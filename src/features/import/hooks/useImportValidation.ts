import { useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { ImportRow } from '../types/import.types';

export function useImportValidation() {
  const validateRows = useCallback(async (rows: ImportRow[]): Promise<ImportRow[]> => {
    // Cargar ubicaciones
    const { data: locations } = await supabase
      .from('locations')
      .select('id, code');

    const locationMap = new Map<string, string>();
    locations?.forEach((loc) => locationMap.set(loc.code, loc.id));

    // Cargar códigos existentes
    const { data: existing } = await supabase.from('expedientes').select('code');
    const existingCodes = new Set(existing?.map((e) => e.code) || []);

    const seenCodes = new Set<string>();

    return rows.map((row) => {
      const code = String(row.codigo || '').trim().toUpperCase();

      if (!code) {
        return { ...row, _status: 'error', _error: 'Código vacío' };
      }

      if (existingCodes.has(code)) {
        return { ...row, _status: 'duplicate', _error: 'Ya existe' };
      }

      if (seenCodes.has(code)) {
        return { ...row, _status: 'error', _error: 'Duplicado en archivo' };
      }

      seenCodes.add(code);

      const rackCode = String(row.rack || '').trim().toUpperCase();
      const nivel = Number(row.nivel);

      if (!rackCode || isNaN(nivel)) {
        return { ...row, _status: 'error', _error: 'Rack o nivel inválido' };
      }

      const locationCode = `ARCH-${rackCode}-N${String(nivel).padStart(2, '0')}`;
      const locationId = locationMap.get(locationCode);

      if (!locationId) {
        return {
          ...row,
          _status: 'error',
          _error: `Ubicación no encontrada: ${locationCode}`,
        };
      }

      return {
        ...row,
        codigo: code,
        _status: 'valid',
        _location_id: locationId,
      };
    });
  }, []);

  return { validateRows };
}