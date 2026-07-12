"use server";

import dbConnect from "@/lib/db";
import CarbonRecord from "@/models/CarbonRecord";
import User from "@/models/User";
import { carbonRecordSchema } from "@/validations/esg";
import { cookies } from "next/headers";
import { decodeJwt } from "@/middleware/auth";

/**
 * Server Action to log a new Carbon footprint record.
 * Saves record, connects user identity, and increments gamification XP.
 */
export async function addCarbonRecordAction(data: any) {
  try {
    await dbConnect();
    
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) {
      return { success: false, error: "Unauthorized: No token session found" };
    }
    const payload = decodeJwt(token);
    if (!payload) {
      return { success: false, error: "Unauthorized: Invalid or expired token" };
    }

    const result = carbonRecordSchema.safeParse(data);
    if (!result.success) {
      return { success: false, error: "Invalid record inputs: Zod parsing failed" };
    }

    const record = await CarbonRecord.create({
      ...result.data,
      userId: payload.userId,
    });

    // Award Gamification XP (20 points per submission)
    const updatedUser = await User.findByIdAndUpdate(
      payload.userId,
      { $inc: { xp: 20 } },
      { new: true }
    );

    // Calculate level ups based on 100 XP per level increments
    if (updatedUser && updatedUser.xp >= updatedUser.level * 100) {
      await User.findByIdAndUpdate(payload.userId, {
        $inc: { level: 1 },
      });
    }

    return {
      success: true,
      record: JSON.parse(JSON.stringify(record)),
    };
  } catch (error: any) {
    return { success: false, error: error.message || "An unexpected error occurred" };
  }
}
