import type { UserRole } from '@/types/database';

export type Permission =
  | 'expedientes:read'
  | 'expedientes:create'
  | 'expedientes:update'
  | 'expedientes:delete'
  | 'movements:read'
  | 'movements:create'
  | 'racks:read'
  | 'racks:manage'
  | 'locations:read'
  | 'locations:manage'
  | 'users:manage'
  | 'settings:manage'
  | 'import:execute'
  | 'export:execute'
  | 'audit:read';

const rolePermissions: Record<UserRole, Permission[]> = {
  admin: [
    'expedientes:read',
    'expedientes:create',
    'expedientes:update',
    'expedientes:delete',
    'movements:read',
    'movements:create',
    'racks:read',
    'racks:manage',
    'locations:read',
    'locations:manage',
    'users:manage',
    'settings:manage',
    'import:execute',
    'export:execute',
    'audit:read',
  ],
  archivista: [
    'expedientes:read',
    'expedientes:create',
    'expedientes:update',
    'movements:read',
    'movements:create',
    'racks:read',
    'locations:read',
    'import:execute',
    'export:execute',
    'audit:read',
  ],
  consulta: [
    'expedientes:read',
    'racks:read',
    'locations:read',
  ],
};

export function hasPermission(role: UserRole, permission: Permission): boolean {
  return rolePermissions[role]?.includes(permission) ?? false;
}

export function canAccess(role: UserRole, permissions: Permission[]): boolean {
  return permissions.some((p) => hasPermission(role, p));
}