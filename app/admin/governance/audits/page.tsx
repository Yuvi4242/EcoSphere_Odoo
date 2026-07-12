import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/app/_lib/prisma';
import { getAudits } from '@/app/_actions/governance';
import AuditsClient from './AuditsClient';

export default async function AuditsPage() {
  const session = await getServerSession(authOptions);
  const userRole = (session?.user as { role?: string })?.role || 'EMPLOYEE';

  // Fetch audits
  const audits = await getAudits();
  const departments = await prisma.department.findMany();

  return (
    <AuditsClient
      initialAudits={audits}
      departments={departments}
      userRole={userRole}
    />
  );
}
