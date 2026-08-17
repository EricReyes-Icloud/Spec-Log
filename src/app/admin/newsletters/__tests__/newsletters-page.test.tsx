import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AdminNewslettersPage from "../page";

const mocks = vi.hoisted(() => {
  const signOut = vi.fn();
  const onAuthStateChanged = vi.fn(() => () => {});
  const push = vi.fn();
  return { signOut, onAuthStateChanged, push, auth: {} };
});

vi.mock("firebase/auth", () => ({
  signOut: mocks.signOut,
  onAuthStateChanged: mocks.onAuthStateChanged,
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mocks.push }),
}));

vi.mock("@/lib/firebase-client", () => ({
  auth: mocks.auth,
}));

describe("AdminNewslettersPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal(
      "fetch",
      vi.fn(() => Promise.resolve({ ok: true, json: () => ({}) })),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("does NOT register an onAuthStateChanged listener on mount", () => {
    render(<AdminNewslettersPage />);

    expect(screen.getByRole("heading", { name: "Newsletters" })).toBeTruthy();
    expect(mocks.onAuthStateChanged).not.toHaveBeenCalled();
  });

  it("keeps the logout flow working: signOut + server session DELETE", async () => {
    mocks.signOut.mockResolvedValueOnce(undefined);

    render(<AdminNewslettersPage />);
    fireEvent.click(screen.getByRole("button", { name: "Logout" }));

    await waitFor(() => {
      expect(mocks.signOut).toHaveBeenCalledTimes(1);
    });
    expect(fetch).toHaveBeenCalledWith("/api/auth/session", {
      method: "DELETE",
    });
    expect(mocks.push).toHaveBeenCalledWith("/admin/login");
  });
});