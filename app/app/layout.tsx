'use client';

import AppShell from '@/app/_components/AppShell';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, Suspense } from 'react';
import { useToast } from '@/app/_components/ui/Toast';

function UnauthorizedNotifier() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { showToast } = useToast();

  useEffect(() => {
    const unauth = searchParams.get('unauthorized');
    if (unauth === 'true') {
      showToast('Not authorized. Admin access required.', 'error');
      // Clean up search params
      const newUrl = window.location.pathname;
      router.replace(newUrl);
    }
  }, [searchParams, showToast, router]);

  return null;
}

export default function EmployeeLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell>
      <Suspense fallback={null}>
        <UnauthorizedNotifier />
      </Suspense>
      {children}
    </AppShell>
  );
}
