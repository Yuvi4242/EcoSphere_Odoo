import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import EmissionFactor from "@/models/EmissionFactor";

/**
 * GET all emission factors.
 */
export async function GET() {
  try {
    await dbConnect();
    const factors = await EmissionFactor.find({}).populate("category");
    return NextResponse.json({ factors });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}

/**
 * POST a new emission factor (Restricted to ADMIN and MANAGER).
 */
export async function POST(request: Request) {
  try {
    await dbConnect();
    const role = request.headers.get("x-user-role");
    if (role !== "ADMIN" && role !== "MANAGER") {
      return NextResponse.json({ error: "Forbidden: Insufficient privileges" }, { status: 403 });
    }

    const body = await request.json();
    const { activityName, factor, unit, categoryId } = body;
    if (!activityName || factor === undefined || !unit || !categoryId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const ef = await EmissionFactor.create({
      activityName,
      factor,
      unit,
      category: categoryId,
    });
    return NextResponse.json({ factor: ef }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
