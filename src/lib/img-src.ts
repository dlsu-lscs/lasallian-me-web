/**
 * Converts a stored image key (e.g. "preview-images/abc.jpg") into a
 * URL that routes through the /api/signed proxy, which generates a fresh
 * 24-hour signed URL on every request.
 *
 * Legacy full-URL values (starting with "http") are passed through as-is
 * so old data doesn't break.
 */
export function imgSrc(keyOrUrl: string): string {
  if (
    keyOrUrl.startsWith('http') ||
    keyOrUrl.startsWith('blob:') ||
    keyOrUrl.startsWith('data:')
  ) {
    return keyOrUrl;
  }
  return `/api/signed?key=${encodeURIComponent(keyOrUrl)}`;
}
