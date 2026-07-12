import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Category from "@/models/Category";

/**
 * GET all categories.
 */
export async function GET() {
  try {
    await dbConnect();
    const categories = await Category.find({});
    return NextResponse.json({ categories });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}

/**
 * POST a new category (Restricted to ADMIN and MANAGER).
 */
export async function POST(request: Request) {
  try {
    await dbConnect();
    const role = request.headers.get("x-user-role");
    if (role !== "ADMIN" && role !== "MANAGER") {
      return NextResponse.json({ error: "Forbidden: Insufficient privileges" }, { status: 403 });
    }

    const body = await request.json();
    const { name, type, description } = body;
    if (!name || !type) {
      return NextResponse.json({ error: "Name and Type are required" }, { status: 400 });
    }

    const cat = await Category.create({ name, type, description });
    return NextResponse.json({ category: cat }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
