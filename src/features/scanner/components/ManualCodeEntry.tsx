import { useState } from 'react';
import { Keyboard } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface ManualCodeEntryProps {
  onSubmit: (code: string) => void;
}

export function ManualCodeEntry({ onSubmit }: ManualCodeEntryProps) {
  const [code, setCode] = useState('');
  const [open, setOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) return;

    // Si el usuario ingresa solo "R01-1" o similar, normalizar
    const match = trimmed.match(/^(?:ARCH-)?R(\d{1,2})-?N?(\d{1,2})$/);
    const normalized = match
      ? `ARCH-R${String(match[1]).padStart(2, '0')}-N${String(match[2]).padStart(2, '0')}`
      : trimmed;

    onSubmit(normalized);
    setCode('');
  };

  if (!open) {
    return (
      <Button
        variant="outline"
        onClick={() => setOpen(true)}
        className="w-full"
      >
        <Keyboard className="h-4 w-4 mr-2" />
        Ingresar código manualmente
      </Button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="space-y-2">
        <Label htmlFor="manual-code">Código de ubicación</Label>
        <Input
          id="manual-code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="ARCH-R01-N01"
          className="font-mono uppercase"
          autoFocus
        />
      </div>
      <div className="flex gap-2">
        <Button type="submit" className="flex-1">
          Buscar
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setOpen(false);
            setCode('');
          }}
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
}