import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import ChallengeParticipation from "@/models/ChallengeParticipation";
import Challenge from "@/models/Challenge";
import User from "@/models/User";
import ESGConfig from "@/models/ESGConfig";
import Notification from "@/models/Notification";
import Badge from "@/models/Badge";

/**
 * GET all challenge participation records.
 * - Employees retrieve only their own.
 * - Managers and Admins retrieve all.
 */
export async function GET(request: Request) {
  try {
    await dbConnect();
    const userId = request.headers.get("x-user-id");
    const role = request.headers.get("x-user-role");

    let query = {};
    if (role === "EMPLOYEE") {
      query = { userId };
    }

    const participations = await ChallengeParticipation.find(query)
      .populate("userId", "name email department")
      .populate("challengeId")
      .sort({ createdAt: -1 });

    return NextResponse.json({ participations });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}

/**
 * POST a new challenge completion request (Pending).
 */
export async function POST(request: Request) {
  try {
    await dbConnect();
    const userId = request.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized session" }, { status: 401 });
    }

    const body = await request.json();
    const { challengeId, proofUrl } = body;
    if (!challengeId) {
      return NextResponse.json({ error: "Challenge ID is required" }, { status: 400 });
    }

    const existing = await ChallengeParticipation.findOne({ userId, challengeId });
    if (existing) {
      return NextResponse.json({ error: "Already registered or logged a submission for this challenge" }, { status: 400 });
    }

    const cp = await ChallengeParticipation.create({
      userId,
      challengeId,
      proofUrl: proofUrl || undefined,
      status: "Pending",
    });

    return NextResponse.json({ participation: cp }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}

/**
 * PATCH to update challenge submission status (Completed/Failed) (Restricted to ADMIN and MANAGER).
 * Implements business logic:
 * - Evidence requirement check (proofUrl missing blocks approval).
 * - Completed list update.
 * - User XP points increments & level-up checks.
 * - Dynamic badges unlock triggers based on total challenges completed.
 * - Notifications trigger.
 */
export async function PATCH(request: Request) {
  try {
    await dbConnect();
    const role = request.headers.get("x-user-role");
    if (role !== "ADMIN" && role !== "MANAGER") {
      return NextResponse.json({ error: "Forbidden: Insufficient privileges" }, { status: 403 });
    }

    const body = await request.json();
    const { id, status } = body;
    if (!id || !status) {
      return NextResponse.json({ error: "Missing ID or status" }, { status: 400 });
    }

    const cp = await ChallengeParticipation.findById(id);
    if (!cp) {
      return NextResponse.json({ error: "Challenge participation record not found" }, { status: 404 });
    }

    let config = await ESGConfig.findOne({});
    if (!config) {
      config = await ESGConfig.create({});
    }

    // 1. Evidence Requirement business rule check
    if (status === "Completed" && config.evidenceRequirement && !cp.proofUrl) {
      return NextResponse.json({ error: "Cannot approve: Proof file is required by policy." }, { status: 400 });
    }

    cp.status = status;
    await cp.save();

    if (status === "Completed") {
      // 2. Add user to Challenge completed list
      await Challenge.findByIdAndUpdate(cp.challengeId, {
        $addToSet: { completedBy: cp.userId },
      });

      const challenge = await Challenge.findById(cp.challengeId);
      const user = await User.findById(cp.userId);

      if (user && challenge) {
        // 3. Award XP & Level Checks
        user.xp += challenge.xpReward;
        if (user.xp >= user.level * 100) {
          user.level += 1;
        }

        // 4. Award Direct Badge if applicable
        if (challenge.badgeReward) {
          if (!user.badges.includes(challenge.badgeReward)) {
            user.badges.push(challenge.badgeReward);
            await Notification.create({
              userId: user._id,
              title: "Badge Unlocked!",
              message: `You earned the '${challenge.badgeReward}' badge for completing challenge: '${challenge.title}'!`,
              type: "Achievement",
            });
          }
        }

        // 5. Auto Badge Unlock evaluation based on challengesCompleted count
        if (config.badgeAutoAward) {
          const currentBadges = new Set(user.badges);
          const completedChallengesCount = await ChallengeParticipation.countDocuments({
            userId: user._id,
            status: "Completed",
          });

          const allBadges = await Badge.find({});
          for (const badge of allBadges) {
            if (badge.triggerType === "ChallengesCompleted" && completedChallengesCount >= badge.triggerValue) {
              if (!currentBadges.has(badge.name)) {
                user.badges.push(badge.name);
                currentBadges.add(badge.name);
                await Notification.create({
                  userId: user._id,
                  title: "Badge Unlocked!",
                  message: `You unlocked the '${badge.name}' badge!`,
                  type: "Achievement",
                });
              }
            }
          }
        }

        await user.save();

        // 6. Create Notification log
        await Notification.create({
          userId: cp.userId,
          title: "Challenge Approved!",
          message: `Your completion of challenge '${challenge.title}' was approved. +${challenge.xpReward} XP!`,
          type: "Info",
        });
      }
    }

    return NextResponse.json({ participation: cp });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
