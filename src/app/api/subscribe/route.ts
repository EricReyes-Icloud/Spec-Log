import { NextResponse } from "next/server";
import { Timestamp } from "firebase-admin/firestore";
import { getDb } from "@/lib/firebase-admin";
import { sendWelcomeEmail } from "@/lib/services/email";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TOKEN_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

function detectBrowser(userAgent: string): string {
  if (/Edg\//i.test(userAgent)) return "Edge";
  if (/Chrome/i.test(userAgent)) return "Chrome";
  if (/Firefox/i.test(userAgent)) return "Firefox";
  if (/Safari/i.test(userAgent)) return "Safari";
  return "Unknown";
}

function generateToken(): string {
  const bytes = new Uint8Array(8);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => TOKEN_CHARS[b % TOKEN_CHARS.length]).join("");
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email } = body as Record<string, unknown>;

    // Validate name
    if (typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json(
        { error: "El nombre debe tener al menos 2 caracteres" },
        { status: 400 }
      );
    }

    // Validate email
    if (typeof email !== "string" || !email.trim()) {
      return NextResponse.json(
        { error: "El email es requerido" },
        { status: 400 }
      );
    }

    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { error: "Ingresá un email válido" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();
    const db = getDb();
    const subscribersRef = db.collection("subscribers");
    const subscriberDoc = subscribersRef.doc(normalizedEmail);

    // Duplicate check
    const existing = await subscriberDoc.get();
    if (existing.exists) {
      return NextResponse.json(
        { error: "Ya estás registrado", code: "DUPLICATE_EMAIL" },
        { status: 409 }
      );
    }

    // Metadata from request headers
    const userAgent = request.headers.get("user-agent") ?? "";
    const country = request.headers.get("x-vercel-ip-country") ?? "unknown";
    const unsubscribeToken = generateToken();

    // Create subscriber document
    await subscriberDoc.set({
      name: name.trim(),
      email: normalizedEmail,
      status: "active",
      source: "landing-page",
      createdAt: Timestamp.now(),
      confirmedAt: null,
      lastEmailSent: null,
      metadata: {
        browser: detectBrowser(userAgent),
        country,
      },
      totalEmailsSent: 0,
      unsubscribeToken,
    });

    // Send welcome email — failure is logged but never blocks the response
    try {
      await sendWelcomeEmail(normalizedEmail, unsubscribeToken);
    } catch (emailError) {
      console.error("[email] Welcome email failed:", emailError);
    }

    return NextResponse.json(
      { redirectUrl: "/subscribe" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Subscribe API error:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
