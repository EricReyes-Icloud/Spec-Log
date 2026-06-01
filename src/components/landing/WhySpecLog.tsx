import "@/styles/why-spec-log.css";

const ARROW_ITEMS = [
  "Cómo aprendió",
  "Qué errores cometió",
  "Qué decisiones tomó",
  "Qué tuvo que replantear",
  "Qué descubrió durante el camino",
];

function CodeLine({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}

export default function WhySpecLog() {
  return (
    <section aria-label="Por qué existe Spec Log" className="why-section">
      <div className="why-split">
        {/* ── Left column: text ── */}
        <div className="why-left">
          <p className="why-comment">
            {`< !--- why.spec-log --- >`}
          </p>

          <h2 className="why-heading">
            ¿Por qué existe <span className="why-orange">Spec Log</span>?
          </h2>

          <p className="why-text">
            La mayoría muestra resultados.
          </p>
          <p className="why-text">
            Pocos documentan el proceso.
          </p>

          <div className="why-spacer" />

          <p className="why-text">
            LinkedIn muestra el empleo conseguido.
          </p>
          <p className="why-text">
            GitHub muestra el proyecto terminado.
          </p>
          <p className="why-text">
            El CV muestra los logros alcanzados.
          </p> 

          <div className="why-spacer" />

          <p className="why-text">
            Pero casi nadie documenta:
          </p>

          <div className="why-arrow-box">
            <ul>
              {ARROW_ITEMS.map((item) => (
                <li key={item} className="why-arrow-item">
                  <span className="why-arrow">→</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Right column: Terminal ── */}
        <div className="why-terminal">
          {/* Terminal header */}
          <div className="why-terminal-header">
            <span className="why-terminal-dot why-terminal-dot-red" />
            <span className="why-terminal-dot why-terminal-dot-yellow" />
            <span className="why-terminal-dot why-terminal-dot-green" />
          </div>

          {/* Terminal body — split panes */}
          <div className="why-terminal-body">
            {/* Left pane: profile */}
            <div className="why-terminal-pane why-terminal-pane-left">
              <CodeLine>
                <span className="syn-comment">{`// Lo que vemos`}</span>
              </CodeLine>
              <CodeLine>
                <span className="syn-const">const</span>{" "}
                <span className="syn-variable">profile</span>
                <span className="syn-punctuation"> = {"{"}</span>
              </CodeLine>
              <CodeLine>
                {"  "}<span className="syn-key">empleo</span>
                <span className="syn-punctuation">:</span>{" "}
                <span className="syn-boolean">true</span>
                <span className="syn-punctuation">,</span>
              </CodeLine>
              <CodeLine>
                {"  "}<span className="syn-key">proyecto</span>
                <span className="syn-punctuation">:</span>{" "}
                <span className="syn-string">{`"finalizado"`}</span>
                <span className="syn-punctuation">,</span>
              </CodeLine>
              <CodeLine>
                {"  "}<span className="syn-key">logros</span>
                <span className="syn-punctuation">:</span>{" "}
                <span className="syn-punctuation">[</span>
                <span className="syn-string">{`"ascenso"`}</span>
                <span className="syn-punctuation">,</span>
              </CodeLine>
              <CodeLine>
                {"           "}<span className="syn-string">{`"certificación"`}</span>
                <span className="syn-punctuation">],</span>
              </CodeLine>
              <CodeLine>
                {"  "}<span className="syn-key">resultados</span>
                <span className="syn-punctuation">:</span>{" "}
                <span className="syn-string">{`"visibles"`}</span>
              </CodeLine>
              <CodeLine>
                <span className="syn-punctuation">{"};"}</span>
              </CodeLine>
            </div>

            {/* Vertical divider */}
            <div className="why-terminal-divider" />

            {/* Right pane: proceso */}
            <div className="why-terminal-pane why-terminal-pane-right">
              <CodeLine>
                <span className="syn-comment">{`// Lo que rara vez vemos`}</span>
              </CodeLine>
              <CodeLine>
                <span className="syn-const">const</span>{" "}
                <span className="syn-variable">proceso</span>
                <span className="syn-punctuation"> = {"{"}</span>
              </CodeLine>
              <CodeLine>
                {"  "}<span className="syn-key">como_llego</span>
                <span className="syn-punctuation">:</span>{" "}
                <span className="syn-undefined">undefined</span>
                <span className="syn-punctuation">,</span>
              </CodeLine>
              <CodeLine>
                {"  "}<span className="syn-key">errores</span>
                <span className="syn-punctuation">:</span>{" "}
                <span className="syn-punctuation">[]</span>
                <span className="syn-punctuation">,</span>
              </CodeLine>
              <CodeLine>
                {"  "}<span className="syn-key">aprendizajes</span>
                <span className="syn-punctuation">:</span>{" "}
                <span className="syn-punctuation">[]</span>
                <span className="syn-punctuation">,</span>
              </CodeLine>
              <CodeLine>
                {"  "}<span className="syn-key">cambios</span>
                <span className="syn-punctuation">:</span>{" "}
                <span className="syn-punctuation">[]</span>
              </CodeLine>
              <CodeLine>
                <span className="syn-punctuation">{"};"}</span>
              </CodeLine>
            </div>
          </div>
        </div>
      </div>
      <p className="why-final">
          ¡<span className="why-orange">Spec Log</span> existe para registrar esa parte!
      </p>
    </section>
  );
}
