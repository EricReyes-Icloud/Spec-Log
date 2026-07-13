import { describe, it, expect, vi, beforeEach } from "vitest";

// Use vi.hoisted to define mocks before vi.mock hoisting
const { mockEmailsSend } = vi.hoisted(() => ({
  mockEmailsSend: vi.fn(),
}));

vi.mock("@react-email/render", () => ({
  render: vi.fn().mockResolvedValue("<html>mock rendered email</html>"),
}));

// Use a class constructor for Resend so that `new Resend()` works
vi.mock("resend", () => {
  class MockResend {
    emails: { send: typeof mockEmailsSend };
    constructor(_key: string) {
      this.emails = { send: mockEmailsSend };
    }
  }
  return { Resend: MockResend };
});

vi.mock("@/lib/markdown-preparser", () => ({
  withLineBreaks: vi.fn(),
  preparseMarkdown: vi.fn(),
}));

vi.mock("unified", () => ({
  unified: vi.fn(),
}));

vi.mock("remark-parse", () => ({
  default: vi.fn(),
}));

vi.mock("remark-rehype", () => ({
  default: vi.fn(),
}));

vi.mock("rehype-stringify", () => ({
  default: vi.fn(),
}));

import { render } from "@react-email/render";
import { sendWelcomeEmail } from "@/lib/services/email";
import { withLineBreaks, preparseMarkdown } from "@/lib/markdown-preparser";
import { unified } from "unified";

describe("sendWelcomeEmail", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.RESEND_API_KEY = "test_resend_key";
    process.env.RESEND_FROM_EMAIL = "Spec Log <newsletter@speclog.dpdns.org>";
  });

  it("calls render() with WelcomeEmail then resend.emails.send() with correct args and subject", async () => {
    const email = "ana@example.com";
    const token = "ABC12345";

    mockEmailsSend.mockResolvedValueOnce({ error: null });

    await sendWelcomeEmail(email, token);

    // Assert render was called
    expect(render).toHaveBeenCalledTimes(1);

    // Assert resend.emails.send was called with correct args
    expect(mockEmailsSend).toHaveBeenCalledTimes(1);
    expect(mockEmailsSend).toHaveBeenCalledWith({
      from: "Spec Log <newsletter@speclog.dpdns.org>",
      to: email,
      subject: "Bienvenido a Spec Log",
      html: "<html>mock rendered email</html>",
    });
  });

  it("does not invoke any markdown pipeline functions", async () => {
    const email = "bob@example.com";
    const token = "XYZ98765";

    mockEmailsSend.mockResolvedValueOnce({ error: null });

    await sendWelcomeEmail(email, token);

    // Assert none of the markdown pipeline functions were called
    expect(withLineBreaks).not.toHaveBeenCalled();
    expect(preparseMarkdown).not.toHaveBeenCalled();
    expect(unified).not.toHaveBeenCalled();
  });

  it("throws when Resend returns an error", async () => {
    mockEmailsSend.mockResolvedValueOnce({
      error: { message: "Rate limit exceeded" },
    });

    await expect(
      sendWelcomeEmail("fail@example.com", "ERR999"),
    ).rejects.toThrow("Rate limit exceeded");
  });
});
