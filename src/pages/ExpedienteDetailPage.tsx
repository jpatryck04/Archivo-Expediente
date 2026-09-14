import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  FileText,
  ArrowLeftRight,
  Edit,
} from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/shared/EmptyState';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { MovementBadge } from '@/components/shared/MovementBadge';
import { getExpedienteById } from '@/features/expedientes/services/expedientes.service';
import { useMovementsByExpediente } from '@/features/movements/hooks/useMovements';
import { formatDate, formatDateTime } from '@/lib/utils';
import { useAuth } from '@/features/auth/hooks/useAuth';

export function ExpedienteDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { role } = useAuth();
  const canCreateMovement = role === 'admin' || role === 'archivista';
  const canEdit = canCreateMovement;

  const { data: expediente, isLoading } = useQuery({
    queryKey: ['expediente', id],
    queryFn: () => getExpedienteById(id || ''),
    enabled: !!id,
  });

  const { data: movements, isLoading: movementsLoading } = useMovementsByExpediente(
    id || ''
  );

  if (isLoading) {
    return (
      <PageLayout title="Cargando...">
        <div className="space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </PageLayout>
    );
  }

  if (!expediente) {
    return (
      <PageLayout title="Expediente no encontrado">
        <EmptyState
          icon={FileText}
          title="Expediente no encontrado"
          description="El expediente solicitado no existe o fue eliminado."
          action={
            <Link to="/expedientes">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver a Expedientes
              </Button>
            </Link>
          }
        />
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title={expediente.code}
      description={expediente.name || 'Sin nombre asignado'}
      actions={
        <div className="flex items-center gap-3">
          <Link to="/expedientes">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
          </Link>
          {canEdit && (
            <Link to={`/expedientes/${id}/editar`}>
              <Button variant="outline">
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </Button>
            </Link>
          )}
          {canCreateMovement && expediente.status === 'available' && (
            <Link to={`/movements/salida?expediente=${id}`}>
              <Button>
                <ArrowLeftRight className="h-4 w-4 mr-2" />
                Registrar Salida
              </Button>
            </Link>
          )}
        </div>
      }
    >
      {/* Información del expediente */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Información General</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Código</p>
                <p className="font-mono font-medium">{expediente.code}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Nombre</p>
                <p className="font-medium">
                  {expediente.name || (
                    <span className="text-muted-foreground">—</span>
                  )}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Estado</p>
                <StatusBadge status={expediente.status} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Ubicación actual</p>
                {expediente.location ? (
                  <Link
                    to={`/locations/${expediente.location.code}`}
                    className="text-primary-600 hover:underline flex items-center gap-1"
                  >
                    <MapPin className="h-3 w-3" />
                    {expediente.location.rack?.name} · Nivel{' '}
                    {String(expediente.location.level).padStart(2, '0')}
                  </Link>
                ) : (
                  <span className="text-muted-foreground">Sin ubicación</span>
                )}
              </div>
            </div>

            {expediente.description && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">Descripción</p>
                <p className="text-sm">{expediente.description}</p>
              </div>
            )}

            {expediente.notes && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">Observaciones</p>
                <p className="text-sm">{expediente.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Fechas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Creado
              </p>
              <p className="text-sm font-medium">
                {formatDate(expediente.created_at)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Última actualización
              </p>
              <p className="text-sm font-medium">
                {formatDate(expediente.updated_at)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Historial de movimientos */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Historial de Movimientos</CardTitle>
        </CardHeader>
        <CardContent>
          {movementsLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : !movements || movements.length === 0 ? (
            <EmptyState
              icon={ArrowLeftRight}
              title="Sin movimientos"
              description="Este expediente no tiene movimientos registrados."
            />
          ) : (
            <div className="space-y-3">
              {movements.map((movement) => (
                <div
                  key={movement.id}
                  className="flex items-start gap-4 p-3 rounded-lg border"
                >
                  <MovementBadge type={movement.type} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium">
                        {formatDateTime(movement.created_at)}
                      </span>
                      <span className="text-muted-foreground">por</span>
                      <span>{movement.user?.full_name || movement.user?.email}</span>
                    </div>
                    {movement.from_location && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Desde: {movement.from_location.rack?.name} · Nivel{' '}
                        {String(movement.from_location.level).padStart(2, '0')}
                      </p>
                    )}
                    {movement.to_location && (
                      <p className="text-sm text-muted-foreground">
                        Hacia: {movement.to_location.rack?.name} · Nivel{' '}
                        {String(movement.to_location.level).padStart(2, '0')}
                      </p>
                    )}
                    {movement.reason && (
                      <p className="text-sm mt-1">Motivo: {movement.reason}</p>
                    )}
                    {movement.notes && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {movement.notes}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </PageLayout>
  );
}