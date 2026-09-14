import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { ExpedienteStatus } from '@/types/database';

export interface ExpedienteFilterValues {
  search: string;
  status: ExpedienteStatus | '';
}

interface ExpedienteFiltersProps {
  values: ExpedienteFilterValues;
  onChange: (values: ExpedienteFilterValues) => void;
  onClear: () => void;
}

export function ExpedienteFilters({
  values,
  onChange,
  onClear,
}: ExpedienteFiltersProps) {
  const hasFilters = values.search !== '' || values.status !== '';

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por código o nombre..."
          value={values.search}
          onChange={(e) => onChange({ ...values, search: e.target.value })}
          className="pl-10"
        />
      </div>

      <Select
        value={values.status || 'all'}
        onValueChange={(v) =>
          onChange({ ...values, status: v === 'all' ? '' : (v as ExpedienteStatus) })
        }
      >
        <SelectTrigger className="w-full sm:w-48">
          <SelectValue placeholder="Estado" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos los estados</SelectItem>
          <SelectItem value="available">Disponible</SelectItem>
          <SelectItem value="borrowed">Prestado</SelectItem>
          <SelectItem value="inactive">Inactivo</SelectItem>
        </SelectContent>
      </Select>

      {hasFilters && (
        <Button variant="outline" onClick={onClear}>
          <X className="h-4 w-4 mr-2" />
          Limpiar
        </Button>
      )}
    </div>
  );
}