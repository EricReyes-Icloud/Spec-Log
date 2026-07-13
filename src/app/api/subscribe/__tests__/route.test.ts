import { describe, it, expect, vi, beforeEach } from "vitest";

// All mock definitions must be hoisted before vi.mock calls
const { mockDocGet, mockDocSet, mockDoc, mockCollection, mockSendWelcomeEmail } =
  vi.hoisted(() => {
    const mockDocGet = vi.fn();
    const mockDocSet = vi.fn();
    const mockDoc = vi.fn(() => ({
      get: mockDocGet,
      set: mockDocSet,
    }));
    const mockCollection = vi.fn(() => ({
      doc: mockDoc,
    }));
    const mockSendWelcomeEmail = vi.fn();

    return {
      mockDocGet,
      mockDocSet,
      mockDoc,
      mockCollection,
      mockSendWelcomeEmail,
    };
  });

vi.mock("@/lib/firebase-admin", () => ({
  getDb: vi.fn(() => ({
    collection: mockCollection,
  })),
}));

vi.mock("@/lib/services/email", () => ({
  sendWelcomeEmail: mockSendWelcomeEmail,
}));

import { POST } from "@/app/api/subscribe/route";

function buildRequest(body: object, headers: Record<string, string> = {}) {
  return new Request("http://localhost:3000/api/subscribe", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "user-agent": "Mozilla/5.0 Chrome/120",
      ...headers,
    },
    body: JSON.stringify(body),
  });
}

describe("POST /api/subscribe", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockDocGet.mockResolvedValue({ exists: false });
    mockDocSet.mockResolvedValue(undefined);
    mockSendWelcomeEmail.mockResolvedValue(undefined);
  });

  it("calls sendWelcomeEmail after document creation", async () => {
    const request = buildRequest({
      name: "Ana López",
      email: "ana@example.com",
    });

    const response = await POST(request);
    const body = await response.json();

    expect(mockDocSet).toHaveBeenCalledTimes(1);
    expect(mockSendWelcomeEmail).toHaveBeenCalledTimes(1);
    expect(mockSendWelcomeEmail).toHaveBeenCalledWith(
      "ana@example.com",
      expect.any(String),
    );
    expect(response.status).toBe(201);
    expect(body).toEqual({ redirectUrl: "/subscribe" });
  });

  it("returns 201 when email send throws", async () => {
    mockSendWelcomeEmail.mockRejectedValueOnce(
      new Error("Resend API error"),
    );

    const request = buildRequest({
      name: "Bob Smith",
      email: "bob@test.com",
    });

    const response = await POST(request);
    const body = await response.json();

    expect(mockDocSet).toHaveBeenCalledTimes(1);
    expect(response.status).toBe(201);
    expect(body).toEqual({ redirectUrl: "/subscribe" });
  });
});
