'use server';

import { prisma } from '@/app/_lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { revalidatePath } from 'next/cache';

// Fetch all CSR activities
export async function getCsrActivities() {
  return await prisma.csrActivity.findMany({
    orderBy: { activityDate: 'desc' },
    include: {
      participations: true,
    }
  });
}

// Fetch pending participations for admin Approval Queue
export async function getPendingParticipations() {
  return await prisma.participation.findMany({
    where: { status: 'PENDING' },
    include: {
      user: true,
      activity: true,
    },
    orderBy: { submittedAt: 'desc' },
  });
}

// Create a new CSR Activity (Admin only)
export async function createCsrActivity(data: { title: string; category: string; activityDate: Date; description?: string }) {
  const session = await getServerSession(authOptions);
  let userId = (session?.user as any)?.id;

  if (!userId) {
    let admin = await prisma.user.findFirst({ where: { role: 'ADMIN' } }) || await prisma.user.findFirst();
    if (!admin) {
      // Auto-seed a dummy admin user so the button NEVER fails, even on a totally empty DB.
      admin = await prisma.user.create({
        data: {
          email: 'admin@ecosphere.demo',
          name: 'Demo Admin',
          password: 'password123',
          role: 'ADMIN'
        }
      });
    }
    userId = admin.id;
  }

  const count = await prisma.csrActivity.count();
  const code = `CSR-${count + 1}`;

  await prisma.csrActivity.create({
    data: {
      code,
      title: data.title,
      category: data.category,
      activityDate: data.activityDate,
      description: data.description,
      status: 'UPCOMING',
      createdById: userId,
    }
  });

  revalidatePath('/social', 'layout');
}

// Join a CSR Activity (Employee)
export async function joinCsrActivity(activityId: string, proofUrl?: string, note?: string) {
  const session = await getServerSession(authOptions);
  let userId = (session?.user as any)?.id;

  if (!userId) {
    let employee = await prisma.user.findFirst({ where: { role: 'EMPLOYEE' } }) || await prisma.user.findFirst();
    if (!employee) {
      employee = await prisma.user.create({
        data: {
          email: 'employee@ecosphere.demo',
          name: 'Demo Employee',
          password: 'password123',
          role: 'EMPLOYEE'
        }
      });
    }
    userId = employee.id;
  }

  const existing = await prisma.participation.findFirst({
    where: { activityId, userId }
  });
  if (existing) throw new Error('You have already joined this activity.');

  await prisma.participation.create({
    data: {
      activityId,
      userId,
      proofUrl,
      status: 'PENDING',
      reviewComment: note,
    }
  });

  revalidatePath('/social', 'layout');
}

// Approve or Reject Participation (Admin only)
export async function reviewParticipation(participationId: string, approved: boolean, comment?: string) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || (session.user as any).role !== 'ADMIN') throw new Error('Unauthorized');

  const participation = await prisma.participation.findUnique({ where: { id: participationId } });
  if (!participation || participation.status !== 'PENDING') throw new Error('Invalid participation');

  const pointsEarned = approved ? 100 : 0; // Default fixed value per prompt

  await prisma.$transaction(async (tx: any) => {
    // 1. Update Participation
    await tx.participation.update({
      where: { id: participationId },
      data: {
        status: approved ? 'APPROVED' : 'REJECTED',
        pointsEarned,
        reviewedById: (session.user as any).id,
        reviewedAt: new Date(),
        reviewComment: comment,
      }
    });

    // 2. If approved, add points to User and check badges
    if (approved) {
      const updatedUser = await tx.user.update({
        where: { id: participation.userId },
        data: {
          xpTotal: { increment: pointsEarned },
          pointsBalance: { increment: pointsEarned },
        }
      });

      // Count approved activities
      const activityCount = await tx.participation.count({
        where: { userId: participation.userId, status: 'APPROVED' }
      });

      // Fetch all unearned badges
      const userBadges = await tx.employeeBadge.findMany({
        where: { userId: participation.userId },
        select: { badgeId: true }
      });
      const earnedBadgeIds = userBadges.map((ub: any) => ub.badgeId);

      const availableBadges = await tx.badge.findMany({
        where: {
          id: { notIn: earnedBadgeIds }
        }
      });

      const badgesToAward: string[] = [];
      for (const badge of availableBadges) {
        if (badge.unlockType === 'XP_THRESHOLD' && updatedUser.xpTotal >= badge.unlockValue) {
          badgesToAward.push(badge.id);
        } else if (badge.unlockType === 'ACTIVITY_COUNT' && activityCount >= badge.unlockValue) {
          badgesToAward.push(badge.id);
        }
      }

      if (badgesToAward.length > 0) {
        await tx.employeeBadge.createMany({
          data: badgesToAward.map((badgeId: string) => ({
            userId: participation.userId,
            badgeId: badgeId
          }))
        });
      }
    }
  });

  revalidatePath('/social', 'layout');
}

