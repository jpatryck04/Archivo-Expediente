import type { Expediente } from '@/types/database';

/**
 * Formatea el nombre de un expediente para mostrar.
 * Si no tiene nombre, solo muestra el código.
 */
export function formatExpedienteName(expediente: Expediente): string {
  return expediente.name
    ? `${expediente.code} — ${expediente.name}`
    : expediente.code;
}

/**
 * Formatea la ubicación de un expediente.
 */
export function formatExpedienteLocation(expediente: Expediente): string {
  if (!expediente.location) return 'Sin ubicación';
  const rack = expediente.location.rack?.name || '';
  const level = String(expediente.location.level).padStart(2, '0');
  return `${rack} · Nivel ${level}`;
}

/**
 * Calcula el rango visual de códigos de una lista de expedientes.
 */
export function calculateRange(codes: string[]): {
  first: string;
  last: string;
  range: string;
} | null {
  if (codes.length === 0) return null;

  const sorted = [...codes].sort();
  const first = sorted[0];
  const last = sorted[sorted.length - 1];

  return {
    first,
    last,
    range: first === last ? first : `${first} - ${last}`,
  };
}

/**
 * Genera el siguiente código disponible usando el prefijo y ancho indicados.
 */
export function getNextCode(
  existingCodes: string[],
  prefix = '',
  padding = 5
): string {
  const numbers = existingCodes
    .map((c) => {
      const escapedPrefix = prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const match = c.match(new RegExp(`^${escapedPrefix}(\\d+)$`));
      return match ? parseInt(match[1], 10) : null;
    })
    .filter((n): n is number => n !== null);

  const max = numbers.length > 0 ? Math.max(...numbers) : 0;
  return `${prefix}${String(max + 1).padStart(padding, '0')}`;
}

/**
 * Valida el formato de un código de expediente.
 */
export function isValidExpedienteCode(code: string): boolean {
  return /^[A-Z0-9-]{1,50}$/.test(code);
}