import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import ComplianceIssue from "@/models/ComplianceIssue";
import Notification from "@/models/Notification";

/**
 * GET compliance issues.
 * - Employees view only issues assigned to them.
 * - Managers/Admins view all.
 */
export async function GET(request: Request) {
  try {
    await dbConnect();
    const userId = request.headers.get("x-user-id");
    const role = request.headers.get("x-user-role");

    let query = {};
    if (role === "EMPLOYEE") {
      query = { owner: userId };
    }

    const issues = await ComplianceIssue.find(query)
      .populate("owner", "name email department")
      .sort({ dueDate: 1 });

    return NextResponse.json({ issues });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}

/**
 * POST a new compliance issue (Restricted to ADMIN and MANAGER).
 * - Fires an alert notification to the assigned owner.
 */
export async function POST(request: Request) {
  try {
    await dbConnect();
    const role = request.headers.get("x-user-role");
    if (role !== "ADMIN" && role !== "MANAGER") {
      return NextResponse.json({ error: "Forbidden: Insufficient privileges" }, { status: 403 });
    }

    const body = await request.json();
    const { title, description, dueDate, ownerId } = body;
    if (!title || !description || !dueDate || !ownerId) {
      return NextResponse.json({ error: "Missing required fields (title, description, dueDate, ownerId)" }, { status: 400 });
    }

    const issue = await ComplianceIssue.create({
      title,
      description,
      dueDate: new Date(dueDate),
      owner: ownerId,
      status: "Open",
    });

    // Alert the owner
    await Notification.create({
      userId: ownerId,
      title: "New Compliance Issue Assigned",
      message: `You have been assigned a compliance task: '${title}'. Due date: ${new Date(dueDate).toLocaleDateString()}`,
      type: "Alert",
    });

    return NextResponse.json({ issue }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}

/**
 * PATCH compliance issue status (Open -> Resolved).
 * - Employees can resolve only issues assigned to them.
 * - Managers and Admins can resolve any.
 */
export async function PATCH(request: Request) {
  try {
    await dbConnect();
    const userId = request.headers.get("x-user-id");
    const role = request.headers.get("x-user-role");

    const body = await request.json();
    const { id, status } = body;
    if (!id || !status) {
      return NextResponse.json({ error: "Missing ID or status" }, { status: 400 });
    }

    const issue = await ComplianceIssue.findById(id);
    if (!issue) {
      return NextResponse.json({ error: "Compliance issue not found" }, { status: 404 });
    }

    if (role === "EMPLOYEE" && issue.owner.toString() !== userId) {
      return NextResponse.json({ error: "Forbidden: You are not the owner of this compliance task" }, { status: 403 });
    }

    issue.status = status;
    await issue.save();

    if (status === "Resolved") {
      await Notification.create({
        userId: issue.owner,
        title: "Compliance Issue Resolved",
        message: `Your assigned task '${issue.title}' has been successfully resolved.`,
        type: "Info",
      });
    }

    return NextResponse.json({ issue });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
