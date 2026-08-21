import { useMemo, useState } from 'react';
import { Search } from '../components/icons';
import StatusBadge from '../components/StatusBadge';
import type { StatusKind } from '../components/StatusBadge';
import { useAppState } from '../data/AppContext';
import type { PickupStatus } from '../data/types';

const statusMap: Record<PickupStatus, StatusKind> = {
  pending: 'pending', assigned: 'assigned', inProgress: 'inProgress', completed: 'completed', cancelled: 'cancelled',
};

const filters: { key: 'all' | PickupStatus; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'assigned', label: 'Assigned' },
  { key: 'inProgress', label: 'In progress' },
  { key: 'completed', label: 'Completed' },
  { key: 'cancelled', label: 'Cancelled' },
];

export default function PickupsPage() {
  const { pickups } = useAppState();
  const [filter, setFilter] = useState<'all' | PickupStatus>('all');
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    return pickups.filter((p) => {
      const matchesFilter = filter === 'all' || p.status === filter;
      const matchesQuery =
        query.trim() === '' ||
        p.code.toLowerCase().includes(query.toLowerCase()) ||
        p.household.toLowerCase().includes(query.toLowerCase());
      return matchesFilter && matchesQuery;
    });
  }, [pickups, filter, query]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-(--color-ink)">Pickups</h1>
        <p className="mt-1 text-sm text-(--color-muted)">All pickup, sell, and drop-off requests across the platform.</p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                filter === f.key ? 'bg-(--color-primary) text-white' : 'bg-(--color-surface) text-(--color-body) border border-(--color-border)'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-(--color-muted)" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by code or household..."
            className="w-64 rounded-lg border border-(--color-border) bg-(--color-surface) py-2 pl-9 pr-3 text-sm outline-none focus:border-(--color-primary)"
          />
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-(--color-border) bg-(--color-surface)">
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead>
            <tr className="border-b border-(--color-border) text-xs uppercase tracking-wide text-(--color-muted)">
              <th className="px-5 py-3 font-medium">Code</th>
              <th className="px-5 py-3 font-medium">Household</th>
              <th className="px-5 py-3 font-medium">Intent</th>
              <th className="px-5 py-3 font-medium">Category</th>
              <th className="px-5 py-3 font-medium">Weight</th>
              <th className="px-5 py-3 font-medium">PSP</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium text-right">Value</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} className="border-b border-(--color-border) last:border-0 hover:bg-(--color-bg)">
                <td className="px-5 py-3.5 font-medium text-(--color-ink)">{p.code}</td>
                <td className="px-5 py-3.5 text-(--color-body)">{p.household}</td>
                <td className="px-5 py-3.5 text-(--color-body)">{p.intent}</td>
                <td className="px-5 py-3.5 text-(--color-body)">{p.category}</td>
                <td className="px-5 py-3.5 text-(--color-body)">{p.weightKg}kg</td>
                <td className="px-5 py-3.5 text-(--color-body)">{p.psp ?? '—'}</td>
                <td className="px-5 py-3.5"><StatusBadge status={statusMap[p.status]} /></td>
                <td className="px-5 py-3.5 text-right font-medium text-(--color-ink)">₦{p.value.toLocaleString()}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="px-5 py-10 text-center text-(--color-muted)">No pickups match your filters.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
