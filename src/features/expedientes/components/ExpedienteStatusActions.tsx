import { Link } from 'react-router-dom';
import { ArrowDownToLine, ArrowUpFromLine, MoveRight, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Expediente } from '@/types/database';
import { useAuth } from '@/features/auth/hooks/useAuth';

interface ExpedienteStatusActionsProps {
  expediente: Expediente;
}

export function ExpedienteStatusActions({ expediente }: ExpedienteStatusActionsProps) {
  const { role } = useAuth();
  const canCreateMovement = role === 'admin' || role === 'archivista';

  if (!canCreateMovement) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {expediente.status === 'available' && (
        <>
          <Link to={`/movements/salida?expediente=${expediente.id}`}>
            <Button variant="outline" size="sm">
              <ArrowUpFromLine className="h-4 w-4 mr-2" />
              Registrar salida
            </Button>
          </Link>
          <Link to={`/movements/traslado?expediente=${expediente.id}`}>
            <Button variant="outline" size="sm">
              <MoveRight className="h-4 w-4 mr-2" />
              Trasladar
            </Button>
          </Link>
        </>
      )}

      {expediente.status === 'borrowed' && (
        <Link to={`/movements/devolucion?expediente=${expediente.id}`}>
          <Button variant="outline" size="sm">
            <RotateCcw className="h-4 w-4 mr-2" />
            Registrar devolución
          </Button>
        </Link>
      )}

      {expediente.status === 'inactive' && (
        <Link to={`/movements/entrada?expediente=${expediente.id}`}>
          <Button variant="outline" size="sm">
            <ArrowDownToLine className="h-4 w-4 mr-2" />
            Reactivar
          </Button>
        </Link>
      )}
    </div>
  );
}