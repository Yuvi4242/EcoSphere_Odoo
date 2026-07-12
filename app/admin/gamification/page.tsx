'use client';

import { useState } from 'react';
import PageHeader from '@/app/_components/ui/PageHeader';
import Badge from '@/app/_components/ui/Badge';
import { challenges } from '@/app/_lib/mock-data';

type Status = 'todo' | 'inprogress' | 'done';

const columns: { key: Status; label: string; accent: string }[] = [
  { key: 'todo',       label: 'To Do',      accent: 'border-border' },
  { key: 'inprogress', label: 'In Progress', accent: 'border-gamif' },
  { key: 'done',       label: 'Done',        accent: 'border-env' },
];

export default function ChallengesPage() {
  const [items, setItems] = useState(challenges);
  const [dragId, setDragId] = useState<string | null>(null);

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();
  const handleDrop = (status: Status) => {
    if (!dragId) return;
    setItems(prev => prev.map(c => c.id === dragId ? { ...c, status } : c));
    setDragId(null);
  };

  return (
    <div>
      <PageHeader
        eyebrow="Gamification · Challenges"
        title="Challenge Board"
        subtitle="Drag cards between columns to update challenge status"
        accentColor="gamif"
      />

      {/* XP banner */}
      <div className="bg-gamif-light border border-gamif/20 rounded-2xl p-4 mb-6 flex items-center gap-4">
        <span className="text-3xl">⭐</span>
        <div>
          <p className="text-xs font-mono uppercase tracking-widest text-gamif mb-0.5">Your Progress</p>
          <p className="font-black text-text-primary">9,847 XP · Level 24</p>
        </div>
        <div className="ml-auto">
          <div className="h-2 w-48 bg-gamif/20 rounded-full overflow-hidden">
            <div className="h-full bg-gamif rounded-full" style={{ width: '72%' }} />
          </div>
          <p className="text-[10px] font-mono text-gamif mt-1 text-right">153 XP to Level 25</p>
        </div>
      </div>

      {/* Kanban board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map(col => {
          const colItems = items.filter(c => c.status === col.key);
          return (
            <div
              key={col.key}
              className="flex flex-col gap-3"
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(col.key)}
            >
              <div className={`flex items-center justify-between px-1 pb-3 border-b-2 ${col.accent}`}>
                <span className="text-xs font-mono uppercase tracking-widest text-text-muted">{col.label}</span>
                <span className="text-xs font-mono bg-border px-2 py-0.5 rounded-full text-text-muted">{colItems.length}</span>
              </div>
              {colItems.map(challenge => (
                <div
                  key={challenge.id}
                  draggable
                  onDragStart={() => setDragId(challenge.id)}
                  className="bg-surface rounded-xl border border-border card-shadow p-4 cursor-grab active:cursor-grabbing hover:border-gamif/30 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-gamif">{challenge.id}</span>
                    <span className="text-[10px] font-mono bg-gamif-light text-gamif px-2 py-0.5 rounded-full font-semibold">+{challenge.points} XP</span>
                  </div>
                  <p className="text-sm font-semibold text-text-primary mb-3">{challenge.title}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gamif-light text-gamif text-[10px] font-bold flex items-center justify-center">
                        {challenge.assignee.split(' ').map(w => w[0]).join('')}
                      </div>
                      <span className="text-xs text-text-muted">{challenge.assignee}</span>
                    </div>
                    <span className="text-[10px] font-mono text-text-muted">{challenge.deadline}</span>
                  </div>
                </div>
              ))}
              {colItems.length === 0 && (
                <div className="border-2 border-dashed border-border rounded-xl p-8 text-center text-xs text-text-muted font-mono">
                  Drop here
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
