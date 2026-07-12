import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getComplianceRequirementById } from '@/app/_actions/governance';
import ComplianceDetailClient from './ComplianceDetailClient';
import { prisma } from '@/app/_lib/prisma';
import { notFound } from 'next/navigation';

export default async function ComplianceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const req = await getComplianceRequirementById(id);
  if (!req) {
    notFound();
  }

  const session = await getServerSession(authOptions);
  const currentUserRole = (session?.user as { role?: string })?.role || 'EMPLOYEE';
  const currentUserId = (session?.user as { id?: string })?.id || '';

  // Get active users for task selection dropdown
  const users = await prisma.user.findMany({
    select: { id: true, name: true }
  });

  return (
    <ComplianceDetailClient
      req={req}
      users={users}
      currentUserRole={currentUserRole}
      currentUserId={currentUserId}
    />
  );
}
