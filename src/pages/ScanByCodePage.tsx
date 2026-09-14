import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2, AlertCircle } from 'lucide-react';
import { useLocationByCode } from '@/features/locations/hooks/useLocations';
import { useAuth } from '@/features/auth/hooks/useAuth';

export function ScanByCodePage() {
  const { locationCode } = useParams<{ locationCode: string }>();
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  const { data: location, isLoading, error } = useLocationByCode(locationCode || '');

  useEffect(() => {
    if (loading) return;

    if (!user) {
      // Redirigir a login preservando el destino
      navigate('/login', {
        state: { from: { pathname: `/locations/${locationCode}` } },
        replace: true,
      });
      return;
    }

    if (location) {
      navigate(`/locations/${location.code}`, { replace: true });
    }
  }, [location, user, loading, navigate, locationCode]);

  if (error || (!isLoading && !location)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="p-4 rounded-full bg-red-50 w-fit mx-auto mb-4">
            <AlertCircle className="h-8 w-8 text-red-500" />
          </div>
          <h1 className="text-xl font-semibold mb-2">Ubicación no encontrada</h1>
          <p className="text-muted-foreground mb-6">
            El código QR escaneado no corresponde a una ubicación válida.
          </p>
          <p className="font-mono text-sm bg-gray-100 p-2 rounded">
            {locationCode}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600 mx-auto mb-4" />
        <p className="text-muted-foreground">Cargando ubicación...</p>
      </div>
    </div>
  );
}