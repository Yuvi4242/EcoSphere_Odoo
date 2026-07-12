import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import ESGConfig from "@/models/ESGConfig";
import Department from "@/models/Department";
import User from "@/models/User";
import CarbonRecord from "@/models/CarbonRecord";
import EmployeeParticipation from "@/models/EmployeeParticipation";
import PolicyAcknowledgement from "@/models/PolicyAcknowledgement";
import Policy from "@/models/Policy";
import DepartmentScore from "@/models/DepartmentScore";

/**
 * GET current ESG weighted score aggregations.
 * Computes individual department scores and rolls them up to organization-wide totals.
 */
export async function GET() {
  try {
    await dbConnect();

    // 1. Fetch ESG weights configurations
    let config = await ESGConfig.findOne({});
    if (!config) {
      config = await ESGConfig.create({});
    }
    const { environmentalWeight, socialWeight, governanceWeight } = config;

    // 2. Fetch departments and policies
    const departments = await Department.find({});
    const totalPolicies = await Policy.countDocuments({});

    const scoresList = [];

    let overallE = 0;
    let overallS = 0;
    let overallG = 0;

    for (const dept of departments) {
      // Find all employees assigned to this department
      const users = await User.find({ department: dept.name });
      const userIds = users.map((u) => u._id);

      // --- Environmental (E) Calculation ---
      const carbonRecords = await CarbonRecord.find({ userId: { $in: userIds } });
      const totalEmissions = carbonRecords.reduce((sum, r) => sum + r.co2e, 0);
      // E Score: Base 100, decremented by emissions volume (100kg CO2e = -1pt)
      const eScore = Math.max(0, Math.min(100, 100 - totalEmissions / 100));

      // --- Social (S) Calculation ---
      const participations = await EmployeeParticipation.find({ userId: { $in: userIds }, status: "Approved" });
      const totalHours = participations.reduce((sum, p) => sum + p.hoursVolunteered, 0);
      // S Score: Base 50, incremented by volunteer hour contributions (1 hour = +5pts)
      const sScore = Math.max(50, Math.min(100, 50 + totalHours * 5));

      // --- Governance (G) Calculation ---
      let gScore = 100;
      if (totalPolicies > 0 && users.length > 0) {
        const acksCount = await PolicyAcknowledgement.countDocuments({ userId: { $in: userIds } });
        gScore = Math.round((acksCount / (totalPolicies * users.length)) * 100);
      }

      // --- Weighted Overall Department Score ---
      const overallScore = Math.round(
        (eScore * environmentalWeight + sScore * socialWeight + gScore * governanceWeight) / 100
      );

      // Store in DepartmentScore collection
      await DepartmentScore.findOneAndUpdate(
        { departmentId: dept._id },
        {
          environmentalScore: eScore,
          socialScore: sScore,
          governanceScore: gScore,
          overallScore,
          calculatedAt: new Date(),
        },
        { upsert: true, new: true }
      );

      scoresList.push({
        department: dept.name,
        environmentalScore: Math.round(eScore),
        socialScore: Math.round(sScore),
        governanceScore: Math.round(gScore),
        overallScore,
      });

      overallE += eScore;
      overallS += sScore;
      overallG += gScore;
    }

    // Roll up averages
    const count = departments.length || 1;
    const avgE = Math.round(overallE / count);
    const avgS = Math.round(overallS / count);
    const avgG = Math.round(overallG / count);
    const orgOverall = Math.round(
      (avgE * environmentalWeight + avgS * socialWeight + avgG * governanceWeight) / 100
    );

    return NextResponse.json({
      weights: {
        environmental: environmentalWeight,
        social: socialWeight,
        governance: governanceWeight,
      },
      orgScore: {
        environmental: avgE,
        social: avgS,
        governance: avgG,
        overall: orgOverall,
      },
      departmentScores: scoresList,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
