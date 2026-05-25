export function imgSrc(keyOrUrl: string): string {
  if (keyOrUrl.startsWith('blob:') || keyOrUrl.startsWith('data:')) {
    return keyOrUrl;
  }

  // Rewrite old CDN-style URLs:
  // https://.../api/images/preview-images/file.png → /api/signed?key=preview-images/file.png
  const oldCdnMatch = keyOrUrl.match(/\/api\/images\/(preview-images|icons)\/([^?#]+)/);
  if (oldCdnMatch) {
    return `/api/signed?key=${encodeURIComponent(`${oldCdnMatch[1]}/${oldCdnMatch[2]}`)}`;
  }

  // Rewrite old /api/image?key=... proxy URLs (deleted route) to current /api/signed
  const oldProxyMatch = keyOrUrl.match(/\/api\/image\?key=([^&]+)/);
  if (oldProxyMatch) {
    return `/api/signed?key=${oldProxyMatch[1]}`;
  }

  if (keyOrUrl.startsWith('http')) {
    return keyOrUrl;
  }

  return `/api/signed?key=${encodeURIComponent(keyOrUrl)}`;
}
