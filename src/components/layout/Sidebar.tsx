import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderOpen,
  Archive,
  QrCode,
  ArrowLeftRight,
  Upload,
  Download,
  Users,
  Settings,
  LogOut,
  ScanLine,
  ArrowDownToLine,
  ArrowUpFromLine,
  ArrowLeftRight as Swap,
  MoveRight,
  AlertTriangle,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { hasPermission, type Permission } from '@/lib/permissions';
import { ROLES } from '@/lib/constants';

interface NavItem {
  name: string;
  href: string;
  icon: typeof LayoutDashboard;
  permission: Permission | null;
  group?: string;
}

const navigation: NavItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, permission: null, group: 'Principal' },
  { name: 'Expedientes', href: '/expedientes', icon: FolderOpen, permission: 'expedientes:read', group: 'Principal' },
  { name: 'Racks', href: '/racks', icon: Archive, permission: 'racks:read', group: 'Principal' },
  
  { name: 'Escanear QR', href: '/scan', icon: ScanLine, permission: null, group: 'Operaciones' },
  { name: 'Registrar Entrada', href: '/movements/entrada', icon: ArrowDownToLine, permission: 'movements:create', group: 'Operaciones' },
  { name: 'Registrar Salida', href: '/movements/salida', icon: ArrowUpFromLine, permission: 'movements:create', group: 'Operaciones' },
  { name: 'Registrar Devolución', href: '/movements/devolucion', icon: Swap, permission: 'movements:create', group: 'Operaciones' },
  { name: 'Registrar Traslado', href: '/movements/traslado', icon: MoveRight, permission: 'movements:create', group: 'Operaciones' },
  { name: 'Historial Movimientos', href: '/movements', icon: ArrowLeftRight, permission: 'movements:read', group: 'Operaciones' },
  
  { name: 'Generador QR', href: '/qr-generator', icon: QrCode, permission: 'locations:manage', group: 'Herramientas' },
  { name: 'Importar', href: '/import', icon: Upload, permission: 'import:execute', group: 'Herramientas' },
  { name: 'Exportar', href: '/export', icon: Download, permission: 'export:execute', group: 'Herramientas' },
  { name: 'Auditoría', href: '/audit', icon: AlertTriangle, permission: 'audit:read', group: 'Herramientas' },
  
  { name: 'Usuarios', href: '/users', icon: Users, permission: 'users:manage', group: 'Administración' },
  { name: 'Configuración', href: '/settings', icon: Settings, permission: null, group: 'Administración' },
];

interface SidebarProps {
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export function Sidebar({ mobileOpen, onMobileClose }: SidebarProps) {
  const { profile, role, signOut } = useAuth();

  const filteredNavigation = navigation.filter(
    (item) => item.permission === null || (role && hasPermission(role, item.permission))
  );

  // Agrupar por grupo
  const grouped = filteredNavigation.reduce((acc, item) => {
    const group = item.group || 'Otros';
    if (!acc[group]) acc[group] = [];
    acc[group].push(item);
    return acc;
  }, {} as Record<string, NavItem[]>);

  const sidebarContent = (
    <>
      <div className="flex items-center gap-3 px-6 py-5 border-b border-primary-800">
        <div className="h-10 w-10 rounded-lg bg-primary-600 flex items-center justify-center">
          <Archive className="h-6 w-6" />
        </div>
        <div>
          <h1 className="font-bold text-sm">Archivo</h1>
          <p className="text-xs text-primary-300">Expedientes</p>
        </div>
        <button
          type="button"
          className="ml-auto rounded-md p-2 text-primary-200 hover:bg-primary-900 md:hidden"
          aria-label="Cerrar menú de navegación"
          onClick={onMobileClose}
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="app-scrollbar flex-1 space-y-4 overflow-y-auto px-3 py-4">
        {Object.entries(grouped).map(([group, items]) => (
          <div key={group}>
            <p className="px-3 text-xs font-semibold text-primary-400 uppercase tracking-wider mb-2">
              {group}
            </p>
            <div className="space-y-1">
              {items.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary-800 text-white'
                        : 'text-primary-200 hover:bg-primary-900 hover:text-white'
                    )
                  }
                  onClick={onMobileClose}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-primary-800 p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-9 w-9 rounded-full bg-primary-700 flex items-center justify-center">
            <span className="text-sm font-medium">
              {profile?.full_name?.charAt(0) || profile?.email?.charAt(0) || 'U'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {profile?.full_name || 'Usuario'}
            </p>
            <p className="text-xs text-primary-300 truncate">
              {role ? ROLES[role] : 'Sin rol'}
            </p>
          </div>
        </div>
        <button
          onClick={signOut}
          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-primary-200 hover:bg-primary-900 hover:text-white rounded-md transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Cerrar sesión
        </button>
      </div>
    </>
  );

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-50 hidden w-64 bg-primary-950 text-white md:flex md:flex-col">
        {sidebarContent}
      </aside>
      {mobileOpen && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            aria-label="Cerrar menú de navegación"
            onClick={onMobileClose}
          />
          <aside className="fixed inset-y-0 left-0 z-50 flex w-[min(18rem,86vw)] flex-col bg-primary-950 text-white shadow-xl md:hidden">
            {sidebarContent}
          </aside>
        </>
      )}
    </>
  );
}