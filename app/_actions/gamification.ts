'use server';

import { prisma } from '@/app/_lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { revalidatePath } from 'next/cache';

// Fetch leaderboard (Top 10 users by XP)
export async function getLeaderboard() {
  return await prisma.user.findMany({
    orderBy: { xpTotal: 'desc' },
    take: 10,
    select: {
      id: true,
      name: true,
      xpTotal: true,
      department: { select: { name: true } },
    }
  });
}

// Fetch all available rewards
export async function getRewards() {
  return await prisma.reward.findMany({
    orderBy: { pointsRequired: 'asc' },
  });
}

// Fetch the current user's profile to get pointsBalance
export async function getUserProfile() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !(session.user as any).id) return null;

  return await prisma.user.findUnique({
    where: { id: (session.user as any).id },
    select: {
      id: true,
      pointsBalance: true,
      xpTotal: true,
      role: true,
    }
  });
}

// Atomically redeem a reward
export async function redeemReward(rewardId: string) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !(session.user as any).id) {
    throw new Error('Unauthorized');
  }

  const userId = (session.user as any).id;

  try {
    await prisma.$transaction(async (tx: any) => {
      // 1. Fetch reward and ensure it exists, is active, and has stock
      const reward = await tx.reward.findUnique({
        where: { id: rewardId }
      });

      if (!reward || reward.status !== 'ACTIVE') {
        throw new Error('Reward is not available.');
      }
      if (reward.stock <= 0) {
        throw new Error('Out of stock!');
      }

      // 2. Fetch user to ensure they have enough points
      const user = await tx.user.findUnique({
        where: { id: userId }
      });

      if (!user || user.pointsBalance < reward.pointsRequired) {
        throw new Error('Not enough points.');
      }

      // 3. Decrement stock
      await tx.reward.update({
        where: { id: rewardId },
        data: { stock: { decrement: 1 } }
      });

      // 4. Deduct points from user
      await tx.user.update({
        where: { id: userId },
        data: { pointsBalance: { decrement: reward.pointsRequired } }
      });

      // 5. Create redemption record
      await tx.redemption.create({
        data: {
          pointsSpent: reward.pointsRequired,
          userId,
          rewardId,
        }
      });
    });

    revalidatePath('/gamification/rewards');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// Seed rewards if they don't exist
export async function seedRewards() {
  const count = await prisma.reward.count();
  if (count > 0) return { message: 'Rewards already seeded' };

  const defaultRewards = [
    { name: '$10 Coffee Gift Card', description: 'Redeemable at major coffee chains', pointsRequired: 500, stock: 50 },
    { name: 'Extra PTO Half-Day', description: 'Take an afternoon off on us', pointsRequired: 2000, stock: 10 },
    { name: 'Company Swag Pack', description: 'T-shirt, mug, and stickers', pointsRequired: 1000, stock: 25 },
    { name: 'Charity Donation ($50)', description: 'We donate $50 to a green charity of your choice', pointsRequired: 1500, stock: 100 },
  ];

  await prisma.reward.createMany({ data: defaultRewards });
  return { message: 'Successfully seeded default rewards' };
}
