import { supabase } from '@/lib/supabase';

export interface GapDetectionResult {
  locationCode: string;
  locationId: string;
  expedientes: string[];
  gaps: string[];
  firstCode: string;
  lastCode: string;
  total: number;
}

interface LocationRow {
  id: string;
  code: string;
}

interface ExpedienteRow {
  code: string;
}

export async function detectGapsInLocation(
  locationId: string
): Promise<GapDetectionResult | null> {
  const { data: location } = (await supabase
    .from('locations')
    .select('id, code')
    .eq('id', locationId)
    .single()) as { data: LocationRow | null };

  if (!location) return null;

  const { data: expedientes } = (await supabase
    .from('expedientes')
    .select('code')
    .eq('location_id', locationId)
    .order('code')) as { data: ExpedienteRow[] | null };

  if (!expedientes || expedientes.length === 0) {
    return {
      locationCode: location.code,
      locationId: location.id,
      expedientes: [],
      gaps: [],
      firstCode: '',
      lastCode: '',
      total: 0,
    };
  }

  const parsed = expedientes
    .map((e) => {
      const match = e.code.match(/^(.*?)(\d+)$/);
      return match
        ? { code: e.code, prefix: match[1], num: parseInt(match[2], 10), width: match[2].length }
        : null;
    })
    .filter((x): x is { code: string; prefix: string; num: number; width: number } => x !== null);

  if (parsed.length < 2) {
    return {
      locationCode: location.code,
      locationId: location.id,
      expedientes: expedientes.map((e) => e.code),
      gaps: [],
      firstCode: parsed[0]?.code || '',
      lastCode: parsed[0]?.code || '',
      total: parsed.length,
    };
  }

  const prefix = parsed[0].prefix;
  const samePrefix = parsed.filter((item) => item.prefix === prefix);

  if (samePrefix.length < 2) {
    return {
      locationCode: location.code,
      locationId: location.id,
      expedientes: expedientes.map((e) => e.code),
      gaps: [],
      firstCode: parsed[0]?.code || '',
      lastCode: parsed[parsed.length - 1]?.code || '',
      total: expedientes.length,
    };
  }

  samePrefix.sort((a, b) => a.num - b.num);

  const first = samePrefix[0];
  const last = samePrefix[samePrefix.length - 1];
  const existingNums = new Set(samePrefix.map((p) => p.num));

  const gaps: string[] = [];
  for (let i = first.num; i <= last.num; i++) {
    if (!existingNums.has(i)) {
      gaps.push(`${prefix}${String(i).padStart(first.width, '0')}`);
    }
  }

  return {
    locationCode: location.code,
    locationId: location.id,
    expedientes: expedientes.map((e) => e.code),
    gaps,
    firstCode: first.code,
    lastCode: last.code,
    total: expedientes.length,
  };
}

export async function auditAllLocations(): Promise<GapDetectionResult[]> {
  const { data: locations } = (await supabase
    .from('locations')
    .select('id')
    .order('code')) as { data: LocationRow[] | null };

  if (!locations) return [];

  const results: GapDetectionResult[] = [];

  for (const loc of locations) {
    const result = await detectGapsInLocation(loc.id);
    if (result && result.expedientes.length > 0) {
      results.push(result);
    }
  }

  return results;
}