'use server';

import { prisma } from '@/app/_lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { revalidatePath } from 'next/cache';
import {
  PolicySchema,
  ComplianceRequirementSchema,
  AuditSchema,
  RiskAssessmentSchema,
  PolicyInput,
  ComplianceRequirementInput,
  AuditInput,
  RiskAssessmentInput
} from '@/app/_lib/governance-validation';

// ==========================================
// UTILITY / HELPERS
// ==========================================

async function getAuthUser() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string })?.id;

  if (userId) {
    const dbUser = await prisma.user.findUnique({
      where: { id: userId },
      include: { department: true }
    });
    if (dbUser) return dbUser;
  }

  // Fallback to first user in DB based on role for testing/demo ease
  const fallback = await prisma.user.findFirst({
    orderBy: { role: 'desc' }, // Admin first
    include: { department: true }
  });

  return fallback;
}

export async function logActivity(userId: string, action: string, entity: string, entityId: string) {
  try {
    return await prisma.activityLog.create({
      data: { userId, action, entity, entityId }
    });
  } catch (error) {
    console.error('Failed to log activity:', error);
  }
}

export async function createNotification(userId: string, title: string, message: string, type = 'system') {
  try {
    return await prisma.notification.create({
      data: { userId, title, message, type }
    });
  } catch (error) {
    console.error('Failed to create notification:', error);
  }
}

// ==========================================
// POLICY MANAGEMENT ACTIONS
// ==========================================

