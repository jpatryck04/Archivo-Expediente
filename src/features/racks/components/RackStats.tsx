import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { RackWithLocations } from '../services/racks.service';
import { DEFAULT_CAPACITY } from '@/lib/constants';

interface RackStatsProps {
  rack: RackWithLocations;
}

export function RackStats({ rack }: RackStatsProps) {
  const totalCapacity = rack.locations.reduce(
    (sum, loc) => sum + (loc.capacity || DEFAULT_CAPACITY),
    0
  );
  const occupancy =
    totalCapacity > 0
      ? Math.round((rack.total_expedientes / totalCapacity) * 100)
      : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <Card>
        <CardContent className="p-6">
          <p className="text-sm text-muted-foreground">Expedientes</p>
          <p className="text-3xl font-bold">{rack.total_expedientes}</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <p className="text-sm text-muted-foreground">Capacidad total</p>
          <p className="text-3xl font-bold">{totalCapacity}</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <p className="text-sm text-muted-foreground">Ocupación</p>
          <div className="flex items-center gap-3">
            <p className="text-3xl font-bold">{occupancy}%</p>
            <Badge
              variant={
                occupancy === 0
                  ? 'secondary'
                  : occupancy < 50
                  ? 'warning'
                  : 'success'
              }
            >
              {occupancy === 0
                ? 'Vacío'
                : occupancy < 50
                ? 'Bajo'
                : 'Ocupado'}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}