'use client';

import { useState, useEffect } from 'react';
import { policies } from '@/app/_lib/mock-data';
import { useToast } from '@/app/_components/ui/Toast';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { cn } from '@/app/_lib/utils';

export default function PoliciesClient() {
  const { showToast } = useToast();
  
  const [acknowledged, setAcknowledged] = useState<Record<string, string>>({
    'POL-14': '2026-05-10',
    'POL-12': '2026-06-01',
    'POL-11': '2026-06-15',
  });

  useEffect(() => {
    const saved = localStorage.getItem('employee_policies_ack');
    if (saved) {
      try {
        setAcknowledged(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleAcknowledge = (id: string, name: string) => {
    const today = new Date().toISOString().split('T')[0];
    const updated = { ...acknowledged, [id]: today };
    setAcknowledged(updated);
    localStorage.setItem('employee_policies_ack', JSON.stringify(updated));
    showToast(`Policy Acknowledged: ${name}`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-surface rounded-2xl border border-border p-5 card-shadow flex items-center gap-4">
          <span className="text-3xl">📋</span>
          <div>
            <p className="text-xs font-mono uppercase tracking-widest text-text-muted mb-0.5">Total Policies</p>
            <p className="text-2xl font-black text-text-primary">{policies.length}</p>
          </div>
        </div>
        <div className="bg-surface rounded-2xl border border-border p-5 card-shadow flex items-center gap-4">
          <span className="text-3xl">✓</span>
          <div>
            <p className="text-xs font-mono uppercase tracking-widest text-text-muted mb-0.5">Acknowledged</p>
            <p className="text-2xl font-black text-env">
              {Object.keys(acknowledged).length}
            </p>
          </div>
        </div>
        <div className="bg-surface rounded-2xl border border-border p-5 card-shadow flex items-center gap-4">
          <span className="text-3xl text-amber-500">⚠️</span>
          <div>
            <p className="text-xs font-mono uppercase tracking-widest text-text-muted mb-0.5">Awaiting Action</p>
            <p className="text-2xl font-black text-amber-600">
              {policies.length - Object.keys(acknowledged).length}
            </p>
          </div>
        </div>
      </div>

      {/* Policies List */}
      <div className="flex flex-col gap-4">
        {policies.map(policy => {
          const ackDate = acknowledged[policy.id];
          const isAcked = !!ackDate;

          return (
            <div 
              key={policy.id} 
              className={cn(
                "bg-surface rounded-2xl border p-6 card-shadow flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all",
                isAcked ? "border-border/60 opacity-90" : "border-amber-200 bg-amber-50/20"
              )}
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <span className="text-xs font-mono text-gov bg-gov-light/60 px-2 py-0.5 rounded-lg border border-gov/10">
                    {policy.id}
                  </span>
                  <span className="text-[10px] font-mono text-text-muted">
                    Version {policy.version} · Effective: {policy.effectiveDate}
                  </span>
                  <span className={cn(
                    "text-[10px] font-mono px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold",
                    policy.category === 'Environmental' ? 'bg-env-light text-env'
                    : policy.category === 'Social' ? 'bg-social-light text-social'
                    : 'bg-gov-light text-gov'
                  )}>
                    {policy.category}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-text-primary mb-1">{policy.name}</h3>
                <p className="text-sm text-text-muted max-w-2xl leading-relaxed">
                  This document governs the compliance standards for {policy.category.toLowerCase()} practices within our global organization. Employees must read the policy detail and signify acknowledgement of compliance.
                </p>
              </div>

              <div className="flex items-center md:self-center">
                {isAcked ? (
                  <div className="flex items-center gap-2 bg-env-light/50 border border-env/20 px-4 py-2 rounded-full text-env">
                    <CheckCircle2 size={16} />
                    <div className="text-left font-mono">
                      <p className="text-xs font-bold uppercase leading-none">Acknowledged</p>
                      <p className="text-[10px] opacity-75 mt-0.5">{ackDate}</p>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => handleAcknowledge(policy.id, policy.name)}
                    className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-full text-xs font-semibold tracking-wider uppercase transition-colors flex items-center gap-1.5 shadow-sm"
                  >
                    <span>Acknowledge</span>
                    <ArrowRight size={14} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