export async function getPolicies(filters?: {
  status?: string;
  departmentId?: string;
  categoryId?: string;
  search?: string;
  page?: number;
  limit?: number;
}) {
  const page = filters?.page || 1;
  const limit = filters?.limit || 10;
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {};
  if (filters?.status) where.status = filters.status;
  if (filters?.departmentId) where.departmentId = filters.departmentId;
  if (filters?.categoryId) where.categoryId = filters.categoryId;
  if (filters?.search) {
    where.OR = [
      { title: { contains: filters.search, mode: 'insensitive' } },
      { description: { contains: filters.search, mode: 'insensitive' } },
      { summary: { contains: filters.search, mode: 'insensitive' } },
    ];
  }

  const [policies, total] = await Promise.all([
    prisma.policy.findMany({
      where,
      include: {
        category: true,
        department: true,
        createdBy: { select: { name: true, email: true } },
        acknowledgements: true,
      },
      orderBy: { updatedAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.policy.count({ where }),
  ]);

  return { policies, total, page, totalPages: Math.ceil(total / limit) };
}

export async function getPolicyById(id: string) {
  return await prisma.policy.findUnique({
    where: { id },
    include: {
      category: true,
      department: true,
      createdBy: { select: { id: true, name: true, email: true } },
      versions: { orderBy: { createdAt: 'desc' } },
      acknowledgements: {
        include: {
          user: {
            select: {
              name: true,
              email: true,
              department: { select: { name: true } },
            },
          },
        },
      },
    },
  });
}

export async function createPolicy(input: PolicyInput) {
  const user = await getAuthUser();
  if (!user || (user.role !== 'ADMIN' && user.role !== 'MANAGER')) {
    throw new Error('Unauthorized or user not found');
  }

  const validated = PolicySchema.parse(input);

  // Check duplicate title
  const duplicate = await prisma.policy.findFirst({
    where: { title: validated.title },
  });
  if (duplicate) {
    throw new Error('A policy with this title already exists.');
  }

  const policy = await prisma.policy.create({
    data: {
      title: validated.title,
      description: validated.description,
      summary: validated.summary,
      categoryId: validated.categoryId,
      departmentId: validated.departmentId,
      status: validated.status,
      version: validated.version,
      effectiveDate: new Date(validated.effectiveDate),
      expiryDate: new Date(validated.expiryDate),
      pdfUrl: validated.pdfUrl || null,
      createdById: user.id,
    },
  });

  // Version 1.0.0 Log
  await prisma.policyVersion.create({
    data: {
      policyId: policy.id,
      version: validated.version,
      changeLog: 'Initial Policy Document Created',
    },
  });

  await logActivity(user.id, 'Created Policy', 'Policy', policy.id);
  revalidatePath('/governance/policies');
  return policy;
}

export async function updatePolicy(id: string, input: PolicyInput, changeLog?: string) {
  const user = await getAuthUser();
  if (!user || (user.role !== 'ADMIN' && user.role !== 'MANAGER')) {
    throw new Error('Unauthorized');
  }

  const validated = PolicySchema.parse(input);

  const existing = await prisma.policy.findUnique({ where: { id } });
  if (!existing) throw new Error('Policy not found');

  const policy = await prisma.policy.update({
    where: { id },
    data: {
      title: validated.title,
      description: validated.description,
      summary: validated.summary,
      categoryId: validated.categoryId,
      departmentId: validated.departmentId,
      status: validated.status,
      version: validated.version,
      effectiveDate: new Date(validated.effectiveDate),
      expiryDate: new Date(validated.expiryDate),
      pdfUrl: validated.pdfUrl || null,
    },
  });

  // Create new version log if semver is updated
  if (existing.version !== validated.version) {
    await prisma.policyVersion.create({
      data: {
        policyId: policy.id,
        version: validated.version,
        changeLog: changeLog || `Updated policy version to ${validated.version}`,
      },
    });
  }

  await logActivity(user.id, 'Edited Policy', 'Policy', policy.id);
  revalidatePath(`/governance/policies/${id}`);
  revalidatePath('/governance/policies');
  return policy;
}

export async function deletePolicy(id: string) {
  const user = await getAuthUser();
  if (!user || user.role !== 'ADMIN') {
    throw new Error('Only admins can delete policies');
  }

  await prisma.policy.delete({ where: { id } });
  await logActivity(user.id, 'Deleted Policy', 'Policy', id);
  revalidatePath('/governance/policies');
  return { success: true };
}

export async function publishPolicy(id: string) {
  const user = await getAuthUser();
  if (!user || (user.role !== 'ADMIN' && user.role !== 'MANAGER')) {
    throw new Error('Unauthorized');
  }

  const policy = await prisma.policy.update({
    where: { id },
    data: { status: 'Published' },
  });

  // 1. Get all employees in the department (or all users if corporate policy)
  const usersToAcknowledge = await prisma.user.findMany({
    where: {
      OR: [
        { departmentId: policy.departmentId },
        { role: 'EMPLOYEE' },
      ],
    },
  });

  // 2. Create acknowledgements in Pending state (only if they don't already exist)
  for (const u of usersToAcknowledge) {
    const existingAck = await prisma.policyAcknowledgement.findFirst({
      where: { policyId: policy.id, userId: u.id },
    });
    if (!existingAck) {
      await prisma.policyAcknowledgement.create({
        data: {
          policyId: policy.id,
          userId: u.id,
          status: 'Pending',
        },
      });
      // Trigger notification
      await createNotification(
        u.id,
        'Policy Acknowledgment Required',
        `A new policy "${policy.title}" has been published. Please review and acknowledge it before the expiry date.`,
        'policy'
      );
    }
  }

  await logActivity(user.id, 'Published Policy', 'Policy', policy.id);
  revalidatePath(`/governance/policies/${id}`);
  revalidatePath('/governance/policies');
  return { success: true };
}

export async function archivePolicy(id: string) {
  const user = await getAuthUser();
  if (!user || (user.role !== 'ADMIN' && user.role !== 'MANAGER')) {
    throw new Error('Unauthorized');
  }

  const policy = await prisma.policy.update({
    where: { id },
    data: { status: 'Archived' },
  });

  await logActivity(user.id, 'Archived Policy', 'Policy', policy.id);
  revalidatePath(`/governance/policies/${id}`);
  revalidatePath('/governance/policies');
  return { success: true };
}

export async function duplicatePolicy(id: string) {
  const user = await getAuthUser();
  if (!user || (user.role !== 'ADMIN' && user.role !== 'MANAGER')) {
    throw new Error('Unauthorized');
  }

  const src = await prisma.policy.findUnique({ where: { id } });
  if (!src) throw new Error('Source policy not found');

  const dup = await prisma.policy.create({
    data: {
      title: `Copy of ${src.title}`,
      description: src.description,
      summary: src.summary,
      categoryId: src.categoryId,
      departmentId: src.departmentId,
      status: 'Draft',
      version: '1.0.0',
      effectiveDate: new Date(),
      expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // +1 year
      pdfUrl: src.pdfUrl,
      createdById: user.id,
    },
  });

  await prisma.policyVersion.create({
    data: {
      policyId: dup.id,
      version: '1.0.0',
      changeLog: `Duplicated from policy ID ${src.id}`,
    },
  });

  await logActivity(user.id, 'Duplicated Policy', 'Policy', dup.id);
  revalidatePath('/governance/policies');
  return dup;
}

export async function getPolicyCategories() {
  return await prisma.policyCategory.findMany({
    orderBy: { name: 'asc' },
  });
}

export async function createPolicyCategory(name: string) {
  return await prisma.policyCategory.create({
    data: { name },
  });
}

// ==========================================
// POLICY ACKNOWLEDGEMENT ACTIONS
// ==========================================

export async function acknowledgePolicy(policyId: string, status: 'Accepted' | 'Rejected') {
  const user = await getAuthUser();
  if (!user) throw new Error('User not found');

  const ack = await prisma.policyAcknowledgement.findFirst({
    where: { policyId, userId: user.id },
  });

  if (!ack) {
    throw new Error('No acknowledgment request found for this policy.');
  }

  const updatedAck = await prisma.policyAcknowledgement.update({
    where: { id: ack.id },
    data: {
      status,
      acceptedAt: status === 'Accepted' ? new Date() : null,
    },
    include: { policy: true },
  });

  // Award user XP & Points if Accepted
  if (status === 'Accepted') {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        xpTotal: { increment: 10 },
        pointsBalance: { increment: 10 },
      },
    });

    await logActivity(user.id, 'Accepted Policy', 'Policy', policyId);
    await createNotification(
      user.id,
      'Policy Acknowledged',
      `Thank you for acknowledging "${updatedAck.policy.title}". You earned 10 XP!`,
      'policy'
    );
  } else {
    await logActivity(user.id, 'Rejected Policy', 'Policy', policyId);
  }

  revalidatePath(`/governance/policies/${policyId}`);
  revalidatePath('/governance/dashboard');
  return updatedAck;
}

export async function sendAcknowledgementReminder(policyId: string, userId: string) {
  const user = await getAuthUser();
  if (!user || (user.role !== 'ADMIN' && user.role !== 'MANAGER')) {
    throw new Error('Unauthorized');
  }

  const target = await prisma.user.findUnique({ where: { id: userId } });
  const policy = await prisma.policy.findUnique({ where: { id: policyId } });
  if (!target || !policy) throw new Error('User or Policy not found');

  await createNotification(
    userId,
    'REMINDER: Policy Acknowledgment Pending',
    `Please review and acknowledge "${policy.title}" as soon as possible.`,
    'policy'
  );

  return { success: true };
}

export async function getEmployeePolicyStats(policyId: string) {
  const acks = await prisma.policyAcknowledgement.findMany({
    where: { policyId },
    include: {
      user: {
        select: {
          name: true,
          email: true,
          department: { select: { name: true } },
        },
      },
    },
  });

  const total = acks.length;
  const accepted = acks.filter((a) => a.status === 'Accepted').length;
  const pending = acks.filter((a) => a.status === 'Pending').length;
  const rejected = acks.filter((a) => a.status === 'Rejected').length;

  const rate = total > 0 ? Math.round((accepted / total) * 100) : 0;

  return { acks, total, accepted, pending, rejected, rate };
}

// ==========================================
// COMPLIANCE TRACKER ACTIONS
// ==========================================

