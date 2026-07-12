import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getPolicyById } from '@/app/_actions/governance';
import PolicyDetailClient from './PolicyDetailClient';
import { notFound } from 'next/navigation';

export default async function PolicyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const policy = await getPolicyById(id);
  if (!policy) {
    notFound();
  }

  const session = await getServerSession(authOptions);
  const currentUserRole = (session?.user as { role?: string })?.role || 'EMPLOYEE';
  const currentUserId = (session?.user as { id?: string })?.id || '';

  return (
    <PolicyDetailClient
      policy={policy}
      currentUserRole={currentUserRole}
      currentUserId={currentUserId}
    />
  );
}
