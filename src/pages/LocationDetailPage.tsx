import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Printer, Plus } from 'lucide-react';

import { PageLayout } from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  useLocationByCode,
  useLocationExpedientes,
} from '@/features/locations/hooks/useLocations';
import { DEFAULT_CAPACITY, EXPEDIENTE_STATUS } from '@/lib/constants';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { hasPermission } from '@/lib/permissions';

export function LocationDetailPage() {
  const { role } = useAuth();
  const canCreateMovement = role === 'admin' || role === 'archivista';
  const canPrintQr = role ? hasPermission(role, 'locations:manage') : false;
  const { locationCode } = useParams<{ locationCode: string }>();

  const { data: location, isLoading: locationLoading } = useLocationByCode(
    locationCode || ''
  );
  const { data: expedientes, isLoading: expedientesLoading } = useLocationExpedientes(
    location?.id || ''
  );

  if (locationLoading) {
    return (
      <PageLayout title="Cargando...">
        <div className="animate-pulse space-y-4">
          <div className="h-32 bg-gray-200 rounded" />
          <div className="h-64 bg-gray-200 rounded" />
        </div>
      </PageLayout>
    );
  }

  if (!location) {
    return (
      <PageLayout title="Ubicación no encontrada">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">
              No se encontró la ubicación con código: {locationCode}
            </p>
            <Link to="/racks">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver a Racks
              </Button>
            </Link>
          </CardContent>
        </Card>
      </PageLayout>
    );
  }

  const totalExpedientes = expedientes?.length || 0;
  const capacidad = location.capacity || DEFAULT_CAPACITY;
  const porcentajeOcupacion = Math.round((totalExpedientes / capacidad) * 100);

  return (
    <PageLayout
      title={`${location.rack.name} — Nivel ${String(location.level).padStart(2, '0')}`}
      description={`Código: ${location.code}`}
      actions={
        <div className="flex items-center gap-3">
          <Link to="/racks">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
          </Link>
          {canPrintQr && (
            <Button variant="outline">
              <Printer className="h-4 w-4 mr-2" />
              Imprimir QR
            </Button>
          )}
          {canCreateMovement && (
            <Link to={`/movements/entrada?location=${location.id}`}>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Registrar Entrada
              </Button>
            </Link>
          )}
        </div>
      }
    >
      {/* Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Total Expedientes</p>
            <p className="text-3xl font-bold">{totalExpedientes}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Capacidad</p>
            <p className="text-3xl font-bold">{capacidad}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Ocupación</p>
            <div className="flex items-center gap-3">
              <p className="text-3xl font-bold">{porcentajeOcupacion}%</p>
              <Badge
                variant={
                  porcentajeOcupacion === 0
                    ? 'secondary'
                    : porcentajeOcupacion < 50
                    ? 'warning'
                    : 'success'
                }
              >
                {porcentajeOcupacion === 0
                  ? 'Vacía'
                  : porcentajeOcupacion < 50
                  ? 'Parcial'
                  : 'Ocupada'}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabla de expedientes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Expedientes en esta ubicación</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expedientesLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={4}>
                      <div className="h-8 bg-gray-100 animate-pulse rounded" />
                    </TableCell>
                  </TableRow>
                ))
              ) : expedientes?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                    No hay expedientes en esta ubicación
                  </TableCell>
                </TableRow>
              ) : (
                expedientes?.map((expediente) => (
                  <TableRow key={expediente.id}>
                    <TableCell className="font-mono font-medium">
                      {expediente.code}
                    </TableCell>
                    <TableCell>
                      {expediente.name || (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          expediente.status === 'available'
                            ? 'success'
                            : expediente.status === 'borrowed'
                            ? 'error'
                            : 'secondary'
                        }
                      >
                        {EXPEDIENTE_STATUS[expediente.status].label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link to={`/expedientes/${expediente.id}`}>
                        <Button variant="ghost" size="sm">
                          Ver
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </PageLayout>
  );
}