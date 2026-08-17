import { describe, it, expect } from "vitest";
import { GENERIC_LOGIN_ERROR, mapLoginError } from "@/lib/firebase-errors";

/**
 * Session-route style error body (from the login page catch block).
 */
const sessionRouteError = (error: string) => ({ error });

/**
 * Firebase Auth errors carry a `code` like "auth/invalid-credential"
 * plus a human-readable `message`. The raw code must never reach the UI.
 */
const firebaseError = (code: string) => ({
  code,
  message: `Firebase error: ${code}`,
});

const KNOWN_FIREBASE_CODES = [
  "auth/invalid-credential",
  "auth/user-not-found",
  "auth/wrong-password",
  "auth/invalid-login-credentials",
  "auth/too-many-requests",
  "auth/user-disabled",
  "auth/network-request-failed",
  "auth/invalid-email",
] as const;

describe("mapLoginError", () => {
  it.each(KNOWN_FIREBASE_CODES)(
    "maps Firebase code %s to GENERIC_LOGIN_ERROR",
    (code) => {
      expect(mapLoginError(firebaseError(code))).toBe(GENERIC_LOGIN_ERROR);
    },
  );

  it("maps an unknown Firebase code to GENERIC_LOGIN_ERROR", () => {
    expect(mapLoginError(firebaseError("auth/unknown-code"))).toBe(
      GENERIC_LOGIN_ERROR,
    );
  });

  it("maps a plain Error with arbitrary message text to GENERIC_LOGIN_ERROR", () => {
    expect(
      mapLoginError(
        new Error("auth/invalid-email: The email address is badly formatted."),
      ),
    ).toBe(GENERIC_LOGIN_ERROR);
  });

  it("maps a network error (TypeError) to GENERIC_LOGIN_ERROR", () => {
    expect(
      mapLoginError(
        new TypeError("NetworkError when attempting to fetch resource."),
      ),
    ).toBe(GENERIC_LOGIN_ERROR);
  });

  it("maps a session-route { error } body to GENERIC_LOGIN_ERROR", () => {
    expect(mapLoginError(sessionRouteError("Origen no permitido"))).toBe(
      GENERIC_LOGIN_ERROR,
    );
  });

  it.each([null, undefined] as const)(
    "maps %s to GENERIC_LOGIN_ERROR",
    (input) => {
      expect(mapLoginError(input)).toBe(GENERIC_LOGIN_ERROR);
    },
  );

  it("never leaks raw codes, messages, or body text", () => {
    const inputs = [
      firebaseError("auth/invalid-credential"),
      new Error("auth/user-not-found"),
      sessionRouteError("Origen no permitido"),
      "auth/too-many-requests",
    ];
    for (const input of inputs) {
      const result = mapLoginError(input);
      // The value must be EXACTLY the generic constant (anti-enumeration).
      expect(result).toBe(GENERIC_LOGIN_ERROR);
      expect(result).not.toContain("auth/");
      expect(result).not.toContain("Firebase error");
      expect(result).not.toContain("Origen");
    }
  });
});