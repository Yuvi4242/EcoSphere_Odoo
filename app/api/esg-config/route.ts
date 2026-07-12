import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import ESGConfig from "@/models/ESGConfig";

/**
 * GET current ESG configuration.
 */
export async function GET() {
  try {
    await dbConnect();
    let config = await ESGConfig.findOne({});
    if (!config) {
      config = await ESGConfig.create({});
    }
    return NextResponse.json({ config });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}

/**
 * POST / update ESG configurations (Restricted to ADMIN and MANAGER).
 * Enforces that Environmental, Social, and Governance weights sum to exactly 100%.
 */
export async function POST(request: Request) {
  try {
    await dbConnect();
    const role = request.headers.get("x-user-role");
    if (role !== "ADMIN" && role !== "MANAGER") {
      return NextResponse.json({ error: "Forbidden: Insufficient privileges" }, { status: 403 });
    }

    const body = await request.json();
    const { environmentalWeight, socialWeight, governanceWeight, autoEmissionCalculation, evidenceRequirement, badgeAutoAward } = body;

    let config = await ESGConfig.findOne({});
    if (!config) {
      config = new ESGConfig({});
    }

    if (environmentalWeight !== undefined) config.environmentalWeight = environmentalWeight;
    if (socialWeight !== undefined) config.socialWeight = socialWeight;
    if (governanceWeight !== undefined) config.governanceWeight = governanceWeight;
    if (autoEmissionCalculation !== undefined) config.autoEmissionCalculation = autoEmissionCalculation;
    if (evidenceRequirement !== undefined) config.evidenceRequirement = evidenceRequirement;
    if (badgeAutoAward !== undefined) config.badgeAutoAward = badgeAutoAward;

    // Validate weights total 100
    const total = config.environmentalWeight + config.socialWeight + config.governanceWeight;
    if (total !== 100) {
      return NextResponse.json({ error: "Score weights must sum to exactly 100%" }, { status: 400 });
    }

    await config.save();
    return NextResponse.json({ config });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