export async function getComplianceRequirements(filters?: { departmentId?: string; priority?: string }) {
  const where: Record<string, unknown> = {};
  if (filters?.departmentId) where.departmentId = filters.departmentId;
  if (filters?.priority) where.priority = filters.priority;

  return await prisma.complianceRequirement.findMany({
    where,
    include: {
      owner: { select: { name: true, email: true } },
      department: true,
      tasks: true,
    },
    orderBy: { dueDate: 'asc' },
  });
}

export async function getComplianceRequirementById(id: string) {
  return await prisma.complianceRequirement.findUnique({
    where: { id },
    include: {
      owner: { select: { id: true, name: true, email: true } },
      department: true,
      tasks: {
        include: {
          assignee: { select: { name: true, email: true } },
        },
      },
    },
  });
}

export async function createComplianceRequirement(input: ComplianceRequirementInput) {
  const user = await getAuthUser();
  if (!user || (user.role !== 'ADMIN' && user.role !== 'MANAGER')) {
    throw new Error('Unauthorized');
  }

  const validated = ComplianceRequirementSchema.parse(input);

  const req = await prisma.complianceRequirement.create({
    data: {
      title: validated.title,
      description: validated.description,
      ownerId: validated.ownerId,
      departmentId: validated.departmentId,
      priority: validated.priority,
      frequency: validated.frequency,
      status: validated.status,
      dueDate: new Date(validated.dueDate),
    },
  });

  await createNotification(
    validated.ownerId,
    'Compliance Assignment',
    `You have been assigned as the owner of the compliance requirement: "${validated.title}"`,
    'compliance'
  );

  await logActivity(user.id, 'Created Compliance Requirement', 'ComplianceRequirement', req.id);
  revalidatePath('/governance/compliance');
  return req;
}

export async function updateComplianceRequirement(id: string, input: ComplianceRequirementInput) {
  const user = await getAuthUser();
  if (!user || (user.role !== 'ADMIN' && user.role !== 'MANAGER')) {
    throw new Error('Unauthorized');
  }

  const validated = ComplianceRequirementSchema.parse(input);

  const req = await prisma.complianceRequirement.update({
    where: { id },
    data: {
      title: validated.title,
      description: validated.description,
      ownerId: validated.ownerId,
      departmentId: validated.departmentId,
      priority: validated.priority,
      frequency: validated.frequency,
      status: validated.status,
      dueDate: new Date(validated.dueDate),
    },
  });

  await logActivity(user.id, 'Updated Compliance Requirement', 'ComplianceRequirement', req.id);
  revalidatePath(`/governance/compliance/${id}`);
  revalidatePath('/governance/compliance');
  return req;
}

export async function deleteComplianceRequirement(id: string) {
  const user = await getAuthUser();
  if (!user || user.role !== 'ADMIN') {
    throw new Error('Only Admins can delete compliance requirements');
  }

  await prisma.complianceRequirement.delete({ where: { id } });
  await logActivity(user.id, 'Deleted Compliance Requirement', 'ComplianceRequirement', id);
  revalidatePath('/governance/compliance');
  return { success: true };
}

export async function createComplianceTask(complianceId: string, data: { assignedTo: string; remarks?: string }) {
  const user = await getAuthUser();
  if (!user || (user.role !== 'ADMIN' && user.role !== 'MANAGER')) {
    throw new Error('Unauthorized');
  }

  const task = await prisma.complianceTask.create({
    data: {
      complianceId,
      assignedTo: data.assignedTo,
      remarks: data.remarks || '',
    },
  });

  // Notify assignee
  await createNotification(
    data.assignedTo,
    'Compliance Task Assigned',
    `You have been assigned a new compliance task under requirement ID ${complianceId}.`,
    'compliance'
  );

  revalidatePath(`/governance/compliance/${complianceId}`);
  return task;
}

export async function completeComplianceTask(taskId: string, remarks?: string) {
  const user = await getAuthUser();
  if (!user) throw new Error('User not found');

  const task = await prisma.complianceTask.update({
    where: { id: taskId },
    data: {
      completedAt: new Date(),
      remarks: remarks || 'Completed task',
    },
  });

  // Recalculate Compliance Requirement status if all tasks are completed
  const siblingTasks = await prisma.complianceTask.findMany({
    where: { complianceId: task.complianceId },
  });

  const allCompleted = siblingTasks.every((t) => t.completedAt !== null);
  if (allCompleted) {
    await prisma.complianceRequirement.update({
      where: { id: task.complianceId },
      data: { status: 'Completed' },
    });
  } else {
    await prisma.complianceRequirement.update({
      where: { id: task.complianceId },
      data: { status: 'In Progress' },
    });
  }

  revalidatePath(`/governance/compliance/${task.complianceId}`);
  revalidatePath('/governance/compliance');
  return task;
}

export async function getComplianceStats() {
  const requirements = await prisma.complianceRequirement.findMany({
    include: { department: true },
  });

  const total = requirements.length;
  const completed = requirements.filter((r) => r.status === 'Completed').length;
  const inProgress = requirements.filter((r) => r.status === 'In Progress').length;
  const overdue = requirements.filter((r) => r.status === 'Overdue' || (r.status !== 'Completed' && new Date(r.dueDate) < new Date())).length;
  const pending = total - completed - inProgress - overdue;

  const score = total > 0 ? Math.round((completed / total) * 100) : 100;

  // Department comparisons
  const depts = await prisma.department.findMany();
  const deptComparisons = depts.map((d) => {
    const deptReqs = requirements.filter((r) => r.departmentId === d.id);
    const dTotal = deptReqs.length;
    const dCompleted = deptReqs.filter((r) => r.status === 'Completed').length;
    const dScore = dTotal > 0 ? Math.round((dCompleted / dTotal) * 100) : 100;
    return {
      department: d.name,
      completed: dCompleted,
      total: dTotal,
      score: dScore,
    };
  });

  return { total, completed, inProgress, overdue, pending, score, deptComparisons };
}

