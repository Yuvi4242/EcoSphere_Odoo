import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/app/_lib/prisma';
import { getComplianceRequirements, getComplianceStats } from '@/app/_actions/governance';
import ComplianceClient from './ComplianceClient';

export default async function CompliancePage() {
  const session = await getServerSession(authOptions);
  const userRole = (session?.user as { role?: string })?.role || 'EMPLOYEE';

  // Fetch compliance details
  const requirements = await getComplianceRequirements();
  const stats = await getComplianceStats();
  const departments = await prisma.department.findMany();
  
  // Fetch users for assignment selections
  const users = await prisma.user.findMany({
    select: { id: true, name: true }
  });

  return (
    <ComplianceClient
      initialRequirements={requirements}
      stats={stats}
      departments={departments}
      users={users}
      userRole={userRole}
    />
  );
}
