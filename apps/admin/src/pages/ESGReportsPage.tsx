import { useAppState } from '../data/AppContext';

export default function ESGReportsPage() {
  const { esgMetrics, cityBreakdown } = useAppState();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-(--color-ink)">ESG Reports</h1>
        <p className="mt-1 text-sm text-(--color-muted)">Verified environmental impact metrics for compliance and corporate reporting.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {esgMetrics.map((m) => (
          <div key={m.label} className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-5">
            <p className="text-sm text-(--color-muted)">{m.label}</p>
            <p className="mt-2 font-display text-2xl font-bold text-(--color-ink)">{m.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-6">
        <h2 className="mb-4 text-sm font-semibold text-(--color-ink)">Environmental impact by region</h2>
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-(--color-border) text-xs uppercase tracking-wide text-(--color-muted)">
              <th className="pb-3 font-medium">City</th>
              <th className="pb-3 font-medium">Waste diverted</th>
              <th className="pb-3 font-medium">CO₂ avoided</th>
              <th className="pb-3 font-medium">Active users</th>
            </tr>
          </thead>
          <tbody>
            {cityBreakdown.map((c) => (
              <tr key={c.city} className="border-b border-(--color-border) last:border-0">
                <td className="py-3 font-medium text-(--color-ink)">{c.city}</td>
                <td className="py-3 text-(--color-body)">{(c.wasteKg / 1000).toFixed(1)} t</td>
                <td className="py-3 text-(--color-body)">{(c.co2Kg / 1000).toFixed(1)} t</td>
                <td className="py-3 text-(--color-body)">{c.users.toLocaleString()}</td>
              </tr>
            ))}
            {cityBreakdown.length === 0 && (
              <tr>
                <td colSpan={4} className="py-6 text-center text-(--color-muted)">No completed pickups yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="rounded-2xl border border-dashed border-(--color-border) bg-(--color-surface) p-6 text-center">
        <p className="text-sm font-medium text-(--color-ink)">PDF/CSV report export</p>
        <p className="mt-1 text-sm text-(--color-muted)">Not built yet — the metrics above are live and real, but downloadable report generation is planned for a future update.</p>
      </div>
    </div>
  );
}
