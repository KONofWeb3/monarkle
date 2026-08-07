import { useState } from 'react';
import { Download, FileText, Plus, Sparkles } from '../components/icons';
import { esgMetrics, cityBreakdown } from '../data/mockData';

const existingReports = [
  { id: 'r1', name: 'Q2 2026 Sustainability Report', period: 'Apr – Jun 2026', generated: 'Jul 2, 2026', size: '2.4 MB' },
  { id: 'r2', name: 'Q1 2026 Sustainability Report', period: 'Jan – Mar 2026', generated: 'Apr 3, 2026', size: '2.1 MB' },
  { id: 'r3', name: 'FY2025 Annual ESG Report', period: 'Jan – Dec 2025', generated: 'Jan 15, 2026', size: '5.8 MB' },
];

export default function ESGReportsPage() {
  const [generating, setGenerating] = useState(false);

  const onGenerate = () => {
    setGenerating(true);
    setTimeout(() => setGenerating(false), 1500);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-[--color-ink]">ESG Reports</h1>
          <p className="mt-1 text-sm text-[--color-muted]">Verified environmental impact metrics for compliance and corporate reporting.</p>
        </div>
        <button
          onClick={onGenerate}
          disabled={generating}
          className="inline-flex items-center gap-2 rounded-lg bg-[--color-primary] px-4 py-2.5 text-sm font-medium text-white disabled:opacity-60"
        >
          {generating ? <Sparkles size={16} className="animate-pulse" /> : <Plus size={16} />}
          {generating ? 'Generating…' : 'Generate new report'}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {esgMetrics.map((m) => (
          <div key={m.label} className="rounded-2xl border border-[--color-border] bg-[--color-surface] p-5">
            <p className="text-sm text-[--color-muted]">{m.label}</p>
            <p className="mt-2 font-display text-2xl font-bold text-[--color-ink]">{m.value}</p>
            <p className="mt-1 text-xs font-medium text-[--color-primary]">{m.change} vs last period</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-[--color-border] bg-[--color-surface] p-6">
        <h2 className="mb-4 text-sm font-semibold text-[--color-ink]">Environmental impact by region</h2>
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[--color-border] text-xs uppercase tracking-wide text-[--color-muted]">
              <th className="pb-3 font-medium">City</th>
              <th className="pb-3 font-medium">Waste diverted</th>
              <th className="pb-3 font-medium">CO₂ avoided</th>
              <th className="pb-3 font-medium">Active users</th>
            </tr>
          </thead>
          <tbody>
            {cityBreakdown.map((c) => (
              <tr key={c.city} className="border-b border-[--color-border] last:border-0">
                <td className="py-3 font-medium text-[--color-ink]">{c.city}</td>
                <td className="py-3 text-[--color-body]">{(c.wasteKg / 1000).toFixed(1)} t</td>
                <td className="py-3 text-[--color-body]">{(c.co2Kg / 1000).toFixed(1)} t</td>
                <td className="py-3 text-[--color-body]">{c.users.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="rounded-2xl border border-[--color-border] bg-[--color-surface] p-6">
        <h2 className="mb-4 text-sm font-semibold text-[--color-ink]">Generated reports</h2>
        <div className="space-y-2">
          {existingReports.map((r) => (
            <div key={r.id} className="flex items-center justify-between rounded-xl border border-[--color-border] px-4 py-3.5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[--color-primary-light]">
                  <FileText size={18} className="text-[--color-primary]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[--color-ink]">{r.name}</p>
                  <p className="text-xs text-[--color-muted]">{r.period} · Generated {r.generated} · {r.size}</p>
                </div>
              </div>
              <button className="inline-flex items-center gap-1.5 rounded-lg border border-[--color-border] px-3 py-1.5 text-xs font-medium text-[--color-body] hover:bg-[--color-bg]">
                <Download size={13} /> Download
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
