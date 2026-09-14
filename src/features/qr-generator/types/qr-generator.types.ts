import type { LocationWithRack } from '@/features/locations/types';

export type QrGenerationMode = 'all' | 'rack' | 'location' | 'custom';

export interface QrLabelData {
  locationCode: string;
  rackName: string;
  level: number;
  qrValue: string;
}

export interface QrGenerationOptions {
  mode: QrGenerationMode;
  rackCode?: string;
  level?: number;
  size?: number;
  columns?: number;
  showRackName?: boolean;
  showLevel?: boolean;
  showCode?: boolean;
}

export interface QrLabelConfig {
  size: number;
  columns: number;
  showRackName: boolean;
  showLevel: boolean;
  showCode: boolean;
  showArchivo: boolean;
}

export interface QrGeneratorState {
  mode: QrGenerationMode;
  selectedRack: string;
  selectedLevel: number;
  labels: QrLabelData[];
  config: QrLabelConfig;
}

export type { LocationWithRack };