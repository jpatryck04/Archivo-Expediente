import { supabase } from '@/lib/supabase';
import type { Database, Expediente, ExpedienteStatus } from '@/types/database';

export interface ExpedienteFilters {
  search?: string;
  status?: ExpedienteStatus;
  locationId?: string;
  page?: number;
  pageSize?: number;
}

export interface ExpedienteListResult {
  data: Expediente[];
  count: number;
}

export async function getExpedientes(
  filters: ExpedienteFilters = {}
): Promise<ExpedienteListResult> {
  const { search, status, locationId, page = 1, pageSize = 20 } = filters;
  
  let query = supabase
    .from('expedientes')
    .select(`
      *,
      location:locations(
        *,
        rack:racks(*)
      )
    `, { count: 'exact' });

  if (search) {
    query = query.or(`code.ilike.%${search}%,name.ilike.%${search}%`);
  }

  if (status) {
    query = query.eq('status', status);
  }

  if (locationId) {
    query = query.eq('location_id', locationId);
  }

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await query
    .order('code', { ascending: true })
    .range(from, to);

  if (error) throw error;

  return {
    data: (data as Expediente[]) || [],
    count: count || 0,
  };
}

export async function getExpedienteById(id: string): Promise<Expediente | null> {
  const { data, error } = await supabase
    .from('expedientes')
    .select(`
      *,
      location:locations(
        *,
        rack:racks(*)
      )
    `)
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }

  return data as Expediente;
}

export async function getExpedienteByCode(code: string): Promise<Expediente | null> {
  const { data, error } = await supabase
    .from('expedientes')
    .select(`
      *,
      location:locations(
        *,
        rack:racks(*)
      )
    `)
    .eq('code', code)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }

  return data as Expediente;
}

export async function searchExpedientes(query: string, limit = 50) {
  const { data, error } = await supabase.rpc('buscar_expedientes', {
    p_query: query,
    p_limit: limit,
  });

  if (error) throw error;
  return data;
}

export async function updateExpediente(
  id: string,
  updates: Database['public']['Tables']['expedientes']['Update']
): Promise<Expediente> {
  const { data, error } = await supabase
    .from('expedientes')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Expediente;
}

export async function deleteExpediente(id: string): Promise<void> {
  const { error } = await supabase
    .from('expedientes')
    .delete()
    .eq('id', id);

  if (error) throw error;
}