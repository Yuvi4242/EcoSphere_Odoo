'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => router.push('/overview'), 1000);
  };

  return (
    <div className="bg-surface rounded-2xl border border-border card-shadow p-8">
      <h2 className="text-2xl font-black text-text-primary mb-1">Welcome back</h2>
      <p className="text-sm text-text-muted mb-6">Sign in to your EcoSphere account</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-xs font-mono uppercase tracking-widest text-text-muted mb-1.5" htmlFor="login-email">Email</label>
          <input
            id="login-email"
            type="email"
            value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            placeholder="you@company.com"
            className="w-full px-4 py-2.5 border border-border rounded-xl text-sm outline-none focus:border-env bg-bg placeholder:text-text-muted"
            required
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-mono uppercase tracking-widest text-text-muted" htmlFor="login-password">Password</label>
            <Link href="/forgot-password" className="text-xs text-env hover:underline">Forgot password?</Link>
          </div>
          <input
            id="login-password"
            type="password"
            value={form.password}
            onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
            placeholder="••••••••"
            className="w-full px-4 py-2.5 border border-border rounded-xl text-sm outline-none focus:border-env bg-bg placeholder:text-text-muted"
            required
          />
        </div>
        <button
          id="login-submit"
          type="submit"
          disabled={loading}
          className="mt-2 w-full py-3 rounded-full bg-action text-white font-semibold text-sm hover:bg-[#2a2a25] transition-colors disabled:opacity-60"
        >
          {loading ? 'Signing in…' : 'Sign In'}
        </button>
      </form>

      <p className="text-center text-xs text-text-muted mt-5">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="text-env hover:underline font-medium">Create one</Link>
      </p>
    </div>
  );
}
