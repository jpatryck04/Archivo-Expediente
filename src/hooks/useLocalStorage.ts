import { useCallback, useEffect, useState } from 'react';

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  const [stored, setStored] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        const next =
          typeof value === 'function'
            ? (value as (prev: T) => T)(stored)
            : value;
        setStored(next);
        window.localStorage.setItem(key, JSON.stringify(next));
      } catch (err) {
        console.error('Error saving to localStorage:', err);
      }
    },
    [key, stored]
  );

  const remove = useCallback(() => {
    window.localStorage.removeItem(key);
    setStored(initialValue);
  }, [key, initialValue]);

  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === key && e.newValue) {
        try {
          setStored(JSON.parse(e.newValue));
        } catch {
          /* noop */
        }
      }
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, [key]);

  return [stored, setValue, remove];
}