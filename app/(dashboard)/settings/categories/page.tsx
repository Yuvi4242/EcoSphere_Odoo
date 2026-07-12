import PageHeader from '@/app/_components/ui/PageHeader';
import Badge from '@/app/_components/ui/Badge';
import { categories } from '@/app/_lib/mock-data';

export default function CategoriesPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Settings · Categories"
        title="Categories"
        subtitle="Manage categories used for CSR activities and gamification challenges"
        actionLabel="+ Add Category"
        accentColor="neutral"
      />

      <div className="bg-surface rounded-2xl border border-border card-shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-bg/60">
              {['ID', 'Name', 'Type', 'Status', 'Actions'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-mono uppercase tracking-widest text-text-muted">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {categories.map(cat => (
              <tr key={cat.id} className="border-b border-border last:border-0 hover:bg-bg/30 transition-colors">
                <td className="px-4 py-3.5 font-mono text-xs text-text-muted">{cat.id}</td>
                <td className="px-4 py-3.5 font-medium text-text-primary">{cat.name}</td>
                <td className="px-4 py-3.5">
                  <Badge variant={cat.type === 'Challenge' ? 'gamif' : 'social'} label={cat.type} />
                </td>
                <td className="px-4 py-3.5">
                  <Badge variant={cat.status.toLowerCase() as 'active' | 'inactive'} label={cat.status} />
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex gap-2">
                    <button className="px-3 py-1 rounded-lg border border-border text-xs text-text-muted hover:bg-bg hover:text-text-primary transition-colors">Edit</button>
                    <button className="px-3 py-1 rounded-lg border border-border text-xs text-red-400 hover:bg-red-50 transition-colors">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
