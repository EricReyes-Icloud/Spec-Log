import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Text,
  Hr,
  Link,
  Img,
} from "@react-email/components";
import type { CSSProperties } from "react";

interface WeeklyNewsletterProps {
  htmlContent: string;
  unsubscribeToken: string;
}

const SOCIAL_LINKS = [
  { label: "github.com/eric_reyes", href: "https://github.com/EricReyes-Icloud", icon: "/icono github.png" },
  { label: "linkedin.com/in/eric_reyes", href: "https://www.linkedin.com/in/eric-reyes-b96418343/", icon: "/icono linkedin.png" },
];

const main: CSSProperties = {
  backgroundColor: "#f0f0f0",
  fontFamily: "Arial, Helvetica, sans-serif",
  padding: "20px 0",
};

const container: CSSProperties = {
  backgroundColor: "#ffffff",
  maxWidth: "600px",
  margin: "0 auto",
  borderRadius: "8px",
  overflow: "hidden",
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
  padding: "1.5rem 2rem",
  color: "#1F1F1F",
  fontFamily: "Arial, Helvetica, sans-serif",
  fontSize: "16px",
  lineHeight: "1.6",
};

const footerSection: CSSProperties = {
  backgroundColor: "#292C2E",
  padding: "1rem 1.5rem 1.5rem",
};

const footerPillLink: CSSProperties = {
  display: "inline-block",
  borderRadius: "6px",
  padding: "6px 12px",
  fontFamily: "Courier New, monospace",
  fontSize: "11px",
  color: "#ffffff",
  textDecoration: "none",
  marginRight: "12px",
};

const footerPillIcon: CSSProperties = {
  width: 14,
  height: 14,
  verticalAlign: "middle",
  marginRight: "6px",
};

const commentLine: CSSProperties = {
  fontFamily: "Courier New, monospace",
  fontSize: "13px",
  color: "#888888",
  margin: "1rem 0",
  textAlign: "center" as const,
};

const unsubscribeLink: CSSProperties = {
  color: "#999999",
  fontSize: "12px",
  textDecoration: "underline",
};

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
          .coment-line { display:inline; font-size:0.80rem; color:#9ca3af; font-family:'Courier New',monospace; }
          .newsletter-orange { color:#F95616; font-weight:600; }
          .align-left { display:block; text-align:left; }
          .align-right { display:block; text-align:right; }
          .align-center { display:block; text-align:center; }
          .newsletter-tip { background:#f97416; border-radius:8px; padding:1rem 1.25rem; margin-bottom:1rem; color:#1F1F1F; }
          .newsletter-tip p { margin-bottom:0; }
          .newsletter-cta { background:#292C2E; border-radius:10px; padding:1rem 1.25rem; margin-bottom:1rem; }
          .newsletter-cta code { color:#e0e0e0; font-family:'Courier New',monospace; font-size:0.8125rem; line-height:1.6; white-space:pre-wrap; }
          .content-area h1, .content-area h2, .content-area h3 { margin-top:1rem; margin-bottom:0.75rem; font-weight:700; }
          .content-area h1 { font-size:1.5rem; }
          .content-area h2 { font-size:1.25rem; }
          .content-area h3 { font-size:1.125rem; }
          .content-area p { margin-bottom:1rem; }
          .content-area ul, .content-area ol { margin-bottom:1rem; padding-left:1.5rem; }
          .content-area li { margin-bottom:0.25rem; }
          .content-area strong { font-weight:700; }
          .content-area a { color:#F95616; text-decoration:underline; }
        `}</style>
      </Head>
      <Preview>Spec Log Newsletter</Preview>
      <Body style={main}>
        <Container style={container}>
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
              style={{ width: "100%", borderCollapse: "collapse" }}
            >
              <tr>
                <td style={contentCell}>
                  <div className="content-area">
                    <div
                      dangerouslySetInnerHTML={{ __html: htmlContent }}
                    />
                  </div>
                </td>
              </tr>
            </table>
          </Section>

          {/* ── Footer ── */}
          <Section style={footerSection}>
            <Hr
              style={{
                borderColor: "#e0e0e0",
                margin: "0 0 1.5rem",
              }}
            />

            <table
              cellPadding="0"
              cellSpacing="0"
              style={{ width: "100%", borderCollapse: "collapse" }}
            >
              <tr>
                <td align="center">
                  {SOCIAL_LINKS.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      style={footerPillLink}
                    >
                      <Img
                        src={`${baseUrl}${encodeURI(link.icon)}`}
                        alt=""
                        width="14"
                        height="14"
                        style={footerPillIcon}
                      />
                      {link.label}
                    </Link>
                  ))}
                </td>
              </tr>
            </table>

            <Text style={commentLine}>
              {"< !--- Construyendo sistemas reales con IA --- >"}
            </Text>

            <Link href={unsubscribeUrl} style={unsubscribeLink}>
              Cancelar suscripción
            </Link>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
