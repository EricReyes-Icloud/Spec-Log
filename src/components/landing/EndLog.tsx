import "@/styles/end-log.css";

export default function EndLog() {
  return (
    <section aria-label="Final" className="endlog-section">
      <p className="endlog-comment">{`< !--- end.log --- >`}</p>

      <div className="endlog-container">
        <h2 className="endlog-heading">Gracias por leer hasta aquí.</h2>

        <div className="endlog-text">
          <p className="endlog-line">
            Si llegaste hasta este punto, probablemente te interesa algo más que
            consumir contenido.
          </p>

          <div className="endlog-spacer" />

          <p className="endlog-line">
            Quizás te interesa construir cosas reales, aprender de los errores y
            documentar el proceso.
          </p>

          <p className="endlog-line">
            Eso es exactamente lo que encontrarás aquí.
          </p>

          <div className="endlog-spacer" />

          <p className="endlog-line">Cada edición es una nota de campo.</p>

          <p className="endlog-line">
            Un registro de decisiones.
          </p>
          <p className="endlog-line">
            De problemas.
          </p>
          <p className="endlog-line">
            De aprendizajes.
          </p>

          <div className="endlog-spacer" />

          <p className="endlog-line">
            Sin humo.
          </p>
          <p className="endlog-line">
            Sin promesas imposibles.
          </p>

          <div className="endlog-spacer" />

          <p className="endlog-line endlog-highlight">
            Solo trabajo real documentado.
          </p>
        </div>

        <a href="#" className="endlog-btn">
          ↳ Unirme a Spec Log
        </a>
      </div>
    </section>
  );
}
