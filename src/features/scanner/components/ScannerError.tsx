import { AlertCircle } from 'lucide-react';

interface ScannerErrorProps {
  message: string;
}

export function ScannerError({ message }: ScannerErrorProps) {
  return (
    <div className="flex items-center gap-2 p-3 bg-red-50 rounded-md">
      <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
      <span className="text-sm text-red-800">{message}</span>
    </div>
  );
}