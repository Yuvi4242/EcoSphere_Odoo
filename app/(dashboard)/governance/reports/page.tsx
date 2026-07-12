import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getReports } from '@/app/_actions/governance';
import ReportsClient from './ReportsClient';
import { prisma } from '@/app/_lib/prisma';

export default async function ReportsPage() {
  const session = await getServerSession(authOptions);
  const userRole = (session?.user as { role?: string })?.role || 'EMPLOYEE';

  // Fetch reports list
  const reports = await getReports();
  const departments = await prisma.department.findMany();

  return (
    <ReportsClient
      initialReports={reports}
      departments={departments}
      userRole={userRole}
    />
  );
}
