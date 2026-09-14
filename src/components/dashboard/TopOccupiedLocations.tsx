import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useTopOccupiedLocations } from '@/features/dashboard/hooks/useDashboard';

export function TopOccupiedLocations() {
  const { data, isLoading } = useTopOccupiedLocations(10);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Ubicaciones Más Ocupadas</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : !data || data.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            No hay datos para mostrar
          </p>
        ) : (
          <div className="space-y-2">
            {data.map((loc, index) => (
              <Link
                key={loc.id}
                to={`/locations/${loc.code}`}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-muted-foreground w-5">
                    #{index + 1}
                  </span>
                  <div>
                    <p className="text-sm font-medium">
                      {loc.rack?.name} · Nivel{' '}
                      {String(loc.level).padStart(2, '0')}
                    </p>
                    <p className="text-xs text-muted-foreground font-mono">
                      {loc.code}
                    </p>
                  </div>
                </div>
                <Badge variant={loc.expediente_count > 20 ? 'success' : 'secondary'}>
                  {loc.expediente_count} expedientes
                </Badge>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}