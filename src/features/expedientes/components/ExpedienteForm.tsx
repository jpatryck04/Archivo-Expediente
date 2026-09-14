import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LocationSelector } from '@/features/locations/components/LocationSelector';
import {
  expedienteSchema,
  type ExpedienteFormData,
} from '../schemas/expediente.schema';
import type { Expediente } from '@/types/database';

interface ExpedienteFormProps {
  initialData?: Expediente;
  onSubmit: (data: ExpedienteFormData) => Promise<void>;
  onCancel?: () => void;
  isSubmitting?: boolean;
  mode?: 'create' | 'edit';
}

export function ExpedienteForm({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
  mode = 'create',
}: ExpedienteFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<ExpedienteFormData>({
    resolver: zodResolver(expedienteSchema),
    defaultValues: {
      code: initialData?.code || '',
      name: initialData?.name || '',
      description: initialData?.description || '',
      notes: initialData?.notes || '',
      location_id: initialData?.location_id || null,
    },
  });

  const locationId = useWatch({ control, name: 'location_id' });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Datos del Expediente</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="code">
              Código <span className="text-red-500">*</span>
            </Label>
            <Input
              id="code"
              placeholder="Ej: EXP-001"
              className="font-mono uppercase"
              disabled={mode === 'edit'}
              {...register('code')}
            />
            {errors.code && (
              <p className="text-sm text-red-600">{errors.code.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">
              Nombre{' '}
              <span className="text-muted-foreground text-xs">(opcional)</span>
            </Label>
            <Input
              id="name"
              placeholder="Ej: Hospital San Juan"
              {...register('name')}
            />
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">
              Descripción{' '}
              <span className="text-muted-foreground text-xs">(opcional)</span>
            </Label>
            <Textarea
              id="description"
              rows={3}
              placeholder="Descripción del expediente..."
              {...register('description')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">
              Observaciones{' '}
              <span className="text-muted-foreground text-xs">(opcional)</span>
            </Label>
            <Textarea
              id="notes"
              rows={2}
              placeholder="Observaciones adicionales..."
              {...register('notes')}
            />
          </div>

          <div className="space-y-2">
            <Label>Ubicación</Label>
            <LocationSelector
              value={locationId || ''}
              onChange={(id) => setValue('location_id', id || null)}
              error={errors.location_id?.message}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Guardando...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              {mode === 'edit' ? 'Actualizar' : 'Guardar'}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}