export function createReplyMailto(
  senderEmail: string,
  replySubject: string,
  bccEmail?: string,
): string {
  const encodedSubject = encodeURIComponent(replySubject);
  let href = `mailto:${senderEmail}?subject=${encodedSubject}`;
  if (bccEmail) {
    href += `&bcc=${encodeURIComponent(bccEmail)}`;
  }
  return href;
}