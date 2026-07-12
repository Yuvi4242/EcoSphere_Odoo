'use client';

import React from 'react';
import { Users, Heart, GraduationCap, BarChart3 } from 'lucide-react';

export default function SocialModule() {
  return (
    <div className="space-y-8 animate-fade-in font-sans">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <Users className="w-6 h-6 text-blue-600" />
          Social (CSR) Module
        </h1>
        <p className="text-muted-foreground text-sm mt-0.5">
          Corporate Social Responsibility, diversity metrics, employee well-being, and professional training.
        </p>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-2xl">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] text-muted-foreground font-mono uppercase">CSR PARTICIPATION</p>
              <h3 className="text-2xl font-bold text-foreground mt-1">85% <span className="text-xs text-muted-foreground">active</span></h3>
            </div>
            <div className="p-2 bg-blue-500/10 border border-blue-500/20 text-blue-600 rounded-xl">
              <Heart className="w-4 h-4" />
            </div>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] text-muted-foreground font-mono uppercase">DIVERSITY INDEX</p>
              <h3 className="text-2xl font-bold text-foreground mt-1">42% <span className="text-xs text-muted-foreground">representation</span></h3>
            </div>
            <div className="p-2 bg-blue-500/10 border border-blue-500/20 text-blue-600 rounded-xl">
              <BarChart3 className="w-4 h-4" />
            </div>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] text-muted-foreground font-mono uppercase">SAFETY TRAINING</p>
              <h3 className="text-2xl font-bold text-foreground mt-1">98% <span className="text-xs text-muted-foreground">completed</span></h3>
            </div>
            <div className="p-2 bg-blue-500/10 border border-blue-500/20 text-blue-600 rounded-xl">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Main card */}
      <div className="glass-panel p-8 rounded-2xl text-center space-y-4 max-w-xl mx-auto py-12">
        <Users className="w-12 h-12 text-blue-600 mx-auto opacity-70 animate-bounce" />
        <h3 className="text-lg font-bold text-foreground">Social (CSR) metrics are online!</h3>
        <p className="text-muted-foreground text-xs leading-relaxed">
          Operational statistics (e.g. employee diversity count, safety training attendance, and charity donation points) are being monitored. Full interaction widgets are scheduled for next deployment cycle.
        </p>
      </div>

    </div>
  );
}
