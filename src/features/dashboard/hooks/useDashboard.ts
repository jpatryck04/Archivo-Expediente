import { useQuery } from '@tanstack/react-query';
import {
  getDashboardStats,
  getRackDistribution,
  getTopOccupiedLocations,
} from '../services/dashboard.service';

export const dashboardKeys = {
  all: ['dashboard'] as const,
  stats: () => [...dashboardKeys.all, 'stats'] as const,
  distribution: () => [...dashboardKeys.all, 'distribution'] as const,
  topOccupied: (limit: number) => [...dashboardKeys.all, 'top-occupied', limit] as const,
};

export function useDashboardStats() {
  return useQuery({
    queryKey: dashboardKeys.stats(),
    queryFn: getDashboardStats,
    staleTime: 1000 * 30, // 30 segundos
    refetchInterval: 1000 * 60, // Refetch cada minuto
  });
}

export function useRackDistribution() {
  return useQuery({
    queryKey: dashboardKeys.distribution(),
    queryFn: getRackDistribution,
    staleTime: 1000 * 60 * 5,
  });
}

export function useTopOccupiedLocations(limit = 10) {
  return useQuery({
    queryKey: dashboardKeys.topOccupied(limit),
    queryFn: () => getTopOccupiedLocations(limit),
    staleTime: 1000 * 60,
  });
}