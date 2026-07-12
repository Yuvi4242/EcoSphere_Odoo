import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getAuditById } from '@/app/_actions/governance';
import AuditDetailClient from './AuditDetailClient';
import { prisma } from '@/app/_lib/prisma';
import { notFound } from 'next/navigation';

export default async function AuditDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const audit = await getAuditById(id);
  if (!audit) {
    notFound();
  }

  const session = await getServerSession(authOptions);
  const currentUserRole = (session?.user as { role?: string })?.role || 'EMPLOYEE';
  const currentUserId = (session?.user as { id?: string })?.id || '';

  // Get active users for findings assignment dropdown
  const users = await prisma.user.findMany({
    select: { id: true, name: true }
  });

  return (
    <AuditDetailClient
      audit={audit}
      users={users}
      currentUserRole={currentUserRole}
      currentUserId={currentUserId}
    />
  );
}