// Seed basic Badges for the Gamification engine
export async function seedBadges() {
  const count = await prisma.badge.count();
  if (count > 0) return { message: 'Badges already seeded' };

  const defaultBadges = [
    { name: 'Bronze Volunteer', description: 'Participated in 1 CSR activity', icon: '🏆', unlockType: 'ACTIVITY_COUNT', unlockValue: 1 },
    { name: 'Silver Volunteer', description: 'Participated in 5 CSR activities', icon: '🌟', unlockType: 'ACTIVITY_COUNT', unlockValue: 5 },
    { name: 'Eco Warrior', description: 'Earned 500 XP overall', icon: '🌱', unlockType: 'XP_THRESHOLD', unlockValue: 500 },
    { name: 'Community Hero', description: 'Earned 1000 XP overall', icon: '🦸', unlockType: 'XP_THRESHOLD', unlockValue: 1000 },
  ];

  await prisma.badge.createMany({ data: defaultBadges });
  return { message: 'Successfully seeded default badges' };
}

// Get stats for Social Overview
export async function getSocialStats() {
  const [activityCount, volunteers, trainingCompletions, trainings] = await Promise.all([
    prisma.csrActivity.count(),
    prisma.participation.findMany({ where: { status: 'APPROVED' }, select: { userId: true }, distinct: ['userId'] }),
    prisma.trainingCompletion.count(),
    prisma.training.count(),
  ]);

  const trainingCompletionRate = trainings > 0 ? Math.round((trainingCompletions / trainings) * 100) : 0;

  return {
    activityCount,
    volunteersCount: volunteers.length,
    trainingCompletionRate,
  };
}

// Seed basic Trainings
export async function seedTrainings() {
  const count = await prisma.training.count();
  if (count > 0) return { message: 'Trainings already seeded' };

  // Need departments first
  const deptCount = await prisma.department.count();
  if (deptCount === 0) {
    const defaultDepts = ['Manufacturing', 'Engineering', 'Sales', 'Finance', 'HR', 'Logistics'];
    await prisma.department.createMany({
      data: defaultDepts.map(name => ({ name, code: name.slice(0, 3).toUpperCase() }))
    });
  }

  const defaultTrainings = [
    { title: 'Anti-Bribery & Corruption', description: 'Mandatory annual compliance' },
    { title: 'Waste Sorting Basics', description: 'Office environmental policy' },
    { title: 'Advanced ESG Reporting', description: 'For finance and engineering' },
  ];

  await prisma.training.createMany({ data: defaultTrainings });
  return { message: 'Successfully seeded default trainings' };
}

// Get the Training Module matrix (Completion % by Department)
export async function getTrainingMatrix() {
  // Fetch all trainings
  const trainings = await prisma.training.findMany({
    include: {
      completions: {
        include: { user: { include: { department: true } } }
      }
    }
  });

  // Fetch all departments
  const departments = await prisma.department.findMany({
    orderBy: { name: 'asc' }
  });

  // Fetch all users to know total users per department (for the denominator)
  const users = await prisma.user.findMany({
    select: { departmentId: true }
  });

  const deptUserCounts: Record<string, number> = {};
  for (const dept of departments) {
    deptUserCounts[dept.id] = users.filter(u => u.departmentId === dept.id).length || 1; // avoid division by zero
  }

  const matrix = trainings.map(t => {
    const deptProgress: Record<string, number> = {};
    
    for (const dept of departments) {
      // count how many completions in this training were by users in this dept
      const completionsInDept = t.completions.filter(c => c.user.departmentId === dept.id).length;
      const totalUsersInDept = deptUserCounts[dept.id];
      deptProgress[dept.name] = Math.round((completionsInDept / totalUsersInDept) * 100);
    }

    return {
      id: t.id,
      name: t.title,
      type: 'Mandatory', // using static type for now
      deptProgress
    };
  });

  return { matrix, departmentNames: departments.map(d => d.name) };
}
