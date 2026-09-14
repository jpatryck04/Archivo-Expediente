import { supabase } from '@/lib/supabase';
import type { Database, Rack, Location } from '@/types/database';

export interface RackWithLocations extends Rack {
  locations: (Location & { expediente_count: number })[];
  total_expedientes: number;
}

export async function getRacks(): Promise<Rack[]> {
  const { data, error } = await supabase
    .from('racks')
    .select('*')
    .eq('active', true)
    .order('code');

  if (error) throw error;
  return data as Rack[];
}

export async function getRackById(id: string): Promise<Rack | null> {
  const { data, error } = await supabase
    .from('racks')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return data as Rack;
}

export async function getRackByCode(code: string): Promise<Rack | null> {
  const { data, error } = await supabase
    .from('racks')
    .select('*')
    .eq('code', code)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return data as Rack;
}

export async function getRacksWithLocations(): Promise<RackWithLocations[]> {
  // Obtener racks con sus ubicaciones
  const { data: racks, error: racksError } = await supabase
    .from('racks')
    .select(`
      *,
      locations(*)
    `)
    .eq('active', true)
    .order('code');

  if (racksError) throw racksError;

  // Obtener conteo de expedientes por ubicación
  const { data: counts, error: countsError } = await supabase
    .from('expedientes')
    .select('location_id');

  if (countsError) throw countsError;

  // Crear mapa de conteos
  const countMap = new Map<string, number>();
  counts?.forEach((item) => {
    if (item.location_id) {
      countMap.set(item.location_id, (countMap.get(item.location_id) || 0) + 1);
    }
  });

  // Combinar datos
  const rackRows = (racks || []) as unknown as (Rack & { locations: Location[] })[];

  return rackRows.map((rack) => {
    const locations = (rack.locations || []).map((loc: Location) => ({
      ...loc,
      expediente_count: countMap.get(loc.id) || 0,
    }));

    const total_expedientes = locations.reduce(
      (sum: number, loc: Location & { expediente_count: number }) =>
        sum + loc.expediente_count,
      0
    );

    return {
      ...rack,
      locations: locations.sort((a: Location, b: Location) => b.level - a.level),
      total_expedientes,
    };
  });
}

export async function getRackWithLocations(
  rackId: string
): Promise<RackWithLocations | null> {
  const { data: rack, error: rackError } = await supabase
    .from('racks')
    .select(`
      *,
      locations(*)
    `)
    .eq('id', rackId)
    .single();

  if (rackError) {
    if (rackError.code === 'PGRST116') return null;
    throw rackError;
  }

  const rackWithLocations = rack as unknown as Rack & { locations: Location[] };

  // Obtener conteos
  const locationIds = rackWithLocations.locations.map((location) => location.id);

  const { data: counts } = await supabase
    .from('expedientes')
    .select('location_id')
    .in('location_id', locationIds);

  const countMap = new Map<string, number>();
  counts?.forEach((item) => {
    if (item.location_id) {
      countMap.set(item.location_id, (countMap.get(item.location_id) || 0) + 1);
    }
  });

  const locations = rackWithLocations.locations.map((loc) => ({
    ...loc,
    expediente_count: countMap.get(loc.id) || 0,
  }));

  const total_expedientes = locations.reduce(
    (sum: number, loc: Location & { expediente_count: number }) =>
      sum + loc.expediente_count,
    0
  );

  return {
    ...rackWithLocations,
    locations: locations.sort((a: Location, b: Location) => b.level - a.level),
    total_expedientes,
  };
}

export async function updateRack(
  id: string,
  updates: Database['public']['Tables']['racks']['Update']
): Promise<Rack> {
  const { data, error } = await supabase
    .from('racks')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Rack;
}

export async function createRack(
  rack: Omit<Rack, 'id' | 'created_at'>
): Promise<Rack> {
  const { data, error } = await supabase
    .from('racks')
    .insert(rack)
    .select()
    .single();

  if (error) throw error;
  return data as Rack;
}

export async function deleteRack(id: string): Promise<void> {
  const { error } = await supabase
    .from('racks')
    .update({ active: false })
    .eq('id', id);

  if (error) throw error;
}