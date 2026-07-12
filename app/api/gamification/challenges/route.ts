import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Challenge from "@/models/Challenge";

/**
 * GET all active and historical gamification challenges.
 */
export async function GET() {
  try {
    await dbConnect();
    const challenges = await Challenge.find({}).sort({ deadline: 1 });
    return NextResponse.json({ challenges });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}

/**
 * POST a new challenge (Restricted to ADMIN and MANAGER).
 */
export async function POST(request: Request) {
  try {
    await dbConnect();
    const role = request.headers.get("x-user-role");
    if (role !== "ADMIN" && role !== "MANAGER") {
      return NextResponse.json({ error: "Forbidden: Insufficient privileges" }, { status: 403 });
    }

    const body = await request.json();
    const { title, description, xpReward, badgeReward, type, deadline } = body;
    if (!title || !description || xpReward === undefined || !type || !deadline) {
      return NextResponse.json({ error: "Missing required fields (title, description, xpReward, type, deadline)" }, { status: 400 });
    }

    const challenge = await Challenge.create({
      title,
      description,
      xpReward,
      badgeReward: badgeReward || undefined,
      type,
      deadline: new Date(deadline),
      completedBy: [],
    });

    return NextResponse.json({ challenge }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
