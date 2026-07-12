import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Reward from "@/models/Reward";
import User from "@/models/User";
import Notification from "@/models/Notification";

/**
 * GET all rewards in catalog.
 */
export async function GET() {
  try {
    await dbConnect();
    const rewards = await Reward.find({});
    return NextResponse.json({ rewards });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}

/**
 * POST a new reward to the store (Restricted to ADMIN and MANAGER).
 */
export async function POST(request: Request) {
  try {
    await dbConnect();
    const role = request.headers.get("x-user-role");
    if (role !== "ADMIN" && role !== "MANAGER") {
      return NextResponse.json({ error: "Forbidden: Insufficient privileges" }, { status: 403 });
    }

    const body = await request.json();
    const { name, description, costXP, stock } = body;
    if (!name || !description || costXP === undefined || stock === undefined) {
      return NextResponse.json({ error: "Missing required fields (name, description, costXP, stock)" }, { status: 400 });
    }

    const reward = await Reward.create({ name, description, costXP, stock });
    return NextResponse.json({ reward }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}

/**
 * PUT to redeem a reward.
 * Implements business logic:
 * - Checks stock levels and XP points.
 * - Performs atomic stock decrements and XP deductions.
 * - Rolls back stock changes on XP deduction failures.
 * - Records confirmation notification log.
 */
export async function PUT(request: Request) {
  try {
    await dbConnect();
    const userId = request.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized session" }, { status: 401 });
    }

    const body = await request.json();
    const { rewardId } = body;
    if (!rewardId) {
      return NextResponse.json({ error: "Reward ID is required for redemption" }, { status: 400 });
    }

    const reward = await Reward.findById(rewardId);
    if (!reward) {
      return NextResponse.json({ error: "Reward not found in store" }, { status: 404 });
    }

    // 1. Validate stock availability
    if (reward.stock <= 0) {
      return NextResponse.json({ error: "Reward is currently out of stock" }, { status: 400 });
    }

    // 2. Validate user XP points
    const user = await User.findById(userId);
    if (!user || user.xp < reward.costXP) {
      return NextResponse.json({ error: "Insufficient XP points balance for this redemption" }, { status: 400 });
    }

    // 3. Perform atomic update operations with rollback safety
    const updatedReward = await Reward.findOneAndUpdate(
      { _id: rewardId, stock: { $gt: 0 } },
      { $inc: { stock: -1 } },
      { new: true }
    );

    if (!updatedReward) {
      return NextResponse.json({ error: "Item went out of stock during processing" }, { status: 400 });
    }

    const updatedUser = await User.findOneAndUpdate(
      { _id: userId, xp: { $gte: reward.costXP } },
      { $inc: { xp: -reward.costXP } },
      { new: true }
    );

    if (!updatedUser) {
      // Rollback stock decrement on failure
      await Reward.findByIdAndUpdate(rewardId, { $inc: { stock: 1 } });
      return NextResponse.json({ error: "Insufficient XP points balance" }, { status: 400 });
    }

    // 4. Record Notification log
    await Notification.create({
      userId,
      title: "Reward Redeemed!",
      message: `You successfully redeemed '${reward.name}'. -${reward.costXP} XP!`,
      type: "Info",
    });

    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser._id.toString(),
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        department: updatedUser.department,
        xp: updatedUser.xp,
        level: updatedUser.level,
        badges: updatedUser.badges,
      },
      reward: updatedReward,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
