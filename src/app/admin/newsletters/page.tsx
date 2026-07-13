"use client";

import { useState, useEffect } from "react";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase-client";
import Link from "next/link";
import "@/styles/admin-editor.css";

export default function AdminNewslettersPage() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Track Firebase auth state to restore session on page reload
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        // No authenticated user in Firebase client — session cookie might still
        // be valid at the middleware level, but the client SDK has no session.
        // This can happen on initial load before Firebase restores from IndexedDB.
        // Do nothing here — middleware handles unauthenticated access.
      }
    });

    return () => unsubscribe();
  }, []);

  async function handleLogout() {
    if (isLoggingOut) return;
    setIsLoggingOut(true);

    try {
      await signOut(auth);

      // Destroy the server-side session cookie
      await fetch("/api/auth/session", { method: "DELETE" });
    } catch {
      // Even if Firebase signOut fails, attempt to clear the cookie
      await fetch("/api/auth/session", { method: "DELETE" }).catch(() => {});
    }

    router.push("/admin/login");
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#1a1a1a",
        color: "#e0e0e0",
        display: "flex",
        flexDirection: "column",
        fontFamily: "ui-monospace, 'Cascadia Code', 'Fira Code', monospace",
      }}
    >
      {/* Top bar with logout button */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          padding: "1rem 1.5rem",
        }}
      >
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="admin-editor-top-bar-btn"
        >
          {isLoggingOut ? "Signing out..." : "Logout"}
        </button>
      </div>

      {/* Main content */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
        }}
      >
        <h1
          style={{
            fontSize: "1.75rem",
            fontWeight: 700,
            color: "#F95616",
            marginBottom: "1rem",
          }}
        >
          Newsletters
        </h1>
        <p
          style={{
            fontSize: "0.9375rem",
            color: "#aaa",
            textAlign: "center",
            maxWidth: "28rem",
            lineHeight: 1.6,
          }}
        >
          This is the newsletter management area. 
          Edits will be displayed later; for now, 
          you can access the editor to create your first edition.
        </p>
        

        <Link href="/admin/editor">
          <button
            style={{
              backgroundColor: "#F95616",
              color: "#1a1a1a",
              border: "none",
              padding: "0.5rem 1.25rem",
              fontWeight: 700,
              fontSize: "18px",
              cursor: isLoggingOut ? "not-allowed" : "pointer",
              opacity: isLoggingOut ? 0.6 : 1,
              marginTop: "50px",
            }}
            >
              Open Editor
          </button>
        </Link>
      </div>
    </div>
  );
}
