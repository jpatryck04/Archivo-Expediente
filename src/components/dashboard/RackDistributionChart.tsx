import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useRackDistribution } from '@/features/dashboard/hooks/useDashboard';

export function RackDistributionChart() {
  const { data, isLoading } = useRackDistribution();

  const maxValue = Math.max(...(data?.map((d) => d.total) || [1]), 1);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Distribución por Rack</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-6 w-full" />
            ))}
          </div>
        ) : !data || data.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            No hay datos para mostrar
          </p>
        ) : (
          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {data.map((item) => (
              <div key={item.rackCode}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="font-medium">{item.rackName}</span>
                  <span className="text-muted-foreground">{item.total}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-primary-600 h-full rounded-full transition-all"
                    style={{
                      width: `${(item.total / maxValue) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}