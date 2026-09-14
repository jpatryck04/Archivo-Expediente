import { useState } from 'react';

export interface QrLabelConfig {
  size: number;
  columns: number;
  showRackName: boolean;
  showLevel: boolean;
  showCode: boolean;
  showArchivo: boolean;
}

const DEFAULT_CONFIG: QrLabelConfig = {
  size: 128,
  columns: 3,
  showRackName: true,
  showLevel: true,
  showCode: true,
  showArchivo: true,
};

export function useQrLabelConfig(initial?: Partial<QrLabelConfig>) {
  const [config, setConfig] = useState<QrLabelConfig>({
    ...DEFAULT_CONFIG,
    ...initial,
  });

  const update = <K extends keyof QrLabelConfig>(
    key: K,
    value: QrLabelConfig[K]
  ) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  const reset = () => setConfig({ ...DEFAULT_CONFIG });

  return { config, update, reset };
}