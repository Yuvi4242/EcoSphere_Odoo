'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useToast } from '@/app/_components/ui/Toast';

export default function LoginPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { showToast } = useToast();

  const [role, setRole] = useState<'EMPLOYEE' | 'ADMIN'>('EMPLOYEE');
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      const userRole = (session.user as any).role;
      if (userRole === 'ADMIN') {
        router.replace('/admin/overview');
      } else {
        router.replace('/app');
      }
    }
  }, [session, status, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await signIn('credentials', {
        email: form.email,
        password: form.password,
        role: role,
        redirect: false,
      });

      if (res?.error) {
        setErrorMsg('Invalid email or password');
        showToast('Login failed. Please check your credentials.', 'error');
        setLoading(false);
      } else {
        showToast('Successfully signed in!', 'success');
      }
    } catch (e: any) {
      setErrorMsg('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface rounded-2xl border border-border card-shadow p-8 font-sans">
      <h2 className="text-2xl font-black text-text-primary mb-1">Welcome back</h2>
      <p className="text-sm text-text-muted mb-6">Sign in to your EcoSphere account</p>

      {errorMsg && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-medium">
          {errorMsg}
        </div>
      )}

      {/* Role Segment Selector */}
      <div className="flex bg-bg p-1 rounded-xl border border-border mb-4">
        <button
          type="button"
          onClick={() => setRole('EMPLOYEE')}
          className={`flex-1 py-2 rounded-lg text-xs font-mono font-bold uppercase transition-all cursor-pointer ${
            role === 'EMPLOYEE'
              ? 'bg-surface text-text-primary border border-border card-shadow'
              : 'text-text-muted hover:text-text-primary'
          }`}
        >
          👤 Employee
        </button>
        <button
          type="button"
          onClick={() => setRole('ADMIN')}
          className={`flex-1 py-2 rounded-lg text-xs font-mono font-bold uppercase transition-all cursor-pointer ${
            role === 'ADMIN'
              ? 'bg-surface text-text-primary border border-border card-shadow'
              : 'text-text-muted hover:text-text-primary'
          }`}
        >
          👑 Admin Panel
        </button>
      </div>

      {/* Demo Credentials Quick Fill */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <button
          type="button"
          onClick={() => {
            setRole('ADMIN');
            setForm({ email: 'admin@ecosphere.com', password: 'admin123' });
            showToast('Admin presets loaded!', 'success');
          }}
          className="py-2 px-3 rounded-xl border border-env bg-env-light/35 text-env font-semibold text-xs transition-all hover:bg-env-light/60 flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <span>👑 Admin Preset</span>
        </button>
        <button
          type="button"
          onClick={() => {
            setRole('EMPLOYEE');
            setForm({ email: 'employee@ecosphere.com', password: 'employee123' });
            showToast('Employee presets loaded!', 'success');
          }}
          className="py-2 px-3 rounded-xl border border-social bg-social-light/35 text-social font-semibold text-xs transition-all hover:bg-social-light/60 flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <span>👤 Employee Preset</span>
        </button>
      </div>

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
