"use client";

import { useState, useEffect } from "react";
import MacHeader from "@/components/landing/MacHeader";
import Footer from "@/components/landing/Footer";
import "@/styles/post-registro.css";

type AnimState =
  | "LOADING_DOTS"
  | "CHECK_1"
  | "CHECK_2"
  | "CHECK_3"
  | "CHECK_4"
  | "CHECK_5"
  | "SUCCESS";

export default function SubscribePage() {
  const [animState, setAnimState] = useState<AnimState>("LOADING_DOTS");
  const [mounted, setMounted] = useState(false);

  /* ── Animation machine ── */
  useEffect(() => {
    setMounted(true);

    // 1. localStorage gate — already seen?
    const alreadyShown = localStorage.getItem("animationShown");
    if (alreadyShown) {
      setAnimState("SUCCESS");
      return;
    }

    // 2. prefers-reduced-motion check
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) {
      localStorage.setItem("animationShown", "true");
      setAnimState("SUCCESS");
      return;
    }

    // 3. First visit — set flag IMMEDIATELY so refresh always shows SUCCESS
    localStorage.setItem("animationShown", "true");

    // 4. Fire the animation sequence
    const t1 = setTimeout(() => setAnimState("CHECK_1"), 1500);
    const t2 = setTimeout(() => setAnimState("CHECK_2"), 3000);
    const t3 = setTimeout(() => setAnimState("CHECK_3"), 4500);
    const t4 = setTimeout(() => setAnimState("CHECK_4"), 4500);
    const t5 = setTimeout(() => setAnimState("CHECK_5"), 6000);
    const t6 = setTimeout(() => setAnimState("SUCCESS"), 6000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      clearTimeout(t6);
    };
  }, []);

  /* ── Prevent hydration mismatch ── */
  if (!mounted) return null;

  /* ── Render ── */
  return (
    <>
      <MacHeader showTimer={false} buttonHref="/" buttonText="landing" />

      <main className="post-registro-main">
        {/* Orange comment — full width */}
        <span className="post-registro-comment">
          {"spec-log://onboarding"}
        </span>

        {/* Two-column split: card left, text right */}
        <div className="post-registro-split">
          {/* ── Left: Terminal card ── */}
          <div className="post-registro-left">
            <div className="post-registro-card">
              <div className="post-registro-card-body">
                {/* STATUS line */}
                <span className="post-registro-status-label">
                  STATUS:{" "}
                  {animState === "SUCCESS" ? (
                    <span className="post-registro-success">SUCCESS</span>
                  ) : (
                    <span className="post-registro-progress">
                      In progress
                      <span className="post-registro-dot">.</span>
                      <span className="post-registro-dot">.</span>
                      <span className="post-registro-dot">.</span>
                    </span>
                  )}
                </span>

                {/* [✓] Email verificado — appears at 1.5s */}
                {(animState === "CHECK_1" ||
                  animState === "CHECK_2" ||
                  animState === "CHECK_3" ||
                  animState === "CHECK_4" ||
                  animState === "CHECK_5" ||
                  animState === "SUCCESS") && (
                  <span className="post-registro-check">
                    <span className="post-registro-check-mark">[✓]</span>
                    <span className="post-registro-check-text"> Email verificado</span>
                  </span>
                )}

                {/* [✓] Suscripción creada — appears at 3.0s */}
                {(animState === "CHECK_2" ||
                  animState === "CHECK_3" ||
                  animState === "CHECK_4" ||
                  animState === "CHECK_5" ||
                  animState === "SUCCESS") && (
                  <span className="post-registro-check">
                    <span className="post-registro-check-mark">[✓]</span>
                    <span className="post-registro-check-text"> Suscripción creada</span>
                  </span>
                )}
                {/* [✓] Usuario registrado — appears at 4.5s */}
                {(animState === "CHECK_3" ||
                  animState === "CHECK_4" ||
                  animState === "CHECK_5" ||
                  animState === "SUCCESS") && (
                  <span className="post-registro-check">
                    <span className="post-registro-check-mark">[✓]</span>
                    <span className="post-registro-check-text"> Usuario registrado</span>
                  </span>
                )}
                {/* [✓] Próxima edición programada — appears at 4.5s */}
                {(animState === "CHECK_4" ||
                  animState === "CHECK_5" ||
                  animState === "SUCCESS") && (
                  <span className="post-registro-check">
                    <span className="post-registro-check-mark">[✓]</span>
                    <span className="post-registro-check-text"> Próxima edición programada</span>
                  </span>
                )}
                {/* [✓] Primer mail enviado — appears at 6.0s */}
                {(animState === "CHECK_5" ||
                  animState === "SUCCESS") && (
                  <span className="post-registro-check">
                    <span className="post-registro-check-mark">[✓]</span>
                    <span className="post-registro-check-text"> Primer mail enviado</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* ── Right: Heading + text ── */}
          <div className="post-registro-right">
            <h1 className="post-registro-heading">
              Acabas de entrar a{" "}
              <span className="post-registro-heading-brand">Spec Log</span>.
            </h1>
            <p className="post-registro-text">
              Ahora recibirás contenido exclusivo sobre arquitectura de software,
              desarrollo con IA y más contenido directamente en tu correo.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
