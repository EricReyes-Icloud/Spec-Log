/**
 * Stub de suscripción — placeholder para la Fase 2.
 *
 * En la próxima fase esto se conectará con Supabase para almacenar emails
 * y con Resend para el envío de newsletters.
 */

export async function subscribe(email: string): Promise<{ success: boolean }> {
  // Simula una llamada asíncrona
  await new Promise((resolve) => setTimeout(resolve, 500));

  console.info(`[subscribe] Email registrado (stub): ${email}`);

  return { success: true };
}
