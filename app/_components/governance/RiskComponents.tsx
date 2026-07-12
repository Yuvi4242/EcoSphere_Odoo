'use client';

import React from 'react';
import { User, AlertOctagon, ShieldCheck, Flame } from 'lucide-react';
import { StatusBadge, PriorityBadge } from './BadgeHelpers';
import { motion } from 'framer-motion';

interface RiskItem {
  id: string;
  title: string;
  description: string;
  riskLevel: string;
  mitigationPlan?: string | null;
  impact: string | null;
  probability: string | null;
  status: string | null;
  owner?: { name: string | null } | null;
  department?: { name: string } | null;
}

// ==========================================
// RISK CARD
// ==========================================

export function RiskCard({ risk }: { risk: RiskItem }) {
  const isCritical = risk.riskLevel === 'Critical' || risk.riskLevel === 'High';

  return (
    <motion.div
      whileHover={{ y: -3 }}
      className="bg-surface rounded-2xl border border-border card-shadow p-6 flex flex-col justify-between hover:border-border-strong transition-all"
    >
      <div>
        <div className="flex justify-between items-start mb-4">
          <span className="text-[10px] font-mono uppercase tracking-wider text-text-muted">
            Impact: {risk.impact} / Prob: {risk.probability}
          </span>
          <div className="flex items-center gap-1">
            <PriorityBadge priority={risk.riskLevel} />
            <StatusBadge status={risk.status || 'Open'} />
          </div>
        </div>

        <h4 className="text-base font-bold text-text-primary mb-2 line-clamp-1 flex items-center gap-1.5">
          {isCritical ? (
            <Flame size={16} className="text-red-500 animate-bounce" />
          ) : (
            <AlertOctagon size={16} className="text-text-muted" />
          )}
          {risk.title}
        </h4>
        <p className="text-sm text-text-muted mb-4 line-clamp-2 leading-relaxed">{risk.description}</p>

        {risk.mitigationPlan && (
          <div className="bg-bg/20 rounded-xl p-3 border border-border text-xs mb-4">
            <div className="font-semibold text-text-primary mb-1 flex items-center gap-1">
              <ShieldCheck size={14} className="text-env" /> Mitigation Plan
            </div>
            <p className="text-text-muted line-clamp-2">{risk.mitigationPlan}</p>
          </div>
        )}
      </div>

      <div className="pt-4 border-t border-border flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-text-muted">
          <User size={13} />
          <span>Owner: <strong className="text-text-primary">{risk.owner?.name || 'Unassigned'}</strong></span>
        </div>
        <span className="text-xs text-text-muted font-mono">{risk.department?.name || 'All'}</span>
      </div>
    </motion.div>
  );
}

// ==========================================
// RISK HEATMAP MATRIX (3x3)
// ==========================================

export function RiskMatrix({ risks }: { risks: RiskItem[] }) {
  const impacts = ['High', 'Medium', 'Low'];
  const probabilities = ['Low', 'Medium', 'High'];

  // Categorize risks into matrix coordinates
  const matrix: Record<string, Record<string, any[]>> = {
    High: { Low: [], Medium: [], High: [] },
    Medium: { Low: [], Medium: [], High: [] },
    Low: { Low: [], Medium: [], High: [] },
  };

  risks.forEach((r) => {
    const imp = r.impact || 'Medium';
    const prob = r.probability || 'Medium';
    if (matrix[imp] && matrix[imp][prob]) {
      matrix[imp][prob].push(r);
    }
  });

  // Cell Background Color based on Risk Heat Level
  // High-High: Critical Red, Low-Low: Light Green
  const getCellColor = (imp: string, prob: string, count: number) => {
    if (imp === 'High' && prob === 'High') {
      return count > 0 ? 'bg-red-500 text-white font-black' : 'bg-red-50 text-red-500 opacity-60';
    }
    if ((imp === 'High' && prob === 'Medium') || (imp === 'Medium' && prob === 'High')) {
      return count > 0 ? 'bg-orange-500 text-white font-black' : 'bg-orange-50 text-orange-500 opacity-60';
    }
    if ((imp === 'High' && prob === 'Low') || (imp === 'Medium' && prob === 'Medium') || (imp === 'Low' && prob === 'High')) {
      return count > 0 ? 'bg-yellow-500 text-text-primary font-black' : 'bg-yellow-50 text-yellow-600 opacity-60';
    }
    return count > 0 ? 'bg-env text-white font-black' : 'bg-env-light text-env opacity-60';
  };

  return (
    <div className="bg-surface rounded-2xl border border-border card-shadow p-6 mb-6">
      <p className="text-xs font-mono uppercase tracking-widest text-text-muted mb-4">Risk Assessment Matrix (Heatmap)</p>
      
      <div className="flex flex-col items-center">
        {/* Heatmap Grid Wrapper */}
        <div className="grid grid-cols-[30px_1fr] w-full max-w-xl gap-2">
          {/* Y Axis Label (Impact) */}
          <div className="flex flex-col justify-around text-center select-none font-mono text-[10px] text-text-muted py-8 pr-1">
            <span className="transform -rotate-90">IMPACT</span>
          </div>

          <div className="flex flex-col gap-2">
            {/* 3x3 Grid Rows */}
            {impacts.map((imp) => (
              <div key={imp} className="grid grid-cols-[70px_1fr_1fr_1fr] gap-2 items-center">
                {/* Row label */}
                <span className="font-mono text-xs font-bold text-text-muted text-right pr-2 select-none">
                  {imp}
                </span>
                {/* Probability Cells */}
                {probabilities.map((prob) => {
                  const items = matrix[imp][prob] || [];
                  const count = items.length;
                  return (
                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      key={prob}
                      title={`${imp} Impact & ${prob} Probability: ${count} Risks`}
                      className={`h-20 rounded-xl flex flex-col items-center justify-center cursor-pointer shadow-sm relative transition-all ${getCellColor(
                        imp,
                        prob,
                        count
                      )}`}
                    >
                      <span className="text-2xl font-black">{count}</span>
                      <span className="text-[9px] uppercase font-mono tracking-wide opacity-80">
                        {count === 1 ? 'Risk' : 'Risks'}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            ))}

            {/* X Axis Labels (Probability) */}
            <div className="grid grid-cols-[70px_1fr_1fr_1fr] gap-2 items-center mt-1">
              <span />
              {probabilities.map((prob) => (
                <span key={prob} className="font-mono text-xs font-bold text-text-muted text-center select-none">
                  {prob}
                </span>
              ))}
            </div>
            
            {/* Probability axis title */}
            <div className="grid grid-cols-[70px_1fr] gap-2">
              <span />
              <span className="font-mono text-[10px] text-text-muted text-center tracking-widest select-none mt-2">
                PROBABILITY
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
