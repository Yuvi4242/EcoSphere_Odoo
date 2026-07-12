import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/app/_lib/prisma';
import PageHeader from '@/app/_components/ui/PageHeader';
import { getPolicies, getPolicyCategories } from '@/app/_actions/governance';
import { PolicyTable } from '@/app/_components/governance/PolicyComponents';
import { publishPolicy, archivePolicy, duplicatePolicy, deletePolicy } from '@/app/_actions/governance';

// Server Actions wrapped for the Client Table
async function handlePublish(id: string) {
  'use server';
  await publishPolicy(id);
}

async function handleArchive(id: string) {
  'use server';
  await archivePolicy(id);
}

async function handleDuplicate(id: string) {
  'use server';
  await duplicatePolicy(id);
}

async function handleDelete(id: string) {
  'use server';
  await deletePolicy(id);
}

export default async function PoliciesPage() {
  const session = await getServerSession(authOptions);
  const userRole = (session?.user as { role?: string })?.role || 'EMPLOYEE';

  // Fetch initial policies list
  const { policies } = await getPolicies({ limit: 100 });
  const categories = await getPolicyCategories();
  const departments = await prisma.department.findMany();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Governance"
        title="ESG Policies Registry"
        subtitle="Manage and view corporate compliance policies, employee sign-offs, and versions"
        accentColor="gov"
      />

      <PolicyTable
        policies={policies}
        categories={categories}
        departments={departments}
        userRole={userRole}
        onPublish={handlePublish}
        onArchive={handleArchive}
        onDuplicate={handleDuplicate}
        onDelete={handleDelete}
      />
    </div>
  );
}
