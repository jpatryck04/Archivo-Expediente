import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AlertTriangle, CheckCircle, RefreshCw, Search } from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/shared/EmptyState';
import { auditAllLocations } from '@/features/audit/services/range-audit.service';


export function AuditPage() {
  const [filter, setFilter] = useState('');

  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['audit-ranges'],
    queryFn: auditAllLocations,
    staleTime: 1000 * 60 * 5,
  });

  const filteredData = data?.filter(
    (r) =>
      r.gaps.length > 0 &&
      (filter === '' ||
        r.locationCode.toLowerCase().includes(filter.toLowerCase()) ||
        r.gaps.some((g) => g.toLowerCase().includes(filter.toLowerCase())))
  );

  const totalGaps = data?.reduce((sum, r) => sum + r.gaps.length, 0) || 0;
  const locationsWithGaps = data?.filter((r) => r.gaps.length > 0).length || 0;

  return (
    <PageLayout
      title="Auditoría de Rangos"
      description="Detección de posibles expedientes faltantes en las secuencias"
      actions={
        <Button onClick={() => refetch()} disabled={isFetching}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isFetching ? 'animate-spin' : ''}`} />
          Reauditar
        </Button>
      }
    >
      {/* Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Ubicaciones auditadas</p>
            <p className="text-3xl font-bold">{data?.length || 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Ubicaciones con huecos</p>
            <p className="text-3xl font-bold text-amber-600">{locationsWithGaps}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Total huecos detectados</p>
            <p className="text-3xl font-bold text-red-600">{totalGaps}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtro */}
      <div className="relative mb-4 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Filtrar por ubicación o código faltante..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Resultados */}
      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      ) : !filteredData || filteredData.length === 0 ? (
        <EmptyState
          icon={CheckCircle}
          title="No se detectaron huecos"
          description="Todas las ubicaciones auditadas tienen secuencias completas."
        />
      ) : (
        <div className="space-y-4">
          {filteredData.map((result) => (
            <Card key={result.locationId}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-mono">
                      {result.locationCode}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      Rango: {result.firstCode} - {result.lastCode} ·{' '}
                      {result.total} expedientes
                    </p>
                  </div>
                  <Badge variant="warning" className="gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    {result.gaps.length} huecos
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm font-medium mb-2">
                  Posibles expedientes faltantes:
                </p>
                <div className="flex flex-wrap gap-2">
                  {result.gaps.map((gap) => (
                    <Badge
                      key={gap}
                      variant="error"
                      className="font-mono text-xs"
                    >
                      {gap}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </PageLayout>
  );
}