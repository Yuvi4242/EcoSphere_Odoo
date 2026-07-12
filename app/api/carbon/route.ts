import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import CarbonRecord from "@/models/CarbonRecord";
import ESGConfig from "@/models/ESGConfig";
import EmissionFactor from "@/models/EmissionFactor";
import User from "@/models/User";

/**
 * GET carbon records.
 * - Employees retrieve only their own records.
 * - Admins and Managers retrieve all records.
 */
export async function GET(request: Request) {
  try {
    await dbConnect();
    const userId = request.headers.get("x-user-id");
    const role = request.headers.get("x-user-role");

    let query = {};
    if (role === "EMPLOYEE") {
      query = { userId };
    }

    const records = await CarbonRecord.find(query)
      .populate("userId", "name email department")
      .sort({ date: -1 });
      
    return NextResponse.json({ records });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}

/**
 * POST a new carbon record.
 * Implements business logic:
 * - Checks ESGConfig.autoEmissionCalculation toggle to auto-calculate CO2e.
 * - Auto-awards 20 XP to the logging employee and checks level ups.
 */
export async function POST(request: Request) {
  try {
    await dbConnect();
    const userId = request.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized session" }, { status: 401 });
    }

    const body = await request.json();
    const { scope, category, value, date, notes, emissionFactorId, co2e: manualCo2e } = body;
    if (!scope || !category || value === undefined) {
      return NextResponse.json({ error: "Missing required fields (scope, category, value)" }, { status: 400 });
    }

    // 1. Fetch ESG Configurations
    let config = await ESGConfig.findOne({});
    if (!config) {
      config = await ESGConfig.create({});
    }

    let calculatedCo2e = manualCo2e || 0;

    // 2. Perform Auto Calculation check
    if (config.autoEmissionCalculation && emissionFactorId) {
      const factorObj = await EmissionFactor.findById(emissionFactorId);
      if (factorObj) {
        calculatedCo2e = value * factorObj.factor;
      }
    }

    // 3. Log Carbon record
    const record = await CarbonRecord.create({
      userId,
      scope,
      category,
      value,
      co2e: calculatedCo2e,
      date: date ? new Date(date) : new Date(),
      notes,
    });

    // 4. Award XP Points
    const user = await User.findById(userId);
    if (user) {
      user.xp += 20;
      // Level check
      if (user.xp >= user.level * 100) {
        user.level += 1;
      }
      await user.save();
    }

    return NextResponse.json({ record }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
