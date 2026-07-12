import Link from 'next/link';

export default function Page() {
  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-black text-text-primary capitalize mb-4">blog</h1>
      <p className="text-text-muted mb-8 max-w-lg text-center">This page is under construction. It will contain information about EcoSphere's blog.</p>
      <Link href="/" className="px-6 py-3 bg-action text-white rounded-full text-sm font-semibold hover:bg-[#2a2a25] transition-colors">Return Home</Link>
    </div>
  );
}
