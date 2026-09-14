import type { Location, Rack, Expediente } from '@/types/database';

interface RackRef {
  id: string;
  code: string;
  name: string;
}

export interface LocationWithRack extends Omit<Location, 'rack'> {
  rack: RackRef;
}

export interface LocationWithDetails extends LocationWithRack {
  expediente_count?: number;
  total_expedientes?: number;
  ocupacion_porcentaje?: number;
  estado?: 'VACÍA' | 'PARCIAL' | 'OCUPADA';
}

export interface LocationExpedientesResult {
  location: LocationWithRack;
  expedientes: Expediente[];
  total: number;
  capacity: number;
  occupancy: number;
}

export type LocationStatus = 'VACÍA' | 'PARCIAL' | 'OCUPADA';

export function calculateLocationStatus(
  count: number,
  capacity: number
): LocationStatus {
  if (count === 0) return 'VACÍA';
  if (count < capacity) return 'PARCIAL';
  return 'OCUPADA';
}

export type { Rack, Expediente };