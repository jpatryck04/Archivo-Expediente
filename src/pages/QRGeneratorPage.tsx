import { useState, useRef, type CSSProperties } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Printer, Settings, Grid3X3, Layers } from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { QRLabel } from '@/features/qr-generator/components/QRLabel';
import { useLocations } from '@/features/locations/hooks/useLocations';
import { useRacks } from '@/features/racks/hooks/useRacks';

type GenerationMode = 'all' | 'rack' | 'location';

export function QRGeneratorPage() {
  const [mode, setMode] = useState<GenerationMode>('all');
  const [selectedRack, setSelectedRack] = useState<string>('');
  const [selectedLevel, setSelectedLevel] = useState<number>(1);
  const [labelSize, setLabelSize] = useState(120);
  const [columns, setColumns] = useState(3);
  const printRef = useRef<HTMLDivElement>(null);

  const { data: racks } = useRacks();
  const { data: locations } = useLocations();

  const appUrl = import.meta.env.VITE_APP_URL || window.location.origin;

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: 'Etiquetas-QR-Archivo',
  });

  // Filtrar ubicaciones según el modo seleccionado
  const filteredLocations = (() => {
    if (!locations) return [];

    switch (mode) {
      case 'all':
        return locations;
      case 'rack':
        if (!selectedRack) return [];
        return locations.filter((loc) => loc.rack.code === selectedRack);
      case 'location':
        if (!selectedRack) return [];
        return locations.filter(
          (loc) => loc.rack.code === selectedRack && loc.level === selectedLevel
        );
      default:
        return [];
    }
  })();

  const availableLevels = Array.from(
    new Set(
      (locations || [])
        .filter((location) => !selectedRack || location.rack.code === selectedRack)
        .map((location) => location.level)
    )
  ).sort((a, b) => a - b);

  return (
    <PageLayout
      title="Generador de Códigos QR"
      description="Genere e imprima etiquetas QR para las ubicaciones del archivo"
    >
      {/* Controles */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6 no-print">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Configuración
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Modo de generación */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Modo de generación</label>
              <div className="space-y-2">
                <button
                  onClick={() => setMode('all')}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                    mode === 'all'
                      ? 'bg-primary-100 text-primary-800 border-2 border-primary-500'
                      : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                  }`}
                >
                  <Grid3X3 className="h-4 w-4" />
                  Todos los racks ({racks?.length || 0})
                </button>
                <button
                  onClick={() => setMode('rack')}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                    mode === 'rack'
                      ? 'bg-primary-100 text-primary-800 border-2 border-primary-500'
                      : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                  }`}
                >
                  <Layers className="h-4 w-4" />
                  Un rack completo
                </button>
                <button
                  onClick={() => setMode('location')}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                    mode === 'location'
                      ? 'bg-primary-100 text-primary-800 border-2 border-primary-500'
                      : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                  }`}
                >
                  <Layers className="h-4 w-4" />
                  Una ubicación
                </button>
              </div>
            </div>

            {/* Selector de rack */}
            {mode !== 'all' && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Rack</label>
                <select
                  value={selectedRack}
                  onChange={(e) => setSelectedRack(e.target.value)}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                >
                  <option value="">Seleccionar rack</option>
                  {racks?.map((rack) => (
                    <option key={rack.id} value={rack.code}>
                      {rack.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Selector de nivel */}
            {mode === 'location' && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Nivel</label>
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(Number(e.target.value))}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                >
                  {availableLevels.map((level) => (
                      <option key={level} value={level}>
                        Nivel {String(level).padStart(2, '0')}
                      </option>
                  ))}
                </select>
              </div>
            )}

            {/* Tamaño de etiqueta */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Tamaño QR: {labelSize}px
              </label>
              <input
                type="range"
                min="80"
                max="200"
                value={labelSize}
                onChange={(e) => setLabelSize(Number(e.target.value))}
                className="w-full"
              />
            </div>

            {/* Columnas */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Etiquetas por fila</label>
              <select
                value={columns}
                onChange={(e) => setColumns(Number(e.target.value))}
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
              >
                <option value={2}>2 columnas</option>
                <option value={3}>3 columnas</option>
                <option value={4}>4 columnas</option>
                <option value={5}>5 columnas</option>
              </select>
            </div>

            {/* Botones de acción */}
            <div className="pt-4 space-y-2">
              <Button onClick={handlePrint} className="w-full">
                <Printer className="h-4 w-4 mr-2" />
                Imprimir etiquetas
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Info */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-base">
              Vista previa ({filteredLocations.length} etiquetas)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              ref={printRef}
              className="qr-preview-grid grid gap-4"
              style={{ '--qr-columns': columns } as CSSProperties}
            >
              {filteredLocations.map((location) => (
                <QRLabel
                  key={location.id}
                  locationCode={location.code}
                  rackName={location.rack.name}
                  level={location.level}
                  appUrl={appUrl}
                  size={labelSize}
                />
              ))}
            </div>

            {filteredLocations.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <Grid3X3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Seleccione un rack para generar las etiquetas</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}