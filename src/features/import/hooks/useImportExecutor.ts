import { useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/sonner';
import type { ImportRow } from '../types/import.types';

interface ImportResult {
  total: number;
  success: number;
  errors: number;
}

export function useImportExecutor() {
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const queryClient = useQueryClient();

  const executeImport = useCallback(
    async (rows: ImportRow[]): Promise<ImportResult> => {
      const validRows = rows.filter((r) => r._status === 'valid');
      if (validRows.length === 0) {
        toast.error('No hay filas válidas para importar');
        throw new Error('Sin filas válidas');
      }

      setImporting(true);

      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) throw new Error('Usuario no autenticado');

        let success = 0;
        // Procesar en lotes para mayor rendimiento
        const BATCH_SIZE = 25;
        for (let i = 0; i < validRows.length; i += BATCH_SIZE) {
          const batch = validRows.slice(i, i + BATCH_SIZE);

          const expedientesToInsert = batch.map((row) => ({
            code: row.codigo,
            name: row.nombre?.trim() || null,
            description: row.descripcion?.trim() || null,
            notes: row.observaciones?.trim() || null,
            location_id: row._location_id!,
            status: 'available' as const,
          }));

          const { data: inserted, error: insertError } = await supabase
            .from('expedientes')
            .insert(expedientesToInsert)
            .select('id, location_id');

          if (insertError) {
            console.error('Batch error:', insertError);
            continue;
          }

          // Registrar movimientos
          const movements = (inserted || []).map((exp) => ({
            expediente_id: exp.id,
            user_id: user.id,
            type: 'ENTRY' as const,
            to_location_id: exp.location_id,
          }));

          const { error: movError } = await supabase
            .from('movements')
            .insert(movements);

          if (movError) {
            console.error('Movement error:', movError);
          }

          success += batch.length;
        }

        const importResult: ImportResult = {
          total: rows.length,
          success,
          errors: rows.length - success,
        };

        setResult(importResult);
        queryClient.invalidateQueries({ queryKey: ['expedientes'] });
        queryClient.invalidateQueries({ queryKey: ['movements'] });
        queryClient.invalidateQueries({ queryKey: ['dashboard'] });

        toast.success(`${success} expedientes importados exitosamente`);
        return importResult;
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Error desconocido';
        toast.error(`Error durante la importación: ${msg}`);
        throw err;
      } finally {
        setImporting(false);
      }
    },
    [queryClient]
  );

  const reset = useCallback(() => {
    setResult(null);
    setImporting(false);
  }, []);

  return {
    importing,
    result,
    executeImport,
    reset,
  };
}