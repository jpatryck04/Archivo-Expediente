import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { MovementBadge } from '@/components/shared/MovementBadge';
import { formatDateTime } from '@/lib/utils';
import type { Movement } from '@/types/database';

interface MovementCardProps {
  movement: Movement;
}

export function MovementCard({ movement }: MovementCardProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3 mb-2">
          <MovementBadge type={movement.type} />
          <span className="text-xs text-muted-foreground">
            {formatDateTime(movement.created_at)}
          </span>
        </div>

        {movement.expediente && (
          <Link
            to={`/expedientes/${movement.expediente_id}`}
            className="font-mono text-sm font-medium text-primary-600 hover:underline"
          >
            {movement.expediente.code}
          </Link>
        )}
        {movement.expediente?.name && (
          <p className="text-sm text-muted-foreground">{movement.expediente.name}</p>
        )}

        <div className="mt-3 space-y-1 text-sm">
          {movement.from_location && (
            <p className="text-muted-foreground">
              Origen: {movement.from_location.rack?.name} · N
              {String(movement.from_location.level).padStart(2, '0')}
            </p>
          )}
          {movement.to_location && (
            <p className="text-muted-foreground">
              Destino: {movement.to_location.rack?.name} · N
              {String(movement.to_location.level).padStart(2, '0')}
            </p>
          )}
        </div>

        <p className="text-xs text-muted-foreground mt-3">
          {movement.user?.full_name || movement.user?.email}
        </p>
      </CardContent>
    </Card>
  );
}