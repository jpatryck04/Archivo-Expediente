import { useEffect, useRef, useState, useCallback } from 'react';
import { Html5Qrcode, Html5QrcodeScannerState } from 'html5-qrcode';
import { extractQrToken } from '@/lib/utils';

interface UseQrScannerOptions {
  onScanSuccess: (token: string) => void;
  onScanError?: (error: string) => void;
}

interface UseQrScannerReturn {
  isScanning: boolean;
  error: string | null;
  startScanner: () => Promise<void>;
  stopScanner: () => Promise<void>;
}

export function useQrScanner({
  onScanSuccess,
  onScanError,
}: UseQrScannerOptions): UseQrScannerReturn {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const elementId = 'qr-reader';

  const startScanner = useCallback(async () => {
    try {
      setError(null);

      if (!scannerRef.current) {
        scannerRef.current = new Html5Qrcode(elementId);
      }

      const config = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
      };

      await scannerRef.current.start(
        { facingMode: 'environment' },
        config,
        (decodedText) => {
          const token = extractQrToken(decodedText);
          if (token) {
            onScanSuccess(token);
          } else {
            onScanError?.('Código QR no reconocido');
          }
        },
        (_errorMessage) => {
          // Ignorar errores de escaneo continuo
        }
      );

      setIsScanning(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al iniciar cámara';
      
      if (message.includes('NotAllowedError')) {
        setError('Permiso de cámara denegado. Habilite el acceso a la cámara.');
      } else if (message.includes('NotFoundError')) {
        setError('No se encontró ninguna cámara disponible.');
      } else {
        setError(message);
      }
      onScanError?.(message);
    }
  }, [onScanSuccess, onScanError]);

  const stopScanner = useCallback(async () => {
    if (scannerRef.current && scannerRef.current.getState() === Html5QrcodeScannerState.SCANNING) {
      await scannerRef.current.stop();
      setIsScanning(false);
    }
  }, []);

  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, [stopScanner]);

  return {
    isScanning,
    error,
    startScanner,
    stopScanner,
  };
}