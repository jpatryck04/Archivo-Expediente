import { Navigate, Outlet, useLocation, useOutletContext } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import type { UserRole } from '@/types/database';

interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
}

interface AppLayoutContext {
  onMobileMenuOpen: () => void;
}

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { user, role, loading } = useAuth();
  const location = useLocation();
  const parentContext = useOutletContext<AppLayoutContext | undefined>();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && role && !allowedRoles.includes(role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet context={parentContext} />;
}