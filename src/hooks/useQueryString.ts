'use client';

import { useState, useCallback } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

export function useQueryString<T extends string>(key: string, initialValue: T | '' = '') {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [value, setValue] = useState<T | ''>(
    (searchParams.get(key) as T) ?? initialValue
  );

  const setQueryValue = useCallback((newValue: T | '') => {
    setValue(newValue);
    const params = new URLSearchParams(searchParams.toString());
    if (newValue) {
      params.set(key, newValue);
    } else {
      params.delete(key);
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [key, searchParams, pathname, router]);

  return [value, setQueryValue] as const;
}
