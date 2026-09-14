import { supabase } from '@/lib/supabase';
import type { Movement, MovementType } from '@/types/database';

export interface MovementFilters {
  expedienteId?: string;
  userId?: string;
  type?: MovementType;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  pageSize?: number;
}

export interface MovementListResult {
  data: Movement[];
  count: number;
}

export async function getMovements(
  filters: MovementFilters = {}
): Promise<MovementListResult> {
  const {
    expedienteId,
    userId,
    type,
    dateFrom,
    dateTo,
    page = 1,
    pageSize = 20,
  } = filters;

  let query = supabase
    .from('movements')
    .select(`
      *,
      expediente:expedientes(id, code, name),
      user:profiles(id, full_name, email),
      from_location:locations!movements_from_location_id_fkey(id, code, level, rack:racks(name)),
      to_location:locations!movements_to_location_id_fkey(id, code, level, rack:racks(name))
    `, { count: 'exact' });

  if (expedienteId) {
    query = query.eq('expediente_id', expedienteId);
  }

  if (userId) {
    query = query.eq('user_id', userId);
  }

  if (type) {
    query = query.eq('type', type);
  }

  if (dateFrom) {
    query = query.gte('created_at', dateFrom);
  }

  if (dateTo) {
    query = query.lte('created_at', dateTo);
  }

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await query
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) throw error;

  return {
    data: (data as Movement[]) || [],
    count: count || 0,
  };
}

export async function getMovementsByExpediente(expedienteId: string): Promise<Movement[]> {
  const { data, error } = await supabase
    .from('movements')
    .select(`
      *,
      user:profiles(id, full_name, email),
      from_location:locations!movements_from_location_id_fkey(id, code, level, rack:racks(name)),
      to_location:locations!movements_to_location_id_fkey(id, code, level, rack:racks(name))
    `)
    .eq('expediente_id', expedienteId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Movement[];
}

export async function getRecentMovements(limit = 10): Promise<Movement[]> {
  const { data, error } = await supabase
    .from('movements')
    .select(`
      *,
      expediente:expedientes(id, code, name),
      user:profiles(id, full_name, email),
      from_location:locations!movements_from_location_id_fkey(id, code, level, rack:racks(name)),
      to_location:locations!movements_to_location_id_fkey(id, code, level, rack:racks(name))
    `)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data as Movement[];
}

export async function getMovementsStats() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const { data, error } = await supabase
    .from('movements')
    .select('type')
    .gte('created_at', today.toISOString())
    .lt('created_at', tomorrow.toISOString());

  if (error) throw error;

  const stats = { ENTRY: 0, EXIT: 0, RETURN: 0, TRANSFER: 0, total: 0 };
  data?.forEach((movement) => {
    stats[movement.type as keyof typeof stats]++;
    stats.total++;
  });

  return stats;
}

// RPC Functions
export async function registrarEntrada(data: {
  code: string;
  name?: string;
  description?: string;
  notes?: string;
  locationId: string;
}): Promise<string> {
  const { data: result, error } = await supabase.rpc('registrar_entrada', {
    p_code: data.code,
    p_name: data.name || '',
    p_description: data.description || '',
    p_notes: data.notes || '',
    p_location_id: data.locationId,
  });

  if (error) throw error;
  return result;
}

export async function registrarSalida(data: {
  expedienteId: string;
  reason?: string;
  notes?: string;
}): Promise<string> {
  const { data: result, error } = await supabase.rpc('registrar_salida', {
    p_expediente_id: data.expedienteId,
    p_reason: data.reason || '',
    p_notes: data.notes || '',
  });

  if (error) throw error;
  return result;
}

export async function registrarDevolucion(data: {
  expedienteId: string;
  locationId: string;
  notes?: string;
}): Promise<string> {
  const { data: result, error } = await supabase.rpc('registrar_devolucion', {
    p_expediente_id: data.expedienteId,
    p_location_id: data.locationId,
    p_notes: data.notes || '',
  });

  if (error) throw error;
  return result;
}

export async function registrarTraslado(data: {
  expedienteId: string;
  newLocationId: string;
  notes?: string;
}): Promise<string> {
  const { data: result, error } = await supabase.rpc('registrar_traslado', {
    p_expediente_id: data.expedienteId,
    p_new_location_id: data.newLocationId,
    p_notes: data.notes || '',
  });

  if (error) throw error;
  return result;
}