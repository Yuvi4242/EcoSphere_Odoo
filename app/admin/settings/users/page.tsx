import PageHeader from '@/app/_components/ui/PageHeader';
import Badge from '@/app/_components/ui/Badge';
import { users } from '@/app/_lib/mock-data';

const roles = ['Admin', 'Manager', 'Viewer'];

export default function UsersPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Settings · Users & Roles"
        title="Users & Roles"
        subtitle="Manage platform access, assign roles, and invite new team members"
        actionLabel="+ Invite User"
        accentColor="neutral"
      />

      <div className="bg-surface rounded-2xl border border-border card-shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-bg/60">
              {['User', 'Email', 'Department', 'Role', 'Actions'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-mono uppercase tracking-widest text-text-muted">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="border-b border-border last:border-0 hover:bg-bg/30 transition-colors">
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-env flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {user.initials}
                    </div>
                    <span className="font-semibold text-text-primary">{user.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3.5 text-text-muted font-mono text-xs">{user.email}</td>
                <td className="px-4 py-3.5 text-text-muted">{user.department}</td>
                <td className="px-4 py-3.5">
                  <select
                    defaultValue={user.role}
                    className="px-3 py-1.5 border border-border rounded-xl text-xs outline-none focus:border-border-strong bg-bg font-mono"
                    aria-label={`Role for ${user.name}`}
                  >
                    {roles.map(r => <option key={r}>{r}</option>)}
                  </select>
                </td>
                <td className="px-4 py-3.5">
                  <button className="px-3 py-1 rounded-lg border border-border text-xs text-text-muted hover:bg-bg hover:text-text-primary transition-colors">
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
