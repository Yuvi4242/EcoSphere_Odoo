import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Notification from "@/models/Notification";

/**
 * GET all notifications for the current user.
 */
export async function GET(request: Request) {
  try {
    await dbConnect();
    const userId = request.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized session" }, { status: 401 });
    }

    const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });
    return NextResponse.json({ notifications });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}

/**
 * PATCH notifications (isRead: true).
 * - Accepts an optional 'id' to read one.
 * - If no 'id' is supplied, marks all notifications for this user as read.
 */
export async function PATCH(request: Request) {
  try {
    await dbConnect();
    const userId = request.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized session" }, { status: 401 });
    }

    const body = await request.json();
    const { id } = body;

    if (id) {
      await Notification.updateOne({ _id: id, userId }, { isRead: true });
    } else {
      await Notification.updateMany({ userId }, { isRead: true });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
