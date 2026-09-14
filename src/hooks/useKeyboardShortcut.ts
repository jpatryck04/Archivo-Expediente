import { useEffect } from 'react';

interface Options {
  enabled?: boolean;
  ctrlOrCmd?: boolean;
  shift?: boolean;
  preventDefault?: boolean;
}

export function useKeyboardShortcut(
  key: string,
  callback: () => void,
  { enabled = true, ctrlOrCmd = false, shift = false, preventDefault = true }: Options = {}
): void {
  useEffect(() => {
    if (!enabled) return;

    const handler = (e: KeyboardEvent) => {
      const modPressed = ctrlOrCmd ? e.ctrlKey || e.metaKey : true;
      const shiftPressed = shift ? e.shiftKey : true;

      if (
        e.key.toLowerCase() === key.toLowerCase() &&
        modPressed &&
        shiftPressed
      ) {
        if (preventDefault) e.preventDefault();
        callback();
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [key, callback, enabled, ctrlOrCmd, shift, preventDefault]);
}