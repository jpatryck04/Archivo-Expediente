import { useState, useCallback } from 'react';
import Papa from 'papaparse';
import { toast } from '@/components/ui/sonner';
import type { ImportRow } from '../types/import.types';

export function useCsvParser() {
  const [parsing, setParsing] = useState(false);
  const [rows, setRows] = useState<ImportRow[]>([]);

  const parseFile = useCallback(async (file: File): Promise<ImportRow[]> => {
    setParsing(true);
    return new Promise((resolve, reject) => {
      Papa.parse<ImportRow>(file, {
        header: true,
        skipEmptyLines: true,
        transformHeader: (h) => h.trim().toLowerCase(),
        complete: (results) => {
          if (results.errors.length > 0) {
            const msg = results.errors[0].message;
            toast.error(`Error al parsear CSV: ${msg}`);
            setParsing(false);
            reject(new Error(msg));
            return;
          }

          const parsedRows = results.data.map((row) => ({
            codigo: String(row.codigo || '').trim().toUpperCase(),
            nombre: String(row.nombre || '').trim(),
            descripcion: String(row.descripcion || '').trim(),
            observaciones: String(row.observaciones || '').trim(),
            rack: String(row.rack || '').trim().toUpperCase(),
            nivel: parseInt(String(row.nivel || '0'), 10),
          }));

          setRows(parsedRows);
          setParsing(false);
          resolve(parsedRows);
        },
        error: (err) => {
          toast.error('Error al leer el archivo');
          setParsing(false);
          reject(err);
        },
      });
    });
  }, []);

  const clear = useCallback(() => {
    setRows([]);
  }, []);

  return {
    parsing,
    rows,
    parseFile,
    clear,
    setRows,
  };
}