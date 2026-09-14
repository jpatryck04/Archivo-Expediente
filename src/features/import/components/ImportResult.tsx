import { CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface ImportResultProps {
  total: number;
  success: number;
  errors: number;
}

export function ImportResult({ total, success, errors }: ImportResultProps) {
  return (
    <Card className="border-green-200 bg-green-50">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <CheckCircle className="h-6 w-6 text-green-600" />
          <h3 className="font-semibold text-green-900">Importación completada</h3>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-green-700">Total</p>
            <p className="text-2xl font-bold text-green-900">{total}</p>
          </div>
          <div>
            <p className="text-sm text-green-700">Importados</p>
            <p className="text-2xl font-bold text-green-900">{success}</p>
          </div>
          <div>
            <p className="text-sm text-green-700">Errores</p>
            <p className="text-2xl font-bold text-green-900">{errors}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}