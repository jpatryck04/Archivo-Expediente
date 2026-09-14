import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save, Loader2, Search } from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useSearchExpedientes } from '@/features/expedientes/hooks/useExpedientes';
import { useRegistrarSalida } from '@/features/movements/hooks/useMovements';
import { salidaSchema, type SalidaFormData } from '@/features/movements/schemas/movement.schema';
import { toast } from '@/components/ui/sonner';
import type { Expediente } from '@/types/database';

export function SalidaPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedExpediente = searchParams.get('expediente') || '';

  const [search, setSearch] = useState('');
  const [selectedExpediente, setSelectedExpediente] = useState<Expediente | null>(null);

  const { data: searchResults, isLoading: searching } = useSearchExpedientes(search);
  const registrarSalida = useRegistrarSalida();

  const { register, handleSubmit, setValue } = useForm<SalidaFormData>({
    resolver: zodResolver(salidaSchema),
    defaultValues: {
      expediente_id: preselectedExpediente,
      reason: '',
      notes: '',
      requested_by: '',
    },
  });

  const onSubmit = async (data: SalidaFormData) => {
    if (!selectedExpediente) {
      toast.error('Debe seleccionar un expediente');
      return;
    }

    try {
      await registrarSalida.mutateAsync({
        expedienteId: selectedExpediente.id,
        reason: data.reason,
        notes: data.notes,
      });

      toast.success('Salida registrada exitosamente');
      navigate('/expedientes');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al registrar';
      toast.error(message);
    }
  };

  const onInvalid = () => {
    toast.error('Seleccione un expediente disponible');
  };

  return (
    <PageLayout
      title="Registrar Salida"
      description="Registre la salida de un expediente del archivo"
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
                  ) : searchResults?.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No se encontraron resultados
                    </p>
                  ) : (
                    searchResults?.map((result) => (
                      <button
                        key={result.id}
                        type="button"
                        onClick={async () => {
                          const { getExpedienteById } = await import(
                            '@/features/expedientes/services/expedientes.service'
                          );
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
                          {result.status === 'available' && (
                            <Badge variant="success">Disponible</Badge>
                          )}
                          {result.status === 'borrowed' && (
                            <Badge variant="error">Prestado</Badge>
                          )}
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
              <CardTitle className="text-base">Expediente Seleccionado</CardTitle>
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
                      Ubicación: {selectedExpediente.location.rack?.name} · Nivel{' '}
                      {String(selectedExpediente.location.level).padStart(2, '0')}
                    </p>
                  )}
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

              {selectedExpediente.status === 'borrowed' && (
                <p className="text-sm text-red-600 mt-3">
                  ⚠ Este expediente ya está prestado
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Datos de la salida */}
        {selectedExpediente && selectedExpediente.status === 'available' && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Datos de la Salida</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reason">Motivo</Label>
                <Input
                  id="reason"
                  placeholder="Ej: Consulta, Auditoría, etc."
                  {...register('reason')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="requested_by">Solicitado por</Label>
                <Input
                  id="requested_by"
                  placeholder="Nombre de quien solicita"
                  {...register('requested_by')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Observaciones</Label>
                <Textarea
                  id="notes"
                  placeholder="Observaciones adicionales..."
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
            disabled={registrarSalida.isPending}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={
              registrarSalida.isPending ||
              !selectedExpediente ||
              selectedExpediente.status !== 'available'
            }
          >
            {registrarSalida.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Registrar Salida
              </>
            )}
          </Button>
        </div>
      </form>
    </PageLayout>
  );
}