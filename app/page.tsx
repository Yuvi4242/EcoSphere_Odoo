import Link from "next/link";
import { Leaf, Users, ShieldCheck, Trophy, ArrowRight, BarChart3 } from "lucide-react";

/**
 * Premium EcoSphere Platform Landing Page.
 * Showcases the ESG value proposition and links to access routes.
 */
export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 text-slate-100 antialiased selection:bg-emerald-500 selection:text-white">
      {/* Navigation Header */}
      <header className="px-6 lg:px-16 h-20 flex items-center justify-between border-b border-slate-800 backdrop-blur-md sticky top-0 z-50 bg-slate-900/85">
        <div className="flex items-center space-x-2">
          <Leaf className="h-7 w-7 text-emerald-500" />
          <span className="text-2xl font-extrabold tracking-tight text-white">EcoSphere</span>
        </div>
        <div className="flex items-center space-x-4">
          <Link
            href="/login"
            className="text-sm font-medium text-slate-350 hover:text-white transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/login"
            className="flex items-center text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-full transition-all hover:shadow-lg hover:shadow-emerald-500/20"
          >
            Access Platform
            <ArrowRight className="ml-1.5 h-4 w-4" />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="py-24 px-6 text-center max-w-5xl mx-auto flex flex-col items-center">
          <div className="inline-flex items-center space-x-2 bg-emerald-950/40 border border-emerald-800/50 rounded-full px-4 py-1.5 mb-8 text-emerald-450 text-xs font-semibold">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Next-Gen Enterprise ESG Management</span>
          </div>
          
          <h2 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight max-w-4xl">
            Empower Your Enterprise to Achieve <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">True Sustainability</span>
          </h2>
          
          <p className="mt-6 text-base sm:text-lg text-slate-400 max-w-2xl leading-relaxed">
            Monitor Carbon metrics, evaluate Social impact, track Governance compliance, and engage employees through an interactive, gamified sustainability tracker.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <Link
              href="/login"
              className="flex items-center justify-center text-base font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-8 py-3.5 rounded-full shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/25 transition-all hover:scale-[1.02]"
            >
              Get Started
            </Link>
            <a
              href="#modules"
              className="flex items-center justify-center text-base font-semibold border border-slate-700 hover:border-slate-500 hover:bg-slate-800/30 text-slate-300 px-8 py-3.5 rounded-full transition-all"
            >
              Explore Modules
            </a>
          </div>
        </section>

        {/* Feature Cards Grid */}
        <section id="modules" className="py-20 border-t border-slate-900 bg-slate-950/40">
          <div className="max-w-7xl mx-auto px-6 lg:px-16">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h3 className="text-3xl font-bold text-white tracking-tight">Comprehensive ESG Framework</h3>
              <p className="text-slate-400 mt-3 text-sm sm:text-base">
                Everything your organization needs to collect metrics, compile audits, and automate ESG compliance reporting.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Environmental */}
              <div className="bg-slate-900/50 border border-slate-800/60 p-6 rounded-2xl flex flex-col hover:border-emerald-500/40 transition-all hover:-translate-y-1">
                <div className="h-12 w-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-5 border border-emerald-500/20">
                  <Leaf className="h-6 w-6" />
                </div>
                <h4 className="text-lg font-bold text-white mb-2">Environmental Scope</h4>
                <p className="text-slate-400 text-sm leading-relaxed flex-1">
                  Track Scope 1, 2, and 3 carbon emissions. Run calculations, manage sustainability goals, and report emission factors.
                </p>
              </div>

              {/* Social */}
              <div className="bg-slate-900/50 border border-slate-800/60 p-6 rounded-2xl flex flex-col hover:border-blue-500/40 transition-all hover:-translate-y-1">
                <div className="h-12 w-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-5 border border-blue-500/20">
                  <Users className="h-6 w-6" />
                </div>
                <h4 className="text-lg font-bold text-white mb-2">Social Responsibility</h4>
                <p className="text-slate-400 text-sm leading-relaxed flex-1">
                  Log blood donation camps, tree plantation campaigns, and volunteer hours. Access diversity metrics and track engagement.
                </p>
              </div>

              {/* Governance */}
              <div className="bg-slate-900/50 border border-slate-800/60 p-6 rounded-2xl flex flex-col hover:border-violet-500/40 transition-all hover:-translate-y-1">
                <div className="h-12 w-12 rounded-xl bg-violet-500/10 text-violet-400 flex items-center justify-center mb-5 border border-violet-500/20">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h4 className="text-lg font-bold text-white mb-2">Corporate Governance</h4>
                <p className="text-slate-400 text-sm leading-relaxed flex-1">
                  Draft policies, track policy acceptance rates, conduct audits, and resolve organizational compliance issues.
                </p>
              </div>

              {/* Gamification */}
              <div className="bg-slate-900/50 border border-slate-800/60 p-6 rounded-2xl flex flex-col hover:border-amber-500/40 transition-all hover:-translate-y-1">
                <div className="h-12 w-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-5 border border-amber-500/20">
                  <Trophy className="h-6 w-6" />
                </div>
                <h4 className="text-lg font-bold text-white mb-2">XP & Engagement</h4>
                <p className="text-slate-400 text-sm leading-relaxed flex-1">
                  Engage employees with challenges. Award levels, XP, and badges. Build friendly competition via the leaderboard.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-8 px-6 text-center border-t border-slate-900 text-slate-500 text-xs bg-slate-950">
        <p>&copy; {new Date().getFullYear()} EcoSphere. Enterprise-grade ESG Management Platform. All rights reserved.</p>
      </footer>
    </div>
  );
}
