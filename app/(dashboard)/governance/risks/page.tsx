import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getRiskAssessments } from '@/app/_actions/governance';
import RisksClient from './RisksClient';
import { prisma } from '@/app/_lib/prisma';

export default async function RisksPage() {
  const session = await getServerSession(authOptions);
  const userRole = (session?.user as { role?: string })?.role || 'EMPLOYEE';

  // Fetch risks
  const risks = await getRiskAssessments();
  const departments = await prisma.department.findMany();
  
  // Get active users for ownership selectors
  const users = await prisma.user.findMany({
    select: { id: true, name: true }
  });

  return (
    <RisksClient
      initialRisks={risks}
      departments={departments}
      users={users}
      userRole={userRole}
    />
  );
}
