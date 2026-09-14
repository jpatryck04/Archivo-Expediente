import {
  FolderOpen,
  CheckCircle,
  Clock,
  Archive,
  MapPin,
  TrendingUp,
  XCircle,
  Package,
} from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { RackDistributionChart } from '@/components/dashboard/RackDistributionChart';
import { RecentMovementsList } from '@/components/dashboard/RecentMovementsList';
import { TopOccupiedLocations } from '@/components/dashboard/TopOccupiedLocations';
import { useDashboardStats } from '@/features/dashboard/hooks/useDashboard';
import { useAuth } from '@/features/auth/hooks/useAuth';

export function DashboardPage() {
  const { role } = useAuth();
  const canReadMovements = role === 'admin' || role === 'archivista';
  const { data: stats, isLoading } = useDashboardStats();

  return (
    <PageLayout
      title="Dashboard"
      description="Resumen general del sistema de archivo"
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard
          title="Total Expedientes"
          value={stats?.totalExpedientes ?? 0}
          icon={FolderOpen}
          color="text-blue-600"
          bgColor="bg-blue-50"
          isLoading={isLoading}
        />
        <StatsCard
          title="Disponibles"
          value={stats?.disponibles ?? 0}
          icon={CheckCircle}
          color="text-green-600"
          bgColor="bg-green-50"
          isLoading={isLoading}
        />
        <StatsCard
          title="Prestados"
          value={stats?.prestados ?? 0}
          icon={Clock}
          color="text-red-600"
          bgColor="bg-red-50"
          isLoading={isLoading}
        />
        {canReadMovements && (
          <StatsCard
            title="Movimientos Hoy"
            value={stats?.movimientosHoy ?? 0}
            icon={TrendingUp}
            color="text-indigo-600"
            bgColor="bg-indigo-50"
            isLoading={isLoading}
          />
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard
          title="Racks Activos"
          value={stats?.totalRacks ?? 0}
          icon={Archive}
          color="text-purple-600"
          bgColor="bg-purple-50"
          isLoading={isLoading}
        />
        <StatsCard
          title="Total Ubicaciones"
          value={stats?.totalUbicaciones ?? 0}
          icon={MapPin}
          color="text-amber-600"
          bgColor="bg-amber-50"
          isLoading={isLoading}
        />
        <StatsCard
          title="Ubicaciones Ocupadas"
          value={stats?.ubicacionesOcupadas ?? 0}
          icon={Package}
          color="text-emerald-600"
          bgColor="bg-emerald-50"
          isLoading={isLoading}
        />
        <StatsCard
          title="Inactivos"
          value={stats?.inactivos ?? 0}
          icon={XCircle}
          color="text-gray-600"
          bgColor="bg-gray-50"
          isLoading={isLoading}
        />
      </div>

      {/* Charts and lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {canReadMovements && <RecentMovementsList />}
        <RackDistributionChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopOccupiedLocations />
      </div>
    </PageLayout>
  );
}