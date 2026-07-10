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
} from "@react-email/components";
import type { CSSProperties } from "react";
import { createReplyMailto } from "@/utils/mailto";

export interface WelcomeEmailProps {
  unsubscribeToken: string;
  senderEmail: string;
  replySubject: string;
}

const main: CSSProperties = {
  backgroundColor: "#f0f0f0",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  padding: "0",
};

const container: CSSProperties = {
  backgroundColor: "#ffffff",
  maxWidth: "600px",
  margin: "0 auto",
  marginTop: "24px",
  marginBottom: "24px",
  borderRadius: "8px",
  overflow: "hidden",
  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
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
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  fontSize: "17px",
  lineHeight: "1.5",
};

const footerSection: CSSProperties = {
  backgroundColor: "#292C2E",
  padding: "1rem 1.5rem 1.5rem",
};

const footerPillLink: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "6px",
  border: "1px solid white",
  borderRadius: "6px",
  padding: "0.375rem 0.75rem",
  marginRight: "12px",
  fontFamily: "ui-monospace, 'Cascadia Code', 'Fira Code', monospace",
  fontSize: "0.6875rem",
  color: "white",
  textDecoration: "none",
};

const commentLine: CSSProperties = {
  fontFamily: "ui-monospace, 'Cascadia Code', 'Fira Code', monospace",
  fontSize: "0.7rem",
  color: "#9ca3af",
  margin: "10px 0 5px",
  textAlign: "center" as const,
};

const unsubscribeLink: CSSProperties = {
  color: "#9ca3af",
  fontSize: "12px",
  textDecoration: "underline",
};

const titleStyle: CSSProperties = {
  fontSize: "1.6rem",
  fontWeight: 700,
  marginTop: "10px",
  marginBottom: "35px",
};

const subtitleStyle: CSSProperties = {
  fontSize: "1.125rem",
  fontWeight: 700,
  marginTop: "40px",
  marginBottom: "35px",
};

const tagComentStyle: CSSProperties = {
  fontSize: "0.90rem",
  color: "#9ca3af",
};

const tagOrangeStyle: CSSProperties = {
  color: "#F95616",
};


const tagRightStyle: CSSProperties = {
  display: "block",
  textAlign: "right",
};

const tagCenterStyle: CSSProperties = {
  display: "block",
  textAlign: "center",
};

const tipSectionStyle: CSSProperties = {
  background: "#f97416",
  borderRadius: "8px",
  padding: "1rem 1.25rem",
  marginTop: "2rem",
  marginBottom: "1rem",
};

const COMMENT_LINE_TEXT =
  "< !--- Construyendo sistemas reales con IA --- >";

const SOCIAL_LINKS = [
  {
    label: "github.com/eric_reyes",
    href: "https://github.com/EricReyes-Icloud",
  },
  {
    label: "linkedin.com/in/eric_reyes",
    href: "https://www.linkedin.com/in/eric-reyes-b96418343/",
  },
];

export default function WelcomeEmail({
  unsubscribeToken,
  senderEmail,
  replySubject,
}: WelcomeEmailProps) {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const unsubscribeUrl = `${baseUrl}/unsubscribe?token=${unsubscribeToken}`;
  const replyHref = createReplyMailto(
    senderEmail,
    replySubject,
  );

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

          {/* ── Content: static JSX ── */}
          <Section style={contentSection}>
            <table
              cellPadding="0"
              cellSpacing="0"
              style={{ width: "100%", borderCollapse: "collapse" }}
            >
              <tr>
                <td style={contentCell}>
                  {/* Comment header line */}
                  <Text style={tagComentStyle}>{"[LOG-000]"}</Text>
                  <Text style={{...tagComentStyle, ...tagRightStyle}}>~ spec-log/welcome.md</Text>
                  {/* Title */}
                  <Text style={titleStyle}>
                    Registro iniciado.
                  </Text>

                  {/* Custom tags row */}
                  <Text
                    style={{
                      fontSize: "17px",
                      marginBottom: "1rem",
                      lineHeight: "1.5",
                    }}
                  >
                    Si estás leyendo esto, significa que acabas de abrir la primera 
                    edición de
                    <span style={tagOrangeStyle}><strong> Spec Log</strong></span>.
                     Nuestra edición de bienvenida.
                    <br />
                    <br />
                    Y antes de continuar, quisiera darte las gracias por suscribirte.
                    <br />
                    <br />
                    También quisiera explicarte algo.
                    <br />
                    <br />
                    No empecé esta newsletter porque tenga todas las respuestas.
                    <br />
                    <br />
                    La empecé porque tengo demasiadas preguntas.
                    <br />
                    <br />
                    Por eso decidí crear un lugar donde documentar lo que estoy aprendiendo mientras construyo proyectos, desarrollo habilidades y trato de convertirme en un mejor ingeniero.
                    <br />
                    <br />
                    Algunas entradas serán técnicas.
                    <br />
                    <br />
                    Otras serán reflexiones.
                    <br />
                    <br />
                    No hay una fórmula fija.
                    <br />
                    <br />
                    Solo una regla.
                    <br />
                    <br />
                    <strong>Registrar aquello que valga la pena recordar.</strong>
                    <br />
                    <br />
                    <span style={{...tagComentStyle, ...tagCenterStyle}}>{"< !------------ before.you.leave ------------ >"}</span>
                    <br />
                    Tengo curiosidad.
                    <br />
                    <br />
                    ¿Qué fue exactamente lo que te hizo suscribirte?
                    <br />
                    <br />
                    No busco una respuesta perfecta.
                    <br />
                    <br />
                    Solo la respuesta real.
                  </Text>

                  {/* Tip section */}
                  <Section style={tipSectionStyle}>
                    <Link
                      href={replyHref}
                      style={{
                        display: "block",
                        width: "100%",
                        textDecoration: "none",
                        color: "inherit",
                        margin: 0,
                        fontSize: "17px",
                      }}
                    >
                      <strong>{"↳ reply"}</strong> responde a este correo y cuéntamelo.
                    </Link>
                  </Section>

                  <Text style={subtitleStyle}>¡Nos vemos en la siguiente edición!</Text>
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
                      {link.label}
                    </Link>
                  ))}
                </td>
              </tr>
            </table>

            <Text style={commentLine}>{COMMENT_LINE_TEXT}</Text>

            <Link href={unsubscribeUrl} style={unsubscribeLink}>
              Cancelar suscripción
            </Link>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
