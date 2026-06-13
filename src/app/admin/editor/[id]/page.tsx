"use client";

import { useState, useEffect, useRef, useCallback, type ChangeEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { signOut } from "firebase/auth";
import { preparseMarkdown } from "@/lib/markdown-preparser";
import { getNewsletter, updateNewsletter, createNewsletter } from "@/lib/firebase-client";
import { auth } from "@/lib/firebase-client";
import type { Newsletter } from "@/lib/firebase-client";
import NewsletterPreview from "@/components/email/NewsletterPreview";
import "@/styles/admin-editor.css";

type PageState =
  | { status: "loading" }
  | { status: "loaded"; newsletter: Newsletter }
  | { status: "error"; message: string }
  | { status: "not-found" };

export default function AdminEditNewsletterPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [title, setTitle] = useState("");
  const [markdown, setMarkdown] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState(false);
  const [pageState, setPageState] = useState<PageState>({ status: "loading" });
  const [isLoggingOut, setIsLoggingOut] = useState(false);
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

  // Load newsletter on mount
  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const newsletter = await getNewsletter(id);
        if (cancelled) return;

        if (!newsletter) {
          setPageState({ status: "not-found" });
          return;
        }

        setTitle(newsletter.title);
        setMarkdown(newsletter.markdown);
        setPageState({ status: "loaded", newsletter });
      } catch (err) {
        if (cancelled) return;
        const message =
          err instanceof Error ? err.message : "Failed to load newsletter";
        setPageState({ status: "error", message });
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  // Pre-parsed content for preview
  const previewContent = preparseMarkdown(markdown);

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
      if (pageState.status === "loaded") {
        await updateNewsletter(id, title.trim(), markdown);
      } else {
        // Even on the edit route, if the doc doesn't exist, allow creating anew
        await createNewsletter(title.trim(), markdown);
      }
      setSuccess(true);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to save newsletter";
      setError(message);
    } finally {
      setSaving(false);
    }
  }, [title, markdown, id, pageState.status]);

  // ── Shared: top bar (logout + back) ──
  const topBar = (
    <div className="admin-editor-top-bar">
      <Link href="/admin/newsletters">
        <button className="admin-editor-top-bar-btn">← Newsletters</button>
      </Link>
      <button
        onClick={handleLogout}
        disabled={isLoggingOut}
        className="admin-editor-top-bar-btn"
      >
        {isLoggingOut ? "Signing out..." : "Logout"}
      </button>
    </div>
  );

  // ── Shared: publish button ──
  const publishBar = (
    <div className="admin-editor-publish-bar">
      <button disabled className="admin-editor-publish-btn">
        Publicar
      </button>
    </div>
  );

  // ── Shared: toolbar (title + save) ──
  const editorToolbar = (
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
    </div>
  );

  // ── Shared: split pane (textarea + preview) ──
  const editorSplitPane = (
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
  );

  // ── Loading state ──
  if (pageState.status === "loading") {
    return (
      <main className="admin-editor-page">
        {topBar}
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#aaa",
            fontFamily: "ui-monospace, monospace",
            fontSize: "0.875rem",
          }}
        >
          Loading newsletter...
        </div>
      </main>
    );
  }

  // ── Error state ──
  if (pageState.status === "error") {
    return (
      <main className="admin-editor-page">
        {topBar}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            color: "#ff4444",
            fontFamily: "ui-monospace, monospace",
            fontSize: "0.875rem",
            padding: "2rem",
            gap: "1rem",
          }}
        >
          <p>{pageState.message}</p>
          <p style={{ color: "#aaa", fontSize: "0.8125rem" }}>
            You can still create new content below.
          </p>
        </div>

        {editorToolbar}
        {editorSplitPane}
        {publishBar}
      </main>
    );
  }

  // ── Not found state ──
  if (pageState.status === "not-found") {
    return (
      <main className="admin-editor-page">
        {topBar}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            color: "#aaa",
            fontFamily: "ui-monospace, monospace",
            fontSize: "0.875rem",
            padding: "2rem",
            gap: "1rem",
          }}
        >
          <p>Newsletter not found.</p>
          <p style={{ color: "#aaa", fontSize: "0.8125rem" }}>
            Create a new newsletter below.
          </p>
        </div>

        {editorToolbar}
        {editorSplitPane}
        {publishBar}
      </main>
    );
  }

  // ── Loaded state ──
  return (
    <main className="admin-editor-page">
      {topBar}
      {editorToolbar}
      {editorSplitPane}
      {publishBar}
    </main>
  );
}
