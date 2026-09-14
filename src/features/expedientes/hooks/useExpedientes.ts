import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getExpedientes,
  getExpedienteById,
  searchExpedientes,
  updateExpediente,
  deleteExpediente,
  type ExpedienteFilters,
} from '../services/expedientes.service';

export const expedientesKeys = {
  all: ['expedientes'] as const,
  lists: () => [...expedientesKeys.all, 'list'] as const,
  list: (filters: ExpedienteFilters) => [...expedientesKeys.lists(), filters] as const,
  details: () => [...expedientesKeys.all, 'detail'] as const,
  detail: (id: string) => [...expedientesKeys.details(), id] as const,
  search: (query: string) => [...expedientesKeys.all, 'search', query] as const,
};

export function useExpedientes(filters: ExpedienteFilters = {}) {
  return useQuery({
    queryKey: expedientesKeys.list(filters),
    queryFn: () => getExpedientes(filters),
    staleTime: 1000 * 60, // 1 minuto
  });
}

export function useExpediente(id: string) {
  return useQuery({
    queryKey: expedientesKeys.detail(id),
    queryFn: () => getExpedienteById(id),
    enabled: !!id,
  });
}

export function useSearchExpedientes(query: string, limit = 50) {
  return useQuery({
    queryKey: expedientesKeys.search(query),
    queryFn: () => searchExpedientes(query, limit),
    enabled: query.length >= 2,
    staleTime: 1000 * 30, // 30 segundos
  });
}

export function useUpdateExpediente() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: any }) =>
      updateExpediente(id, updates),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: expedientesKeys.lists() });
      queryClient.invalidateQueries({ queryKey: expedientesKeys.detail(data.id) });
    },
  });
}

export function useDeleteExpediente() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteExpediente,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: expedientesKeys.lists() });
    },
  });
}