import Papa from 'papaparse';
import type { ImportRow } from '../types/import.types';

export function parseCsvFile(file: File): Promise<ImportRow[]> {
  return new Promise((resolve, reject) => {
    Papa.parse<ImportRow>(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (h) => h.trim().toLowerCase(),
      complete: (results) => resolve(results.data),
      error: (err) => reject(err),
    });
  });
}

export function exportToCsv(
  data: Record<string, unknown>[],
  filename: string
): void {
  const csv = Papa.unparse(data);
  const blob = new Blob(['\ufeff' + csv], {
    type: 'text/csv;charset=utf-8;',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}-${Date.now()}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}