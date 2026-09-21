'use client';

import { useCallback } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

export function useQueryString<T extends string>(
  key: string, 
  initialValue: T | '' = '', 
  validValues?: readonly T[],
) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const rawValue = searchParams.get(key) as T | null;
  const isValid = rawValue && (!validValues || validValues.includes(rawValue))
  const value = isValid ? rawValue : initialValue;

  const setQueryValue = useCallback((newValue: T | '') => {
    const params = new URLSearchParams(searchParams.toString());
    if (newValue) {
      params.set(key, newValue);
    } else {
      params.delete(key);
    }

    const queryString = params.toString();
    router.replace(queryString ? `${pathname}?${params.toString()}` : pathname, { scroll: false });
  }, [key, searchParams, pathname, router]);

  return [value, setQueryValue] as const;
}
