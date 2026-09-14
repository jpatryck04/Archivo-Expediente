import type { Movement, MovementType,} from '@/types/database';

interface MovementExpedienteRef {
  id: string;
  code: string;
  name: string | null;
}

interface MovementLocationRef {
  id: string;
  code: string;
  level: number;
  rack?: { name: string };
}

interface MovementUserRef {
  id: string;
  full_name: string | null;
  email: string;
}

export interface MovementWithDetails extends Omit<Movement, 'expediente' | 'user' | 'from_location' | 'to_location'> {
  expediente?: MovementExpedienteRef;
  user?: MovementUserRef;
  from_location?: MovementLocationRef;
  to_location?: MovementLocationRef;
}

export interface MovementStats {
  ENTRY: number;
  EXIT: number;
  RETURN: number;
  TRANSFER: number;
  total: number;
}

export interface MovementFilterValues {
  type?: MovementType;
  dateFrom?: string;
  dateTo?: string;
  userId?: string;
  expedienteId?: string;
}