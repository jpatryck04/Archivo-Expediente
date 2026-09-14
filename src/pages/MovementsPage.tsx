import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Filter, ChevronLeft, ChevronRight, ArrowLeftRight } from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/shared/EmptyState';
import { MovementBadge } from '@/components/shared/MovementBadge';
import { useMovements } from '@/features/movements/hooks/useMovements';
import { PAGINATION } from '@/lib/constants';
import { formatDateTime } from '@/lib/utils';
import type { MovementType } from '@/types/database';

export function MovementsPage() {
  const [type, setType] = useState<MovementType | undefined>();
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useMovements({
    type,
    dateFrom: dateFrom || undefined,
    dateTo: dateTo || undefined,
    page,
    pageSize: PAGINATION.defaultPageSize,
  });

  const totalPages = data ? Math.ceil(data.count / PAGINATION.defaultPageSize) : 0;

  return (
    <PageLayout
      title="Movimientos"
      description="Historial general de movimientos"
    >
      {/* Filtros */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Tipo</label>
              <select
                value={type || ''}
                onChange={(e) => {
                  setType((e.target.value as MovementType) || undefined);
                  setPage(1);
                }}
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
              >
                <option value="">Todos</option>
                <option value="ENTRY">Entrada</option>
                <option value="EXIT">Salida</option>
                <option value="RETURN">Devolución</option>
                <option value="TRANSFER">Traslado</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Desde</label>
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => {
                  setDateFrom(e.target.value);
                  setPage(1);
                }}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Hasta</label>
              <Input
                type="date"
                value={dateTo}
                onChange={(e) => {
                  setDateTo(e.target.value);
                  setPage(1);
                }}
              />
            </div>
            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => {
                  setType(undefined);
                  setDateFrom('');
                  setDateTo('');
                  setPage(1);
                }}
                className="w-full"
              >
                <Filter className="h-4 w-4 mr-2" />
                Limpiar filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabla */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Expediente</TableHead>
                <TableHead>Origen</TableHead>
                <TableHead>Destino</TableHead>
                <TableHead>Usuario</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={6}>
                      <Skeleton className="h-8 w-full" />
                    </TableCell>
                  </TableRow>
                ))
              ) : data?.data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6}>
                    <EmptyState
                      icon={ArrowLeftRight}
                      title="Sin movimientos"
                      description="No se encontraron movimientos con los filtros aplicados."
                    />
                  </TableCell>
                </TableRow>
              ) : (
                data?.data.map((movement) => (
                  <TableRow key={movement.id}>
                    <TableCell className="text-sm">
                      {formatDateTime(movement.created_at)}
                    </TableCell>
                    <TableCell>
                      <MovementBadge type={movement.type} />
                    </TableCell>
                    <TableCell>
                      <Link
                        to={`/expedientes/${movement.expediente_id}`}
                        className="font-mono text-sm text-primary-600 hover:underline"
                      >
                        {movement.expediente?.code}
                      </Link>
                      {movement.expediente?.name && (
                        <p className="text-xs text-muted-foreground">
                          {movement.expediente.name}
                        </p>
                      )}
                    </TableCell>
                    <TableCell className="text-sm">
                      {movement.from_location ? (
                        <>
                          {movement.from_location.rack?.name}
                          <br />
                          <span className="text-xs text-muted-foreground">
                            Nivel {String(movement.from_location.level).padStart(2, '0')}
                          </span>
                        </>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm">
                      {movement.to_location ? (
                        <>
                          {movement.to_location.rack?.name}
                          <br />
                          <span className="text-xs text-muted-foreground">
                            Nivel {String(movement.to_location.level).padStart(2, '0')}
                          </span>
                        </>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm">
                      {movement.user?.full_name || movement.user?.email}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-muted-foreground">
            Mostrando {((page - 1) * PAGINATION.defaultPageSize) + 1} -{' '}
            {Math.min(page * PAGINATION.defaultPageSize, data?.count || 0)} de{' '}
            {data?.count || 0} movimientos
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm">
              Página {page} de {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </PageLayout>
  );
}