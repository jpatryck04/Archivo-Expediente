import { useMemo } from 'react';

interface UseQrValuesOptions {
  appUrl: string;
  path?: string;
}

export function useQrValues({ appUrl, path = '/scan' }: UseQrValuesOptions) {
  return useMemo(
    () => ({
      buildUrl: (locationCode: string) =>
        `${appUrl.replace(/\/$/, '')}${path}/${locationCode}`,
    }),
    [appUrl, path]
  );
}