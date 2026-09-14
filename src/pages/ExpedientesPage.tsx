import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { useExpedientes } from '@/features/expedientes/hooks/useExpedientes';
import { EXPEDIENTE_STATUS, PAGINATION } from '@/lib/constants';
import type { ExpedienteStatus } from '@/types/database';

export function ExpedientesPage() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<ExpedienteStatus | undefined>();
  const [page, setPage] = useState(1);

  const { data, isLoading } = useExpedientes({
    search: search || undefined,
    status,
    page,
    pageSize: PAGINATION.defaultPageSize,
  });

  const totalPages = data ? Math.ceil(data.count / PAGINATION.defaultPageSize) : 0;

  return (
    <PageLayout
      title="Expedientes"
      description="Gestión de expedientes del archivo"
      actions={
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por código o nombre..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="pl-10"
            />
          </div>
          <select
            value={status || ''}
            onChange={(e) => {
              setStatus((e.target.value as ExpedienteStatus) || undefined);
              setPage(1);
            }}
            className="h-10 px-3 rounded-md border border-input bg-background text-sm"
          >
            <option value="">Todos los estados</option>
            <option value="available">Disponible</option>
            <option value="borrowed">Prestado</option>
            <option value="inactive">Inactivo</option>
          </select>
          <Link to="/expedientes/nuevo">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo
            </Button>
          </Link>
        </div>
      }
    >
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Ubicación</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={5}>
                      <div className="h-8 bg-gray-100 animate-pulse rounded" />
                    </TableCell>
                  </TableRow>
                ))
              ) : data?.data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No se encontraron expedientes
                  </TableCell>
                </TableRow>
              ) : (
                data?.data.map((expediente) => (
                  <TableRow key={expediente.id}>
                    <TableCell className="font-mono font-medium">
                      {expediente.code}
                    </TableCell>
                    <TableCell>
                      {expediente.name || (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {expediente.location ? (
                        <span>
                          {expediente.location.rack?.name} · Nivel{' '}
                          {String(expediente.location.level).padStart(2, '0')}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">Sin ubicación</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          expediente.status === 'available'
                            ? 'success'
                            : expediente.status === 'borrowed'
                            ? 'error'
                            : 'secondary'
                        }
                      >
                        {EXPEDIENTE_STATUS[expediente.status].label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link to={`/expedientes/${expediente.id}`}>
                        <Button variant="ghost" size="sm">
                          Ver detalle
                        </Button>
                      </Link>
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
            {data?.count || 0} expedientes
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