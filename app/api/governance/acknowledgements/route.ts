import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import PolicyAcknowledgement from "@/models/PolicyAcknowledgement";
import Policy from "@/models/Policy";
import User from "@/models/User";
import Notification from "@/models/Notification";

/**
 * GET current user's acknowledgements.
 */
export async function GET(request: Request) {
  try {
    await dbConnect();
    const userId = request.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized session" }, { status: 401 });
    }

    const acks = await PolicyAcknowledgement.find({ userId }).populate("policyId");
    return NextResponse.json({ acks });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}

/**
 * POST a new policy acknowledgement.
 * - Adds employee to policy accepted list.
 * - Awards 15 XP points and checks level-up.
 * - Logs notification achievement.
 */
export async function POST(request: Request) {
  try {
    await dbConnect();
    const userId = request.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized session" }, { status: 401 });
    }

    const body = await request.json();
    const { policyId } = body;
    if (!policyId) {
      return NextResponse.json({ error: "Policy ID is required" }, { status: 400 });
    }

    // Check if already acknowledged
    const existing = await PolicyAcknowledgement.findOne({ userId, policyId });
    if (existing) {
      return NextResponse.json({ error: "Policy already acknowledged by this user" }, { status: 400 });
    }

    const ack = await PolicyAcknowledgement.create({
      userId,
      policyId,
      acknowledgedAt: new Date(),
    });

    // Add user ID to Policy acceptance list
    await Policy.findByIdAndUpdate(policyId, {
      $addToSet: { acceptedBy: userId },
    });

    // Give user 15 XP points
    const user = await User.findById(userId);
    if (user) {
      user.xp += 15;
      if (user.xp >= user.level * 100) {
        user.level += 1;
      }
      await user.save();
    }

    const policy = await Policy.findById(policyId);
    
    // Create Notification log
    await Notification.create({
      userId,
      title: "Policy Acknowledged",
      message: `You acknowledged policy: '${policy?.title}' (v${policy?.version}). +15 XP!`,
      type: "Info",
    });

    return NextResponse.json({ acknowledgement: ack }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
