'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useToast } from '@/app/_components/ui/Toast';

export default function SignupPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { showToast } = useToast();

  const [role, setRole] = useState<'EMPLOYEE' | 'ADMIN'>('EMPLOYEE');
  const [form, setForm] = useState({ name: '', email: '', password: '', org: '' });
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
      // For demo, NextAuth authorize callback acts as auto-registration.
      // Signing in with a new email automatically registers the user with their selected role.
      const res = await signIn('credentials', {
        email: form.email,
        password: form.password,
        role: role,
        redirect: false,
      });

      if (res?.error) {
        setErrorMsg('Failed to create account. Please check details.');
        showToast('Signup failed.', 'error');
        setLoading(false);
      } else {
        showToast('Successfully registered and logged in!', 'success');
      }
    } catch (e: any) {
      setErrorMsg('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface rounded-2xl border border-border card-shadow p-8 font-sans">
      <h2 className="text-2xl font-black text-text-primary mb-1">Create your account</h2>
      <p className="text-sm text-text-muted mb-6">Start your EcoSphere ESG journey today</p>

      {errorMsg && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-medium">
          {errorMsg}
        </div>
      )}

      {/* Role Segment Selector */}
      <div className="flex bg-bg p-1 rounded-xl border border-border mb-6">
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

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {[
          { id: 'signup-name',  label: 'Full Name',     type: 'text',     placeholder: 'Sarah K.',         key: 'name' },
          { id: 'signup-email', label: 'Work Email',    type: 'email',    placeholder: 'you@company.com',  key: 'email' },
          { id: 'signup-org',   label: 'Organization',  type: 'text',     placeholder: 'Acme Corp',        key: 'org' },
          { id: 'signup-pw',    label: 'Password',      type: 'password', placeholder: '8+ characters',   key: 'password' },
        ].map(f => (
          <div key={f.id}>
            <label className="block text-xs font-mono uppercase tracking-widest text-text-muted mb-1.5" htmlFor={f.id}>{f.label}</label>
            <input
              id={f.id}
              type={f.type}
              placeholder={f.placeholder}
              value={form[f.key as keyof typeof form]}
              onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
              className="w-full px-4 py-2.5 border border-border rounded-xl text-sm outline-none focus:border-env bg-bg placeholder:text-text-muted"
              required
            />
          </div>
        ))}
        <button
          id="signup-submit"
          type="submit"
          disabled={loading}
          className="mt-2 w-full py-3 rounded-full bg-action text-white font-semibold text-sm hover:bg-[#2a2a25] transition-colors disabled:opacity-60"
        >
          {loading ? 'Creating account…' : 'Create Account'}
        </button>
      </form>

      <p className="text-center text-xs text-text-muted mt-5">
        Already have an account?{' '}
        <Link href="/login" className="text-env hover:underline font-medium">Sign in</Link>
      </p>
    </div>
  );
}

