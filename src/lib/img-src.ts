const API_URL = process.env.NEXT_PUBLIC_API_URL ?? '';

export function imgSrc(keyOrUrl: string): string {
  if (keyOrUrl.startsWith('blob:') || keyOrUrl.startsWith('data:')) {
    return keyOrUrl;
  }

  // Rewrite old CDN-style URLs:
  // https://.../api/images/preview-images/file.png → {API_URL}/api/images/signed?key=preview-images/file.png
  const oldCdnMatch = keyOrUrl.match(/\/api\/images\/(preview-images|icons)\/([^?#]+)/);
  if (oldCdnMatch) {
    return `${API_URL}/api/images/signed?key=${encodeURIComponent(`${oldCdnMatch[1]}/${oldCdnMatch[2]}`)}`;
  }

  // Rewrite old frontend /api/signed?key=... URLs stored in DB before this migration
  // Matches both relative (/api/signed?key=...) and full origin (https://site.com/api/signed?key=...)
  const oldSignedMatch = keyOrUrl.match(/\/api\/signed\?key=([^&]+)/);
  if (oldSignedMatch) {
    return `${API_URL}/api/images/signed?key=${oldSignedMatch[1]}`;
  }

  // Rewrite old /api/image?key=... proxy URLs (deleted route) to current backend signed endpoint
  const oldProxyMatch = keyOrUrl.match(/\/api\/image\?key=([^&]+)/);
  if (oldProxyMatch) {
    return `${API_URL}/api/images/signed?key=${oldProxyMatch[1]}`;
  }

  if (keyOrUrl.startsWith('http')) {
    return keyOrUrl;
  }

  return `${API_URL}/api/images/signed?key=${encodeURIComponent(keyOrUrl)}`;
}
