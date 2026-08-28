'use client';

import { useEffect, useRef } from 'react';

export function useTrackView(slug: string, delayMs: number = 2000) {
  const hasTracked = useRef(false);

  useEffect(() => {
    if (hasTracked.current) return;

    const timer = setTimeout(() => {
      hasTracked.current = true;
      const url = `${process.env.NEXT_PUBLIC_API_URL}/api/applications/${encodeURIComponent(slug)}/view`;
      
      if (navigator.sendBeacon) {
        navigator.sendBeacon(url);
      } else {
        fetch(url, { method: 'POST', keepalive: true }).catch(() => {});
      }
    }, delayMs);

    return () => clearTimeout(timer);
  }, [slug]);
}