import { Link } from 'react-router-dom';
import { MapPin, FileText } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { StatusBadge } from '@/components/shared/StatusBadge';
import type { Expediente } from '@/types/database';

interface ExpedienteCardProps {
  expediente: Expediente;
  compact?: boolean;
}

export function ExpedienteCard({ expediente, compact = false }: ExpedienteCardProps) {
  return (
    <Link to={`/expedientes/${expediente.id}`} className="block">
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardContent className={compact ? 'p-4' : 'p-6'}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-primary-50">
                  <FileText className="h-4 w-4 text-primary-600" />
                </div>
                <p className="font-mono font-semibold text-lg">{expediente.code}</p>
              </div>
              {expediente.name && (
                <p className="text-sm text-muted-foreground mb-2 truncate">
                  {expediente.name}
                </p>
              )}
              {!compact && expediente.description && (
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                  {expediente.description}
                </p>
              )}
              {expediente.location && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  {expediente.location.rack?.name} · Nivel{' '}
                  {String(expediente.location.level).padStart(2, '0')}
                </div>
              )}
            </div>
            <StatusBadge status={expediente.status} />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}