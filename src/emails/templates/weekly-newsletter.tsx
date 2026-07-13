import {
  Html,
  Head,
  Preview,
  Body,
  Section,
  Text,
  Hr,
  Link,
} from "@react-email/components";
import type { CSSProperties } from "react";

interface WeeklyNewsletterProps {
  htmlContent: string;
  unsubscribeToken: string;
}

const main: CSSProperties = {
  backgroundColor: "#f0f0f0",
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  padding: "0",
};

const container: CSSProperties = {
  backgroundColor: "#ffffff",
  maxWidth: "600px",
  width: "100%",
  margin: "0 auto",
  marginTop: "24px",
  marginBottom: "24px",
  borderRadius: "8px",
  overflow: "hidden",
  border: "1px solid #9ca3af",
};

const headerSection: CSSProperties = {
  backgroundColor: "#292C2E",
  padding: "12px 24px",
};

const circleCell: CSSProperties = {
  width: "12px",
  height: "12px",
  borderRadius: "50%",
  display: "inline-block", 
};

const contentSection: CSSProperties = {
  backgroundColor: "#ffffff",
  padding: "0",
};

const contentCell: CSSProperties = {
  padding: "0.5rem 2rem",
  color: "#1F1F1F",
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  fontSize: "17px",
  lineHeight: "1.5",
};

const footerSection: CSSProperties = {
  backgroundColor: "#292C2E",
  padding: "1rem 1.5rem 1.5rem",
};

const footerPillLink: CSSProperties = {
  display: "inline-block",
  border: "1px solid white",
  borderRadius: "6px",
  padding: "0.375rem 0.75rem",
  fontFamily: "ui-monospace, 'Cascadia Code', 'Fira Code', monospace",
  fontSize: "0.6875rem",
  color: "white",
  textDecoration: "none",
  wordBreak: "break-word",
  gap: "6px",
};

const footerPillIcon: CSSProperties = {
  width: 14,
  height: 14,
  verticalAlign: "middle",
  marginRight: "6px",
};

const commentLine: CSSProperties = {
  fontFamily: "ui-monospace, 'Cascadia Code', 'Fira Code', monospace",
  fontSize: "0.7000rem",
  color: "#9ca3af",
  margin: "10px 0 5px",
  textAlign: "center" as const,
};

const unsubscribeLink: CSSProperties = {
  color: "#9ca3af",
  fontSize: "12px",
  textDecoration: "underline",
};


const COMMENT_LINE_TEXT = "< !--- Construyendo sistemas reales con IA --- >";

const SOCIAL_LINKS = [
  { label: "github.com/eric_reyes", href: "https://github.com/EricReyes-Icloud" },
  { label: "linkedin.com/in/eric_reyes", href: "https://www.linkedin.com/in/eric-reyes-b96418343/" },
];

