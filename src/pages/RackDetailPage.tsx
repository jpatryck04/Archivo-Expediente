import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Archive, Package } from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/shared/EmptyState';
import { useRackByCode } from '@/features/racks/hooks/useRacks';
import { useLocationsByRack } from '@/features/locations/hooks/useLocations';
import { DEFAULT_CAPACITY } from '@/lib/constants';

export function RackDetailPage() {
  const { rackCode } = useParams<{ rackCode: string }>();

  const { data: rack, isLoading: rackLoading } = useRackByCode(rackCode || '');
  const { data: locations, isLoading: locationsLoading } = useLocationsByRack(
    rack?.id || ''
  );

  if (rackLoading) {
    return (
      <PageLayout title="Cargando...">
        <div className="space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </PageLayout>
    );
  }

  if (!rack) {
    return (
      <PageLayout title="Rack no encontrado">
        <EmptyState
          icon={Archive}
          title="Rack no encontrado"
          description={`No se encontró el rack con código: ${rackCode}`}
          action={
            <Link to="/racks">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver a Racks
              </Button>
            </Link>
          }
        />
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title={rack.name}
      description={`Código: ${rack.code}`}
      actions={
        <Link to="/racks">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
        </Link>
      }
    >
      {/* Niveles */}
      {locationsLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      ) : !locations || locations.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No hay niveles configurados"
          description="Este rack no tiene niveles configurados."
        />
      ) : (
        <div className="space-y-3">
          {[...locations].reverse().map((location) => (
            <Link
              key={location.id}
              to={`/locations/${location.code}`}
              className="block"
            >
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary-50">
                        <span className="text-lg font-bold text-primary-600">
                          N{String(location.level).padStart(2, '0')}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">
                          Nivel {String(location.level).padStart(2, '0')}
                        </p>
                        <p className="text-sm text-muted-foreground font-mono">
                          {location.code}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary">
                          Capacidad: {location.capacity || DEFAULT_CAPACITY}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        Ver expedientes
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </PageLayout>
  );
}