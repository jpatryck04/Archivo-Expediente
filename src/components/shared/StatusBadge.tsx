import { Badge } from '@/components/ui/badge';
import { EXPEDIENTE_STATUS } from '@/lib/constants';
import type { ExpedienteStatus } from '@/types/database';

interface StatusBadgeProps {
  status: ExpedienteStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = EXPEDIENTE_STATUS[status];
  const variant =
    status === 'available'
      ? 'success'
      : status === 'borrowed'
      ? 'error'
      : 'secondary';

  return <Badge variant={variant}>{config.label}</Badge>;
}