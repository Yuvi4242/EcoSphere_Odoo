'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { useState, useEffect } from 'react';

const pillars = [
  {
    color: '#189A57', bg: '#E6F4EE', label: 'E — Environmental',
    title: 'Carbon Accounting at Scale',
    desc: 'Real-time emission tracking connected to your ERP, with factors, goals, and automated reporting.',
    bullets: ['Emission Factors Library', 'Carbon Transaction Log', 'Department Targets & Goals'],
  },
  {
    color: '#E8823D', bg: '#FDF0E8', label: 'S — Social',
    title: 'People, Community & Culture',
    desc: 'Run CSR campaigns, track diversity metrics, and measure training completion across your org.',
    bullets: ['CSR Activity Management', 'Volunteer Participation', 'Diversity & Inclusion Metrics'],
  },
  {
    color: '#22344E', bg: '#E8EDF4', label: 'G — Governance',
    title: 'Compliance Without Chaos',
    desc: 'Central policy registry, audit trails, and compliance issue tracking — all connected.',
    bullets: ['ESG Policy Registry', 'Audit Log & Findings', 'Compliance Issue Tracker'],
  },
  {
    color: '#7C4DFF', bg: '#EDE8FF', label: 'Gamification',
    title: 'Engagement That Drives Action',
    desc: 'Turn sustainability tasks into challenges with XP, badges, leaderboards, and redeemable rewards.',
    bullets: ['Challenges & XP System', 'Achievement Badges', 'Rewards & Leaderboard'],
  },
];

const flow = [
  'Master Config', 'Daily Operations', 'Carbon Transactions',
  'E / S / G Scores', 'Overall ESG Score', 'Dashboard',
];

