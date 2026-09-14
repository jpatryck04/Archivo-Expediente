import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, CameraOff, AlertCircle, Loader2 } from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useQrScanner } from '@/features/scanner/hooks/useQrScanner';
import { useLocationByCode } from '@/features/locations/hooks/useLocations';

export function ScannerPage() {
  const navigate = useNavigate();
  const [scannedCode, setScannedCode] = useState<string | null>(null);

  const { data: location, isLoading, error: locationError } = useLocationByCode(
    scannedCode || ''
  );

  const handleScanSuccess = (token: string) => {
    setScannedCode(token);
  };

  const handleScanError = (error: string) => {
    console.error('Scan error:', error);
  };

  const { isScanning, error, startScanner, stopScanner } = useQrScanner({
    onScanSuccess: handleScanSuccess,
    onScanError: handleScanError,
  });

  // Navegar cuando se encuentra la ubicación
  if (location && scannedCode) {
    navigate(`/locations/${location.code}`);
  }

  return (
    <PageLayout
      title="Escanear Código QR"
      description="Apunte la cámara al código QR de la ubicación"
    >
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="p-6">
            {/* Área del escáner */}
            <div className="relative">
              <div
                id="qr-reader"
                className="w-full aspect-square bg-gray-100 rounded-lg overflow-hidden"
              />

              {!isScanning && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 rounded-lg">
                  <Camera className="h-16 w-16 text-gray-400 mb-4" />
                  <p className="text-gray-600 mb-4">
                    Presione el botón para activar la cámara
                  </p>
                  <Button onClick={startScanner}>
                    <Camera className="h-4 w-4 mr-2" />
                    Activar cámara
                  </Button>
                </div>
              )}

              {isScanning && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                  <Button variant="destructive" onClick={stopScanner}>
                    <CameraOff className="h-4 w-4 mr-2" />
                    Detener
                  </Button>
                </div>
              )}
            </div>

            {/* Estado de carga */}
            {isLoading && (
              <div className="flex items-center justify-center gap-2 mt-4 p-3 bg-blue-50 rounded-md">
                <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                <span className="text-sm text-blue-800">Buscando ubicación...</span>
              </div>
            )}

            {/* Error de ubicación */}
            {locationError && scannedCode && (
              <div className="flex items-center gap-2 mt-4 p-3 bg-red-50 rounded-md">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <span className="text-sm text-red-800">
                  Ubicación no encontrada: {scannedCode}
                </span>
              </div>
            )}

            {/* Error de cámara */}
            {error && (
              <div className="flex items-center gap-2 mt-4 p-3 bg-red-50 rounded-md">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <span className="text-sm text-red-800">{error}</span>
              </div>
            )}

            {/* Código escaneado */}
            {scannedCode && !location && !isLoading && !locationError && (
              <div className="mt-4 p-3 bg-gray-50 rounded-md">
                <p className="text-sm text-gray-600">
                  Código escaneado: <span className="font-mono">{scannedCode}</span>
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Instrucciones */}
        <Card className="mt-6">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-3">Instrucciones</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
              <li>Presione "Activar cámara" y permita el acceso cuando se solicite</li>
              <li>Apunte la cámara hacia el código QR de la ubicación</li>
              <li>El sistema detectará automáticamente el código</li>
              <li>Será redirigido a la página de la ubicación</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}