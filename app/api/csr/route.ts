import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import CSRActivity from "@/models/CSRActivity";

/**
 * GET all CSR activities.
 */
export async function GET() {
  try {
    await dbConnect();
    const activities = await CSRActivity.find({}).sort({ date: -1 });
    return NextResponse.json({ activities });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}

/**
 * POST a new CSR activity (Restricted to ADMIN and MANAGER).
 */
export async function POST(request: Request) {
  try {
    await dbConnect();
    const role = request.headers.get("x-user-role");
    if (role !== "ADMIN" && role !== "MANAGER") {
      return NextResponse.json({ error: "Forbidden: Insufficient privileges" }, { status: 403 });
    }

    const body = await request.json();
    const { title, description, date, type, impactMetric } = body;
    if (!title || !description || !type) {
      return NextResponse.json({ error: "Missing required fields (title, description, type)" }, { status: 400 });
    }

    const activity = await CSRActivity.create({
      title,
      description,
      date: date ? new Date(date) : new Date(),
      type,
      impactMetric,
      volunteers: [],
    });

    return NextResponse.json({ activity }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
