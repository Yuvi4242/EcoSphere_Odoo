import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import ComplianceIssue from "@/models/ComplianceIssue";
import Notification from "@/models/Notification";

/**
 * GET cron handler to flag overdue compliance issues.
 * Checks for all compliance tasks with 'Open' status past their due date,
 * transitions them to 'Overdue', and dispatches alerts.
 */
export async function GET() {
  try {
    await dbConnect();

    const now = new Date();
    const overdueIssues = await ComplianceIssue.find({
      status: "Open",
      dueDate: { $lt: now },
    });

    let updatedCount = 0;

    for (const issue of overdueIssues) {
      issue.status = "Overdue";
      await issue.save();
      updatedCount++;

      // Dispatch alert notification to the owner
      await Notification.create({
        userId: issue.owner,
        title: "Compliance Issue Overdue!",
        message: `Compliance Alert: Issue '${issue.title}' is now marked as Overdue. Please resolve immediately.`,
        type: "Alert",
      });
    }

    return NextResponse.json({
      success: true,
      message: `Successfully evaluated. Flagged ${updatedCount} overdue compliance issues.`,
      flaggedCount: updatedCount,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
