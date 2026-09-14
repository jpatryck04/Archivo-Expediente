import { MovementBadge } from '@/components/shared/MovementBadge';
import { Card, CardContent } from '@/components/ui/card';
import { EmptyState } from '@/components/shared/EmptyState';
import { formatDateTime } from '@/lib/utils';
import type { Movement } from '@/types/database';
import { ArrowLeftRight } from 'lucide-react';

interface MovementTimelineProps {
  movements: Movement[];
  showExpediente?: boolean;
}

export function MovementTimeline({
  movements,
  showExpediente = false,
}: MovementTimelineProps) {
  if (movements.length === 0) {
    return (
      <EmptyState
        icon={ArrowLeftRight}
        title="Sin movimientos"
        description="No hay movimientos registrados."
      />
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="relative">
          <div className="absolute left-[7px] top-2 bottom-2 w-px bg-gray-200" />
          <div className="space-y-6">
            {movements.map((movement) => (
              <div key={movement.id} className="relative pl-8">
                <div className="absolute left-0 top-1 w-4 h-4 rounded-full bg-white border-2 border-primary-500" />
                <div className="flex items-center gap-2 mb-1">
                  <MovementBadge type={movement.type} />
                  <span className="text-xs text-muted-foreground">
                    {formatDateTime(movement.created_at)}
                  </span>
                </div>
                {showExpediente && movement.expediente && (
                  <p className="text-sm font-mono font-medium">
                    {movement.expediente.code}
                    {movement.expediente.name && (
                      <span className="font-sans text-muted-foreground ml-1">
                        — {movement.expediente.name}
                      </span>
                    )}
                  </p>
                )}
                {movement.from_location && (
                  <p className="text-sm text-muted-foreground">
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
                <p className="text-xs text-muted-foreground mt-1">
                  por {movement.user?.full_name || movement.user?.email || 'Sistema'}
                </p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}