import { useRef } from 'react';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface ImportFileUploadProps {
  onFileSelected: (file: File) => void;
  disabled?: boolean;
}

export function ImportFileUpload({
  onFileSelected,
  disabled = false,
}: ImportFileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelected(file);
      // Reset para permitir subir el mismo archivo de nuevo
      e.target.value = '';
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (disabled) return;
    const file = e.dataTransfer.files?.[0];
    if (file && file.name.endsWith('.csv')) {
      onFileSelected(file);
    }
  };

  return (
    <Card>
      <CardContent className="p-8">
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="text-center"
        >
          <input
            ref={inputRef}
            type="file"
            accept=".csv"
            onChange={handleChange}
            className="hidden"
            disabled={disabled}
          />
          <div className="p-4 rounded-full bg-primary-50 w-fit mx-auto mb-4">
            <Upload className="h-8 w-8 text-primary-600" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Seleccione un archivo CSV</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Arrastre el archivo aquí o haga clic para seleccionarlo.
            <br />
            Columnas requeridas: <code>codigo, nombre, descripcion, observaciones, rack, nivel</code>
          </p>
          <Button onClick={() => inputRef.current?.click()} disabled={disabled}>
            <Upload className="h-4 w-4 mr-2" />
            Seleccionar archivo
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}