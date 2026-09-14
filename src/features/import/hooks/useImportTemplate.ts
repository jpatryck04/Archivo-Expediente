import { useCallback } from 'react';

export function useImportTemplate() {
  const downloadTemplate = useCallback(() => {
    const csv = [
      'codigo,nombre,descripcion,observaciones,rack,nivel',
    ].join('\n');

    const blob = new Blob(['\ufeff' + csv], {
      type: 'text/csv;charset=utf-8;',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'plantilla-expedientes.csv';
    link.click();
    URL.revokeObjectURL(url);
  }, []);

  return { downloadTemplate };
}