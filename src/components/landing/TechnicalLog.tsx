import "@/styles/tech-log.css";

const LOG_ENTRIES = [
  {
    id: "014",
    time: "5 min",
    title: "La IA tenía razón. Y eso me preocupó.",
    excerpt:
      "Durante semanas pensé que conocía la respuesta correcta. La IA insistía en otra dirección. Al principio asumí que estaba equivocada. Después entendí que el problema no era la calidad de la respuesta. Era mi resistencia a cuestionar mis propias ideas.",
  },
  {
    id: "013",
    time: "4 min",
    title: "Mi backend funcionaba… hasta que entendí el negocio.",
    excerpt:
      "Las APIs respondían. La base de datos estaba bien diseñada. Las pruebas pasaban. Técnicamente todo funcionaba. El problema era que había construido exactamente lo que me pidieron, no lo que realmente necesitaban.",
  },
  {
    id: "012",
    time: "6 min",
    title: "Firestore casi rompe mi arquitectura.",
    excerpt:
      "Elegí Firestore porque quería avanzar rápido. Durante un tiempo fue una decisión perfecta. Hasta que aparecieron nuevos requerimientos y descubrí que algunas decisiones tomadas por comodidad se convierten después en restricciones muy costosas.",
  },
  {
    id: "011",
    time: "5 min",
    title: "La IA aceleró mi código. También mis errores.",
    excerpt:
      "Nunca había desarrollado tan rápido. Componentes completos en minutos. Funcionalidades enteras en una tarde. El problema es que los errores también llegaron más rápido. Aprendí que aumentar la velocidad sin aumentar el criterio tiene consecuencias.",
  },
  {
    id: "010",
    time: "6 min",
    title: "El proyecto falló antes de escribir una sola línea.",
    excerpt:
      "No hubo bugs. No hubo errores de despliegue. No hubo problemas de infraestructura. El proyecto estaba condenado mucho antes de abrir el editor. El verdadero problema estaba en algo que casi nadie quiere hacer: definir correctamente qué se está construyendo.",
  },
  {
    id: "009",
    time: "4 min",
    title: "Intenté automatizar algo que debía entender primero.",
    excerpt:
      "Creía que podía ahorrar tiempo automatizando un proceso repetitivo. Después descubrí que ni siquiera comprendía completamente cómo funcionaba ese proceso. La automatización amplificó la confusión en lugar de resolverla.",
  },
  {
    id: "008",
    time: "5 min",
    title: "Subestimé el poder de una buena especificación.",
    excerpt:
      "Pensaba que las especificaciones eran burocracia. Documentos que retrasaban el trabajo real. Cambié de opinión cuando un proyecto dejó de avanzar por falta de claridad. A veces una hora definiendo el problema ahorra días enteros de desarrollo.",
  },
  {
    id: "007",
    time: "5 min",
    title: "Documentar cambió mi forma de desarrollar.",
    excerpt:
      "Comencé a escribir notas para no olvidar detalles importantes. Con el tiempo descubrí algo inesperado: documentar no solo sirve para recordar. También sirve para pensar mejor. Muchas de mis mejores decisiones aparecieron mientras intentaba explicarme el problema a mí mismo.",
  },

];

function LogCard({
  id,
  time,
  title,
  excerpt,
}: {
  id: string;
  time: string;
  title: string;
  excerpt: string;
}) {
  return (
    <article className="techlog-card">
      <div className="techlog-card-header">
        <span className="techlog-log-id">{`[LOG-${id}]`}</span>
        <span className="techlog-read-time">{time}</span>
      </div>

      <h3 className="techlog-card-title">{title}</h3>

      <p className="techlog-card-text">{excerpt}</p>

      <a href="#" className="techlog-read-link">
        leer registro{" "}
        <span className="techlog-read-arrow">→</span>
      </a>
    </article>
  );
}

export default function TechnicalLog() {
  return (
    <section aria-label="Bitácora técnica" className="techlog-section">
      <p className="techlog-comment">{`< !--- log.entries --- >`}</p>

      <h2 className="techlog-heading">
          Bitácora de temas
      </h2>

      <div className="techlog-grid">
        {LOG_ENTRIES.map((entry) => (
          <LogCard
            key={entry.id}
            id={entry.id}
            time={entry.time}
            title={entry.title}
            excerpt={entry.excerpt}
          />
        ))}
      </div>
    </section>
  );
}
