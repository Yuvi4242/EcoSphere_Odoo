import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// 1. Manually parse .env.local variables for the Node script
try {
  const envPath = path.join(process.cwd(), ".env.local");
  if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, "utf-8");
    envConfig.split("\n").forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) return;
      const parts = trimmed.split("=");
      if (parts.length >= 2) {
        const key = parts[0].trim();
        const value = parts.slice(1).join("=").trim().replace(/^['"]|['"]$/g, "");
        process.env[key] = value;
      }
    });
  }
} catch (e) {
  console.error("Error reading .env.local file:", e);
}

// Ensure MONGODB_URI is set
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/ecosphere";

import {
  User,
  Department,
  Category,
  EmissionFactor,
  Badge,
  Reward,
  ESGConfig,
} from "../models";

async function seed() {
  console.log("Connecting to MongoDB at:", MONGODB_URI);
  await mongoose.connect(MONGODB_URI);
  console.log("Connected successfully. Seeding database...");

  try {
    // Clean old seed data
    await User.deleteMany({});
    await Department.deleteMany({});
    await Category.deleteMany({});
    await EmissionFactor.deleteMany({});
    await Badge.deleteMany({});
    await Reward.deleteMany({});
    await ESGConfig.deleteMany({});

    // 1. Seed Departments
    console.log("Seeding departments...");
    const corpDept = await Department.create({ name: "Corporate" });
    const opsDept = await Department.create({ name: "Operations", parentDepartment: corpDept._id });
    const facDept = await Department.create({ name: "Facilities", parentDepartment: corpDept._id });
    const hrDept = await Department.create({ name: "Human Resources", parentDepartment: corpDept._id });
    const techDept = await Department.create({ name: "IT & Engineering", parentDepartment: corpDept._id });

    // 2. Seed Categories
    console.log("Seeding categories...");
    const catScope1 = await Category.create({ name: "Scope 1 - Direct Emissions", type: "Environmental", description: "Direct combustion of fossil fuels, company vehicles, etc." });
    const catScope2 = await Category.create({ name: "Scope 2 - Indirect Emissions", type: "Environmental", description: "Purchased electricity, steam, heating, and cooling." });
    const catScope3 = await Category.create({ name: "Scope 3 - Travel & Logistics", type: "Environmental", description: "Business flights, employee commuting, transport emissions." });
    const catSocial = await Category.create({ name: "Social - Corporate Responsibility", type: "Social", description: "Community volunteering, blood donation drives, etc." });
    const catGov = await Category.create({ name: "Governance - Compliance", type: "Governance", description: "Policy compliance, audit findings, compliance resolutions." });

    // 3. Seed Emission Factors
    console.log("Seeding emission factors...");
    await EmissionFactor.create([
      { activityName: "Electricity (Grid)", factor: 0.85, unit: "kWh", category: catScope2._id },
      { activityName: "Natural Gas", factor: 2.05, unit: "m3", category: catScope1._id },
      { activityName: "Diesel Fuel", factor: 2.68, unit: "Liter", category: catScope1._id },
      { activityName: "Petrol Fuel", factor: 2.31, unit: "Liter", category: catScope1._id },
      { activityName: "Air Travel (Short)", factor: 0.15, unit: "km", category: catScope3._id },
      { activityName: "Air Travel (Long)", factor: 0.19, unit: "km", category: catScope3._id },
      { activityName: "Car Travel (Standard)", factor: 0.17, unit: "km", category: catScope3._id },
    ]);

    // 4. Seed Badges
    console.log("Seeding badges...");
    await Badge.create([
      { name: "Green Starter", description: "Earned 100 XP on the ESG EcoSphere platform.", triggerType: "XP", triggerValue: 100 },
      { name: "Eco Warrior", description: "Earned 500 XP on the ESG EcoSphere platform.", triggerType: "XP", triggerValue: 500 },
      { name: "Carbon Champion", description: "Completed 5 carbon tracking challenges.", triggerType: "ChallengesCompleted", triggerValue: 5 },
      { name: "Social Star", description: "Participated in 3 CSR events.", triggerType: "CSRParticipation", triggerValue: 3 },
    ]);

    // 5. Seed Rewards
    console.log("Seeding rewards store...");
    await Reward.create([
      { name: "Eco Water Bottle", description: "Reusable bamboo vacuum-insulated water bottle.", costXP: 150, stock: 25 },
      { name: "Solar Power Bank", description: "10,000mAh solar charging phone battery pack.", costXP: 300, stock: 10 },
      { name: "Coffee Voucher", description: "E-gift card to an organic, fair-trade coffee shop.", costXP: 80, stock: 50 },
    ]);

    // 6. Seed Default ESG Config
    console.log("Seeding ESG Configurations...");
    await ESGConfig.create({
      environmentalWeight: 40,
      socialWeight: 30,
      governanceWeight: 30,
      autoEmissionCalculation: true,
      evidenceRequirement: true,
      badgeAutoAward: true,
    });

    // 7. Seed Users (passwords hashed with bcrypt)
    console.log("Seeding users...");
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash("password123", salt);

    await User.create([
      {
        name: "Admin User",
        email: "admin@ecosphere.com",
        passwordHash,
        role: "ADMIN",
        department: techDept.name,
        xp: 0,
        level: 1,
        badges: [],
      },
      {
        name: "Manager User",
        email: "manager@ecosphere.com",
        passwordHash,
        role: "MANAGER",
        department: opsDept.name,
        xp: 150,
        level: 2,
        badges: ["Green Starter"],
      },
      {
        name: "Employee User",
        email: "employee@ecosphere.com",
        passwordHash,
        role: "EMPLOYEE",
        department: hrDept.name,
        xp: 80,
        level: 1,
        badges: [],
      },
    ]);

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error during database seed:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  }
}

seed();
