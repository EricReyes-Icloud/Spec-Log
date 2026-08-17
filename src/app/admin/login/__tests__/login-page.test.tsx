import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { GENERIC_LOGIN_ERROR } from "@/lib/firebase-errors";
import AdminLoginPage from "../page";

const mocks = vi.hoisted(() => {
  const signInWithEmailAndPassword = vi.fn();
  const push = vi.fn();
  return { signInWithEmailAndPassword, push, auth: {} };
});

vi.mock("firebase/auth", () => ({
  signInWithEmailAndPassword: mocks.signInWithEmailAndPassword,
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mocks.push }),
}));

vi.mock("@/lib/firebase-client", () => ({
  auth: mocks.auth,
}));

const firebaseAuthError = (code: string) =>
  Object.assign(new Error(`Firebase: Error (${code}).`), { code });

function fillAndSubmit(email: string, password: string) {
  render(<AdminLoginPage />);
  fireEvent.change(screen.getByLabelText("USER"), {
    target: { value: email },
  });
  fireEvent.change(screen.getByLabelText("PASSWORD"), {
    target: { value: password },
  });
  fireEvent.click(screen.getByRole("button", { name: "Login" }));
}

describe("AdminLoginPage error mapping", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal(
      "fetch",
      vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ success: true }),
        }),
      ),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("shows the generic message for invalid credentials and never leaks the Firebase code", async () => {
    mocks.signInWithEmailAndPassword.mockRejectedValueOnce(
      firebaseAuthError("auth/invalid-credential"),
    );

    fillAndSubmit("admin@spec-log.com", "wrong-password");

    const alert = await screen.findByRole("alert");
    expect(alert.textContent).toBe(GENERIC_LOGIN_ERROR);
    expect(alert.textContent).not.toContain("auth/");
    expect(alert.textContent).not.toContain("Firebase");
  });

  it("re-enables the submit button and does not redirect after a failure", async () => {
    mocks.signInWithEmailAndPassword.mockRejectedValueOnce(
      firebaseAuthError("auth/network-request-failed"),
    );

    fillAndSubmit("admin@spec-log.com", "right-password");

    await screen.findByRole("alert");
    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Login" }).disabled).toBe(
        false,
      );
    });
    expect(mocks.push).not.toHaveBeenCalled();
  });

  it("maps a session-route failure to the generic message without redirecting", async () => {
    mocks.signInWithEmailAndPassword.mockResolvedValueOnce({
      user: { getIdToken: () => Promise.resolve("id-token") },
    });
    vi.stubGlobal(
      "fetch",
      vi.fn(() =>
        Promise.resolve({
          ok: false,
          json: () => Promise.resolve({ error: "Origen no permitido" }),
        }),
      ),
    );

    fillAndSubmit("admin@spec-log.com", "right-password");

    const alert = await screen.findByRole("alert");
    expect(alert.textContent).toBe(GENERIC_LOGIN_ERROR);
    expect(alert.textContent).not.toContain("Origen");
    expect(mocks.push).not.toHaveBeenCalled();
  });

  it("still redirects to /admin/newsletters on success", async () => {
    mocks.signInWithEmailAndPassword.mockResolvedValueOnce({
      user: { getIdToken: () => Promise.resolve("id-token") },
    });

    fillAndSubmit("admin@spec-log.com", "right-password");

    await waitFor(() => {
      expect(mocks.push).toHaveBeenCalledWith("/admin/newsletters");
    });
  });
});