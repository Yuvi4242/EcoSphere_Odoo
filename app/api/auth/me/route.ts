import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";

/**
 * GET handler to retrieve the current user's profile based on proxy authentication headers.
 */
export async function GET(request: Request) {
  try {
    await dbConnect();
    const userId = request.headers.get("x-user-id");
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized session" }, { status: 401 });
    }

    const user = await User.findById(userId).select("-passwordHash");
    if (!user) {
      return NextResponse.json({ error: "User profile not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
