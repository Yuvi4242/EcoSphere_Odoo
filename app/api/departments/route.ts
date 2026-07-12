import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Department from "@/models/Department";

/**
 * GET all departments.
 */
export async function GET() {
  try {
    await dbConnect();
    const departments = await Department.find({}).populate("parentDepartment");
    return NextResponse.json({ departments });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}

/**
 * POST a new department (Restricted to ADMIN and MANAGER).
 */
export async function POST(request: Request) {
  try {
    await dbConnect();
    const role = request.headers.get("x-user-role");
    if (role !== "ADMIN" && role !== "MANAGER") {
      return NextResponse.json({ error: "Forbidden: Insufficient privileges" }, { status: 403 });
    }

    const body = await request.json();
    const { name, parentDepartment } = body;
    if (!name) {
      return NextResponse.json({ error: "Department name is required" }, { status: 400 });
    }

    const dept = await Department.create({
      name,
      parentDepartment: parentDepartment || undefined,
    });

    return NextResponse.json({ department: dept }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 550 });
  }
}
