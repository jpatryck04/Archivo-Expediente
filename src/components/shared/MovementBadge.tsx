import {
  ArrowDownToLine,
  ArrowUpFromLine,
  ArrowLeftRight,
  MoveRight,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { MOVEMENT_TYPES } from '@/lib/constants';
import type { MovementType } from '@/types/database';

interface MovementBadgeProps {
  type: MovementType;
}

const icons = {
  ENTRY: ArrowDownToLine,
  EXIT: ArrowUpFromLine,
  RETURN: ArrowLeftRight,
  TRANSFER: MoveRight,
};

const variants: Record<MovementType, 'success' | 'error' | 'default' | 'warning'> = {
  ENTRY: 'success',
  EXIT: 'error',
  RETURN: 'default',
  TRANSFER: 'warning',
};

export function MovementBadge({ type }: MovementBadgeProps) {
  const Icon = icons[type];
  const config = MOVEMENT_TYPES[type];

  return (
    <Badge variant={variants[type]} className="gap-1">
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
}