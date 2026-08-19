import { useMemo, useState } from 'react';
import { Search, ShieldCheck, ShieldOff } from '../components/icons';
import StatusBadge from '../components/StatusBadge';
import { useAppState } from '../data/AppContext';
import type { UserRole } from '../data/types';

const roles: { key: 'all' | UserRole; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'Household', label: 'Households' },
  { key: 'PSP', label: 'PSPs' },
  { key: 'Collector', label: 'Collectors' },
  { key: 'Recycler', label: 'Recyclers' },
  { key: 'Corporate', label: 'Corporates' },
];

export default function UsersPage() {
  const { users, setUserStatus } = useAppState();
  const [role, setRole] = useState<'all' | UserRole>('all');
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    return users.filter((u) => {
      const matchesRole = role === 'all' || u.role === role;
      const matchesQuery = query.trim() === '' || u.name.toLowerCase().includes(query.toLowerCase()) || u.email.toLowerCase().includes(query.toLowerCase());
      return matchesRole && matchesQuery;
    });
  }, [users, role, query]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-[--color-ink]">Users</h1>
        <p className="mt-1 text-sm text-[--color-muted]">Households, PSPs, collectors, recyclers, and corporate accounts.</p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {roles.map((r) => (
            <button
              key={r.key}
              onClick={() => setRole(r.key)}
              className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                role === r.key ? 'bg-[--color-primary] text-white' : 'bg-[--color-surface] text-[--color-body] border border-[--color-border]'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[--color-muted]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or email..."
            className="w-64 rounded-lg border border-[--color-border] bg-[--color-surface] py-2 pl-9 pr-3 text-sm outline-none focus:border-[--color-primary]"
          />
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-[--color-border] bg-[--color-surface]">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead>
            <tr className="border-b border-[--color-border] text-xs uppercase tracking-wide text-[--color-muted]">
              <th className="px-5 py-3 font-medium">Name</th>
              <th className="px-5 py-3 font-medium">Role</th>
              <th className="px-5 py-3 font-medium">Contact</th>
              <th className="px-5 py-3 font-medium">City</th>
              <th className="px-5 py-3 font-medium">Joined</th>
              <th className="px-5 py-3 font-medium">Pickups</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u.id} className="border-b border-[--color-border] last:border-0 hover:bg-[--color-bg]">
                <td className="px-5 py-3.5 font-medium text-[--color-ink]">{u.name}</td>
                <td className="px-5 py-3.5 text-[--color-body]">{u.role}</td>
                <td className="px-5 py-3.5 text-[--color-body]">
                  <div>{u.email}</div>
                  <div className="text-xs text-[--color-muted]">{u.phone}</div>
                </td>
                <td className="px-5 py-3.5 text-[--color-body]">{u.city}</td>
                <td className="px-5 py-3.5 text-[--color-body]">{u.joined}</td>
                <td className="px-5 py-3.5 text-[--color-body]">{u.totalPickups}</td>
                <td className="px-5 py-3.5"><StatusBadge status={u.status} /></td>
                <td className="px-5 py-3.5 text-right">
                  {u.status === 'suspended' ? (
                    <button
                      onClick={() => { setUserStatus(u.id, 'active').catch(() => {}); }}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-[--color-border] px-2.5 py-1.5 text-xs font-medium text-[--color-primary] hover:bg-[--color-primary-light]"
                    >
                      <ShieldCheck size={13} /> Reinstate
                    </button>
                  ) : (
                    <button
                      onClick={() => { setUserStatus(u.id, 'suspended').catch(() => {}); }}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-[--color-border] px-2.5 py-1.5 text-xs font-medium text-[--color-danger] hover:bg-[--color-danger-bg]"
                    >
                      <ShieldOff size={13} /> Suspend
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="px-5 py-10 text-center text-[--color-muted]">No users match your filters.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
