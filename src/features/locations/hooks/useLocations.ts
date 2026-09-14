import { useQuery } from '@tanstack/react-query';
import {
  getLocations,
  getLocationByCode,
  getLocationById,
  getLocationExpedientes,
  getLocationsByRack,
} from '../services/locations.service';

export const locationsKeys = {
  all: ['locations'] as const,
  lists: () => [...locationsKeys.all, 'list'] as const,
  byCode: (code: string) => [...locationsKeys.all, 'code', code] as const,
  detail: (id: string) => [...locationsKeys.all, 'detail', id] as const,
  expedientes: (locationId: string) => [...locationsKeys.all, 'expedientes', locationId] as const,
  byRack: (rackId: string) => [...locationsKeys.all, 'rack', rackId] as const,
};

export function useLocations() {
  return useQuery({
    queryKey: locationsKeys.lists(),
    queryFn: getLocations,
    staleTime: 1000 * 60 * 5,
  });
}

export function useLocationByCode(code: string) {
  return useQuery({
    queryKey: locationsKeys.byCode(code),
    queryFn: () => getLocationByCode(code),
    enabled: !!code,
  });
}

export function useLocationById(id: string) {
  return useQuery({
    queryKey: locationsKeys.detail(id),
    queryFn: () => getLocationById(id),
    enabled: !!id,
  });
}

export function useLocationExpedientes(locationId: string) {
  return useQuery({
    queryKey: locationsKeys.expedientes(locationId),
    queryFn: () => getLocationExpedientes(locationId),
    enabled: !!locationId,
  });
}

export function useLocationsByRack(rackId: string) {
  return useQuery({
    queryKey: locationsKeys.byRack(rackId),
    queryFn: () => getLocationsByRack(rackId),
    enabled: !!rackId,
  });
}