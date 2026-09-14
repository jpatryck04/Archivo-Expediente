import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save, Loader2, Search } from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LocationSelector } from '@/features/locations/components/LocationSelector';
import { useSearchExpedientes } from '@/features/expedientes/hooks/useExpedientes';
import { useRegistrarDevolucion } from '@/features/movements/hooks/useMovements';
import { devolucionSchema, type DevolucionFormData } from '@/features/movements/schemas/movement.schema';
import { toast } from '@/components/ui/sonner';
import type { Expediente } from '@/types/database';
import { getExpedienteById } from '@/features/expedientes/services/expedientes.service';

export function DevolucionPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselected = searchParams.get('expediente') || '';

  const [search, setSearch] = useState('');
  const [selectedExpediente, setSelectedExpediente] = useState<Expediente | null>(null);

  const { data: searchResults, isLoading: searching } = useSearchExpedientes(search);
  const registrarDevolucion = useRegistrarDevolucion();

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<DevolucionFormData>({
    resolver: zodResolver(devolucionSchema),
    defaultValues: {
      expediente_id: preselected,
      location_id: '',
      notes: '',
    },
  });

  const locationId = useWatch({ control, name: 'location_id' });

  const onSubmit = async (data: DevolucionFormData) => {
    if (!selectedExpediente) {
      toast.error('Debe seleccionar un expediente');
      return;
    }

    try {
      await registrarDevolucion.mutateAsync({
        expedienteId: selectedExpediente.id,
        locationId: data.location_id,
        notes: data.notes,
      });

      toast.success('Devolución registrada exitosamente');
      navigate('/expedientes');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al registrar';
      toast.error(message);
    }
  };

  const onInvalid = () => {
    toast.error('Seleccione un expediente prestado y una ubicación');
  };

  return (
    <PageLayout
      title="Registrar Devolución"
      description="Registre la devolución de un expediente prestado"
    >
      <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="max-w-3xl space-y-6">
        {/* Selección de expediente */}
        {!selectedExpediente && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Buscar Expediente Prestado</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por código o nombre..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>

              {search.length >= 2 && (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {searching ? (
                    <p className="text-sm text-muted-foreground">Buscando...</p>
                  ) : searchResults?.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No se encontraron resultados
                    </p>
                  ) : (
                    searchResults
                      ?.filter((r) => r.status === 'borrowed')
                      .map((result) => (
                        <button
                          key={result.id}
                          type="button"
                          onClick={async () => {
                            const exp = await getExpedienteById(result.id);
                            if (exp) {
                              setSelectedExpediente(exp);
                              setValue('expediente_id', exp.id, {
                                shouldDirty: true,
                                shouldValidate: true,
                              });
                            }
                          }}
                          className="w-full text-left p-3 rounded-md border hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-mono font-medium">{result.code}</p>
                              {result.name && (
                                <p className="text-sm text-muted-foreground">
                                  {result.name}
                                </p>
                              )}
                            </div>
                            <Badge variant="error">Prestado</Badge>
                          </div>
                        </button>
                      ))
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Expediente seleccionado */}
        {selectedExpediente && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Expediente a Devolver</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-md">
                <div>
                  <p className="font-mono font-medium text-lg">
                    {selectedExpediente.code}
                  </p>
                  {selectedExpediente.name && (
                    <p className="text-muted-foreground">{selectedExpediente.name}</p>
                  )}
                  <Badge variant="error" className="mt-2">
                    Estado actual: Prestado
                  </Badge>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedExpediente(null);
                    setValue('expediente_id', '', {
                      shouldDirty: true,
                      shouldValidate: true,
                    });
                  }}
                >
                  Cambiar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Ubicación de devolución */}
        {selectedExpediente && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Ubicación de Devolución</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <LocationSelector
                value={locationId}
                onChange={(id) =>
                  setValue('location_id', id, {
                    shouldDirty: true,
                    shouldValidate: true,
                  })
                }
                error={errors.location_id?.message}
              />

              <div className="space-y-2">
                <Label htmlFor="notes">Observaciones</Label>
                <Textarea
                  id="notes"
                  placeholder="Observaciones sobre la devolución..."
                  rows={3}
                  {...register('notes')}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Acciones */}
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(-1)}
            disabled={registrarDevolucion.isPending}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={
              registrarDevolucion.isPending ||
              !selectedExpediente ||
              !locationId
            }
          >
            {registrarDevolucion.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Registrar Devolución
              </>
            )}
          </Button>
        </div>
      </form>
    </PageLayout>
  );
}