import { withLineBreaks, preparseMarkdown } from "@/lib/markdown-preparser";
import { getDb } from "@/lib/firebase-admin";
import { Timestamp, FieldValue } from "firebase-admin/firestore";
import { Resend } from "resend";
import { render } from "@react-email/render";
import WeeklyNewsletter from "@/emails/templates/weekly-newsletter";

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

  // Process markdown the same way as the editor preview
  const processedHtml = preparseMarkdown(withLineBreaks(markdownContent));

  const resend = new Resend(process.env.RESEND_API_KEY);
  const db = getDb();

  let sentCount = 0;
  let failedCount = 0;
  const failedEmails: string[] = [];

  for (const subscriber of subscribers) {
    try {
      const emailHtml = await render(
        WeeklyNewsletter({
          htmlContent: processedHtml,
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
