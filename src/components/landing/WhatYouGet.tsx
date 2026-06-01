import "@/styles/what-you-get.css";

const YES_ITEMS = [
  "Decisiones y reflexiones detrás de proyectos reales.",
  "Mi Experiencia real desarrollando y mejorando habilidades.",
  "Errores, bloqueos y lecciones aprendidas.",
  "Herramientas que forman parte de mi flujo de trabajo.",
  "El proceso de construir y mejorar cada semana.",
];

const NO_ITEMS = [
  "Humo tech disfrazado de productividad.",
  "Tutoriales reciclados de internet.",
  "10 prompts que cambiarán tu vida.",
];

interface TerminalCardProps {
  variant: "light" | "dark";
  heading: string;
  buildComment: string;
  items: { label: string; icon: "check" | "cross" }[];
}

function TerminalCard({ variant, heading, buildComment, items }: TerminalCardProps) {
  const isLight = variant === "light";

  return (
    <div className={`wyg-card ${isLight ? "wyg-card-light" : "wyg-card-dark"}`}>
      {/* Terminal header */}
      <div className={`wyg-terminal-header ${isLight ? "wyg-terminal-header-light" : "wyg-terminal-header-dark"}`}>
        <span className="wyg-terminal-dot wyg-terminal-dot-red" />
        <span className="wyg-terminal-dot wyg-terminal-dot-yellow" />
        <span className="wyg-terminal-dot wyg-terminal-dot-green" />
      </div>

      {/* Terminal body */}
      <div
        className={`wyg-terminal-body ${isLight ? "wyg-terminal-body-light" : "wyg-terminal-body-dark"}`}
      >
        <p className="wyg-build-public">{buildComment}</p>
        <h3 className={`wyg-card-heading ${isLight ? "wyg-card-heading-light" : "wyg-card-heading-dark"}`}>
          {heading}
        </h3>

        <ul className="wyg-list">
          {items.map((item) => (
            <li key={item.label} className="wyg-item">
              {item.icon === "check" ? (
                <span className={`wyg-check ${isLight ? "wyg-check-green" : ""}`}>
                  ✓
                </span>
              ) : (
                <span className="wyg-cross-red">✗</span>
              )}
              {item.label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function WhatYouGet() {
  return (
    <section aria-label="Qué recibirás" className="wyg-section">
      <div className="wyg-container">
        {/* Build log comment */}
        <p className="wyg-build-comment">
          {`< !--- build.log --- >`}
        </p>

        {/* Header text */}
        <h2 className="wyg-title">Esto NO es otro tutorial.</h2>
        <p className="wyg-description mt-3">
          Internet está lleno de personas explicando qué hacer. Spec Log
          documenta lo que ocurre cuando intentas hacerlo de verdad.
        </p>

        {/* Terminal cards */}
        <div className="wyg-cards">
          <TerminalCard
            variant="light"
            heading="Qué recibirás"
            buildComment="// build.in.public = true"
            items={YES_ITEMS.map((i) => ({ label: i, icon: "check" }))}
          />
          <TerminalCard
            variant="dark"
            heading="Qué NO recibirás"
            buildComment="// build.in.public = false"
            items={NO_ITEMS.map((i) => ({ label: i, icon: "cross" }))}
          />
        </div>
      </div>
    </section>
  );
}
