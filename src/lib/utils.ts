import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { QR_PREFIX } from './constants';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date));
}

export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

export function generateLocationCode(rackNumber: number, level: number): string {
  return `${QR_PREFIX}-R${String(rackNumber).padStart(2, '0')}-N${String(level).padStart(2, '0')}`;
}

export function parseLocationCode(code: string): { rack: number; level: number } | null {
  const match = code.match(/^ARCH-R(\d{2})-N(\d{2})$/);
  if (!match) return null;
  return {
    rack: parseInt(match[1], 10),
    level: parseInt(match[2], 10),
  };
}

export function extractQrToken(input: string): string | null {
  // Si es una URL completa, extraer el token
  const urlMatch = input.match(/\/scan\/([A-Z0-9-]+)$/);
  if (urlMatch) return urlMatch[1];
  
  // Si es el código directamente
  const codeMatch = input.match(/^ARCH-R\d{2}-N\d{2}$/);
  if (codeMatch) return input;
  
  return null;
}