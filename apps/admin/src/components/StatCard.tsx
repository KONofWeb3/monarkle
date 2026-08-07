import { TrendingUp, TrendingDown } from './icons';
import type { ComponentType, SVGProps } from 'react';

type LucideIcon = ComponentType<SVGProps<SVGSVGElement> & { size?: number }>;

export default function StatCard({
  label,
  value,
  change,
  trend,
  icon: Icon,
}: {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: LucideIcon;
}) {
  return (
    <div className="rounded-2xl border border-[--color-border] bg-[--color-surface] p-5">
      <div className="flex items-start justify-between">
        <p className="text-sm text-[--color-muted]">{label}</p>
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[--color-primary-light]">
          <Icon size={16} className="text-[--color-primary]" />
        </div>
      </div>
      <p className="mt-2 font-display text-2xl font-bold text-[--color-ink]">{value}</p>
      <div className={`mt-1 flex items-center gap-1 text-xs font-medium ${trend === 'up' ? 'text-[--color-primary]' : 'text-[--color-danger]'}`}>
        {trend === 'up' ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
        {change}
      </div>
    </div>
  );
}
