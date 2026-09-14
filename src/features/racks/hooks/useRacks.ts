import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getRacks,
  getRackById,
  getRackByCode,
  getRacksWithLocations,
  getRackWithLocations,
  updateRack,
  createRack,
  deleteRack,
} from '../services/racks.service';

export const racksKeys = {
  all: ['racks'] as const,
  lists: () => [...racksKeys.all, 'list'] as const,
  list: () => [...racksKeys.lists()] as const,
  withLocations: () => [...racksKeys.all, 'with-locations'] as const,
  details: () => [...racksKeys.all, 'detail'] as const,
  detail: (id: string) => [...racksKeys.details(), id] as const,
  byCode: (code: string) => [...racksKeys.all, 'code', code] as const,
};

export function useRacks() {
  return useQuery({
    queryKey: racksKeys.list(),
    queryFn: getRacks,
    staleTime: 1000 * 60 * 5,
  });
}

export function useRacksWithLocations() {
  return useQuery({
    queryKey: racksKeys.withLocations(),
    queryFn: getRacksWithLocations,
    staleTime: 1000 * 60 * 2,
  });
}

export function useRack(id: string) {
  return useQuery({
    queryKey: racksKeys.detail(id),
    queryFn: () => getRackById(id),
    enabled: !!id,
  });
}

export function useRackByCode(code: string) {
  return useQuery({
    queryKey: racksKeys.byCode(code),
    queryFn: () => getRackByCode(code),
    enabled: !!code,
  });
}

export function useRackWithLocations(id: string) {
  return useQuery({
    queryKey: [...racksKeys.detail(id), 'with-locations'],
    queryFn: () => getRackWithLocations(id),
    enabled: !!id,
  });
}

export function useUpdateRack() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: any }) =>
      updateRack(id, updates),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: racksKeys.lists() });
      queryClient.invalidateQueries({ queryKey: racksKeys.detail(data.id) });
      queryClient.invalidateQueries({ queryKey: racksKeys.withLocations() });
    },
  });
}

export function useCreateRack() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createRack,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: racksKeys.lists() });
      queryClient.invalidateQueries({ queryKey: racksKeys.withLocations() });
    },
  });
}

export function useDeleteRack() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteRack,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: racksKeys.lists() });
      queryClient.invalidateQueries({ queryKey: racksKeys.withLocations() });
    },
  });
}

