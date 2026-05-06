/**
 * Converts a stored image key (e.g. "preview-images/abc.jpg") into a
 * URL that routes through the /api/image proxy, which generates a fresh
 * 24-hour signed URL on every request.
 *
 * Legacy full-URL values (starting with "http") are passed through as-is
 * so old data doesn't break.
 */
export function imgSrc(keyOrUrl: string): string {
  if (keyOrUrl.startsWith('http')) return keyOrUrl;
  return `/api/image?key=${encodeURIComponent(keyOrUrl)}`;
}
