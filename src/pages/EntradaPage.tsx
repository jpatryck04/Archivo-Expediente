import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save, Loader2 } from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LocationSelector } from '@/features/locations/components/LocationSelector';
import { useRegistrarEntrada } from '@/features/movements/hooks/useMovements';
import { entradaSchema, type EntradaFormData } from '@/features/movements/schemas/movement.schema';
import { toast } from '@/components/ui/sonner';

export function EntradaPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedLocation = searchParams.get('location') || '';

  const registrarEntrada = useRegistrarEntrada();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EntradaFormData>({
    resolver: zodResolver(entradaSchema),
    defaultValues: {
      code: '',
      name: '',
      description: '',
      notes: '',
      location_id: preselectedLocation,
    },
  });

  const locationId = watch('location_id');

  const onSubmit = async (data: EntradaFormData) => {
    try {
      await registrarEntrada.mutateAsync({
        code: data.code,
        name: data.name,
        description: data.description,
        notes: data.notes,
        locationId: data.location_id,
      });

      toast.success('Expediente registrado exitosamente');
      navigate('/expedientes');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al registrar';
      if (message.includes('duplicate')) {
        toast.error('Ya existe un expediente con ese código');
      } else {
        toast.error(message);
      }
    }
  };

  return (
    <PageLayout
      title="Registrar Entrada"
      description="Registre un nuevo expediente en el archivo"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Datos del Expediente</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Código */}
            <div className="space-y-2">
              <Label htmlFor="code">
                Código <span className="text-red-500">*</span>
              </Label>
              <Input
                id="code"
                placeholder="Ej: EXP-001"
                className="font-mono uppercase"
                {...register('code')}
              />
              {errors.code && (
                <p className="text-sm text-red-600">{errors.code.message}</p>
              )}
            </div>

            {/* Nombre (opcional) */}
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

            {/* Descripción */}
            <div className="space-y-2">
              <Label htmlFor="description">
                Descripción{' '}
                <span className="text-muted-foreground text-xs">(opcional)</span>
              </Label>
              <Textarea
                id="description"
                placeholder="Descripción del expediente..."
                rows={3}
                {...register('description')}
              />
            </div>

            {/* Observaciones */}
            <div className="space-y-2">
              <Label htmlFor="notes">
                Observaciones{' '}
                <span className="text-muted-foreground text-xs">(opcional)</span>
              </Label>
              <Textarea
                id="notes"
                placeholder="Observaciones adicionales..."
                rows={2}
                {...register('notes')}
              />
            </div>

            {/* Ubicación */}
            <div className="space-y-2">
              <Label>
                Ubicación <span className="text-red-500">*</span>
              </Label>
              <LocationSelector
                value={locationId}
                onChange={(id) => setValue('location_id', id)}
                error={errors.location_id?.message}
              />
            </div>
          </CardContent>
        </Card>

        {/* Acciones */}
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto"
            disabled={registrarEntrada.isPending}
          >
            Cancelar
          </Button>
          <Button type="submit" className="w-full sm:w-auto" disabled={registrarEntrada.isPending}>
            {registrarEntrada.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Registrar Entrada
              </>
            )}
          </Button>
        </div>
      </form>
    </PageLayout>
  );
}