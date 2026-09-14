import { supabase } from '@/lib/supabase';
import type { Location, Expediente } from '@/types/database';

export type LocationWithDetails = Omit<Location, 'rack'> & {
  rack: {
    id: string;
    code: string;
    name: string;
  };
  expediente_count?: number;
}

export async function getLocations(): Promise<LocationWithDetails[]> {
  const { data, error } = await supabase
    .from('locations')
    .select(`
      *,
      rack:racks(id, code, name)
    `)
    .order('code');

  if (error) throw error;
  return data as LocationWithDetails[];
}

export async function getLocationByCode(code: string): Promise<LocationWithDetails | null> {
  const { data, error } = await supabase
    .from('locations')
    .select(`
      *,
      rack:racks(id, code, name)
    `)
    .eq('code', code)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }

  return data as LocationWithDetails;
}

export async function getLocationById(id: string): Promise<LocationWithDetails | null> {
  const { data, error } = await supabase
    .from('locations')
    .select(`
      *,
      rack:racks(id, code, name)
    `)
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }

  return data as LocationWithDetails;
}

export async function getLocationExpedientes(locationId: string): Promise<Expediente[]> {
  const { data, error } = await supabase
    .from('expedientes')
    .select('*')
    .eq('location_id', locationId)
    .order('code');

  if (error) throw error;
  return data as Expediente[];
}

export async function getLocationsByRack(rackId: string): Promise<Location[]> {
  const { data, error } = await supabase
    .from('locations')
    .select('*')
    .eq('rack_id', rackId)
    .order('level');

  if (error) throw error;
  return data as Location[];
};