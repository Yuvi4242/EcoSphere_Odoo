import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import EmployeeParticipation from "@/models/EmployeeParticipation";
import CSRActivity from "@/models/CSRActivity";
import User from "@/models/User";
import ESGConfig from "@/models/ESGConfig";
import Notification from "@/models/Notification";
import Badge from "@/models/Badge";

/**
 * GET CSR participation logs.
 * - Employees view only their own.
 * - Managers and Admins view all (for reviews).
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

    const participations = await EmployeeParticipation.find(query)
      .populate("userId", "name email department")
      .populate("activityId")
      .sort({ createdAt: -1 });

    return NextResponse.json({ participations });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}

/**
 * POST a new CSR participation request (Pending).
 */
export async function POST(request: Request) {
  try {
    await dbConnect();
    const userId = request.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized session" }, { status: 401 });
    }

    const body = await request.json();
    const { activityId, hoursVolunteered, proofUrl } = body;
    if (!activityId || hoursVolunteered === undefined) {
      return NextResponse.json({ error: "Missing activityId or hoursVolunteered" }, { status: 400 });
    }

    const participation = await EmployeeParticipation.create({
      userId,
      activityId,
      hoursVolunteered,
      proofUrl: proofUrl || undefined,
      status: "Pending",
    });

    return NextResponse.json({ participation }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}

/**
 * PATCH to update participation status (Approved/Rejected) (Restricted to ADMIN and MANAGER).
 * Implements business logic:
 * - Evidence requirement check (block approve if active & proofUrl missing).
 * - Volunteers registry update.
 * - Employee XP points + level-up check.
 * - Automatic badge checks.
 * - Notification generation.
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

    const participation = await EmployeeParticipation.findById(id);
    if (!participation) {
      return NextResponse.json({ error: "Participation record not found" }, { status: 404 });
    }

    let config = await ESGConfig.findOne({});
    if (!config) {
      config = await ESGConfig.create({});
    }

    // 1. Evidence Requirement business rule validation
    if (status === "Approved" && config.evidenceRequirement && !participation.proofUrl) {
      return NextResponse.json({ error: "Cannot approve: Evidence proof file is required by policy." }, { status: 400 });
    }

    participation.status = status;
    await participation.save();

    if (status === "Approved") {
      // 2. Add to CSR Activity volunteer array
      await CSRActivity.findByIdAndUpdate(participation.activityId, {
        $addToSet: { volunteers: participation.userId },
      });

      // 3. Award XP and evaluate level-up
      const user = await User.findById(participation.userId);
      if (user) {
        user.xp += 50; // award 50 XP
        if (user.xp >= user.level * 100) {
          user.level += 1;
        }

        // 4. Badge Award evaluation rule
        if (config.badgeAutoAward) {
          const currentBadges = new Set(user.badges);
          const allBadges = await Badge.find({});
          
          for (const badge of allBadges) {
            if (badge.triggerType === "XP" && user.xp >= badge.triggerValue) {
              if (!currentBadges.has(badge.name)) {
                user.badges.push(badge.name);
                currentBadges.add(badge.name);
                
                await Notification.create({
                  userId: user._id,
                  title: "Badge Unlocked!",
                  message: `You earned the '${badge.name}' badge!`,
                  type: "Achievement",
                });
              }
            }
          }
        }

        await user.save();
      }

      // 5. Send Notification
      const activity = await CSRActivity.findById(participation.activityId);
      await Notification.create({
        userId: participation.userId,
        title: "CSR Submission Approved!",
        message: `Your participation in '${activity?.title}' has been approved. +50 XP!`,
        type: "Info",
      });
    } else if (status === "Rejected") {
      const activity = await CSRActivity.findById(participation.activityId);
      await Notification.create({
        userId: participation.userId,
        title: "CSR Submission Rejected",
        message: `Your participation in '${activity?.title}' was rejected by compliance.`,
        type: "Alert",
      });
    }

    return NextResponse.json({ participation });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
