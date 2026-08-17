import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { initApp } from "@/lib/firebase-admin";
import { getAuth } from "firebase-admin/auth";

const SESSION_COOKIE_NAME = "session";
const SESSION_EXPIRES_IN = 60 * 60 * 24 * 5 * 1000; // 5 days in ms

export type RateLimiter = {
  allow: (ip: string) => boolean;
  prune: () => void;
  size: () => number;
};

/**
 * Origin check: the Origin header (or Referer as fallback) host must match the
 * Host header. Missing origin/referer OR host fails closed (403 raw POSTs).
 */
export function isSameOrigin(request: Request): boolean {
  const host = request.headers.get("host")?.toLowerCase();
  if (!host) return false;

  const origin = request.headers.get("origin");
  if (origin) {
    try {
      return new URL(origin).host.toLowerCase() === host;
    } catch {
      return false;
    }
  }

  const referer = request.headers.get("referer");
  if (referer) {
    try {
      return new URL(referer).host.toLowerCase() === host;
    } catch {
      return false;
    }
  }

  return false;
}

/**
 * Fixed-window in-memory rate limiter keyed by client IP. Stale entries reset on
 * access; the tracked map is capped (~1000) so it cannot grow unbounded. Per
 * serverless instance only — resets on restart (documented limitation).
 */
export function createRateLimiter(
  limit: number,
  windowMs: number,
): RateLimiter {
  const hits = new Map<string, { count: number; resetAt: number }>();
  const MAX_ENTRIES = 1000;

  function sweep(now: number): void {
    if (hits.size <= MAX_ENTRIES) return;
    for (const [ip, entry] of hits) {
      if (now >= entry.resetAt) hits.delete(ip);
    }
    if (hits.size > MAX_ENTRIES) {
      const excess = hits.size - MAX_ENTRIES;
      const oldest = [...hits.entries()]
        .sort((a, b) => a[1].resetAt - b[1].resetAt)
        .slice(0, excess);
      for (const [ip] of oldest) hits.delete(ip);
    }
  }

  function allow(ip: string): boolean {
    const now = Date.now();
    const entry = hits.get(ip);
    if (!entry || now >= entry.resetAt) {
      hits.set(ip, { count: 1, resetAt: now + windowMs });
      sweep(now);
      return true;
    }
    entry.count += 1;
    return entry.count <= limit;
  }

  function prune(): void {
    sweep(Date.now());
  }

  return { allow, prune, size: () => hits.size };
}

const limiter = createRateLimiter(5, 30_000);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { idToken } = body as Record<string, unknown>;

    if (typeof idToken !== "string" || !idToken) {
      return NextResponse.json(
        { error: "idToken is required" },
        { status: 400 }
      );
    }

    // CSRF gate — foreign Origin/Referer gets 403 before any cookie logic.
    if (!isSameOrigin(request)) {
      return NextResponse.json(
        { error: "Origen no permitido" },
        { status: 403 }
      );
    }

    // Rate gate — per-IP burst limit from x-forwarded-for (Vercel) first value.
    const xForwardedFor = request.headers.get("x-forwarded-for");
    const ip = xForwardedFor ? xForwardedFor.split(",")[0].trim() : "unknown";
    if (!limiter.allow(ip)) {
      return NextResponse.json(
        { error: "Demasiados intentos" },
        { status: 429 }
      );
    }

    const adminAuth = getAuth(initApp());

    // Verify the ID token and create a session cookie
    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn: SESSION_EXPIRES_IN,
    });

    const cookieStore = await cookies();

    // Set the session cookie
    cookieStore.set(SESSION_COOKIE_NAME, sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: SESSION_EXPIRES_IN / 1000,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Session creation error:", error);
    return NextResponse.json(
      { error: "Failed to create session" },
      { status: 401 }
    );
  }
}

export async function DELETE() {
  try {
    const cookieStore = await cookies();

    cookieStore.set(SESSION_COOKIE_NAME, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 0,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Session deletion error:", error);
    return NextResponse.json(
      { error: "Failed to clear session" },
      { status: 500 }
    );
  }
}