// ==========================================
// INTERNAL AUDIT ACTIONS
// ==========================================

export async function getAudits(filters?: { departmentId?: string; status?: string }) {
  const where: Record<string, unknown> = {};
  if (filters?.departmentId) where.departmentId = filters.departmentId;
  if (filters?.status) where.status = filters.status;

  return await prisma.audit.findMany({
    where,
    include: {
      department: true,
      auditor: { select: { name: true, email: true } },
      findings: true,
    },
    orderBy: { auditDate: 'desc' },
  });
}

export async function getAuditById(id: string) {
  return await prisma.audit.findUnique({
    where: { id },
    include: {
      department: true,
      auditor: { select: { id: true, name: true, email: true } },
      findings: {
        include: {
          assignee: { select: { id: true, name: true, email: true } },
        },
      },
    },
  });
}

export async function createAudit(input: AuditInput) {
  const user = await getAuthUser();
  if (!user || (user.role !== 'ADMIN' && user.role !== 'MANAGER')) {
    throw new Error('Unauthorized');
  }

  const validated = AuditSchema.parse(input);

  const audit = await prisma.audit.create({
    data: {
      title: validated.title,
      departmentId: validated.departmentId,
      auditorId: validated.auditorId,
      auditDate: new Date(validated.auditDate),
      status: validated.status,
      riskLevel: validated.riskLevel,
      overallScore: validated.overallScore || null,
      recommendation: validated.recommendation || '',
      summary: validated.summary || '',
    },
  });

  // Notify auditor
  await createNotification(
    validated.auditorId,
    'New Audit Scheduled',
    `You have been scheduled to audit "${validated.title}" for department ID ${validated.departmentId} on ${new Date(validated.auditDate).toLocaleDateString()}`,
    'audit'
  );

  await logActivity(user.id, 'Scheduled Audit', 'Audit', audit.id);
  revalidatePath('/governance/audits');
  return audit;
}

export async function updateAudit(id: string, input: AuditInput) {
  const user = await getAuthUser();
  if (!user || (user.role !== 'ADMIN' && user.role !== 'MANAGER')) {
    throw new Error('Unauthorized');
  }

  const validated = AuditSchema.parse(input);

  const audit = await prisma.audit.update({
    where: { id },
    data: {
      title: validated.title,
      departmentId: validated.departmentId,
      auditorId: validated.auditorId,
      auditDate: new Date(validated.auditDate),
      status: validated.status,
      riskLevel: validated.riskLevel,
      overallScore: validated.overallScore || null,
      recommendation: validated.recommendation || '',
      summary: validated.summary || '',
    },
  });

  await logActivity(user.id, 'Updated Audit details', 'Audit', audit.id);
  revalidatePath(`/governance/audits/${id}`);
  revalidatePath('/governance/audits');
  return audit;
}

export async function deleteAudit(id: string) {
  const user = await getAuthUser();
  if (!user || user.role !== 'ADMIN') {
    throw new Error('Only admins can delete audits');
  }

  await prisma.audit.delete({ where: { id } });
  await logActivity(user.id, 'Deleted Audit', 'Audit', id);
  revalidatePath('/governance/audits');
  return { success: true };
}

export async function addAuditFinding(auditId: string, data: { title: string; description: string; severity: string; assignedTo: string }) {
  const user = await getAuthUser();
  if (!user || (user.role !== 'ADMIN' && user.role !== 'MANAGER')) {
    throw new Error('Unauthorized');
  }

  const finding = await prisma.auditFinding.create({
    data: {
      auditId,
      title: data.title,
      description: data.description,
      severity: data.severity,
      assignedTo: data.assignedTo,
      status: 'Open',
    },
  });

  // Notify assignee
  await createNotification(
    data.assignedTo,
    'Critical Audit Finding Assigned',
    `You have been assigned a finding: "${data.title}" from Audit ID ${auditId}. Action required.`,
    'audit'
  );

  await logActivity(user.id, 'Created Audit Finding', 'AuditFinding', finding.id);
  revalidatePath(`/governance/audits/${auditId}`);
  return finding;
}

export async function resolveAuditFinding(findingId: string) {
  const user = await getAuthUser();
  if (!user) throw new Error('User not authenticated');

  const finding = await prisma.auditFinding.update({
    where: { id: findingId },
    data: {
      status: 'Resolved',
      resolvedAt: new Date(),
    },
  });

  await logActivity(user.id, 'Resolved Audit Finding', 'AuditFinding', findingId);
  revalidatePath(`/governance/audits/${finding.auditId}`);
  return finding;
}

export async function getAuditStats() {
  const audits = await prisma.audit.findMany({
    include: { findings: true },
  });

  const total = audits.length;
  const completed = audits.filter((a) => a.status === 'Completed').length;
  const scheduled = audits.filter((a) => a.status === 'Scheduled').length;
  const inProgress = audits.filter((a) => a.status === 'In Progress' || a.status === 'Running').length;
  const cancelled = audits.filter((a) => a.status === 'Cancelled').length;

  const scoreAudits = audits.filter((a) => a.overallScore !== null);
  const avgScore = scoreAudits.length > 0
    ? Math.round(scoreAudits.reduce((acc, curr) => acc + (curr.overallScore || 0), 0) / scoreAudits.length)
    : 0;

  const findings = await prisma.auditFinding.findMany();
  const highRiskFindings = findings.filter((f) => f.status !== 'Resolved' && (f.severity === 'Critical' || f.severity === 'High')).length;

  return { total, completed, scheduled, inProgress, cancelled, avgScore, highRiskFindings };
}

// ==========================================
// RISK ASSESSMENT ACTIONS
// ==========================================

export async function getRiskAssessments() {
  return await prisma.riskAssessment.findMany({
    include: {
      department: true,
      owner: { select: { name: true, email: true } },
    },
    orderBy: { riskLevel: 'desc' },
  });
}

