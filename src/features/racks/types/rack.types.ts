import type { Rack, Location } from '@/types/database';

export interface RackWithLocations extends Rack {
  locations: (Location & { expediente_count: number })[];
  total_expedientes: number;
}

export interface RackSummary {
  id: string;
  code: string;
  name: string;
  total_expedientes: number;
  total_locations: number;
  occupancy: number;
}