import { supabase } from '@/lib/supabase';

export interface DashboardStats {
  totalExpedientes: number;
  disponibles: number;
  prestados: number;
  inactivos: number;
  totalRacks: number;
  totalUbicaciones: number;
  ubicacionesOcupadas: number;
  ubicacionesVacias: number;
  movimientosHoy: number;
}

export interface RackDistribution {
  rackName: string;
  rackCode: string;
  total: number;
}

interface LocationRef {
  location_id: string | null;
}

interface DistributionItem {
  location: {
    rack: {
      code: string;
      name: string;
    } | null;
  } | null;
}

interface LocationWithRack {
  id: string;
  code: string;
  level: number;
  rack: { name: string; code: string } | null;
}

interface CountItem {
  location_id: string | null;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [
    { count: totalExpedientes },
    { count: disponibles },
    { count: prestados },
    { count: inactivos },
    { count: totalRacks },
    { count: totalUbicaciones },
    { count: movimientosHoy },
  ] = await Promise.all([
    supabase.from('expedientes').select('*', { count: 'exact', head: true }),
    supabase
      .from('expedientes')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'available'),
    supabase
      .from('expedientes')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'borrowed'),
    supabase
      .from('expedientes')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'inactive'),
    supabase.from('racks').select('*', { count: 'exact', head: true }).eq('active', true),
    supabase.from('locations').select('*', { count: 'exact', head: true }),
    supabase
      .from('movements')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', today.toISOString()),
  ]);

  const { data: locationsWithExpedientes } = (await supabase
    .from('expedientes')
    .select('location_id')
    .not('location_id', 'is', null)) as { data: LocationRef[] | null };

  const uniqueOccupied = new Set(
    (locationsWithExpedientes ?? [])
      .map((e) => e.location_id)
      .filter((id): id is string => id !== null)
  );

  const ubicacionesOcupadas = uniqueOccupied.size;
  const ubicacionesVacias = (totalUbicaciones || 0) - ubicacionesOcupadas;

  return {
    totalExpedientes: totalExpedientes || 0,
    disponibles: disponibles || 0,
    prestados: prestados || 0,
    inactivos: inactivos || 0,
    totalRacks: totalRacks || 0,
    totalUbicaciones: totalUbicaciones || 0,
    ubicacionesOcupadas,
    ubicacionesVacias,
    movimientosHoy: movimientosHoy || 0,
  };
}

export async function getRackDistribution(): Promise<RackDistribution[]> {
  const { data, error } = await supabase
    .from('expedientes')
    .select(
      `
      location:locations(
        rack:racks(code, name)
      )
    `
    )
    .not('location_id', 'is', null);

  if (error) throw error;

  const distribution = new Map<string, RackDistribution>();

  ((data ?? []) as unknown as DistributionItem[]).forEach((item) => {
    const rack = item.location?.rack;
    if (rack) {
      const existing = distribution.get(rack.code);
      if (existing) {
        existing.total++;
      } else {
        distribution.set(rack.code, {
          rackCode: rack.code,
          rackName: rack.name,
          total: 1,
        });
      }
    }
  });

  return Array.from(distribution.values()).sort((a, b) =>
    a.rackCode.localeCompare(b.rackCode)
  );
}

export async function getTopOccupiedLocations(limit = 10) {
  const { data, error } = await supabase
    .from('locations')
    .select(
      `
      id,
      code,
      level,
      rack:racks(name, code)
    `
    );

  if (error) throw error;

  const { data: counts } = (await supabase
    .from('expedientes')
    .select('location_id')
    .not('location_id', 'is', null)) as { data: CountItem[] | null };

  const countMap = new Map<string, number>();
  (counts ?? []).forEach((item) => {
    if (item.location_id) {
      countMap.set(item.location_id, (countMap.get(item.location_id) || 0) + 1);
    }
  });

  return ((data ?? []) as unknown as LocationWithRack[])
    .map((loc) => ({
      ...loc,
      expediente_count: countMap.get(loc.id) || 0,
    }))
    .sort((a, b) => b.expediente_count - a.expediente_count)
    .slice(0, limit);
}