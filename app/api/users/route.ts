import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

/**
 * GET all users (Restricted to ADMIN and MANAGER).
 */
export async function GET(request: Request) {
  try {
    await dbConnect();
    const currentRole = request.headers.get("x-user-role");
    if (currentRole !== "ADMIN" && currentRole !== "MANAGER") {
      return NextResponse.json({ error: "Forbidden: Insufficient privileges" }, { status: 403 });
    }

    const users = await User.find({}).select("-passwordHash").sort({ createdAt: -1 });
    return NextResponse.json({ users });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}

/**
 * POST to register a new user (Restricted to ADMIN).
 */
export async function POST(request: Request) {
  try {
    await dbConnect();
    const currentRole = request.headers.get("x-user-role");
    if (currentRole !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden: Only Admin accounts can create users" }, { status: 403 });
    }

    const body = await request.json();
    const { name, email, password, role, department } = body;
    if (!name || !email || !password || !role) {
      return NextResponse.json({ error: "Missing required fields (name, email, password, role)" }, { status: 400 });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      passwordHash,
      role,
      department: department || undefined,
      xp: 0,
      level: 1,
      badges: [],
    });

    return NextResponse.json({
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
      },
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}

/**
 * PATCH to edit a user (Restricted to ADMIN and MANAGER).
 * - Only ADMIN can update user role.
 */
export async function PATCH(request: Request) {
  try {
    await dbConnect();
    const currentRole = request.headers.get("x-user-role");
    if (currentRole !== "ADMIN" && currentRole !== "MANAGER") {
      return NextResponse.json({ error: "Forbidden: Insufficient privileges" }, { status: 403 });
    }

    const body = await request.json();
    const { id, role, department } = body;
    if (!id) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json({ error: "User account not found" }, { status: 404 });
    }

    if (role !== undefined) {
      if (currentRole !== "ADMIN") {
        return NextResponse.json({ error: "Forbidden: Only Admins can modify roles" }, { status: 403 });
      }
      user.role = role;
    }

    if (department !== undefined) {
      user.department = department;
    }

    await user.save();
    return NextResponse.json({
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
