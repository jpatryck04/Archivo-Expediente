import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Users,
  Shield,
  Mail,
  Edit,
  Loader2,
  Plus,
  Ban,
  UserCheck,
  Trash2,
} from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/shared/EmptyState';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/sonner';
import { formatDate } from '@/lib/utils';
import { ROLES } from '@/lib/constants';
import type { Profile, UserRole } from '@/types/database';
import { useAuth } from '@/features/auth/hooks/useAuth';

async function getProfiles(): Promise<Profile[]> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data as Profile[]) || [];
}

async function updateProfileRole(id: string, role: UserRole): Promise<Profile> {
  const { data, error } = await supabase
    .from('profiles')
    .update({ role } as never)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Profile;
}

export function UsersPage() {
  const { user: currentUser } = useAuth();
  const queryClient = useQueryClient();
  const [editingUser, setEditingUser] = useState<Profile | null>(null);
  const [newRole, setNewRole] = useState<UserRole>('consulta');
  const [actionUser, setActionUser] = useState<Profile | null>(null);
  const [userAction, setUserAction] = useState<'suspend' | 'restore' | 'delete' | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newUser, setNewUser] = useState({
    full_name: '',
    email: '',
    password: '',
    role: 'consulta' as UserRole,
  });

  const { data: users, isLoading } = useQuery({
    queryKey: ['profiles'],
    queryFn: getProfiles,
  });

  const updateRoleMutation = useMutation({
    mutationFn: ({ id, role }: { id: string; role: UserRole }) =>
      updateProfileRole(id, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
      toast.success('Rol actualizado exitosamente');
      setEditingUser(null);
    },
    onError: () => {
      toast.error('Error al actualizar el rol');
    },
  });

  const handleEdit = (user: Profile) => {
    setEditingUser(user);
    setNewRole(user.role);
  };

  const handleSave = () => {
    if (editingUser) {
      updateRoleMutation.mutate({ id: editingUser.id, role: newRole });
    }
  };

  const requestUserAction = (user: Profile, action: 'suspend' | 'restore' | 'delete') => {
    if (user.id === currentUser?.id) {
      toast.error('No puedes suspenderte ni eliminarte a ti mismo');
      return;
    }

    setActionUser(user);
    setUserAction(action);
  };

  const confirmUserAction = async () => {
    if (!actionUser || !userAction) return;

    setActionLoading(true);
    try {
      const { error } = await supabase.functions.invoke('admin-manage-user', {
        body: { user_id: actionUser.id, action: userAction },
      });

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ['profiles'] });
      toast.success(
        userAction === 'delete'
          ? 'Usuario eliminado'
          : userAction === 'suspend'
          ? 'Usuario suspendido'
          : 'Usuario reactivado'
      );
      setActionUser(null);
      setUserAction(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudo completar la acción';
      toast.error(message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCreateUser = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setCreating(true);

    try {
      const { error } = await supabase.functions.invoke('admin-create-user', {
        body: newUser,
      });

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['profiles'] });
      toast.success('Usuario creado exitosamente');
      setCreateOpen(false);
      setNewUser({ full_name: '', email: '', password: '', role: 'consulta' });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudo crear el usuario';
      toast.error(message);
    } finally {
      setCreating(false);
    }
  };

  return (
    <PageLayout
      title="Usuarios"
      description="Gestión de usuarios del sistema"
      actions={
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Agregar usuario
        </Button>
      }
    >
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuario</TableHead>
                <TableHead>Correo</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Fecha de registro</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={5}>
                      <Skeleton className="h-8 w-full" />
                    </TableCell>
                  </TableRow>
                ))
              ) : !users || users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5}>
                    <EmptyState
                      icon={Users}
                      title="No hay usuarios"
                      description="Los usuarios aparecerán aquí cuando se registren."
                    />
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                          <span className="text-sm font-medium text-primary-700">
                            {(user.full_name || user.email).charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="font-medium">
                          {user.full_name || 'Sin nombre'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="h-3 w-3" />
                        {user.email}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        <Badge
                          variant={user.role === 'archivista' ? 'warning' : 'outline'}
                          className={`gap-1 border-transparent ${
                            user.role === 'admin'
                              ? 'bg-blue-100 text-blue-800'
                              : user.role === 'consulta'
                              ? 'bg-green-100 text-green-800'
                              : ''
                          }`}
                        >
                          <Shield className="h-3 w-3" />
                          {ROLES[user.role]}
                        </Badge>
                        {user.suspended && <Badge variant="error">Suspendido</Badge>}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(user.created_at)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          title="Cambiar rol"
                          onClick={() => handleEdit(user)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        {!user.suspended ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            title="Suspender usuario"
                            onClick={() => requestUserAction(user, 'suspend')}
                          >
                            <Ban className="h-4 w-4 text-amber-600" />
                          </Button>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            title="Reactivar usuario"
                            onClick={() => requestUserAction(user, 'restore')}
                          >
                            <UserCheck className="h-4 w-4 text-green-600" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          title="Eliminar usuario"
                          onClick={() => requestUserAction(user, 'delete')}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cambiar Rol de Usuario</DialogTitle>
            <DialogDescription>
              Modifique el rol de {editingUser?.full_name || editingUser?.email}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Rol</Label>
              <Select value={newRole} onValueChange={(v) => setNewRole(v as UserRole)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrador</SelectItem>
                  <SelectItem value="archivista">Archivista</SelectItem>
                  <SelectItem value="consulta">Consulta</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditingUser(null)}
              disabled={updateRoleMutation.isPending}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              disabled={updateRoleMutation.isPending}
            >
              {updateRoleMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Guardando...
                </>
              ) : (
                'Guardar'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!actionUser}
        onOpenChange={(open) => {
          if (!open && !actionLoading) {
            setActionUser(null);
            setUserAction(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {userAction === 'delete'
                ? 'Eliminar usuario'
                : userAction === 'suspend'
                ? 'Suspender usuario'
                : 'Reactivar usuario'}
            </DialogTitle>
            <DialogDescription>
              {userAction === 'delete'
                ? `Se eliminará permanentemente ${actionUser?.email} y su acceso al sistema.`
                : userAction === 'suspend'
                ? `${actionUser?.email} no podrá iniciar sesión hasta que lo reactives.`
                : `${actionUser?.email} podrá volver a iniciar sesión.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setActionUser(null);
                setUserAction(null);
              }}
              disabled={actionLoading}
            >
              Cancelar
            </Button>
            <Button
              variant={userAction === 'delete' ? 'destructive' : 'default'}
              onClick={confirmUserAction}
              disabled={actionLoading}
            >
              {actionLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agregar usuario</DialogTitle>
            <DialogDescription>
              Crea el acceso y el perfil del usuario en Supabase.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateUser} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="new-user-name">Nombre completo</Label>
              <Input
                id="new-user-name"
                value={newUser.full_name}
                onChange={(event) =>
                  setNewUser((current) => ({ ...current, full_name: event.target.value }))
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-user-email">Correo electrónico</Label>
              <Input
                id="new-user-email"
                type="email"
                value={newUser.email}
                onChange={(event) =>
                  setNewUser((current) => ({ ...current, email: event.target.value }))
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-user-password">Contraseña temporal</Label>
              <Input
                id="new-user-password"
                type="password"
                minLength={8}
                value={newUser.password}
                onChange={(event) =>
                  setNewUser((current) => ({ ...current, password: event.target.value }))
                }
                required
              />
              <p className="text-xs text-muted-foreground">Mínimo 8 caracteres.</p>
            </div>
            <div className="space-y-2">
              <Label>Rol</Label>
              <Select
                value={newUser.role}
                onValueChange={(role) => setNewUser((current) => ({ ...current, role: role as UserRole }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrador</SelectItem>
                  <SelectItem value="archivista">Archivista</SelectItem>
                  <SelectItem value="consulta">Consulta</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setCreateOpen(false)} disabled={creating}>
                Cancelar
              </Button>
              <Button type="submit" disabled={creating}>
                {creating ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
                {creating ? 'Creando...' : 'Crear usuario'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
}