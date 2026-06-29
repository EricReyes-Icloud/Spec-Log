import { withLineBreaks, preparseMarkdown } from "@/lib/markdown-preparser";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import { getDb } from "@/lib/firebase-admin";
import { Timestamp, FieldValue } from "firebase-admin/firestore";
import { Resend } from "resend";
import { render } from "@react-email/render";
import WeeklyNewsletter from "@/emails/templates/weekly-newsletter";

/**
 * Post-process HTML to render <tip> content inline and wrap it in a mailto: link.
 *
 * The pre-parser stores <tip> content in a `data-md` attribute as an empty div
 * (`<div class="newsletter-tip" data-md="..."></div>`). In the preview, a React
 * component reads `data-md` and re-processes it. In email, there's no JS, so
 * we must pre-render the content at send-time.
 *
 * This function:
 *  1. Finds each empty tip div with its data-md attribute
 *  2. Extracts and decodes the raw content
 *  3. Renders it through the same markdown pipeline
 *  4. Wraps it in an <a href="mailto:..."> so clicking the tip opens a reply
 *     compose to the sender's email address.
 */
function renderTipBoxes(html: string, senderEmail: string, replySubject: string): string {
  // Match <div class="newsletter-tip" ... data-md="CONTENT"...></div>
  // The data-md value may have HTML entities from rehype-stringify pass-through.
  const tipDivRegex = /<div\s+class="newsletter-tip"\s+[^>]*data-md="([^"]*)"[^>]*><\/div>/g;

  return html.replace(tipDivRegex, (_match: string, rawAttr: string) => {
    // Step 1: decode HTML entities from the attribute value
    const rawContent = rawAttr
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#(\d+);/g, (_: string, code: string) =>
        String.fromCharCode(Number(code)),
      );

    // Step 2: render the extracted content through the same markdown pipeline
    // (remarkParse → remarkRehype → rehypeStringify) so that **bold**, links,
    // and any other markdown syntax inside the tip render correctly.
    const rendered = unified()
      .use(remarkParse)
      .use(remarkRehype, { allowDangerousHtml: true })
      .use(rehypeStringify, { allowDangerousHtml: true })
      .processSync(rawContent)
      .toString();

    // Step 3: wrap in a mailto: link so clicking the tip composes a reply.
    //
    // Structure: <div class="newsletter-tip"> with a nested <a>.
    // The CSS class provides background, padding, border-radius, color, margin,
    // and especially .newsletter-tip p { margin-bottom: 0 } — without that rule
    // the <p> tags inside add ~32px of extra height vs the preview.
    // The <a> inside makes the entire tip area clickable.
    const encodedSubject = encodeURIComponent(replySubject);
    const href = `mailto:${senderEmail}?subject=${encodedSubject}`;

    return (
      `<div class="newsletter-tip">` +
      `<a href="${href}" ` +
      `style="display:block;text-decoration:none;color:inherit;width:100%;margin:0;">` +
      `${rendered}</a></div>`
    );
  });
}

export interface SubscriberData {
  email: string;
  name: string;
  unsubscribeToken: string;
}

export interface SendResult {
  sentCount: number;
  failedCount: number;
  failedEmails: string[];
}

/**
 * Send a newsletter to a list of subscribers via Resend.
 *
 * Processes markdown content (withLineBreaks + preparseMarkdown), renders
 * the React Email template for each subscriber (with their unsubscribe token),
 * and sends via the Resend API with a 150ms delay between sends to stay
 * within free-tier rate limits.
 *
 * Returns a SendResult with counts of successes and failures.
 */
export async function sendNewsletter(
  newsletterTitle: string,
  markdownContent: string,
  subscribers: SubscriberData[],
): Promise<SendResult> {
  if (subscribers.length === 0) {
    return { sentCount: 0, failedCount: 0, failedEmails: [] };
  }

  // 1) withLineBreaks — convert \n to <br>\n at the string level
  const withBreaks = withLineBreaks(markdownContent);
  // 2) preparseMarkdown — transform custom tags (<coment>, <orange>, etc.)
  //    into standard HTML elements (<span>, <div>, <pre>) FIRST, so the
  //    markdown parser recognizes them as valid HTML rather than plain text.
  const withCustomTags = preparseMarkdown(withBreaks);
  // 3) unified pipeline — convert markdown syntax (**bold**, ## h) to HTML,
  //    preserving HTML elements (spans from preparseMarkdown, native <br>)
  //    via allowDangerousHtml on BOTH remark-rehype AND rehype-stringify.
  const processedHtml = unified()
    .use(remarkParse)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeStringify, { allowDangerousHtml: true })
    .processSync(withCustomTags)
    .toString();

  // 4) renderTipBoxes — post-process <div class="newsletter-tip" data-md="...">
  //    to render the content inline and wrap in a mailto: reply link for email.
  //    The pre-parser encodes tip content as a data attribute (empty div), which
  //    works for the JS-powered preview but leaves an empty box in email clients.
  const withRenderedTips = renderTipBoxes(
    processedHtml,
    process.env.RESEND_FROM_EMAIL!,
    `Re: ${newsletterTitle}`,
  );

  const resend = new Resend(process.env.RESEND_API_KEY);
  const db = getDb();

  let sentCount = 0;
  let failedCount = 0;
  const failedEmails: string[] = [];

  for (const subscriber of subscribers) {
    try {
      const emailHtml = await render(
        WeeklyNewsletter({
          htmlContent: withRenderedTips,
          unsubscribeToken: subscriber.unsubscribeToken,
        }),
      );

      const { error: sendError } = await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL!,
        to: subscriber.email,
        subject: newsletterTitle,
        html: emailHtml,
      });

      if (sendError) {
        throw new Error(sendError.message ?? "Resend error");
      }

      sentCount++;

      console.info(`[email] Sent to ${subscriber.email} (${sentCount}/${subscribers.length})`);

      // Update subscriber record
      await db.collection("subscribers").doc(subscriber.email).update({
        totalEmailsSent: FieldValue.increment(1),
        lastEmailSent: Timestamp.now(),
      });
    } catch (error) {
      failedCount++;
      failedEmails.push(subscriber.email);
      console.error(`[email] Failed to send to ${subscriber.email}:`, error);
    }

    // Rate limiting: 150ms between sends (~6-7 req/s, well within Resend free tier)
    await new Promise((r) => setTimeout(r, 150));
  }

  console.info(
    `[email] Summary: sent=${sentCount}, failed=${failedCount}, total=${subscribers.length}`,
  );

  return { sentCount, failedCount, failedEmails };
}
