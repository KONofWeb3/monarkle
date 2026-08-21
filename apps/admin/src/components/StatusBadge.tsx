import clsx from 'clsx';

export type StatusKind = 'pending' | 'assigned' | 'inProgress' | 'completed' | 'cancelled' | 'active' | 'suspended';

const styles: Record<StatusKind, string> = {
  pending: 'bg-(--color-warning-bg) text-(--color-warning)',
  assigned: 'bg-(--color-info-bg) text-(--color-info)',
  inProgress: 'bg-(--color-info-bg) text-(--color-info)',
  completed: 'bg-(--color-primary-light) text-(--color-primary)',
  cancelled: 'bg-(--color-danger-bg) text-(--color-danger)',
  active: 'bg-(--color-primary-light) text-(--color-primary)',
  suspended: 'bg-(--color-danger-bg) text-(--color-danger)',
};

const labels: Record<StatusKind, string> = {
  pending: 'Pending',
  assigned: 'Assigned',
  inProgress: 'In progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
  active: 'Active',
  suspended: 'Suspended',
};

export default function StatusBadge({ status, label }: { status: StatusKind; label?: string }) {
  return (
    <span className={clsx('inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium', styles[status])}>
      {label ?? labels[status]}
    </span>
  );
}
