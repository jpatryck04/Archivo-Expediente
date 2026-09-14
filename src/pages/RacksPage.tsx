import { Link } from 'react-router-dom';
import { Archive, ChevronRight } from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/shared/EmptyState';
import { ErrorState } from '@/components/shared/ErrorState';
import { useRacksWithLocations } from '@/features/racks/hooks/useRacks';

export function RacksPage() {
  const { data: racks, isLoading, error, refetch } = useRacksWithLocations();

  if (error) {
    return (
      <PageLayout title="Racks" description="Vista general de los racks del archivo">
        <ErrorState onRetry={() => refetch()} />
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="Racks"
      description="Vista general de los racks del archivo"
    >
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-6 w-32 mb-4" />
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-4 w-40" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : !racks || racks.length === 0 ? (
        <EmptyState
          icon={Archive}
          title="No hay racks configurados"
          description="Los racks aparecerán aquí una vez configurados en el sistema."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {racks.map((rack) => (
            <Link key={rack.id} to={`/racks/${rack.code}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary-50">
                        <Archive className="h-5 w-5 text-primary-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{rack.name}</h3>
                        <p className="text-xs text-muted-foreground font-mono">
                          {rack.code}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Expedientes</span>
                      <span className="font-semibold">{rack.total_expedientes}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Niveles</span>
                      <span className="font-semibold">{rack.locations.length}</span>
                    </div>
                  </div>

                  {/* Mini vista de niveles */}
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex flex-wrap gap-1">
                      {rack.locations.map((loc) => (
                        <Badge
                          key={loc.id}
                          variant={loc.expediente_count > 0 ? 'success' : 'secondary'}
                          className="text-xs"
                        >
                          N{String(loc.level).padStart(2, '0')}: {loc.expediente_count}
                        </Badge>
                      ))}
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