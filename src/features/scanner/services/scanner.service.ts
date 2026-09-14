import { supabase } from '@/lib/supabase';
import type { Location } from '@/types/database';

/**
 * Busca una ubicación por su código.
 */
export async function findLocationByCode(
  code: string
): Promise<Location | null> {
  const { data, error } = await supabase
    .from('locations')
    .select(`
      *,
      rack:racks(id, code, name)
    `)
    .eq('code', code)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }

  return data as Location;
}

/**
 * Extrae el token QR de un texto escaneado.
 */
export function parseQrText(text: string): string | null {
  // Si es URL: https://app.com/scan/ARCH-R01-N01
  const urlMatch = text.match(/\/scan\/([A-Z0-9-]+)/i);
  if (urlMatch) return urlMatch[1].toUpperCase();

  // Si es código directo: ARCH-R01-N01
  const codeMatch = text.match(/ARCH-R\d{2}-N\d{2}/i);
  if (codeMatch) return codeMatch[0].toUpperCase();

  // Código simplificado: R01-N01
  const shortMatch = text.match(/R(\d{1,2})-?N?(\d{1,2})/i);
  if (shortMatch) {
    return `ARCH-R${String(shortMatch[1]).padStart(2, '0')}-N${String(
      shortMatch[2]
    ).padStart(2, '0')}`;
  }

  return null;
}