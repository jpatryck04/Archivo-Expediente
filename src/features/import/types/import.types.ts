export type ImportRowStatus = 'valid' | 'error' | 'duplicate';

export interface ImportRow {
  codigo: string;
  nombre?: string;
  descripcion?: string;
  observaciones?: string;
  rack: string;
  nivel: number | string;
  _status?: ImportRowStatus;
  _error?: string;
  _location_id?: string;
}

export interface ImportResult {
  total: number;
  success: number;
  errors: number;
}

export interface ImportValidationStats {
  total: number;
  valid: number;
  errors: number;
  duplicates: number;
}