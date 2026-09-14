import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface ImportSummaryProps {
  total: number;
  valid: number;
  errors: number;
  duplicates: number;
}

export function ImportSummary({
  total,
  valid,
  errors,
  duplicates,
}: ImportSummaryProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-gray-100">
              <span className="text-lg font-bold text-gray-700">{total}</span>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total</p>
              <p className="text-sm font-medium">Filas</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <div>
              <p className="text-xs text-muted-foreground">Válidas</p>
              <p className="text-sm font-medium text-green-600">{valid}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            <div>
              <p className="text-xs text-muted-foreground">Duplicadas</p>
              <p className="text-sm font-medium text-amber-600">{duplicates}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <XCircle className="h-5 w-5 text-red-600" />
            <div>
              <p className="text-xs text-muted-foreground">Con errores</p>
              <p className="text-sm font-medium text-red-600">{errors}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}