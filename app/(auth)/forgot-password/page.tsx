'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="bg-surface rounded-2xl border border-border card-shadow p-8">
      {!sent ? (
        <>
          <h2 className="text-2xl font-black text-text-primary mb-1">Reset your password</h2>
          <p className="text-sm text-text-muted mb-6">Enter your email and we&apos;ll send a reset link</p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-widest text-text-muted mb-1.5" htmlFor="forgot-email">Email</label>
              <input
                id="forgot-email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full px-4 py-2.5 border border-border rounded-xl text-sm outline-none focus:border-env bg-bg placeholder:text-text-muted"
                required
              />
            </div>
            <button
              id="forgot-submit"
              type="submit"
              className="mt-2 w-full py-3 rounded-full bg-action text-white font-semibold text-sm hover:bg-[#2a2a25] transition-colors"
            >
              Send Reset Link
            </button>
          </form>
        </>
      ) : (
        <div className="text-center py-4">
          <div className="text-4xl mb-4">📬</div>
          <h2 className="text-xl font-bold text-text-primary mb-2">Check your inbox</h2>
          <p className="text-sm text-text-muted mb-6">
            We sent a reset link to <strong>{email}</strong>
          </p>
          <button onClick={() => setSent(false)} className="text-xs font-mono text-text-muted hover:text-text-primary">
            Try a different email
          </button>
        </div>
      )}
      <p className="text-center text-xs text-text-muted mt-5">
        <Link href="/login" className="text-env hover:underline font-medium">← Back to Sign In</Link>
      </p>
    </div>
  );
}
