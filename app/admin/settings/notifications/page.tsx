'use client';

import { useState } from 'react';
import PageHeader from '@/app/_components/ui/PageHeader';

const events = [
  { id: 'notif-ci', label: 'New Compliance Issue', description: 'When a new compliance issue is logged', inApp: true, email: true },
  { id: 'notif-csr-appr', label: 'CSR Activity Approved', description: 'Your submitted CSR activity is approved or rejected', inApp: true, email: false },
  { id: 'notif-ch-appr', label: 'Challenge Approved', description: 'Your submitted challenge is approved or rejected', inApp: true, email: false },
  { id: 'notif-pol-ack', label: 'Policy Acknowledgement Reminder', description: 'Pending policies require your acknowledgement', inApp: true, email: true },
  { id: 'notif-badge', label: 'Badge Unlocked', description: 'You earned a new achievement badge', inApp: true, email: false },
  { id: 'notif-reward', label: 'Reward Redeemed', description: 'Your reward redemption is confirmed', inApp: true, email: true },
  { id: 'notif-audit', label: 'Audit Scheduled', description: 'A new audit is assigned to your department', inApp: true, email: true },
];

function Toggle({ id, checked, onChange }: { id: string; checked: boolean; onChange: () => void }) {
  return (
    <button
      id={id}
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={`relative w-10 h-5.5 rounded-full transition-colors flex-shrink-0 ${checked ? 'bg-env' : 'bg-border'}`}
      style={{ height: '22px', minWidth: '40px' }}
    >
      <span
        className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${checked ? 'translate-x-5.5' : 'translate-x-0.5'}`}
        style={{ transform: checked ? 'translateX(19px)' : 'translateX(2px)' }}
      />
    </button>
  );
}

export default function NotificationsPage() {
  const [prefs, setPrefs] = useState(
    Object.fromEntries(events.map(e => [e.id, { inApp: e.inApp, email: e.email }]))
  );

  const toggle = (id: string, type: 'inApp' | 'email') => {
    setPrefs(p => ({ ...p, [id]: { ...p[id], [type]: !p[id][type] } }));
  };

  return (
    <div>
      <PageHeader
        eyebrow="Settings · Notifications"
        title="Notification Preferences"
        subtitle="Control which events trigger in-app alerts and email notifications"
        accentColor="neutral"
      />

      <div className="bg-surface rounded-2xl border border-border card-shadow overflow-hidden">
        <div className="flex items-center gap-4 px-6 py-3 border-b border-border bg-bg/60">
          <span className="flex-1 text-xs font-mono uppercase tracking-widest text-text-muted">Event</span>
          <span className="text-xs font-mono uppercase tracking-widest text-text-muted w-20 text-center">In-App</span>
          <span className="text-xs font-mono uppercase tracking-widest text-text-muted w-20 text-center">Email</span>
        </div>
        {events.map(event => (
          <div key={event.id} className="flex items-center gap-4 px-6 py-4 border-b border-border last:border-0 hover:bg-bg/30 transition-colors">
            <div className="flex-1">
              <p className="text-sm font-semibold text-text-primary">{event.label}</p>
              <p className="text-xs text-text-muted">{event.description}</p>
            </div>
            <div className="w-20 flex justify-center">
              <Toggle id={`${event.id}-inapp`} checked={prefs[event.id].inApp} onChange={() => toggle(event.id, 'inApp')} />
            </div>
            <div className="w-20 flex justify-center">
              <Toggle id={`${event.id}-email`} checked={prefs[event.id].email} onChange={() => toggle(event.id, 'email')} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
