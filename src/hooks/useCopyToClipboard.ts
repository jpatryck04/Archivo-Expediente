import { useCallback, useState } from 'react';

export function useCopyToClipboard(): [
  string | null,
  (text: string) => Promise<boolean>
] {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(text);
      setTimeout(() => setCopied(null), 2000);
      return true;
    } catch {
      return false;
    }
  }, []);

  return [copied, copy];
}