"use client";

import { useState } from "react";
import "@/styles/spec-log-accordion.css";

const QUESTIONS = [
  { question: "¿Qué es Spec Log?", 
    answer: "Spec Log es una newsletter editorial sobre desarrollo de software, inteligencia artificial y construcción de productos.\nNo trata de enseñarte a programar paso a paso.\nTampoco busca convertir cada edición en una lista de herramientas o tutoriales.\nEs un espacio para documentar decisiones, errores, aprendizajes y experiencias reales que aparecen cuando intentas construir algo desde cero.\nLa idea es registrar el proceso, no únicamente el resultado." },
  { question: "¿Por qué nació?", 
    answer: "Porque gran parte del contenido tecnológico muestra únicamente la versión final de las cosas.\nVemos aplicaciones terminadas.\nArquitecturas limpias.\nProyectos exitosos.\nPero rara vez vemos el proceso completo.\n- Las dudas.\n- Los errores.\n- Los cambios de dirección.\nSpec Log nació para documentar precisamente esa parte." },
  { question: "¿De dónde surgió la idea?", 
    answer: "De una pregunta muy simple:\n¿Y si alguien documentara el camino mientras construye, en lugar de contarlo después?\nLa mayoría de historias parecen perfectas porque se escriben cuando todo ya salió bien.\nSpec Log intenta hacer lo contrario.\nMostrar el proceso mientras ocurre." },
  { question: "¿Qué contenido comparte?", 
    answer: "Cada edición puede incluir temas como:\n- Desarrollo web.\n- Arquitectura de software.\n- Inteligencia artificial aplicada.\n- Productividad técnica.\n- Diseño de sistemas.\n- Aprendizajes profesionales.\n- Errores reales durante proyectos.\n- Reflexiones sobre tecnología.\nEl criterio es simple:\nSi aporta una lección útil, puede entrar en Spec Log." },
  { question: "¿Cómo se creó?", 
    answer: "Curiosamente, Spec Log nació utilizando las mismas herramientas de las que habla.\nIA para investigar.\nIA para escribir borradores.\nIA para validar ideas.\nPero también mucho pensamiento crítico para decidir qué vale la pena conservar y qué no.\nPorque la herramienta puede acelerar el trabajo.\nLa dirección sigue siendo responsabilidad humana." },
  { question: "¿Quién debería leerlo?", 
    answer: "Personas que disfrutan construir.\nNo importa si están aprendiendo programación, desarrollando software o creando productos.\nSi te interesa entender cómo se toman decisiones técnicas y por qué ciertos sistemas terminan funcionando —o fallando— probablemente encontrarás algo útil aquí." },
  { question: "¿Quién NO debería leerlo?", 
    answer: "Si buscas:\n- Tutoriales paso a paso.\n- Cursos gratuitos.\n- Listas de ''las mejores herramientas de 2026''.\n- Contenido viral para consumir en dos minutos.\nProbablemente esta newsletter no sea para ti.\nY está bien." },
  { question: "¿Con qué frecuencia se publica?", 
    answer: "La intención es publicar una edición semanal.\nLa prioridad no es la cantidad.\nEs que cada edición tenga algo que merezca ser documentado." },
  { question: "¿Las ediciones siguen una estructura fija?", 
    answer: "Sí.\nAunque los temas cambien, normalmente cada edición gira alrededor de una experiencia, un problema o una decisión.\nLa idea es extraer principios útiles de situaciones reales.\nNo simplemente contar una historia." },
  { question: "¿Por qué el nombre ''Spec Log''?", 
    answer: "Porque resume exactamente la filosofía del proyecto.\nSpec representa especificación, diseño y planificación.\nLog representa registro, documentación y aprendizaje.\nJuntos describen algo simple:\nDiseñar, construir y documentar." },
  { question: "¿Cuál es el objetivo final?", 
    answer: "Crear un archivo de experiencias reales.\nUn lugar donde queden registradas ideas, aprendizajes, errores y decisiones que normalmente desaparecen una vez termina un proyecto.\nPorque muchas veces el verdadero conocimiento no está en el producto final.\nEstá en el proceso que permitió construirlo." },
];

export default function SpecLogAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="accordion">
      {QUESTIONS.map((item, i) => (
        <div key={i} className="accordion-item">
          <div className="accordion-header" onClick={() => toggle(i)}>
            <span className={`accordion-chevron ${openIndex === i ? "open" : ""}`}>
              ▸
            </span>
            <span className="accordion-question">{item.question}</span>
          </div>
          <div className={`accordion-answer ${openIndex === i ? "open" : ""}`}>
            {item.answer &&
              item.answer.split("\n").map((paragraph, j) => (
                <p key={j}>{paragraph}</p>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