export async function createRiskAssessment(input: RiskAssessmentInput) {
  const user = await getAuthUser();
  if (!user || (user.role !== 'ADMIN' && user.role !== 'MANAGER')) {
    throw new Error('Unauthorized');
  }

  const validated = RiskAssessmentSchema.parse(input);

  const risk = await prisma.riskAssessment.create({
    data: {
      departmentId: validated.departmentId,
      title: validated.title,
      description: validated.description,
      riskLevel: validated.riskLevel,
      mitigationPlan: validated.mitigationPlan || '',
      ownerId: validated.ownerId,
      impact: validated.impact,
      probability: validated.probability,
      status: validated.status || 'Open',
    },
  });

  await createNotification(
    validated.ownerId,
    'Assigned as Risk Owner',
    `You have been assigned as the owner of the risk assessment: "${validated.title}"`,
    'risk'
  );

  await logActivity(user.id, 'Logged Risk Assessment', 'RiskAssessment', risk.id);
  revalidatePath('/governance/risks');
  return risk;
}

export async function updateRiskAssessment(id: string, input: RiskAssessmentInput) {
  const user = await getAuthUser();
  if (!user || (user.role !== 'ADMIN' && user.role !== 'MANAGER')) {
    throw new Error('Unauthorized');
  }

  const validated = RiskAssessmentSchema.parse(input);

  const risk = await prisma.riskAssessment.update({
    where: { id },
    data: {
      departmentId: validated.departmentId,
      title: validated.title,
      description: validated.description,
      riskLevel: validated.riskLevel,
      mitigationPlan: validated.mitigationPlan || '',
      ownerId: validated.ownerId,
      impact: validated.impact,
      probability: validated.probability,
      status: validated.status || 'Open',
    },
  });

  await logActivity(user.id, 'Updated Risk Assessment', 'RiskAssessment', risk.id);
  revalidatePath('/governance/risks');
  return risk;
}

export async function deleteRiskAssessment(id: string) {
  const user = await getAuthUser();
  if (!user || user.role !== 'ADMIN') {
    throw new Error('Only admins can delete risk assessments');
  }

  await prisma.riskAssessment.delete({ where: { id } });
  await logActivity(user.id, 'Deleted Risk Assessment', 'RiskAssessment', id);
  revalidatePath('/governance/risks');
  return { success: true };
}

export async function getRiskStats() {
  const risks = await prisma.riskAssessment.findMany();

  const total = risks.length;
  const critical = risks.filter((r) => r.riskLevel === 'Critical').length;
  const high = risks.filter((r) => r.riskLevel === 'High').length;
  const medium = risks.filter((r) => r.riskLevel === 'Medium').length;
  const low = risks.filter((r) => r.riskLevel === 'Low').length;

  // Create standard matrix map: impact (Low/Medium/High) x probability (Low/Medium/High)
  const matrix: Record<string, Record<string, number>> = {
    High: { Low: 0, Medium: 0, High: 0 },
    Medium: { Low: 0, Medium: 0, High: 0 },
    Low: { Low: 0, Medium: 0, High: 0 },
  };

  risks.forEach((r) => {
    const imp = r.impact || 'Medium';
    const prob = r.probability || 'Medium';
    if (matrix[imp] && matrix[imp][prob] !== undefined) {
      matrix[imp][prob]++;
    }
  });

  return { total, critical, high, medium, low, matrix };
}

// ==========================================
// GOVERNANCE REPORTS ACTIONS
// ==========================================

