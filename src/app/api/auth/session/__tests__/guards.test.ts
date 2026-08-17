import { describe, it, expect, vi, afterEach } from "vitest";
import { isSameOrigin, createRateLimiter } from "../route";

function buildRequest(headers: Record<string, string>) {
  return new Request("http://localhost:3000/api/auth/session", {
    method: "POST",
    headers,
  });
}

describe("isSameOrigin", () => {
  it("accepts a request whose Origin host matches the Host header", () => {
    const request = buildRequest({
      host: "localhost:3000",
      origin: "http://localhost:3000",
    });

    expect(isSameOrigin(request)).toBe(true);
  });

  it("rejects a request with a foreign Origin", () => {
    const request = buildRequest({
      host: "localhost:3000",
      origin: "http://evil.example.com",
    });

    expect(isSameOrigin(request)).toBe(false);
  });

  it("falls back to the Referer when Origin is absent and matches", () => {
    const request = buildRequest({
      host: "localhost:3000",
      referer: "http://localhost:3000/admin/login",
    });

    expect(isSameOrigin(request)).toBe(true);
  });

  it("rejects a foreign Referer even without an Origin", () => {
    const request = buildRequest({
      host: "localhost:3000",
      referer: "http://evil.example.com/admin/login",
    });

    expect(isSameOrigin(request)).toBe(false);
  });

  it("rejects a request with neither Origin nor Referer (fail-closed)", () => {
    const request = buildRequest({ host: "localhost:3000" });

    expect(isSameOrigin(request)).toBe(false);
  });
});

describe("createRateLimiter", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("allows the first five requests from a client and denies the sixth", () => {
    const limiter = createRateLimiter(5, 30_000);

    expect(limiter.allow("203.0.113.10")).toBe(true);
    expect(limiter.allow("203.0.113.10")).toBe(true);
    expect(limiter.allow("203.0.113.10")).toBe(true);
    expect(limiter.allow("203.0.113.10")).toBe(true);
    expect(limiter.allow("203.0.113.10")).toBe(true);
    expect(limiter.allow("203.0.113.10")).toBe(false);
  });

  it("keeps other clients on their own budget", () => {
    const limiter = createRateLimiter(5, 30_000);

    expect(limiter.allow("203.0.113.10")).toBe(true);
    expect(limiter.allow("198.51.100.20")).toBe(true);
    expect(limiter.allow("203.0.113.10")).toBe(true);
    expect(limiter.allow("203.0.113.10")).toBe(true);
    expect(limiter.allow("203.0.113.10")).toBe(true);
    expect(limiter.allow("203.0.113.10")).toBe(true);
    expect(limiter.allow("203.0.113.10")).toBe(false);
    expect(limiter.allow("198.51.100.20")).toBe(true);
  });

  it("resets the window after windowMs elapses", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-08-17T12:00:00Z"));
    const limiter = createRateLimiter(5, 30_000);

    for (let i = 0; i < 6; i += 1) {
      limiter.allow("203.0.113.10");
    }
    expect(limiter.allow("203.0.113.10")).toBe(false);

    vi.advanceTimersByTime(30_001);

    expect(limiter.allow("203.0.113.10")).toBe(true);
  });

  it("caps the tracked map size at ~1000 entries (size sweep)", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-08-17T12:00:00Z"));
    const limiter = createRateLimiter(5, 30_000);

    for (let i = 0; i < 1005; i += 1) {
      expect(limiter.allow(`198.51.100.${i}`)).toBe(true);
    }

    expect(limiter.size()).toBe(1000);
  });
});