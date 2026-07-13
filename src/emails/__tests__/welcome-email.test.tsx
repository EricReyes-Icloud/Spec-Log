import { renderToStaticMarkup } from "react-dom/server";
import React from "react";
import WelcomeEmail from "@/emails/welcome-email";
import { describe, it, expect } from "vitest";

/**
 * Render a React Email component to HTML string using react-dom/server.
 * @react-email/render is not compatible with jsdom test environments,
 * so we use renderToStaticMarkup directly which produces the same output
 * for static (non-interactive) email components.
 */
function renderEmail(element: React.ReactElement): string {
  return renderToStaticMarkup(element);
}

describe("WelcomeEmail", () => {
  it("renders unsubscribe link containing the token", () => {
    const token = "ABC12345";
    const html = renderEmail(
      React.createElement(WelcomeEmail, { unsubscribeToken: token }),
    );

    expect(html).toContain(`unsubscribe?token=${token}`);
  });

  it("renders preview text 'Bienvenido a Spec Log'", () => {
    const html = renderEmail(
      React.createElement(WelcomeEmail, { unsubscribeToken: "XYZ98765" }),
    );

    expect(html).toContain("Bienvenido a Spec Log");
  });

  it("does not contain dangerouslySetInnerHTML", () => {
    const html = renderEmail(
      React.createElement(WelcomeEmail, { unsubscribeToken: "TOKEN999" }),
    );

    expect(html).not.toContain("dangerouslySetInnerHTML");
  });
});
