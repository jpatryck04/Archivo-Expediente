import { Link } from 'react-router-dom';
import { Archive, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { RackWithLocations } from '../services/racks.service';

interface RackCardProps {
  rack: RackWithLocations;
}

export function RackCard({ rack }: RackCardProps) {
  return (
    <Link to={`/racks/${rack.code}`} className="block">
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
  );
}