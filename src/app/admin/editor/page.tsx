"use client";

import { useState, useRef, useCallback, type ChangeEvent } from "react";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { preparseMarkdown } from "@/lib/markdown-preparser";
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
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Pre-parsed content for preview
  const previewContent = preparseMarkdown(markdown);

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
      await createNewsletter(title.trim(), markdown);
      setSuccess(true);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to save newsletter";
      setError(message);
    } finally {
      setSaving(false);
    }
  }, [title, markdown]);

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
          <NewsletterPreview content={previewContent} />
        </div>
      </div>

      {/* Publish button (disabled for now) */}
      <div className="admin-editor-publish-bar">
        <button disabled className="admin-editor-publish-btn">
          Publicar
        </button>
      </div>
    </main>
  );
}
