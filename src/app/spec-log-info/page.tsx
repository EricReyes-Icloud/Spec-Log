import MacHeader from "@/components/landing/MacHeader";
import SpecLogAccordion from "@/components/landing/SpecLogAccordion";
import Footer from "@/components/landing/Footer";
import "@/styles/spec-log-info.css";

export default function SpecLogInfoPage() {
  return (
    <>
      <MacHeader buttonHref="/" buttonText="landing" />
      <a href="/" className="spec-log-info-back" title="Volver a la landing">
          ←
      </a>
      <main className="spec-log-info-main">

        <span className="spec-log-info-comment">{"< !--- system.info --- >"}</span>

        <h1 className="spec-log-info-heading">
          Descubre todo sobre{" "}
          <span className="spec-log-info-heading-brand">Spec Log</span>
        </h1>

        <SpecLogAccordion />
      </main>
      <Footer />
    </>
  );
}
