import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { initApp } from "@/lib/firebase-admin";
import type { DecodedIdToken } from "firebase-admin/auth";

// Cached dynamic import of firebase-admin/auth. Mirrors the send-route ESM
// pattern while avoiding a fresh module load per request (design AD3).
let cachedAuthModule: Promise<typeof import("firebase-admin/auth")> | null =
  null;

/**
 * Verifies the session cookie (revocation checked). Returns the decoded token
 * on success or null when the cookie is missing/invalid/expired/revoked.
 */
async function requireAuth(
  request: NextRequest,
): Promise<DecodedIdToken | null> {
  const sessionCookie = request.cookies.get("session")?.value;
  if (!sessionCookie) return null;

  try {
    cachedAuthModule ??= import("firebase-admin/auth");
    const { getAuth } = await cachedAuthModule;
    return await getAuth(initApp()).verifySessionCookie(sessionCookie, true);
  } catch {
    return null;
  }
}

/**
 * Authorization allowlist: the token email must EXACTLY match ADMIN_EMAIL.
 * An unset env var fails closed (every request denied). Case-sensitive.
 */
function requireAdmin(token: DecodedIdToken): boolean {
  return token.email === process.env.ADMIN_EMAIL;
}

export async function proxy(
  request: NextRequest,
): Promise<NextResponse | Response> {
  const { pathname } = request.nextUrl;

  // Login page is reachable regardless of session state.
  if (pathname.startsWith("/admin/login")) {
    return NextResponse.next();
  }

  const token = await requireAuth(request);
  if (!token) {
    const loginUrl = new URL("/admin/login", request.url);
    const response = NextResponse.redirect(loginUrl, 302);
    response.cookies.set("session", "", { maxAge: 0, path: "/" });
    return response;
  }

  // Authenticated but not allowlisted (or ADMIN_EMAIL unset) → 403. Redirecting
  // would loop against /admin/login and blur authN vs authZ (design AD6).
  if (!requireAdmin(token)) {
    return new Response("Forbidden", { status: 403 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/admin/:path*",
  // Next 16 Proxy ALWAYS runs on the Node.js runtime (its default) — a
  // `runtime` config option is rejected at build time in proxy files, so the
  // firebase-admin dynamic import below resolves against the Node runtime.
};