export default function WeeklyNewsletter({
  htmlContent,
  unsubscribeToken,
}: WeeklyNewsletterProps) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const unsubscribeUrl = `${baseUrl}/unsubscribe?token=${unsubscribeToken}`;

  return (
    <Html>
      <Head>
        <style>{`
          .coment-line { display:inline; font-size:0.90rem; color:#9ca3af; }
          .newsletter-orange { color:#F95616; font-weight:600; }
          .align-left { display:block; text-align:left; }
          .align-right { display:block; text-align:right; }
          .align-center { display:block; text-align:center; }
          .newsletter-cta { background:#292C2E; border-radius:10px; padding:1rem 1.25rem; margin-bottom:1rem; }
          .newsletter-cta code { color:#e0e0e0; font-family:'Courier New',monospace; font-size:0.8125rem; line-height:1.6; white-space:pre-wrap; }
          .content-area h1, .content-area h2, .content-area h3 { margin-top:10px; margin-bottom:32px; font-weight:700; }
          .content-area h1 { font-size:1.6rem; }
          .content-area h2 { font-size:1.25rem; }
          .content-area h3 { font-size:1.125rem; }
          .content-area p { margin-bottom:1rem; }
          .content-area ul, .content-area ol { margin-bottom:1rem; padding-left:1.5rem; }
          .content-area li { margin-bottom:0.25rem; }
          .content-area strong { font-weight:700; }
          .content-area a { color:#F95616; text-decoration:underline; }
          .newsletter-tip { background:#f97416; border-radius:8px; padding:1rem 1.25rem; margin-bottom:1rem; color:#1F1F1F; }
          .newsletter-tip p { margin-bottom:0; margin-top:0;}
          @media (max-width: 600px) {
            .content-area { font-size: 18px !important; }
            .footer-pill-link { font-size: 0.5325rem !important; padding: 0.25rem 0.5rem !important; }
            .comment-line { font-size: 0.6125rem !important; }
          }
        `}</style>
      </Head>
      <Preview>Spec Log Newsletter</Preview>
      <Body style={main}>
        <table
          align="center"
          width="100%"
          border={0}
          cellPadding={0}
          cellSpacing={0}
          role="presentation"
        >
          <tr>
            <td align="center" style={{ padding: "24px 4%" }}>
              <div style={container}>
                <table
                  role="presentation"
                  width="100%"
                  cellPadding={0}
                  cellSpacing={0}
                  style={{ borderCollapse: "collapse" }}
                >
                  <tr>
                    <td>
          {/* ── Header: macOS-style traffic light dots ── */}
          <Section style={headerSection}>
            <table
              cellPadding="0"
              cellSpacing="0"
              style={{ borderCollapse: "collapse" }}
            >
              <tr>
                <td style={{ paddingRight: "8px" }}>
                  <table
                    cellPadding="0"
                    cellSpacing="0"
                    style={{ borderCollapse: "collapse" }}
                  >
                    <tr>
                      <td
                        style={{
                          ...circleCell,
                          backgroundColor: "#FF5457",
                        }}
                      />
                    </tr>
                  </table>
                </td>
                <td style={{ paddingRight: "8px" }}>
                  <table
                    cellPadding="0"
                    cellSpacing="0"
                    style={{ borderCollapse: "collapse" }}
                  >
                    <tr>
                      <td
                        style={{
                          ...circleCell,
                          backgroundColor: "#FFC653",
                        }}
                      />
                    </tr>
                  </table>
                </td>
                <td>
                  <table
                    cellPadding="0"
                    cellSpacing="0"
                    style={{ borderCollapse: "collapse" }}
                  >
                    <tr>
                      <td
                        style={{
                          ...circleCell,
                          backgroundColor: "#56E75D",
                        }}
                      />
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </Section>

          {/* ── Content area: pre-processed HTML ── */}
          <Section style={contentSection}>
            <table
              cellPadding="0"
              cellSpacing="0"
              style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}
            >
              <tr>
                <td style={contentCell}>
                  <div
                    className="content-area"
                    style={{ maxWidth: "100%", overflowWrap: "break-word", wordBreak: "break-word" }}
                  >
                    <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
                  </div>
                </td>
              </tr>
            </table>
          </Section>

          {/* ── Footer ── */}
          <Section style={footerSection}>
            <Hr
              style={{
                border: "none",
                borderTop: "none",
              }}
            />

            <table cellPadding="0" cellSpacing="0" style={{ margin: "0 auto" }}>
              <tr>
                {SOCIAL_LINKS.map((link, idx) => (
                  <td key={link.label} align="center" style={{ paddingRight: idx === 0 ? "12px" : "0" }}>
                    <Link href={link.href} style={footerPillLink} className="footer-pill-link">
                      {link.label}
                    </Link>
                  </td>
                ))}
              </tr>
            </table>

            <Text style={commentLine} className="comment-line">
              {COMMENT_LINE_TEXT}
            </Text>

            <Link href={unsubscribeUrl} style={unsubscribeLink}>
              Cancelar suscripción
            </Link>
          </Section>
                    </td>
                  </tr>
                </table>
        </div>
          </td>
        </tr>
      </table>
      </Body>
    </Html>
  );
}
