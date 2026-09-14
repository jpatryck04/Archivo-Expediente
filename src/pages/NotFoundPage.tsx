import { Link } from 'react-router-dom';
import { Home, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="text-center max-w-md">
        <div className="p-4 rounded-full bg-gray-100 w-fit mx-auto mb-6">
          <AlertCircle className="h-12 w-12 text-gray-400" />
        </div>
        <h1 className="text-6xl font-bold text-gray-900 mb-2">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Página no encontrada
        </h2>
        <p className="text-muted-foreground mb-6">
          La página que busca no existe o fue movida.
        </p>
        <Link to="/dashboard">
          <Button>
            <Home className="h-4 w-4 mr-2" />
            Ir al Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}