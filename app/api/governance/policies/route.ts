import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Policy from "@/models/Policy";

/**
 * GET all corporate governance policies.
 */
export async function GET() {
  try {
    await dbConnect();
    const policies = await Policy.find({}).sort({ publishedAt: -1 });
    return NextResponse.json({ policies });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}

/**
 * POST a new policy (Restricted to ADMIN and MANAGER).
 */
export async function POST(request: Request) {
  try {
    await dbConnect();
    const role = request.headers.get("x-user-role");
    if (role !== "ADMIN" && role !== "MANAGER") {
      return NextResponse.json({ error: "Forbidden: Insufficient privileges" }, { status: 403 });
    }

    const body = await request.json();
    const { title, description, version } = body;
    if (!title || !description || !version) {
      return NextResponse.json({ error: "Missing required fields (title, description, version)" }, { status: 400 });
    }

    const policy = await Policy.create({
      title,
      description,
      version,
      publishedAt: new Date(),
      acceptedBy: [],
    });

    return NextResponse.json({ policy }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
