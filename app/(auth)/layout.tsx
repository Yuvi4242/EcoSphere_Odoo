export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg p-6">
      <div className="w-full max-w-sm">
        {/* Brand mark */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-10 h-10 rounded-xl bg-env flex items-center justify-center mb-3 shadow-lg shadow-env/20">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 8C8 10 5.9 16.17 3.82 19.1a10.49 10.49 0 0 0 10.39 1.7c2.64-.9 4.48-3.26 5.04-6.14A11.1 11.1 0 0 0 17 8Z"/>
              <path d="M3 8c0 6.626 5.372 12 12 12"/>
            </svg>
          </div>
          <span className="font-black text-xl text-text-primary">EcoSphere</span>
          <span className="text-[10px] font-mono uppercase tracking-widest text-text-muted mt-0.5">ESG Platform</span>
        </div>
        {children}
      </div>
    </div>
  );
}
