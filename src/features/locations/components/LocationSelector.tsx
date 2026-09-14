import { useState } from 'react';
import { MapPin } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useRacks } from '@/features/racks/hooks/useRacks';
import { useLocationsByRack } from '@/features/locations/hooks/useLocations';

interface LocationSelectorProps {
  value: string;
  onChange: (locationId: string) => void;
  error?: string;
}

export function LocationSelector({ value, onChange, error }: LocationSelectorProps) {
  const [selectedRackId, setSelectedRackId] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);

  const { data: racks } = useRacks();
  const { data: locations } = useLocationsByRack(selectedRackId);

  const handleLevelChange = (level: string) => {
    const levelNum = parseInt(level, 10);
    setSelectedLevel(levelNum);

    const location = locations?.find((loc) => loc.level === levelNum);
    if (location) {
      onChange(location.id);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Rack */}
        <div className="space-y-2">
          <Label>Rack</Label>
          <Select
            value={selectedRackId}
            onValueChange={(val) => {
              setSelectedRackId(val);
              setSelectedLevel(null);
              onChange('');
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar rack" />
            </SelectTrigger>
            <SelectContent>
              {racks?.map((rack) => (
                <SelectItem key={rack.id} value={rack.id}>
                  {rack.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Nivel */}
        <div className="space-y-2">
          <Label>Nivel</Label>
          <Select
            value={selectedLevel?.toString() || ''}
            onValueChange={handleLevelChange}
            disabled={!selectedRackId}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar nivel" />
            </SelectTrigger>
            <SelectContent>
              {(locations || [])
                .map((location) => location.level)
                .sort((a, b) => a - b)
                .map((level) => (
                  <SelectItem key={level} value={level.toString()}>
                    Nivel {String(level).padStart(2, '0')}
                  </SelectItem>
                )
              )}
            </SelectContent>
          </Select>
        </div>
      </div>

      {value && (
        <div className="flex items-center gap-2 p-3 bg-green-50 rounded-md text-sm text-green-800">
          <MapPin className="h-4 w-4" />
          Ubicación seleccionada
        </div>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}