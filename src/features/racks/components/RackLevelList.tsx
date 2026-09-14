import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Location } from '@/types/database';
import { DEFAULT_CAPACITY } from '@/lib/constants';

interface RackLevelListProps {
  locations: Location[];
}

export function RackLevelList({ locations }: RackLevelListProps) {
  return (
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
                    Ver
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}