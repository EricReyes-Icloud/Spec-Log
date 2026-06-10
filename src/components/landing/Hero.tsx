"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import "@/styles/hero.css";

type FormState = {
  name: string;
  email: string;
  isSubmitting: boolean;
  error?: string;
  success?: boolean;
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Hero() {
  const [state, setState] = useState<FormState>({
    name: "",
    email: "",
    isSubmitting: false,
  });

  function validate(name: string, email: string): string | undefined {
    if (!name.trim()) return "El nombre es requerido";
    if (!email.trim()) return "El email es requerido";
    if (!emailRegex.test(email)) return "Ingresá un email válido";
    return undefined;
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const error = validate(state.name, state.email);
    if (error) {
      setState((prev) => ({ ...prev, error }));
      return;
    }

    setState((prev) => ({ ...prev, isSubmitting: true, error: undefined }));

    // Submit to the subscription API
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: state.name.trim(), email: state.email.trim() }),
      });

      const data = await res.json();

      if (res.ok && res.status === 201) {
        window.location.href = data.redirectUrl;
        return;
      }

      // 4xx / 5xx — show inline error
      setState((prev) => ({
        ...prev,
        isSubmitting: false,
        error: data.error ?? "Error inesperado. Intentalo de nuevo.",
      }));
    } catch {
      setState((prev) => ({
        ...prev,
        isSubmitting: false,
        error: "Error de conexión. Verificá tu internet e intentalo de nuevo.",
      }));
    }
  }

  return (
    <section id="hero" aria-label="Hero section" className="hero-section">
      <div className="hero-container">

        {/* ── Left column: form ── */}
        <div className="hero-image-col">
          <div className="hero-card">
            <div className="hero-card-inner">
              {/* Miniatura */}
              <div className="hero-image-wrapper">
                <Image
                  src="/Miniatura.png"
                  alt="Spec Log miniatura"
                  width={256}
                  height={256}
                  className="hero-image"
                />
              </div>

              {/* Register comment */}
              <p className="hero-register-comment">$ register --email</p>

              {/* Form */}
              <form onSubmit={handleSubmit} className="hero-form">
                <div className="hero-input-wrapper">
                  <label htmlFor="hero-name" className="sr-only">Nombre</label>
                  <input
                    id="hero-name"
                    type="text"
                    placeholder="Tu nombre"
                    value={state.name}
                    onChange={(e) =>
                      setState((prev) => ({ ...prev, name: e.target.value, error: undefined }))
                    }
                    aria-invalid={!!state.error}
                    className="hero-input"
                  />
                </div>

                <div className="hero-input-wrapper">
                  <label htmlFor="hero-email" className="sr-only">Correo electrónico</label>
                  <input
                    id="hero-email"
                    type="email"
                    placeholder="tu_correo@email.com"
                    value={state.email}
                    onChange={(e) =>
                      setState((prev) => ({ ...prev, email: e.target.value, error: undefined }))
                    }
                    aria-invalid={!!state.error}
                    aria-describedby={state.error ? "hero-error" : undefined}
                    className="hero-input"
                  />
                </div>

                <button
                  type="submit"
                  disabled={state.isSubmitting}
                  className="hero-btn"
                >
                  {state.isSubmitting ? "Enviando..." : "↳ Unirme a Spec Log"}
                </button>
              </form>

              {/* Error message */}
              {state.error && (
                <p
                  id="hero-error"
                  role="alert"
                  aria-live="polite"
                  className="hero-error"
                >
                  {state.error}
                </p>
              )}

              {/* Success message */}
              {state.success && (
                <p role="status" aria-live="polite" className="hero-success">
                  ¡Gracias! Tu suscripción fue registrada.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ── Right column: description ── */}
        <div className="hero-text-col">
          <p className="hero-comment-orange">{'/* engineering journal */'}</p>
          <p className="hero-comment-gray">{'/* newsletter · cada domingo a las 10:30 am */'}</p>

          <h1 className="hero-title">
            El diario de alguien que construye{" "}
            <span className="hero-title-software">software</span>.
          </h1>

          <p className="hero-desc-text">
            Detrás de cada proyecto hay mucho más que código. Hay dudas,
            aprendizajes, bloqueos y pequeñas victorias que casi nunca quedan
            documentadas.
          </p>

          <div className="hero-bullets">
            <p className="hero-bullet">
              <span className="hero-bullet-cross">✗</span>
              No es otra newsletter de tutoriales.
            </p>
            <p className="hero-bullet">
              <span className="hero-bullet-check">✓</span>
              Es una bitácora sobre construir, aprender y perderse
              escribiendo código.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
