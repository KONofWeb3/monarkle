import { Recycle, Leaf, Users, TrendingUp } from '../components/icons';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar,
} from 'recharts';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import type { StatusKind } from '../components/StatusBadge';
import { useAppState } from '../data/AppContext';
import type { PickupStatus } from '../data/types';

const iconMap = { recycle: Recycle, leaf: Leaf, users: Users, trending: TrendingUp } as const;

const statusMap: Record<PickupStatus, StatusKind> = {
  pending: 'pending', assigned: 'assigned', inProgress: 'inProgress', completed: 'completed', cancelled: 'cancelled',
};

const categoryColors: Record<string, string> = {
  plastic: '#005f28', paper: '#008037', metal: '#5fa96a', glass: '#93c79d', organic: '#c7e6cd', eWaste: '#0b1f19',
};

export default function OverviewPage() {
  const { pickups, kpis, monthlyTrend, cityBreakdown } = useAppState();
  const recent = pickups.slice(0, 5);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-(--color-ink)">Overview</h1>
        <p className="mt-1 text-sm text-(--color-muted)">Platform-wide activity and environmental impact.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((k) => (
          <StatCard key={k.label} label={k.label} value={k.value} icon={iconMap[k.icon]} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-6 lg:col-span-2">
          <h2 className="mb-4 text-sm font-semibold text-(--color-ink)">Waste collected by category (tonnes)</h2>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e7e9e8" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#8c9490' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#8c9490' }} axisLine={false} tickLine={false} />
              <Tooltip />
              <Area type="monotone" dataKey="plastic" stackId="1" stroke={categoryColors.plastic} fill={categoryColors.plastic} fillOpacity={0.85} />
              <Area type="monotone" dataKey="paper" stackId="1" stroke={categoryColors.paper} fill={categoryColors.paper} fillOpacity={0.85} />
              <Area type="monotone" dataKey="metal" stackId="1" stroke={categoryColors.metal} fill={categoryColors.metal} fillOpacity={0.85} />
              <Area type="monotone" dataKey="glass" stackId="1" stroke={categoryColors.glass} fill={categoryColors.glass} fillOpacity={0.85} />
              <Area type="monotone" dataKey="organic" stackId="1" stroke={categoryColors.organic} fill={categoryColors.organic} fillOpacity={0.85} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-6">
          <h2 className="mb-4 text-sm font-semibold text-(--color-ink)">Impact by city</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={cityBreakdown} layout="vertical" margin={{ left: 12 }}>
              <XAxis type="number" hide />
              <YAxis type="category" dataKey="city" tick={{ fontSize: 12, fill: '#4b5a54' }} axisLine={false} tickLine={false} width={90} />
              <Tooltip />
              <Bar dataKey="wasteKg" fill="#005f28" radius={[0, 6, 6, 0]} barSize={16} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-(--color-ink)">Recent pickups</h2>
          <a href="/pickups" className="text-sm font-medium text-(--color-primary)">View all →</a>
        </div>
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-(--color-border) text-xs uppercase tracking-wide text-(--color-muted)">
              <th className="pb-3 font-medium">Code</th>
              <th className="pb-3 font-medium">Household</th>
              <th className="pb-3 font-medium">Category</th>
              <th className="pb-3 font-medium">City</th>
              <th className="pb-3 font-medium">Status</th>
              <th className="pb-3 font-medium text-right">Value</th>
            </tr>
          </thead>
          <tbody>
            {recent.map((p) => (
              <tr key={p.id} className="border-b border-(--color-border) last:border-0">
                <td className="py-3 font-medium text-(--color-ink)">{p.code}</td>
                <td className="py-3 text-(--color-body)">{p.household}</td>
                <td className="py-3 text-(--color-body)">{p.category}</td>
                <td className="py-3 text-(--color-body)">{p.city}</td>
                <td className="py-3"><StatusBadge status={statusMap[p.status]} /></td>
                <td className="py-3 text-right font-medium text-(--color-ink)">₦{p.value.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
