import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save, Loader2, Search, ArrowRight, MapPin } from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LocationSelector } from '@/features/locations/components/LocationSelector';
import { useSearchExpedientes } from '@/features/expedientes/hooks/useExpedientes';
import { useRegistrarTraslado } from '@/features/movements/hooks/useMovements';
import { trasladoSchema, type TrasladoFormData } from '@/features/movements/schemas/movement.schema';
import { toast } from '@/components/ui/sonner';
import type { Expediente } from '@/types/database';
import { getExpedienteById } from '@/features/expedientes/services/expedientes.service';

export function TrasladoPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselected = searchParams.get('expediente') || '';

  const [search, setSearch] = useState('');
  const [selectedExpediente, setSelectedExpediente] = useState<Expediente | null>(null);

  const { data: searchResults, isLoading: searching } = useSearchExpedientes(search);
  const registrarTraslado = useRegistrarTraslado();

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<TrasladoFormData>({
    resolver: zodResolver(trasladoSchema),
    defaultValues: {
      expediente_id: preselected,
      new_location_id: '',
      notes: '',
    },
  });

  const newLocationId = useWatch({ control, name: 'new_location_id' });

  const onSubmit = async (data: TrasladoFormData) => {
    if (!selectedExpediente) {
      toast.error('Debe seleccionar un expediente');
      return;
    }

    if (selectedExpediente.location_id === data.new_location_id) {
      toast.error('La nueva ubicación es la misma que la actual');
      return;
    }

    try {
      await registrarTraslado.mutateAsync({
        expedienteId: selectedExpediente.id,
        newLocationId: data.new_location_id,
        notes: data.notes,
      });

      toast.success('Traslado registrado exitosamente');
      navigate('/expedientes');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al registrar';
      toast.error(message);
    }
  };

  const onInvalid = () => {
    toast.error('Seleccione un expediente y una nueva ubicación');
  };

  return (
    <PageLayout
      title="Registrar Traslado"
      description="Registre el traslado de un expediente a otra ubicación"
    >
      <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="max-w-3xl space-y-6">
        {/* Selección de expediente */}
        {!selectedExpediente && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Buscar Expediente</CardTitle>
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
                            ) : !searchResults || searchResults.length === 0 ? (
                            <p className="text-sm text-muted-foreground">
                                No se encontraron resultados
                            </p>
                            ) : (
                            searchResults.map((result) => (
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
                            {result.location_code && (
                              <p className="text-xs text-muted-foreground mt-1">
                                <MapPin className="h-3 w-3 inline mr-1" />
                                {result.location_code}
                              </p>
                            )}
                          </div>
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
          <>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Expediente a Trasladar</CardTitle>
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
                    {selectedExpediente.location && (
                      <p className="text-sm text-muted-foreground mt-1">
                        <MapPin className="h-3 w-3 inline mr-1" />
                        {selectedExpediente.location.rack?.name} · Nivel{' '}
                        {String(selectedExpediente.location.level).padStart(2, '0')}
                      </p>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedExpediente(null)}
                  >
                    Cambiar
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Nueva ubicación */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <ArrowRight className="h-4 w-4" />
                  Nueva Ubicación
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <LocationSelector
                  value={newLocationId}
                  onChange={(id) =>
                    setValue('new_location_id', id, {
                      shouldDirty: true,
                      shouldValidate: true,
                    })
                  }
                  error={errors.new_location_id?.message}
                />

                <div className="space-y-2">
                  <Label htmlFor="notes">Observaciones</Label>
                  <Textarea
                    id="notes"
                    placeholder="Motivo del traslado..."
                    rows={3}
                    {...register('notes')}
                  />
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Acciones */}
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(-1)}
            disabled={registrarTraslado.isPending}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={
              registrarTraslado.isPending ||
              !selectedExpediente ||
              !newLocationId
            }
          >
            {registrarTraslado.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Registrar Traslado
              </>
            )}
          </Button>
        </div>
      </form>
    </PageLayout>
  );
}