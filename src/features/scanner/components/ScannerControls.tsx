import { Camera, CameraOff, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ScannerControlsProps {
  isScanning: boolean;
  isLoading?: boolean;
  onStart: () => void;
  onStop: () => void;
  onReset?: () => void;
}

export function ScannerControls({
  isScanning,
  isLoading,
  onStart,
  onStop,
  onReset,
}: ScannerControlsProps) {
  return (
    <div className="flex items-center justify-center gap-3">
      {!isScanning ? (
        <Button onClick={onStart} disabled={isLoading} size="lg">
          <Camera className="h-5 w-5 mr-2" />
          Activar cámara
        </Button>
      ) : (
        <>
          <Button variant="destructive" onClick={onStop} size="lg">
            <CameraOff className="h-5 w-5 mr-2" />
            Detener
          </Button>
          {onReset && (
            <Button variant="outline" onClick={onReset} size="lg">
              <RefreshCw className="h-5 w-5" />
            </Button>
          )}
        </>
      )}
    </div>
  );
}