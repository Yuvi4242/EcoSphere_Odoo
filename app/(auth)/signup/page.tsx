'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '', org: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => router.push('/overview'), 1200);
  };

  return (
    <div className="bg-surface rounded-2xl border border-border card-shadow p-8">
      <h2 className="text-2xl font-black text-text-primary mb-1">Create your account</h2>
      <p className="text-sm text-text-muted mb-6">Start your EcoSphere ESG journey today</p>

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
