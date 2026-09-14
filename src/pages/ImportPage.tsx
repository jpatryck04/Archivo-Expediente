import { useState, useRef } from 'react';
import Papa from 'papaparse';
import { Upload, CheckCircle, Download, Loader2 } from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/sonner';

interface ImportRow {
  codigo: string;
  nombre?: string;
  descripcion?: string;
  observaciones?: string;
  rack: string;
  nivel: number | string;
  _status?: 'valid' | 'error' | 'duplicate';
  _error?: string;
  _location_id?: string;
}

export function ImportPage() {
  const [rows, setRows] = useState<ImportRow[]>([]);
  const [importing, setImporting] = useState(false);
  const [imported, setImported] = useState<{
    total: number;
    success: number;
    errors: number;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    Papa.parse<ImportRow>(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        // Validar cada fila
        const validatedRows = await validateRows(results.data);
        setRows(validatedRows);
        setImported(null);
      },
      error: () => {
        toast.error('Error al leer el archivo CSV');
      },
    });
  };

  const validateRows = async (data: ImportRow[]): Promise<ImportRow[]> => {
    // Obtener todas las ubicaciones
    const { data: locations } = await supabase
      .from('locations')
      .select('id, code');

    const locationMap = new Map<string, string>();
    locations?.forEach((loc) => {
      locationMap.set(loc.code, loc.id);
    });

    // Obtener códigos existentes
    const { data: existing } = await supabase
      .from('expedientes')
      .select('code');

    const existingCodes = new Set(existing?.map((e) => e.code) || []);
    const seenCodes = new Set<string>();

    return data.map((row) => {
      const code = String(row.codigo || '').trim().toUpperCase();

      if (!code) {
        return { ...row, _status: 'error', _error: 'Código vacío' };
      }

      if (existingCodes.has(code)) {
        return { ...row, _status: 'duplicate', _error: 'Ya existe en el sistema' };
      }

      if (seenCodes.has(code)) {
        return { ...row, _status: 'error', _error: 'Duplicado en el archivo' };
      }

      seenCodes.add(code);

      const rackCode = String(row.rack || '').trim().toUpperCase();
      const nivel = parseInt(String(row.nivel), 10);

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
  };

  const handleImport = async () => {
    const validRows = rows.filter((r) => r._status === 'valid');
    if (validRows.length === 0) {
      toast.error('No hay filas válidas para importar');
      return;
    }

    setImporting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuario no autenticado');

      let success = 0;
      let errors = 0;

      for (const row of validRows) {
        try {
          // Insertar expediente
          const { data: expediente, error: expError } = await supabase
            .from('expedientes')
            .insert({
              code: row.codigo,
              name: row.nombre?.trim() || null,
              description: row.descripcion?.trim() || null,
              notes: row.observaciones?.trim() || null,
              location_id: row._location_id,
              status: 'available',
            })
            .select()
            .single();

          if (expError) throw expError;

          // Registrar movimiento
          await supabase.from('movements').insert({
            expediente_id: expediente.id,
            user_id: user.id,
            type: 'ENTRY',
            to_location_id: row._location_id,
          });

          success++;
        } catch (err) {
          console.error('Error importing row:', err);
          errors++;
        }
      }

      setImported({
        total: rows.length,
        success,
        errors: rows.length - success,
      });

      toast.success(`Importación completada: ${success} expedientes importados`);
   } catch {
  toast.error('Error durante la importación');
    } finally {
      setImporting(false);
    }
  };

  const downloadTemplate = () => {
    const csv = 'codigo,nombre,descripcion,observaciones,rack,nivel\n';
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'plantilla-expedientes.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const stats = {
    total: rows.length,
    valid: rows.filter((r) => r._status === 'valid').length,
    errors: rows.filter((r) => r._status === 'error').length,
    duplicates: rows.filter((r) => r._status === 'duplicate').length,
  };

  return (
    <PageLayout
      title="Importar Expedientes"
      description="Importe expedientes desde un archivo CSV"
      actions={
        <Button variant="outline" onClick={downloadTemplate}>
          <Download className="h-4 w-4 mr-2" />
          Descargar plantilla
        </Button>
      }
    >
      {/* Upload area */}
      <Card className="mb-6">
        <CardContent className="p-8">
          <div className="text-center">
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
            />
            <div className="p-4 rounded-full bg-primary-50 w-fit mx-auto mb-4">
              <Upload className="h-8 w-8 text-primary-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              Seleccione un archivo CSV
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              El archivo debe tener las columnas: codigo, nombre, descripcion,
              observaciones, rack, nivel
            </p>
            <Button onClick={() => fileInputRef.current?.click()}>
              <Upload className="h-4 w-4 mr-2" />
              Seleccionar archivo
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Resumen de importación */}
      {imported && (
        <Card className="mb-6 border-green-200 bg-green-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <h3 className="font-semibold text-green-900">Importación completada</h3>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-green-700">Total</p>
                <p className="text-2xl font-bold text-green-900">{imported.total}</p>
              </div>
              <div>
                <p className="text-sm text-green-700">Importados</p>
                <p className="text-2xl font-bold text-green-900">{imported.success}</p>
              </div>
              <div>
                <p className="text-sm text-green-700">Errores</p>
                <p className="text-2xl font-bold text-green-900">{imported.errors}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Vista previa */}
      {rows.length > 0 && !imported && (
        <>
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Total filas</p>
                  <p className="text-xl font-bold">{stats.total}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Válidas</p>
                  <p className="text-xl font-bold text-green-600">{stats.valid}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Duplicadas</p>
                  <p className="text-xl font-bold text-amber-600">{stats.duplicates}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Con errores</p>
                  <p className="text-xl font-bold text-red-600">{stats.errors}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-base">Vista Previa</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="max-h-96 overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Fila</TableHead>
                      <TableHead>Código</TableHead>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Rack</TableHead>
                      <TableHead>Nivel</TableHead>
                      <TableHead>Estado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rows.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell className="font-mono">{row.codigo}</TableCell>
                        <TableCell>{row.nombre || '—'}</TableCell>
                        <TableCell>{row.rack}</TableCell>
                        <TableCell>{row.nivel}</TableCell>
                        <TableCell>
                          {row._status === 'valid' && (
                            <Badge variant="success">Válido</Badge>
                          )}
                          {row._status === 'duplicate' && (
                            <Badge variant="warning">Duplicado</Badge>
                          )}
                          {row._status === 'error' && (
                            <Badge variant="error">{row._error}</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setRows([]);
                setImported(null);
              }}
              disabled={importing}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleImport}
              disabled={importing || stats.valid === 0}
            >
              {importing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Importando...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Importar {stats.valid} expedientes
                </>
              )}
            </Button>
          </div>
        </>
      )}
    </PageLayout>
  );
}