import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Badge from "@/models/Badge";

/**
 * GET all achievement badges.
 */
export async function GET() {
  try {
    await dbConnect();
    const badges = await Badge.find({});
    return NextResponse.json({ badges });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
