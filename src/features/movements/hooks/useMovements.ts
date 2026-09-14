import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getMovements,
  getMovementsByExpediente,
  getRecentMovements,
  getMovementsStats,
  registrarEntrada,
  registrarSalida,
  registrarDevolucion,
  registrarTraslado,
  type MovementFilters,
} from '../services/movements.service';
import { expedientesKeys } from '@/features/expedientes/hooks/useExpedientes';
import { locationsKeys } from '@/features/locations/hooks/useLocations';

export const movementsKeys = {
  all: ['movements'] as const,
  lists: () => [...movementsKeys.all, 'list'] as const,
  list: (filters: MovementFilters) => [...movementsKeys.lists(), filters] as const,
  recent: (limit: number) => [...movementsKeys.all, 'recent', limit] as const,
  stats: () => [...movementsKeys.all, 'stats'] as const,
  byExpediente: (id: string) => [...movementsKeys.all, 'expediente', id] as const,
};

export function useMovements(filters: MovementFilters = {}) {
  return useQuery({
    queryKey: movementsKeys.list(filters),
    queryFn: () => getMovements(filters),
    staleTime: 1000 * 60,
  });
}

export function useMovementsByExpediente(expedienteId: string) {
  return useQuery({
    queryKey: movementsKeys.byExpediente(expedienteId),
    queryFn: () => getMovementsByExpediente(expedienteId),
    enabled: !!expedienteId,
  });
}

export function useRecentMovements(limit = 10) {
  return useQuery({
    queryKey: movementsKeys.recent(limit),
    queryFn: () => getRecentMovements(limit),
    staleTime: 1000 * 30,
  });
}

export function useMovementsStats() {
  return useQuery({
    queryKey: movementsKeys.stats(),
    queryFn: getMovementsStats,
    staleTime: 1000 * 60,
  });
}

export function useRegistrarEntrada() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: registrarEntrada,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: expedientesKeys.all });
      queryClient.invalidateQueries({ queryKey: movementsKeys.all });
      queryClient.invalidateQueries({ queryKey: locationsKeys.all });
    },
  });
}

export function useRegistrarSalida() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: registrarSalida,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: expedientesKeys.all });
      queryClient.invalidateQueries({ queryKey: movementsKeys.all });
    },
  });
}

export function useRegistrarDevolucion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: registrarDevolucion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: expedientesKeys.all });
      queryClient.invalidateQueries({ queryKey: movementsKeys.all });
      queryClient.invalidateQueries({ queryKey: locationsKeys.all });
    },
  });
}

export function useRegistrarTraslado() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: registrarTraslado,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: expedientesKeys.all });
      queryClient.invalidateQueries({ queryKey: movementsKeys.all });
      queryClient.invalidateQueries({ queryKey: locationsKeys.all });
    },
  });
}