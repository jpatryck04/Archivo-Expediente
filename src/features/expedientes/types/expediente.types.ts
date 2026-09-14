import type { Expediente, ExpedienteStatus } from '@/types/database';

interface ExpedienteLocationRef {
  id: string;
  code: string;
  level: number;
  rack?: {
    id: string;
    code: string;
    name: string;
  };
}

export interface ExpedienteListItem extends Omit<Expediente, 'location'> {
  location?: ExpedienteLocationRef;
}

export interface ExpedienteSearchResult {
  id: string;
  code: string;
  name: string | null;
  status: ExpedienteStatus;
  location_code: string | null;
  rack_name: string | null;
  level: number | null;
  rank: number;
}

export interface ExpedienteStats {
  total: number;
  disponibles: number;
  prestados: number;
  inactivos: number;
}