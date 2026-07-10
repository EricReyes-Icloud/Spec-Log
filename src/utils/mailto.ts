export function createReplyMailto(
  senderEmail: string,
  replySubject: string,
): string {
  const encodedSubject = encodeURIComponent(replySubject);

  return `mailto:${senderEmail}?subject=${encodedSubject}`;
}