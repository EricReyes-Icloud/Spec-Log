"use client";

import { useState, useRef, useCallback, type ChangeEvent } from "react";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createNewsletter } from "@/lib/firebase-client";
import { auth } from "@/lib/firebase-client";
import NewsletterPreview from "@/components/email/NewsletterPreview";
import "@/styles/admin-editor.css";

export default function AdminNewEditorPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [markdown, setMarkdown] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | undefined>();
  const [sendSuccess, setSendSuccess] = useState(false);
  const [newsletterId, setNewsletterId] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  async function handleLogout() {
    if (isLoggingOut) return;
    setIsLoggingOut(true);

    try {
      await signOut(auth);
      await fetch("/api/auth/session", { method: "DELETE" });
    } catch {
      await fetch("/api/auth/session", { method: "DELETE" }).catch(() => {});
    }

    router.push("/admin/login");
  }

  const handleMarkdownChange = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value;
      setMarkdown(value);
      setError(undefined);
      setSuccess(false);

      if (value.length > 1000) {
        if (debounceRef.current) {
          clearTimeout(debounceRef.current);
        }
        debounceRef.current = setTimeout(() => {
          // Reserved for future debounced remote-sync
        }, 300);
      } else {
        if (debounceRef.current) {
          clearTimeout(debounceRef.current);
          debounceRef.current = null;
        }
      }
    },
    []
  );

  const handleSave = useCallback(async () => {
    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    setSaving(true);
    setError(undefined);
    setSuccess(false);

    try {
      const id = await createNewsletter(title.trim(), markdown);
      setNewsletterId(id);
      setSuccess(true);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to save newsletter";
      setError(message);
    } finally {
      setSaving(false);
    }
  }, [title, markdown]);

  const handlePublish = useCallback(async () => {
    setSending(true);
    setSendError(undefined);
    setSendSuccess(false);

    try {
      // If newsletter hasn't been saved yet, save it first
      let id = newsletterId;
      if (!id) {
        id = await createNewsletter(title.trim(), markdown);
        setNewsletterId(id);
      }

      const res = await fetch("/api/newsletter/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newsletterId: id }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Error al enviar");
      }

      setSendSuccess(true);
    } catch (err) {
      setSendError(err instanceof Error ? err.message : "Error al enviar");
    } finally {
      setSending(false);
    }
  }, [title, markdown, newsletterId]);

  return (
    <main className="admin-editor-page">

      {/* Toolbar: title input + save button */}
      <div className="admin-editor-toolbar">
        <input
          type="text"
          placeholder="Newsletter title..."
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            setError(undefined);
            setSuccess(false);
          }}
          className="admin-editor-title-input"
        />

        <button
          onClick={handleSave}
          disabled={saving}
          className="admin-editor-save-btn"
        >
          {saving ? "Saving..." : "Save"}
        </button>

        {success && <span className="admin-editor-success">Saved!</span>}
        {error && <span className="admin-editor-error">{error}</span>}

        <Link href="/admin/newsletters">
          <button className="admin-editor-top-bar-btn">
            ← Newsletters
          </button>
        </Link>
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="admin-editor-top-bar-btn"
        >
          {isLoggingOut ? "Signing out..." : "Logout"}
        </button>
      </div>

      {/* Split pane: textarea | preview */}
      <div className="admin-editor-split">
        <div className="admin-editor-left">
          <textarea
            placeholder="Write your newsletter markdown here..."
            value={markdown}
            onChange={handleMarkdownChange}
            className="admin-editor-textarea"
          />
        </div>

        <div className="admin-editor-divider" />

        <div className="admin-editor-right">
          <NewsletterPreview content={markdown} />
        </div>
      </div>

      {/* Publish bar */}
      <div className="admin-editor-publish-bar">
        <button
          onClick={handlePublish}
          disabled={sending}
          className="admin-editor-publish-btn"
        >
          {sending ? "Enviando..." : "Publicar"}
        </button>
        {sendSuccess && (
          <span className="admin-editor-success" style={{ marginLeft: "1rem" }}>
            ¡Enviado!
          </span>
        )}
        {sendError && (
          <span className="admin-editor-error" style={{ marginLeft: "1rem" }}>
            {sendError}
          </span>
        )}
      </div>
    </main>
  );
}
