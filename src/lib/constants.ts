export const APP_NAME = 'Sistema de Gestión de Expedientes';
export const APP_DESCRIPTION = 'Dirección de Habilitación y Servicios de Salud';

export const ROLES = {
  admin: 'Administrador',
  archivista: 'Archivista',
  consulta: 'Consulta',
} as const;

export const EXPEDIENTE_STATUS = {
  available: { label: 'Disponible', color: 'bg-green-100 text-green-800' },
  borrowed: { label: 'Prestado', color: 'bg-red-100 text-red-800' },
  inactive: { label: 'Inactivo', color: 'bg-gray-100 text-gray-800' },
} as const;

export const MOVEMENT_TYPES = {
  ENTRY: { label: 'Entrada', icon: 'ArrowDownToLine', color: 'text-green-600' },
  EXIT: { label: 'Salida', icon: 'ArrowUpFromLine', color: 'text-red-600' },
  RETURN: { label: 'Devolución', icon: 'ArrowLeftRight', color: 'text-blue-600' },
  TRANSFER: { label: 'Traslado', icon: 'MoveRight', color: 'text-amber-600' },
} as const;

export const QR_PREFIX = 'ARCH';
export const DEFAULT_CAPACITY = 25;

export const PAGINATION = {
  defaultPageSize: 20,
  pageSizeOptions: [10, 20, 50, 100],
} as const;