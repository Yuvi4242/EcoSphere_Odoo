import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Report from "@/models/Report";
import CarbonRecord from "@/models/CarbonRecord";
import CSRActivity from "@/models/CSRActivity";
import Policy from "@/models/Policy";
import User from "@/models/User";

/**
 * GET all generated reports.
 */
export async function GET() {
  try {
    await dbConnect();
    const reports = await Report.find({}).populate("generatedBy", "name").sort({ createdAt: -1 });
    return NextResponse.json({ reports });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}

/**
 * POST to compile a new ESG report based on filters.
 * Returns both the report metadata and the compiled database records.
 * Supports filters: Department, Date Range, Module type.
 */
export async function POST(request: Request) {
  try {
    await dbConnect();
    const userId = request.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized session" }, { status: 401 });
    }

    const body = await request.json();
    const { title, type, filters } = body;
    if (!title || !type) {
      return NextResponse.json({ error: "Missing required fields (title, type)" }, { status: 400 });
    }

    let data: any[] = [];
    const query: any = {};

    if (filters) {
      if (filters.startDate || filters.endDate) {
        query.date = {};
        if (filters.startDate) query.date.$gte = new Date(filters.startDate);
        if (filters.endDate) query.date.$lte = new Date(filters.endDate);
      }
      if (filters.department) {
        const usersInDept = await User.find({ department: filters.department }).select("_id");
        const userIds = usersInDept.map((u) => u._id);
        query.userId = { $in: userIds };
      }
    }

    // Query appropriate Mongoose collections depending on selected Report Type
    if (type === "Carbon") {
      data = await CarbonRecord.find(query).populate("userId", "name department").lean();
    } else if (type === "CSR") {
      const csrQuery: any = {};
      if (filters && (filters.startDate || filters.endDate)) {
        csrQuery.date = {};
        if (filters.startDate) csrQuery.date.$gte = new Date(filters.startDate);
        if (filters.endDate) csrQuery.date.$lte = new Date(filters.endDate);
      }
      data = await CSRActivity.find(csrQuery).populate("volunteers", "name department").lean();
    } else if (type === "Governance") {
      data = await Policy.find({}).populate("acceptedBy", "name department").lean();
    } else {
      const carbon = await CarbonRecord.find(query).populate("userId", "name department").lean();
      const csr = await CSRActivity.find({}).populate("volunteers", "name department").lean();
      data = [...carbon, ...csr];
    }

    const report = await Report.create({
      title,
      type,
      filters: filters || {},
      generatedBy: userId,
    });

    return NextResponse.json({ report, data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
