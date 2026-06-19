import { NextRequest, NextResponse } from "next/server";
import { Timestamp } from "firebase-admin/firestore";
import { getDb } from "@/lib/firebase-admin";
import { sendNewsletter } from "@/lib/services/email";

export async function POST(request: NextRequest) {
  try {
    // 1. Auth check via Firebase session cookie
    const sessionCookie = request.cookies.get("session")?.value;
    if (!sessionCookie) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // Verify the session cookie against Firebase Auth
    const { getAuth } = await import("firebase-admin/auth");
    try {
      await getAuth().verifySessionCookie(sessionCookie, true);
    } catch {
      return NextResponse.json({ error: "Sesión inválida" }, { status: 401 });
    }

    // 2. Validate body
    const body = await request.json();
    const { newsletterId } = body as { newsletterId?: string };
    if (!newsletterId || typeof newsletterId !== "string") {
      return NextResponse.json(
        { error: "newsletterId es requerido" },
        { status: 400 },
      );
    }

    const db = getDb();

    // 3. Fetch newsletter
    const newsletterDoc = await db
      .collection("newsletters")
      .doc(newsletterId)
      .get();
    if (!newsletterDoc.exists) {
      return NextResponse.json(
        { error: "Newsletter no encontrada" },
        { status: 404 },
      );
    }

    const newsletterData = newsletterDoc.data()!;

    // 4. Check if already sent
    if (newsletterData.status === "sent") {
      return NextResponse.json(
        { error: "La newsletter ya fue enviada", code: "ALREADY_SENT" },
        { status: 409 },
      );
    }

    // 5. Fetch active subscribers
    const subscribersSnapshot = await db
      .collection("subscribers")
      .where("status", "==", "active")
      .get();

    if (subscribersSnapshot.empty) {
      return NextResponse.json({ success: true, sentCount: 0 });
    }

    const subscribers = subscribersSnapshot.docs.map((doc) => ({
      email: doc.data().email,
      name: doc.data().name,
      unsubscribeToken: doc.data().unsubscribeToken,
    }));

    // 6. Call email service
    const result = await sendNewsletter(
      newsletterData.title,
      newsletterData.markdown,
      subscribers,
    );

    // 7. If ALL sent successfully, update newsletter status
    if (result.failedCount === 0 && result.sentCount > 0) {
      await db.collection("newsletters").doc(newsletterId).update({
        status: "sent",
        sentAt: Timestamp.now(),
      });
    }

    // 8. Return response
    if (result.failedCount > 0) {
      return NextResponse.json(
        {
          success: false,
          sentCount: result.sentCount,
          failedCount: result.failedCount,
          error: "Algunos envíos fallaron",
        },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, sentCount: result.sentCount });
  } catch (error) {
    console.error("[newsletter/send] Error:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
