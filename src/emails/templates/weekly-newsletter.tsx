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
  backgroundColor: "#2d2d2d",
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
  padding: "2rem",
  color: "#1F1F1F",
  fontFamily: "Arial, Helvetica, sans-serif",
  fontSize: "16px",
  lineHeight: "1.6",
};

const footerSection: CSSProperties = {
  backgroundColor: "#ffffff",
  padding: "0 2rem 2rem",
};

const footerLinks: CSSProperties = {
  fontSize: "14px",
  color: "#555555",
};

const footerLink: CSSProperties = {
  color: "#F95616",
  textDecoration: "none",
  fontSize: "14px",
  marginRight: "1.5rem",
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
  const unsubscribeUrl = `{{UNSUBSCRIBE_URL}}`;

  return (
    <Html>
      <Head />
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
                          backgroundColor: "#ff5f57",
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
                          backgroundColor: "#ffbd2e",
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
                          backgroundColor: "#28c840",
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
                  <div
                    dangerouslySetInnerHTML={{ __html: htmlContent }}
                  />
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
                <td style={footerLinks}>
                  <Link
                    href="https://github.com/EricReyes-Icloud"
                    style={footerLink}
                  >
                    GitHub
                  </Link>
                  <Link
                    href="https://www.linkedin.com/in/eric-reyes-b96418343/"
                    style={footerLink}
                  >
                    LinkedIn
                  </Link>
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
