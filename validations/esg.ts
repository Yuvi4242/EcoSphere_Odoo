import { z } from "zod";

export const carbonRecordSchema = z.object({
  scope: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  category: z.string().min(1, "Category is required"),
  value: z.number().positive("Value must be a positive number"),
  co2e: z.number().nonnegative(),
  date: z.string().or(z.date()),
  notes: z.string().optional(),
});

export const csrActivitySchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long"),
  description: z.string().min(10, "Description must be at least 10 characters long"),
  date: z.string().or(z.date()),
  type: z.enum(["blood_donation", "tree_plantation", "other"]),
  impactMetric: z.string().optional(),
});

export const policySchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long"),
  description: z.string().min(10, "Description must be at least 10 characters long"),
  version: z.string().min(1, "Version is required"),
});

export const challengeSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long"),
  description: z.string().min(10, "Description must be at least 10 characters long"),
  xpReward: z.number().nonnegative("XP reward must be non-negative"),
  badgeReward: z.string().optional(),
  type: z.enum(["carbon", "social", "governance"]),
  deadline: z.string().or(z.date()),
});

export const reportBuilderSchema = z.object({
  title: z.string().min(3, "Report title is required"),
  type: z.enum(["ESG", "Carbon", "CSR", "Governance", "Custom"]),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  department: z.string().optional(),
});

export type CarbonRecordInput = z.infer<typeof carbonRecordSchema>;
export type CsrActivityInput = z.infer<typeof csrActivitySchema>;
export type PolicyInput = z.infer<typeof policySchema>;
export type ChallengeInput = z.infer<typeof challengeSchema>;
export type ReportBuilderInput = z.infer<typeof reportBuilderSchema>;
