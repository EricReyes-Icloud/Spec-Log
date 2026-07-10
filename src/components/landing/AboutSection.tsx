import Image from "next/image";
import "@/styles/about-section.css";

export default function AboutSection() {
  return (
    <section aria-label="Sobre el autor" className="about-section">
      <div className="about-container">
        {/* Circular photo */}
        <div className="about-photo">
          <Image
            src="/Foto profesional.png"
            alt="Eric Reyes"
            width={250}
            height={250}
            className="about-photo-img"
          />
        </div>

        {/* Text */}
        <div>
          <p className="about-comment">$ open author.md</p>
          <h2 className="about-heading">
            <span className="text-white">Soy </span>
            <span className="about-name">Eric Reyes</span>
             <span className="text-white">.</span>
          </h2>
          <p className="about-desc">
            No trabajo en una Big Tech. No fundé una startup. No tengo una historia espectacular para contar.
          </p>
          <p className="about-desc">
            Soy alguien que decidió aprender tecnología, construir proyectos reales y documentar el camino mientras avanza.
          </p>
          <p className="about-desc">
            Durante este proceso he descubierto algo curioso: los proyectos enseñan, pero los errores enseñan más. Y muchas veces las lecciones más valiosas aparecen cuando algo no sale como esperabas.
          </p>
          <p className="about-desc">
            Hoy sigo aprendiendo exactamente igual que antes: construyendo, equivocándome, corrigiendo y volviendo a intentar.
          </p>
          <p className="about-desc">
            Eso es lo que encontrarás aquí.
          </p>
        </div>
      </div>
    </section>
  );
}
