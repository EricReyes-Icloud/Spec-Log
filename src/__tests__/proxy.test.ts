import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import type { NextRequest } from "next/server";

// Mock definitions hoisted before vi.mock calls (project convention).
const mocks = vi.hoisted(() => {
  const verifySessionCookie = vi.fn();
  const getAuth = vi.fn(() => ({ verifySessionCookie }));
  const initApp = vi.fn(() => ({ name: "[DEFAULT]" }));
  return { verifySessionCookie, getAuth, initApp };
});

vi.mock("firebase-admin/auth", () => ({
  getAuth: mocks.getAuth,
}));

vi.mock("@/lib/firebase-admin", () => ({
  initApp: mocks.initApp,
}));

import { proxy } from "@/proxy";

/**
 * Minimal NextRequest-shaped stub. The proxy reads `cookies.get("session")`,
 * `nextUrl.pathname`, and `url` (absolute, for building the login redirect).
 */
function buildRequest(pathname: string, sessionCookie?: string) {
  return {
    url: `https://spec-log.example.com${pathname}`,
    nextUrl: { pathname },
    cookies: {
      get: (name: string) =>
        name === "session" && sessionCookie
          ? { value: sessionCookie }
          : undefined,
    },
  } as unknown as NextRequest;
}

describe("proxy /admin middleware", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv("ADMIN_EMAIL", "admin@spec-log.com");
    mocks.initApp.mockReturnValue({ name: "[DEFAULT]" });
    mocks.getAuth.mockReturnValue({
      verifySessionCookie: mocks.verifySessionCookie,
    });
    mocks.verifySessionCookie.mockResolvedValue({
      email: "admin@spec-log.com",
      uid: "uid-123",
    });
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("redirects to /admin/login and clears the session cookie when the cookie is missing", async () => {
    const request = buildRequest("/admin/newsletters");

    const response = await proxy(request);

    expect(response.status).toBe(302);
    expect(response.headers.get("location")).toContain("/admin/login");
    const setCookie = response.headers.get("set-cookie") ?? "";
    expect(setCookie).toContain("session=");
    expect(setCookie).toContain("Max-Age=0");
    expect(mocks.verifySessionCookie).not.toHaveBeenCalled();
  });

  it("redirects to /admin/login when verifySessionCookie rejects (invalid/expired/revoked)", async () => {
    mocks.verifySessionCookie.mockRejectedValueOnce(
      new Error("The session cookie is invalid."),
    );
    const request = buildRequest("/admin/newsletters", "stale-cookie");

    const response = await proxy(request);

    expect(response.status).toBe(302);
    expect(response.headers.get("location")).toContain("/admin/login");
    const setCookie = response.headers.get("set-cookie") ?? "";
    expect(setCookie).toContain("session=");
    expect(setCookie).toContain("Max-Age=0");
  });

  it("passes the cookie and revocation flag to verifySessionCookie", async () => {
    const request = buildRequest("/admin/newsletters", "valid-cookie");

    const response = await proxy(request);

    expect(mocks.verifySessionCookie).toHaveBeenCalledWith(
      "valid-cookie",
      true,
    );
    expect(response.status).toBe(200);
  });

  it("returns 403 when the token email does not match ADMIN_EMAIL", async () => {
    mocks.verifySessionCookie.mockResolvedValueOnce({
      email: "other@example.com",
      uid: "uid-456",
    });
    const request = buildRequest("/admin/newsletters", "valid-cookie");

    const response = await proxy(request);

    expect(response.status).toBe(403);
    expect(await response.text()).toBe("Forbidden");
  });

  it("returns 403 when ADMIN_EMAIL is unset (fail-closed)", async () => {
    vi.stubEnv("ADMIN_EMAIL", undefined);
    const request = buildRequest("/admin/newsletters", "valid-cookie");

    const response = await proxy(request);

    expect(response.status).toBe(403);
    expect(await response.text()).toBe("Forbidden");
  });

  it("lets a matching admin session pass through", async () => {
    const request = buildRequest("/admin/newsletters", "valid-cookie");

    const response = await proxy(request);

    expect(response.status).toBe(200);
    expect(mocks.verifySessionCookie).toHaveBeenCalledWith(
      "valid-cookie",
      true,
    );
  });

  it("bypasses authentication for /admin/login", async () => {
    const request = buildRequest("/admin/login");

    const response = await proxy(request);

    expect(response.status).toBe(200);
    expect(mocks.getAuth).not.toHaveBeenCalled();
    expect(mocks.verifySessionCookie).not.toHaveBeenCalled();
  });
});