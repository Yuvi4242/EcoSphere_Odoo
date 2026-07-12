"use server";

import dbConnect from "@/lib/db";
import User from "@/models/User";
import { loginSchema } from "@/validations/auth";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/auth";
import { cookies } from "next/headers";

/**
 * Server Action for User Login.
 * Validates with Zod, connects to MongoDB, hashes credentials, and signs HTTP-only JWT cookies.
 */
export async function loginAction(formData: any) {
  try {
    await dbConnect();
    const result = loginSchema.safeParse(formData);
    if (!result.success) {
      return { success: false, error: "Invalid form data" };
    }

    const { email, password } = result.data;
    const user = await User.findOne({ email });
    if (!user) {
      return { success: false, error: "Invalid credentials" };
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return { success: false, error: "Invalid credentials" };
    }

    const token = signToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      department: user.department,
      name: user.name,
    });

    const cookieStore = await cookies();
    cookieStore.set("token", token, {
      path: "/",
      maxAge: 604800, // 7 days
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
    });

    return {
      success: true,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        xp: user.xp,
        level: user.level,
        badges: user.badges,
      },
    };
  } catch (error: any) {
    return { success: false, error: error.message || "An unexpected error occurred" };
  }
}

/**
 * Server Action for User Logout.
 * Clears the secure authentication cookie.
 */
export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.set("token", "", {
    path: "/",
    expires: new Date(0),
    httpOnly: true,
  });
  return { success: true };
}
