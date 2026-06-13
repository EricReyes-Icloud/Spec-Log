"use client";

import { useState, type FormEvent } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase-client";
import "@/styles/admin-login.css";

type FormState = {
  email: string;
  password: string;
  isSubmitting: boolean;
  error?: string;
};

export default function AdminLoginPage() {
  const router = useRouter();
  const [state, setState] = useState<FormState>({
    email: "",
    password: "",
    isSubmitting: false,
  });

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (state.isSubmitting) return;

    setState((prev) => ({ ...prev, isSubmitting: true, error: undefined }));

    try {
      // Authenticate with Firebase Auth
      const userCredential = await signInWithEmailAndPassword(
        auth,
        state.email,
        state.password
      );

      // Get the ID token
      const idToken = await userCredential.user.getIdToken();

      // Exchange ID token for session cookie
      const res = await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to create session");
      }

      // Redirect to newsletters
      router.push("/admin/newsletters");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Error inesperado. Intentalo de nuevo.";
      setState((prev) => ({
        ...prev,
        isSubmitting: false,
        error: message,
      }));
    }
  }

  return (
    <main className="admin-login-page">
      <div className="admin-login-card">
        <h1 className="admin-login-title">SPEC LOG EDIT</h1>

        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="admin-login-field">
            <label htmlFor="email" className="admin-login-label">
              USER
            </label>
            <input
              id="email"
              type="email"
              placeholder="tu_correo@email.com"
              value={state.email}
              onChange={(e) =>
                setState((prev) => ({
                  ...prev,
                  email: e.target.value,
                  error: undefined,
                }))
              }
              required
              className="admin-login-input"
            />
          </div>

          <div className="admin-login-field">
            <label htmlFor="password" className="admin-login-label">
              PASSWORD
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={state.password}
              onChange={(e) =>
                setState((prev) => ({
                  ...prev,
                  password: e.target.value,
                  error: undefined,
                }))
              }
              required
              className="admin-login-input"
            />
          </div>

          <button
            type="submit"
            disabled={state.isSubmitting}
            className="admin-login-btn"
          >
            {state.isSubmitting ? "Signing in..." : "Login"}
          </button>
        </form>

        {state.error && (
          <p className="admin-login-error" role="alert" aria-live="polite">
            {state.error}
          </p>
        )}
      </div>
    </main>
  );
}
