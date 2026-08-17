/**
 * Generic login error shown to the user. One constant for every failure:
 * unknown codes, network errors, and session-route errors all produce the
 * same string so responses never reveal whether an account exists.
 */
export const GENERIC_LOGIN_ERROR = "Credenciales inválidas.";

/**
 * Maps any login failure to the single generic message.
 *
 * Anti-enumeration by design: the raw Firebase code, error message, and
 * session-route body text are never surfaced. Every input yields
 * GENERIC_LOGIN_ERROR, so no input can be distinguished by its output.
 *
 * @param _err - The failure value; intentionally unused.
 * @returns GENERIC_LOGIN_ERROR for every input.
 */
export function mapLoginError(_err: unknown): string {
  return GENERIC_LOGIN_ERROR;
}