export async function getReports() {
  return await prisma.report.findMany({
    include: {
      creator: { select: { name: true, email: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function generateReport(data: { title: string; type: string; format: string; departmentId?: string }) {
  const user = await getAuthUser();
  if (!user || (user.role !== 'ADMIN' && user.role !== 'MANAGER')) {
    throw new Error('Unauthorized');
  }

  const report = await prisma.report.create({
    data: {
      title: data.title,
      type: data.type,
      format: data.format,
      status: 'Generated',
      url: `/api/reports/download?t=${Date.now()}`,
      departmentId: data.departmentId || null,
      createdById: user.id,
    },
  });

  await logActivity(user.id, `Generated ${data.type} Report`, 'Report', report.id);
  revalidatePath('/governance/reports');
  return report;
}

export async function deleteReport(id: string) {
  const user = await getAuthUser();
  if (!user || user.role !== 'ADMIN') {
    throw new Error('Unauthorized');
  }

  await prisma.report.delete({ where: { id } });
  await logActivity(user.id, 'Deleted Report', 'Report', id);
  revalidatePath('/governance/reports');
  return { success: true };
}

// ==========================================
// NOTIFICATIONS ACTIONS
// ==========================================

export async function getNotifications() {
  const user = await getAuthUser();
  if (!user) return [];

  return await prisma.notification.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
  });
}

export async function markNotificationRead(id: string) {
  await prisma.notification.update({
    where: { id },
    data: { isRead: true },
  });

  revalidatePath('/governance/notifications');
  return { success: true };
}

export async function deleteNotification(id: string) {
  await prisma.notification.delete({ where: { id } });
  revalidatePath('/governance/notifications');
  return { success: true };
}

export async function getUnreadNotificationCount() {
  const user = await getAuthUser();
  if (!user) return 0;

  return await prisma.notification.count({
    where: { userId: user.id, isRead: false },
  });
}

// ==========================================
// ACTIVITY LOG ACTIONS
// ==========================================

export async function getActivityLogs(filters?: {
  search?: string;
  userId?: string;
  entity?: string;
  page?: number;
  limit?: number;
}) {
  const page = filters?.page || 1;
  const limit = filters?.limit || 20;
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {};
  if (filters?.userId) where.userId = filters.userId;
  if (filters?.entity) where.entity = filters.entity;
  if (filters?.search) {
    where.OR = [
      { action: { contains: filters.search, mode: 'insensitive' } },
      { entity: { contains: filters.search, mode: 'insensitive' } },
      { user: { name: { contains: filters.search, mode: 'insensitive' } } },
    ];
  }

  const [logs, total] = await Promise.all([
    prisma.activityLog.findMany({
      where,
      include: {
        user: { select: { name: true, email: true, role: true } },
      },
      orderBy: { timestamp: 'desc' },
      skip,
      take: limit,
    }),
    prisma.activityLog.count({ where }),
  ]);

  return { logs, total, page, totalPages: Math.ceil(total / limit) };
}

// ==========================================
// DUMMY SEED DATA ACTION
// ==========================================

export async function seedGovernanceData() {
  const user = await getAuthUser();
  if (!user) throw new Error('System user context missing');

  // 1. Fetch Departments or create them
  let depts = await prisma.department.findMany();
  if (depts.length === 0) {
    const list = [
      { name: 'Finance & Compliance', code: 'FIN', head: 'Marcus Vance' },
      { name: 'Human Resources', code: 'HR', head: 'Sarah K.' },
      { name: 'Information Technology', code: 'IT', head: 'Dave Miller' },
      { name: 'Operations & Production', code: 'OPS', head: 'Elena Rostova' },
      { name: 'Legal & Policy', code: 'LEG', head: 'Rachel Ross' },
    ];
    for (const d of list) {
      await prisma.department.create({ data: { name: d.name, code: d.code, head: d.head, status: 'Active' } });
    }
    depts = await prisma.department.findMany();
  }

  // 2. Clean Governance Tables
  await prisma.activityLog.deleteMany({});
  await prisma.notification.deleteMany({});
  await prisma.report.deleteMany({});
  await prisma.riskAssessment.deleteMany({});
  await prisma.auditFinding.deleteMany({});
  await prisma.audit.deleteMany({});
  await prisma.complianceTask.deleteMany({});
  await prisma.complianceRequirement.deleteMany({});
  await prisma.policyAcknowledgement.deleteMany({});
  await prisma.policyVersion.deleteMany({});
  await prisma.policy.deleteMany({});
  await prisma.policyCategory.deleteMany({});

  // 3. Create Policy Categories
  const categories = ['Regulatory Compliance', 'Information Security', 'Employee Welfare', 'Environmental Policy', 'Corporate Governance'];
  const dbCats = [];
  for (const catName of categories) {
    const cat = await prisma.policyCategory.create({ data: { name: catName } });
    dbCats.push(cat);
  }

  // 4. Create Users (10 Employees, 3 Managers, 1 Admin)
  const users = await prisma.user.findMany();
  const seededUsers = [];
  if (users.length < 14) {
    // Delete duplicate seeded ones to reseed perfectly
    await prisma.user.deleteMany({ where: { email: { contains: '@ecosphere.demo' } } });

    // Seed Admin
    const admin = await prisma.user.create({
      data: {
        name: 'John Doe (Admin)',
        email: 'admin@ecosphere.demo',
        password: 'password123',
        role: 'ADMIN',
        departmentId: depts[0].id,
      },
    });
    seededUsers.push(admin);

    // Seed Managers
    for (let i = 0; i < 3; i++) {
      const mgr = await prisma.user.create({
        data: {
          name: `Manager ${i + 1}`,
          email: `manager${i + 1}@ecosphere.demo`,
          password: 'password123',
          role: 'MANAGER',
          departmentId: depts[i % depts.length].id,
        },
      });
      seededUsers.push(mgr);
    }

    // Seed Employees
    for (let i = 0; i < 10; i++) {
      const emp = await prisma.user.create({
        data: {
          name: `Employee ${i + 1}`,
          email: `employee${i + 1}@ecosphere.demo`,
          password: 'password123',
          role: 'EMPLOYEE',
          departmentId: depts[(i + 1) % depts.length].id,
        },
      });
      seededUsers.push(emp);
    }
  } else {
    seededUsers.push(...users);
  }

  const adminUser = seededUsers.find((u) => u.role === 'ADMIN') || seededUsers[0];
  const managers = seededUsers.filter((u) => u.role === 'MANAGER');
  const employees = seededUsers.filter((u) => u.role === 'EMPLOYEE');

  // 5. Seed 25 Policies
  const policiesData = [
    { title: 'Code of Business Conduct', catIndex: 4, deptIndex: 4, status: 'Published', version: '2.1.0' },
    { title: 'Information Security Management Policy', catIndex: 1, deptIndex: 2, status: 'Published', version: '1.4.0' },
    { title: 'Waste Disposal & Reduction Policy', catIndex: 3, deptIndex: 3, status: 'Published', version: '1.0.0' },
    { title: 'Anti-Bribery and Corruption Directive', catIndex: 0, deptIndex: 0, status: 'Published', version: '3.0.0' },
    { title: 'Whistleblower Protection Policy', catIndex: 4, deptIndex: 4, status: 'Published', version: '1.2.0' },
    { title: 'Equal Employment Opportunity Guidelines', catIndex: 2, deptIndex: 1, status: 'Published', version: '1.0.0' },
    { title: 'Carbon Emissions Reduction Plan', catIndex: 3, deptIndex: 3, status: 'Published', version: '2.0.0' },
    { title: 'Data Privacy Policy (GDPR Compliance)', catIndex: 0, deptIndex: 2, status: 'Published', version: '1.1.0' },
    { title: 'Supplier Code of Conduct Guidelines', catIndex: 4, deptIndex: 3, status: 'Published', version: '1.0.0' },
    { title: 'Employee Remote Work & Safety Standard', catIndex: 2, deptIndex: 1, status: 'Published', version: '1.2.1' },
    { title: 'Water Stewardship Program Policy', catIndex: 3, deptIndex: 3, status: 'Draft', version: '0.9.0' },
    { title: 'Diversity & Inclusion Charter', catIndex: 2, deptIndex: 1, status: 'Published', version: '1.1.0' },
    { title: 'Audit Committee Charter', catIndex: 4, deptIndex: 0, status: 'Published', version: '1.0.0' },
    { title: 'Conflict of Interest Statement', catIndex: 4, deptIndex: 4, status: 'Published', version: '2.0.0' },
    { title: 'Sustainable Procurement Standards', catIndex: 3, deptIndex: 3, status: 'Draft', version: '1.0.0' },
    { title: 'Human Rights Policy Statement', catIndex: 2, deptIndex: 4, status: 'Published', version: '1.0.0' },
    { title: 'Physical Security and Asset Protection', catIndex: 1, deptIndex: 2, status: 'Published', version: '1.5.0' },
    { title: 'Enterprise Risk Management Policy', catIndex: 4, deptIndex: 0, status: 'Published', version: '2.2.0' },
    { title: 'Emergency Response and Continuity Plan', catIndex: 2, deptIndex: 3, status: 'Published', version: '1.0.0' },
    { title: 'ESG Disclosure Controls and Procedures', catIndex: 0, deptIndex: 0, status: 'Published', version: '1.2.0' },
    { title: 'Health and Well-being Standard', catIndex: 2, deptIndex: 1, status: 'Archived', version: '1.0.0' },
    { title: 'Social Media Use Guidelines', catIndex: 2, deptIndex: 1, status: 'Published', version: '1.0.0' },
    { title: 'Trade Sanctions Compliance Directive', catIndex: 0, deptIndex: 0, status: 'Draft', version: '0.1.0' },
    { title: 'E-Waste Recycling Protocol', catIndex: 3, deptIndex: 2, status: 'Published', version: '1.0.0' },
    { title: 'Intellectual Property Protection Standard', catIndex: 1, deptIndex: 4, status: 'Published', version: '1.3.0' },
  ];

  for (let i = 0; i < policiesData.length; i++) {
    const pd = policiesData[i];
    const cat = dbCats[pd.catIndex];
    const dept = depts[pd.deptIndex];

    const policy = await prisma.policy.create({
      data: {
        title: pd.title,
        description: `This policy outlines the principles, responsibilities, and procedural requirements for managing ${pd.title} across all organizational units. It provides a standard operating procedure to enforce alignment with ESG requirements.`,
        summary: `Summary guidelines of the ${pd.title}. This includes department-wide standards, mandatory checks, and compliance rules.`,
        categoryId: cat.id,
        departmentId: dept.id,
        status: pd.status,
        version: pd.version,
        effectiveDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
        expiryDate: new Date(Date.now() + 335 * 24 * 60 * 60 * 1000), // ~11 months from now
        pdfUrl: `/assets/policies/${pd.title.toLowerCase().replace(/\s+/g, '-')}.pdf`,
        createdById: adminUser.id,
      },
    });

    // Seed versions
    await prisma.policyVersion.create({
      data: {
        policyId: policy.id,
        version: '1.0.0',
        changeLog: 'Initial release of policy guidelines.',
        createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
      },
    });

    if (pd.version !== '1.0.0') {
      await prisma.policyVersion.create({
        data: {
          policyId: policy.id,
          version: pd.version,
          changeLog: `Major enhancements and additions, upgrading to ${pd.version}.`,
          createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        },
      });
    }

    // Seed Acknowledgements if Published
    if (pd.status === 'Published') {
      // Loop users
      for (const u of seededUsers) {
        // Deterministic state: Employees acknowledge, Managers acknowledge, but we leave some Pending to show in UI
        let status = 'Accepted';
        let acceptedAt: Date | null = new Date(Date.now() - Math.floor(Math.random() * 15) * 24 * 60 * 60 * 1000);
        if (Math.random() < 0.25) {
          status = 'Pending';
          acceptedAt = null;
        } else if (Math.random() < 0.05) {
          status = 'Rejected';
          acceptedAt = null;
        }

        await prisma.policyAcknowledgement.create({
          data: {
            policyId: policy.id,
            userId: u.id,
            status,
            acceptedAt,
          },
        });
      }
    }
  }

  // 6. Seed 40 Compliance Requirements / Tasks
  const complianceData = [
    { title: 'EPA Boiler 3 Gas Emission Verification', priority: 'High', freq: 'Monthly' },
    { title: 'GDPR Data Subject Access Request Audit', priority: 'Critical', freq: 'Quarterly' },
    { title: 'Annual Financial Disclosure Audit', priority: 'Critical', freq: 'Yearly' },
    { title: 'Carbon Budget Department Review', priority: 'High', freq: 'Monthly' },
    { title: 'Chemical Waste Logistics Tracking', priority: 'High', freq: 'Weekly' },
    { title: 'Equal Pay Opportunity Wage Survey', priority: 'Medium', freq: 'Yearly' },
    { title: 'Office HVAC Energy Audit', priority: 'Low', freq: 'Quarterly' },
    { title: 'Anti-Bribery Employee Training Verification', priority: 'Critical', freq: 'Yearly' },
  ];

  for (let i = 0; i < 40; i++) {
    const cd = complianceData[i % complianceData.length];
    const dept = depts[i % depts.length];
    const owner = seededUsers[i % seededUsers.length];

    const req = await prisma.complianceRequirement.create({
      data: {
        title: `${cd.title} (Cycle ${Math.floor(i / complianceData.length) + 1})`,
        description: `Ensure complete regulatory alignment and audit readiness for ${cd.title}. Maintain all relevant paperwork, records, and ERP entries.`,
        ownerId: owner.id,
        departmentId: dept.id,
        priority: cd.priority,
        frequency: cd.freq,
        status: i % 4 === 0 ? 'Completed' : i % 4 === 1 ? 'In Progress' : i % 4 === 2 ? 'Pending' : 'Overdue',
        dueDate: i % 4 === 3 ? new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) : new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // past if overdue, else future
      },
    });

    // Create tasks
    const taskAssignees = employees.slice(0, 3);
    for (let t = 0; t < taskAssignees.length; t++) {
      await prisma.complianceTask.create({
        data: {
          complianceId: req.id,
          assignedTo: taskAssignees[t].id,
          completedAt: req.status === 'Completed' ? new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) : null,
          remarks: req.status === 'Completed' ? 'Task completed successfully.' : null,
        },
      });
    }
  }

  // 7. Seed 15 Audits & Findings
  const auditData = [
    { title: 'Scope 1 Emissions Audit', risk: 'High', status: 'Completed', score: 88 },
    { title: 'ISO 14001 Waste Compliance Review', risk: 'Critical', status: 'Completed', score: 94 },
    { title: 'Information Security Governance Audit', risk: 'Critical', status: 'In Progress', score: null },
    { title: 'HR Equal Opportunity & Pay Audit', risk: 'Medium', status: 'Scheduled', score: null },
    { title: 'Fleet Energy Efficiency Valuation', risk: 'Low', status: 'Cancelled', score: null },
  ];

  for (let i = 0; i < 15; i++) {
    const ad = auditData[i % auditData.length];
    const dept = depts[i % depts.length];
    const auditor = managers[i % managers.length] || adminUser;

    const audit = await prisma.audit.create({
      data: {
        title: `${ad.title} (H1-2026-${i})`,
        departmentId: dept.id,
        auditorId: auditor.id,
        auditDate: new Date(Date.now() + (i - 7) * 10 * 24 * 60 * 60 * 1000),
        status: ad.status,
        riskLevel: ad.risk,
        overallScore: ad.score,
        recommendation: 'Ensure all staff complete the mandatory compliance training and report log variances promptly.',
        summary: 'General inspection conducted across site processes. Minor compliance checks succeeded, though warning indicators remain for some machinery.',
      },
    });

    // Add findings for completed or in-progress audits
    if (ad.status !== 'Scheduled' && ad.status !== 'Cancelled') {
      await prisma.auditFinding.create({
        data: {
          auditId: audit.id,
          title: 'Machinery Log Variance Exceeded',
          description: 'Observed logs for Boilers showing a variance exceeding the standard allowable 5% threshold.',
          severity: 'High',
          status: 'Open',
          assignedTo: employees[i % employees.length].id,
        },
      });

      await prisma.auditFinding.create({
        data: {
          auditId: audit.id,
          title: 'Incorrect Waste Bin Labelling',
          description: 'Recyclables mixed with solid waste on the third floor cafeteria area.',
          severity: 'Low',
          status: 'Resolved',
          assignedTo: employees[(i + 1) % employees.length].id,
          resolvedAt: new Date(),
        },
      });
    }
  }

  // 8. Seed 20 Risk Assessments
  const riskAssessmentsData = [
    { title: 'Grid Blackout / Power Outage', risk: 'High', imp: 'High', prob: 'Medium' },
    { title: 'GDPR Compliance Breach / Data Leak', risk: 'Critical', imp: 'High', prob: 'High' },
    { title: 'Supply Chain Shipping Delays', risk: 'Medium', imp: 'Medium', prob: 'Medium' },
    { title: 'Boiler Leak / Environmental Spill', risk: 'High', imp: 'High', prob: 'Low' },
    { title: 'Workplace Injury / Staff Health Risk', risk: 'Critical', imp: 'High', prob: 'Medium' },
    { title: 'Social Media Backlash / PR Crisis', risk: 'Low', imp: 'Low', prob: 'Medium' },
  ];

  for (let i = 0; i < 20; i++) {
    const rd = riskAssessmentsData[i % riskAssessmentsData.length];
    const dept = depts[i % depts.length];
    const owner = managers[i % managers.length] || adminUser;

    await prisma.riskAssessment.create({
      data: {
        departmentId: dept.id,
        title: rd.title,
        description: `Assessment of risk concerning potential events of ${rd.title}. Failure could interrupt manufacturing operations and compromise ESG goals.`,
        riskLevel: rd.risk,
        mitigationPlan: `Enact redundancy systems. Ensure all staff are trained in contingency protocols. Conduct monthly validation exercises.`,
        ownerId: owner.id,
        impact: rd.imp,
        probability: rd.prob,
        status: i % 3 === 0 ? 'Mitigated' : 'Open',
      },
    });
  }

  // 9. Seed 30 Notifications
  for (let i = 0; i < 30; i++) {
    const u = seededUsers[i % seededUsers.length];
    await prisma.notification.create({
      data: {
        userId: u.id,
        title: i % 3 === 0 ? 'Policy Update Published' : i % 3 === 1 ? 'Audit Scheduled' : 'Compliance Task Alert',
        message: `System notification context details for task item ${i + 1}. Action may be required.`,
        type: i % 3 === 0 ? 'policy' : i % 3 === 1 ? 'audit' : 'compliance',
        isRead: i % 4 === 0,
      },
    });
  }

  // 10. Seed 100 Activity Logs
  const actionsList = [
    { action: 'Created Policy', entity: 'Policy' },
    { action: 'Edited Policy', entity: 'Policy' },
    { action: 'Published Policy', entity: 'Policy' },
    { action: 'Accepted Policy', entity: 'Policy' },
    { action: 'Created Audit', entity: 'Audit' },
    { action: 'Completed Audit', entity: 'Audit' },
    { action: 'Updated Compliance', entity: 'ComplianceRequirement' },
    { action: 'Created Risk Assessment', entity: 'RiskAssessment' },
  ];

  for (let i = 0; i < 100; i++) {
    const act = actionsList[i % actionsList.length];
    const u = seededUsers[i % seededUsers.length];

    await prisma.activityLog.create({
      data: {
        userId: u.id,
        action: act.action,
        entity: act.entity,
        entityId: `entity_${i}`,
        timestamp: new Date(Date.now() - i * 2 * 3600 * 1000), // spread out
      },
    });
  }

  revalidatePath('/', 'layout');
  return { success: true, message: 'Successfully seeded 25 policies, 40 compliance requirements, 15 audits, 20 risk assessments, 30 notifications, and 100 activity logs!' };
}
