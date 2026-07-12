import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";

/**
 * GET leaderboard rankings.
 * Returns users ordered by Level and XP in descending order.
 */
export async function GET() {
  try {
    await dbConnect();
    const leaderboard = await User.find({})
      .select("name email role department xp level badges")
      .sort({ level: -1, xp: -1 });

    return NextResponse.json({ leaderboard });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
