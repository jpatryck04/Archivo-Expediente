import { Link } from 'react-router-dom';
import { ArrowLeftRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/shared/EmptyState';
import { MovementBadge } from '@/components/shared/MovementBadge';
import { useRecentMovements } from '@/features/movements/hooks/useMovements';
import { formatDateTime } from '@/lib/utils';
import type { Movement } from '@/types/database';

export function RecentMovementsList() {
  const { data, isLoading } = useRecentMovements(10);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Últimos Movimientos</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : !data || data.length === 0 ? (
          <EmptyState
            icon={ArrowLeftRight}
            title="Sin movimientos recientes"
            description="Los movimientos aparecerán aquí"
          />
        ) : (
          <div className="space-y-3">
            {(data as Movement[]).map((movement) => (
              <div
                key={movement.id}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <MovementBadge type={movement.type} />
                    <Link
                      to={`/expedientes/${movement.expediente_id}`}
                      className="font-mono text-sm text-primary-600 hover:underline truncate"
                    >
                      {movement.expediente?.code}
                    </Link>
                  </div>
                  {movement.expediente?.name && (
                    <p className="text-sm text-muted-foreground truncate">
                      {movement.expediente.name}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDateTime(movement.created_at)} ·{' '}
                    {movement.user?.full_name || movement.user?.email}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}