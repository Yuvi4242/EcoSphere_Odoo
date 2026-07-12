import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export default async function EsgConfigPage() {
  const session = await getServerSession(authOptions);
  const isAdmin = (session?.user as any)?.role === 'ADMIN';

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Reporting Period */}
        <div className="bg-surface rounded-2xl border border-border card-shadow p-6">
          <p className="text-xs font-mono uppercase tracking-widest text-text-muted mb-4">Reporting Period</p>
          <div className="flex flex-col gap-4">
            {[
              { id: 'esg-fiscal-start', label: 'Fiscal Year Start', type: 'select', options: ['January', 'April', 'July', 'October'], value: 'January' },
              { id: 'esg-report-freq', label: 'Reporting Frequency', type: 'select', options: ['Monthly', 'Quarterly', 'Annually'], value: 'Quarterly' },
            ].map(f => (
              <div key={f.id}>
                <label className="block text-xs font-mono uppercase tracking-widest text-text-muted mb-1.5" htmlFor={f.id}>{f.label}</label>
                <select id={f.id} defaultValue={f.value} disabled={!isAdmin} className="w-full px-3 py-2 border border-border rounded-xl text-sm outline-none focus:border-border-strong bg-bg disabled:opacity-70">
                  {f.options?.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
            ))}
          </div>
        </div>

        {/* Emission Thresholds */}
        <div className="bg-surface rounded-2xl border border-border card-shadow p-6">
          <p className="text-xs font-mono uppercase tracking-widest text-text-muted mb-4">Emission Thresholds</p>
          <div className="flex flex-col gap-4">
            {[
              { id: 'esg-org-limit', label: 'Org-wide Annual Limit (tCO2e)', value: '5000' },
              { id: 'esg-dept-limit', label: 'Default Dept Limit (tCO2e)', value: '200' },
              { id: 'esg-alert-pct', label: 'Alert at % of Threshold', value: '90' },
            ].map(f => (
              <div key={f.id}>
                <label className="block text-xs font-mono uppercase tracking-widest text-text-muted mb-1.5" htmlFor={f.id}>{f.label}</label>
                <input id={f.id} type="number" defaultValue={f.value} disabled={!isAdmin} className="w-full px-3 py-2 border border-border rounded-xl text-sm outline-none focus:border-border-strong bg-bg disabled:opacity-70" />
              </div>
            ))}
          </div>
        </div>

        {/* Scoring Weights */}
        <div className="bg-surface rounded-2xl border border-border card-shadow p-6 md:col-span-2">
          <p className="text-xs font-mono uppercase tracking-widest text-text-muted mb-4">ESG Score Weights</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { id: 'w-env', label: 'Environmental', value: '33', color: 'focus:border-env' },
              { id: 'w-soc', label: 'Social', value: '33', color: 'focus:border-social' },
              { id: 'w-gov', label: 'Governance', value: '34', color: 'focus:border-gov' },
              { id: 'w-gam', label: 'Gamification', value: '0', color: 'focus:border-gamif' },
            ].map(f => (
              <div key={f.id}>
                <label className="block text-xs font-mono uppercase tracking-widest text-text-muted mb-1.5" htmlFor={f.id}>{f.label} (%)</label>
                <input id={f.id} type="number" min="0" max="100" defaultValue={f.value} disabled={!isAdmin} className={`w-full px-3 py-2 border border-border rounded-xl text-sm outline-none ${f.color} bg-bg disabled:opacity-70`} />
              </div>
            ))}
          </div>
        </div>
      </div>
      {isAdmin && (
        <div className="flex justify-end mt-6">
          <button className="px-6 py-2.5 rounded-full bg-action text-white text-sm font-semibold hover:bg-[#2a2a25] transition-colors">
            Save Changes
          </button>
        </div>
      )}
    </div>
  );
}

