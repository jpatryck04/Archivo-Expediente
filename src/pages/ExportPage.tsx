import { useState } from 'react';
import { Download, FileSpreadsheet, FileText, Loader2 } from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/sonner';

type ExportType = 'expedientes' | 'locations' | 'movements';

function exportCsv(
  data: Record<string, unknown>[],
  filename: string,
  headers: string[]
) {
  const rows = data.map((row) =>
    headers.map((h) => {
      const value = row[h];
      if (value === null || value === undefined) return '';
      const str = String(value);
      return str.includes(',') || str.includes('"')
        ? `"${str.replace(/"/g, '""')}"`
        : str;
    })
  );

  const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  const timestamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
  link.download = `${filename}-${timestamp}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export function ExportPage() {
  const [exporting, setExporting] = useState<ExportType | null>(null);

  const handleExport = async (type: ExportType) => {
    setExporting(type);

    try {
      if (type === 'expedientes') {
        const { data, error } = await supabase
          .from('expedientes')
          .select(
            `
            code, name, description, notes, status, created_at,
            location:locations(code, level, rack:racks(name))
          `
          )
          .order('code');

        if (error) throw error;

        const rows = (data ?? []).map((e: any) => ({
          codigo: e.code,
          nombre: e.name || '',
          descripcion: e.description || '',
          observaciones: e.notes || '',
          estado: e.status,
          rack: e.location?.rack?.name || '',
          nivel: e.location?.level || '',
          ubicacion: e.location?.code || '',
          fecha_creacion: e.created_at,
        }));

        exportCsv(rows, 'expedientes', [
          'codigo',
          'nombre',
          'descripcion',
          'observaciones',
          'estado',
          'rack',
          'nivel',
          'ubicacion',
          'fecha_creacion',
        ]);
      }

      if (type === 'locations') {
        const { data, error } = await supabase
          .from('locations')
          .select(
            `
            code, level, capacity,
            rack:racks(name, code)
          `
          )
          .order('code');

        if (error) throw error;

        const rows = (data ?? []).map((l: any) => ({
          codigo: l.code,
          rack: l.rack?.name || '',
          nivel: l.level,
          capacidad: l.capacity || '',
        }));

        exportCsv(rows, 'ubicaciones', ['codigo', 'rack', 'nivel', 'capacidad']);
      }

      if (type === 'movements') {
        const { data, error } = await supabase
          .from('movements')
          .select(
            `
            type, reason, notes, created_at,
            expediente:expedientes(code, name),
            user:profiles(full_name, email),
            from_location:locations!movements_from_location_id_fkey(code),
            to_location:locations!movements_to_location_id_fkey(code)
          `
          )
          .order('created_at', { ascending: false });

        if (error) throw error;

        const rows = (data ?? []).map((m: any) => ({
          fecha: m.created_at,
          tipo: m.type,
          expediente: m.expediente?.code || '',
          nombre_expediente: m.expediente?.name || '',
          ubicacion_origen: m.from_location?.code || '',
          ubicacion_destino: m.to_location?.code || '',
          usuario: m.user?.full_name || m.user?.email || '',
          motivo: m.reason || '',
          observaciones: m.notes || '',
        }));

        exportCsv(rows, 'movimientos', [
          'fecha',
          'tipo',
          'expediente',
          'nombre_expediente',
          'ubicacion_origen',
          'ubicacion_destino',
          'usuario',
          'motivo',
          'observaciones',
        ]);
      }

      toast.success('Exportación completada');
    } catch {
      toast.error('Error durante la exportación');
    } finally {
      setExporting(null);
    }
  };

  const exportOptions = [
    {
      type: 'expedientes' as ExportType,
      title: 'Expedientes',
      description: 'Exporta todos los expedientes con su ubicación actual',
      icon: FileSpreadsheet,
    },
    {
      type: 'locations' as ExportType,
      title: 'Ubicaciones',
      description: 'Lista de todas las ubicaciones (racks y niveles)',
      icon: FileText,
    },
    {
      type: 'movements' as ExportType,
      title: 'Movimientos',
      description: 'Historial completo de movimientos del sistema',
      icon: FileText,
    },
  ];

  return (
    <PageLayout
      title="Exportar Datos"
      description="Descargue los datos del sistema en formato CSV"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl">
        {exportOptions.map((option) => (
          <Card key={option.type}>
            <CardHeader>
              <div className="p-3 rounded-lg bg-primary-50 w-fit mb-3">
                <option.icon className="h-6 w-6 text-primary-600" />
              </div>
              <CardTitle className="text-base">{option.title}</CardTitle>
              <CardDescription>{option.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => handleExport(option.type)}
                disabled={exporting === option.type}
                className="w-full"
              >
                {exporting === option.type ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Exportando...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Exportar CSV
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageLayout>
  );
}