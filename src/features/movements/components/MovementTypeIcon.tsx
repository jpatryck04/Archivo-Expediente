import {
  ArrowDownToLine,
  ArrowUpFromLine,
  ArrowLeftRight,
  MoveRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { MovementType } from '@/types/database';

interface MovementTypeIconProps {
  type: MovementType;
  className?: string;
  size?: number;
}

const iconMap = {
  ENTRY: ArrowDownToLine,
  EXIT: ArrowUpFromLine,
  RETURN: ArrowLeftRight,
  TRANSFER: MoveRight,
};

const colorMap: Record<MovementType, string> = {
  ENTRY: 'text-green-600',
  EXIT: 'text-red-600',
  RETURN: 'text-blue-600',
  TRANSFER: 'text-amber-600',
};

export function MovementTypeIcon({
  type,
  className,
  size,
}: MovementTypeIconProps) {
  const Icon = iconMap[type];
  return (
    <Icon
      className={cn(colorMap[type], className)}
      style={size ? { width: size, height: size } : undefined}
    />
  );
}