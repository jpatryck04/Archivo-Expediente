import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { ImportRow } from '../types/import.types';

interface ImportPreviewTableProps {
  rows: ImportRow[];
  maxHeight?: string;
}

export function ImportPreviewTable({
  rows,
  maxHeight = '24rem',
}: ImportPreviewTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">
          Vista Previa ({rows.length} filas)
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div style={{ maxHeight }} className="overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Código</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Rack</TableHead>
                <TableHead>Nivel</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row, index) => (
                <TableRow key={index}>
                  <TableCell className="text-muted-foreground">{index + 1}</TableCell>
                  <TableCell className="font-mono">{row.codigo}</TableCell>
                  <TableCell>{row.nombre || '—'}</TableCell>
                  <TableCell>{row.rack}</TableCell>
                  <TableCell>{row.nivel}</TableCell>
                  <TableCell>
                    {row._status === 'valid' && <Badge variant="success">Válido</Badge>}
                    {row._status === 'duplicate' && (
                      <Badge variant="warning">Duplicado</Badge>
                    )}
                    {row._status === 'error' && (
                      <Badge variant="error">{row._error || 'Error'}</Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}