import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Save, Loader2, User, Building } from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/sonner';
import { useRacks } from '@/features/racks/hooks/useRacks';
import { useLocations } from '@/features/locations/hooks/useLocations';

interface ProfileFormData {
  full_name: string;
  email: string;
}

export function SettingsPage() {
  const { profile, refreshProfile } = useAuth();
  const [saving, setSaving] = useState(false);
  const profileNameLocked = profile?.created_by_admin === true;
  const { data: racks } = useRacks();
  const { data: locations } = useLocations();

  const { register, handleSubmit, reset } = useForm<ProfileFormData>({
    defaultValues: {
      full_name: profile?.full_name || '',
      email: profile?.email || '',
    },
  });

  useEffect(() => {
    if (profile) {
      reset({
        full_name: profile.full_name || '',
        email: profile.email || '',
      });
    }
  }, [profile, reset]);

  const onSubmit = async (data: ProfileFormData) => {
    if (!profile) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ full_name: data.full_name } as never)
        .eq('id', profile.id);

      if (error) throw error;

      await refreshProfile();
      toast.success('Perfil actualizado exitosamente');
    } catch {
      toast.error('Error al actualizar el perfil');
    } finally {
      setSaving(false);
    }
  };

  return (
    <PageLayout title="Configuración" description="Ajustes del sistema y perfil">
      <Tabs defaultValue="profile" className="max-w-3xl">
        <TabsList>
          <TabsTrigger value="profile" className="gap-2">
            <User className="h-4 w-4" />
            Mi Perfil
          </TabsTrigger>
          <TabsTrigger value="system" className="gap-2">
            <Building className="h-4 w-4" />
            Sistema
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Información del Perfil</CardTitle>
              <CardDescription>Actualice su información personal</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Nombre completo</Label>
                  <Input
                    id="full_name"
                    {...register('full_name')}
                    placeholder="Su nombre completo"
                    disabled={profileNameLocked}
                    className={profileNameLocked ? 'bg-gray-50' : undefined}
                  />
                  {profileNameLocked && (
                    <p className="text-xs text-muted-foreground">
                      El nombre fue definido por un administrador y no puede modificarse aquí.
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Correo electrónico</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register('email')}
                    disabled
                    className="bg-gray-50"
                  />
                  <p className="text-xs text-muted-foreground">
                    El correo no puede modificarse desde aquí
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Rol actual</Label>
                  <Input
                    value={profile?.role || ''}
                    disabled
                    className="bg-gray-50 capitalize"
                  />
                </div>

                <div className="flex justify-end">
                  <Button type="submit" disabled={saving}>
                    {saving ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Guardando...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Guardar cambios
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Información del Sistema</CardTitle>
              <CardDescription>Datos generales de la instalación</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Nombre</p>
                  <p className="font-medium">Sistema de Gestión de Expedientes</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Institución</p>
                  <p className="font-medium">
                    Dirección de Habilitación y Servicios de Salud
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Versión</p>
                  <p className="font-medium">1.0.0</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Racks configurados</p>
                  <p className="font-medium">{racks?.length ?? 'Cargando...'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Ubicaciones</p>
                  <p className="font-medium">{locations?.length ?? 'Cargando...'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Capacidad por ubicación
                  </p>
                  <p className="font-medium">
                    {locations?.reduce((total, location) => total + (location.capacity || 0), 0) ||
                      'Según configuración de cada ubicación'}{' '}
                    {locations && locations.length > 0 ? 'expedientes en total' : ''}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
}