export default function LandingPage() {
  const shouldReduceMotion = useReducedMotion();
  const [liveScore, setLiveScore] = useState(74);

  useEffect(() => {
    if (shouldReduceMotion) return;
    const interval = setInterval(() => {
      setLiveScore(prev => prev >= 99 ? 74 : prev + 1);
    }, 3500);
    return () => clearInterval(interval);
  }, [shouldReduceMotion]);

  const easeOut = [0.22, 1, 0.36, 1] as const;
  const linearEase = [0, 0, 1, 1] as const;

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.15,
      },
    },
  };

  const fadeUp = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easeOut } },
  };

  const scaleUp = {
    hidden: { opacity: 0, scale: shouldReduceMotion ? 1 : 0.95 },
    show: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: easeOut } },
  };

  const heroStagger = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: shouldReduceMotion ? 0 : 0.1 },
    },
  };

  const heroFadeSlide = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: linearEase } },
  };
  return (
    <div className="min-h-screen bg-bg font-sans overflow-x-hidden">
      {/* ── Navbar ── */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="flex items-center justify-between px-8 py-5 border-b border-border sticky top-0 bg-bg/80 backdrop-blur-md z-50"
      >
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-env flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 8C8 10 5.9 16.17 3.82 19.1a10.49 10.49 0 0 0 10.39 1.7c2.64-.9 4.48-3.26 5.04-6.14A11.1 11.1 0 0 0 17 8Z" />
              <path d="M3 8c0 6.626 5.372 12 12 12" />
            </svg>
          </div>
          <span className="font-black text-lg text-text-primary">EcoSphere</span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="#pillars" className="text-sm text-text-muted hover:text-text-primary transition-colors">Platform</Link>
          <Link href="#how-it-works" className="text-sm text-text-muted hover:text-text-primary transition-colors">How it Works</Link>
          <Link href="/login" className="text-sm text-text-muted hover:text-text-primary transition-colors">Sign In</Link>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href="/overview" className="px-5 py-2 rounded-full bg-action text-white text-sm font-semibold hover:bg-[#2a2a25] transition-colors shadow-lg">
              Launch Platform
            </Link>
          </motion.div>
        </div>
      </motion.nav>

      {/* ── Hero ── */}
      <section className="max-w-7xl mx-auto px-8 pt-24 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          <motion.div
            variants={heroStagger}
            initial="hidden"
            animate="show"
            className="flex flex-col items-start text-left"
          >
            <motion.div variants={heroFadeSlide} className="flex items-center gap-2 mb-6">
              {!shouldReduceMotion && (
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-env opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-env"></span>
                </span>
              )}
              {shouldReduceMotion && <span className="h-2 w-2 rounded-full bg-env"></span>}
              <span className="text-xs font-mono uppercase tracking-widest text-text-muted">Live ERP sync</span>
            </motion.div>

            <motion.p variants={heroFadeSlide} className="text-xs font-mono uppercase tracking-widest text-env mb-6">
              REAL-TIME ESG, WIRED INTO YOUR ERP
            </motion.p>

            <motion.h1 variants={heroFadeSlide} className="text-5xl lg:text-6xl font-black text-text-primary leading-tight mb-6">
              Turn raw operational data into a <span className="text-env">certified ESG score</span>.
            </motion.h1>

            <motion.p variants={heroFadeSlide} className="text-lg text-text-muted max-w-xl mb-10 leading-relaxed">
              A unified platform that connects carbon accounting, CSR, governance, and gamification directly to your ERP for automated sustainability reporting.
            </motion.p>

            <motion.div variants={heroFadeSlide} className="flex flex-wrap items-center gap-4">
              <motion.div
                whileHover={!shouldReduceMotion ? { scale: 1.02, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' } : {}}
              >
                <Link href="/overview" className="inline-block px-7 py-3.5 rounded-full bg-action text-white font-semibold text-sm transition-shadow">
                  Launch Platform
                </Link>
              </motion.div>
              <Link href="#how-it-works" className="inline-block px-7 py-3.5 rounded-full border border-border text-text-primary font-semibold text-sm hover:bg-[#189A57]/10 transition-colors">
                See How It Works
              </Link>
            </motion.div>
          </motion.div>

          {/* Dashboard preview card */}
          <motion.div
            initial={{ opacity: 0, x: shouldReduceMotion ? 0 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: shouldReduceMotion ? 0 : 0.5, ease: 'easeOut' }}
            className="bg-surface rounded-2xl border border-border card-shadow overflow-hidden shadow-2xl relative w-full max-w-lg lg:ml-auto"
          >
            <div className="flex items-center gap-1.5 px-4 py-3 border-b border-border bg-bg/50">
              <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
              <span className="ml-2 text-xs font-mono text-text-muted">ecosphere.io / overview</span>
            </div>
            <div className="p-6 grid grid-cols-2 gap-4">
              <div className="bg-bg rounded-xl p-4 border border-border">
                <p className="text-[10px] font-mono uppercase tracking-widest text-text-muted mb-1">ESG Score</p>
                <p className="text-4xl font-black text-text-primary transition-all duration-300">
                  {liveScore}
                </p>
              </div>
              <div className="bg-bg rounded-xl p-4 border border-border">
                <p className="text-[10px] font-mono uppercase tracking-widest text-text-muted mb-1">Emissions</p>
                <p className="text-2xl font-black text-env mt-1">
                  4,281 <span className="text-sm font-semibold">tCO2e</span>
                </p>
              </div>
              <div className="bg-bg rounded-xl p-4 border border-border">
                <p className="text-[10px] font-mono uppercase tracking-widest text-text-muted mb-1">CSR Activities</p>
                <p className="text-2xl font-black text-[#E8823D] mt-1">22</p>
              </div>
              <div className="bg-bg rounded-xl p-4 border border-border">
                <p className="text-[10px] font-mono uppercase tracking-widest text-text-muted mb-1">XP Earned</p>
                <p className="text-2xl font-black text-[#7C4DFF] mt-1">128K</p>
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* ── Problem Statement ── */}
      <section className="bg-surface border-y border-border py-20 px-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-social/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="max-w-4xl mx-auto text-center relative z-10"
        >
          <motion.p variants={fadeUp} className="text-xs font-mono uppercase tracking-widest text-text-muted mb-4">The Problem</motion.p>
          <motion.h2 variants={fadeUp} className="text-4xl font-black text-text-primary mb-6">ESG shouldn&apos;t live in spreadsheets</motion.h2>
          <motion.p variants={fadeUp} className="text-lg text-text-muted max-w-2xl mx-auto mb-12">
            Most organizations track carbon, compliance, and CSR across disconnected tools — manual exports, siloed ERP modules, and ad-hoc spreadsheets. EcoSphere unifies it all.
          </motion.p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { stat: '74%', label: 'of ESG data collected manually', sub: 'Industry average' },
              { stat: '6+', label: 'tools used per ESG report', sub: 'Typical enterprise' },
              { stat: '40h', label: 'per quarter on data reconciliation', sub: 'Sustainability teams' },
            ].map(s => (
              <motion.div key={s.stat} variants={scaleUp} className="text-center group">
                <p className="text-5xl font-black text-text-primary mb-1 group-hover:scale-110 transition-transform duration-300 origin-center">{s.stat}</p>
                <p className="text-sm text-text-muted">{s.label}</p>
                <p className="text-xs font-mono text-text-muted/60 mt-1">{s.sub}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── Four Pillars ── */}
      <section id="pillars" className="py-24 px-8 max-w-6xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="text-center mb-16"
        >
          <motion.p variants={fadeUp} className="text-xs font-mono uppercase tracking-widest text-text-muted mb-3">The Four Pillars</motion.p>
          <motion.h2 variants={fadeUp} className="text-4xl font-black text-text-primary">Everything ESG, in one platform</motion.h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {pillars.map((p, i) => (
            <motion.div
              key={p.label}
              variants={fadeUp}
              whileHover={{ y: -8, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
              className="bg-surface rounded-2xl border border-border card-shadow p-8 transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform hover:scale-110" style={{ background: p.bg }}>
                  <div className="w-4 h-4 rounded-full" style={{ background: p.color }} />
                </div>
                <span className="text-xs font-mono uppercase tracking-widest" style={{ color: p.color }}>{p.label}</span>
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-2">{p.title}</h3>
              <p className="text-sm text-text-muted mb-6 leading-relaxed">{p.desc}</p>
              <ul className="flex flex-col gap-2">
                {p.bullets.map(b => (
                  <li key={b} className="flex items-center gap-3 text-sm text-text-muted">
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: p.color }} />
                    {b}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── How It Works ── */}
      <section id="how-it-works" className="bg-surface border-y border-border py-24 px-8 relative overflow-hidden">
        <div className="absolute top-1/2 left-0 w-96 h-96 bg-env/5 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2" />
        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.p variants={fadeUp} className="text-xs font-mono uppercase tracking-widest text-text-muted mb-3">How It Works</motion.p>
            <motion.h2 variants={fadeUp} className="text-4xl font-black text-text-primary">From raw data to ESG score</motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="flex items-center justify-between flex-wrap gap-2 md:gap-0"
          >
            {flow.map((step, i) => (
              <motion.div key={step} variants={scaleUp} className="flex flex-col md:flex-row items-center gap-2 md:gap-4 w-full md:w-auto mb-6 md:mb-0">
                <div className="flex flex-col items-center group cursor-default">
                  <div className="w-12 h-12 rounded-full border-2 border-border bg-surface flex items-center justify-center text-sm font-mono text-text-muted group-hover:border-env group-hover:text-env transition-colors shadow-sm group-hover:shadow-md">
                    {i + 1}
                  </div>
                  <p className="text-xs font-mono uppercase tracking-widest text-text-primary mt-3 text-center max-w-[90px] leading-tight group-hover:text-env transition-colors">{step}</p>
                </div>
                {i < flow.length - 1 && (
                  <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    transition={{ delay: 0.5 + (i * 0.1), duration: 0.5 }}
                    className="hidden md:block w-8 lg:w-16 h-0.5 bg-border flex-shrink-0 origin-left"
                  />
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Dashboard Preview (2nd) ── */}
      <section className="py-24 px-8 max-w-4xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.p variants={fadeUp} className="text-xs font-mono uppercase tracking-widest text-text-muted mb-6 text-center">See It In Action</motion.p>
          <motion.div variants={scaleUp} className="bg-surface rounded-2xl border border-border card-shadow overflow-hidden hover:shadow-2xl transition-shadow duration-500">
            <div className="flex items-center gap-1.5 px-4 py-3 border-b border-border bg-bg/50">
              <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
              <span className="ml-2 text-xs font-mono text-text-muted">ecosphere.io / gamification</span>
            </div>
            <div className="p-6">
              <p className="text-xs font-mono uppercase tracking-widest text-gamif mb-4">Gamification · Leaderboard</p>
              {[
                { rank: '🥇', name: 'Sarah K.', dept: 'Engineering', xp: '9,847' },
                { rank: '🥈', name: 'Tom R.', dept: 'Manufacturing', xp: '8,923' },
                { rank: '🥉', name: 'Maria L.', dept: 'HR', xp: '8,102' },
              ].map((p, i) => (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + (i * 0.1) }}
                  key={p.name}
                  className="flex items-center gap-4 py-3 border-b border-border last:border-0 hover:bg-bg/50 transition-colors px-2 rounded-lg"
                >
                  <span className="text-lg w-8 text-center">{p.rank}</span>
                  <div className="w-8 h-8 rounded-full bg-gamif-light text-gamif text-xs font-bold flex items-center justify-center">
                    {p.name.split(' ').map(w => w[0]).join('')}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-text-primary">{p.name}</p>
                    <p className="text-xs text-text-muted">{p.dept}</p>
                  </div>
                  <span className="text-sm font-black text-gamif">{p.xp} XP</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-text-primary py-24 px-8 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-env/20 via-text-primary to-text-primary opacity-60" />
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="relative z-10"
        >
          <motion.p variants={fadeUp} className="text-xs font-mono uppercase tracking-widest text-surface/40 mb-4">Get Started</motion.p>
          <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-black text-surface mb-6">Ready to unify your ESG data?</motion.h2>
          <motion.p variants={fadeUp} className="text-surface/70 mb-10 max-w-lg mx-auto text-lg">
            Join organizations already managing Environmental, Social, and Governance performance in one place.
          </motion.p>
          <motion.div variants={scaleUp} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-block">
            <Link href="/overview" className="inline-flex px-8 py-4 rounded-full bg-env text-white font-bold text-lg hover:bg-[#147a45] transition-colors shadow-[0_0_20px_rgba(24,154,87,0.4)] hover:shadow-[0_0_30px_rgba(24,154,87,0.6)]">
              Launch Platform →
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-bg border-t border-border px-8 py-12">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-md bg-env flex items-center justify-center">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 8C8 10 5.9 16.17 3.82 19.1a10.49 10.49 0 0 0 10.39 1.7c2.64-.9 4.48-3.26 5.04-6.14A11.1 11.1 0 0 0 17 8Z" />
                  <path d="M3 8c0 6.626 5.372 12 12 12" />
                </svg>
              </div>
              <span className="font-black text-text-primary">EcoSphere</span>
            </div>
            <p className="text-xs text-text-muted leading-relaxed max-w-xs">End-to-end ESG management platform for modern organizations, turning data into action.</p>
          </div>
          {[
            { title: 'Product', links: ['Overview', 'Environmental', 'Social', 'Governance', 'Gamification'] },
            { title: 'Company', links: ['About', 'Careers', 'Blog', 'Press'] },
            { title: 'Legal', links: ['Privacy Policy', 'Terms of Service', 'Cookie Policy'] },
          ].map((col, i) => (
            <motion.div
              key={col.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <p className="text-xs font-mono uppercase tracking-widest text-text-muted mb-4">{col.title}</p>
              <ul className="flex flex-col gap-3">
                {col.links.map(link => (
                  <li key={link}><a href="#" className="text-sm text-text-muted hover:text-text-primary transition-colors">{link}</a></li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
        <div className="max-w-6xl mx-auto mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs font-mono text-text-muted">© 2025 EcoSphere. All rights reserved.</p>
          <div className="flex gap-4">
            {['Twitter', 'LinkedIn', 'GitHub'].map(s => (
              <a key={s} href="#" className="text-xs font-mono text-text-muted hover:text-text-primary">{s}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
