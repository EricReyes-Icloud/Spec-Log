import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { initApp } from "@/lib/firebase-admin";
import { getAuth } from "firebase-admin/auth";

const SESSION_COOKIE_NAME = "session";
const SESSION_EXPIRES_IN = 60 * 60 * 24 * 5 * 1000; // 5 days in ms

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { idToken } = body as Record<string, unknown>;

    if (typeof idToken !== "string" || !idToken) {
      return NextResponse.json(
        { error: "idToken is required" },
        { status: 400 }
      );
    }

    const adminAuth = getAuth(initApp());

    // Verify the ID token and create a session cookie
    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn: SESSION_EXPIRES_IN,
    });

    const cookieStore = await cookies();

    // Set the session cookie
    cookieStore.set(SESSION_COOKIE_NAME, sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: SESSION_EXPIRES_IN / 1000,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Session creation error:", error);
    return NextResponse.json(
      { error: "Failed to create session" },
      { status: 401 }
    );
  }
}

export async function DELETE() {
  try {
    const cookieStore = await cookies();

    cookieStore.set(SESSION_COOKIE_NAME, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 0,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Session deletion error:", error);
    return NextResponse.json(
      { error: "Failed to clear session" },
      { status: 500 }
    );
  }
}
