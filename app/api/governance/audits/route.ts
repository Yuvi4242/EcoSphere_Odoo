import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Audit from "@/models/Audit";

/**
 * GET all audits.
 */
export async function GET() {
  try {
    await dbConnect();
    const audits = await Audit.find({}).sort({ date: -1 });
    return NextResponse.json({ audits });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}

/**
 * POST a new audit (Restricted to ADMIN and MANAGER).
 */
export async function POST(request: Request) {
  try {
    await dbConnect();
    const role = request.headers.get("x-user-role");
    if (role !== "ADMIN" && role !== "MANAGER") {
      return NextResponse.json({ error: "Forbidden: Insufficient privileges" }, { status: 403 });
    }

    const body = await request.json();
    const { title, auditor, date, findings, scope } = body;
    if (!title || !auditor || !scope) {
      return NextResponse.json({ error: "Missing required fields (title, auditor, scope)" }, { status: 400 });
    }

    const audit = await Audit.create({
      title,
      auditor,
      date: date ? new Date(date) : new Date(),
      findings,
      scope,
    });

    return NextResponse.json({ audit }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
