import { z } from 'zod';

export const PolicySchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  description: z.string().min(1, 'Description is required'),
  summary: z.string().min(1, 'Summary is required'),
  categoryId: z.string().min(1, 'Category is required'),
  departmentId: z.string().min(1, 'Department is required'),
  status: z.enum(['Draft', 'Published', 'Archived']),
  version: z.string().regex(/^\d+\.\d+\.\d+$/, 'Version must follow semver format (e.g., 1.0.0)'),
  effectiveDate: z.string().min(1, 'Effective date is required'),
  expiryDate: z.string().min(1, 'Expiry date is required'),
  pdfUrl: z.string().optional().nullable(),
}).refine((data) => {
  return new Date(data.expiryDate) > new Date(data.effectiveDate);
}, {
  message: 'Expiry date must be after effective date',
  path: ['expiryDate'],
});

export const ComplianceRequirementSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  description: z.string().min(1, 'Description is required'),
  ownerId: z.string().min(1, 'Owner is required'),
  departmentId: z.string().min(1, 'Department is required'),
  priority: z.enum(['Low', 'Medium', 'High', 'Critical']),
  frequency: z.enum(['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Yearly']),
  status: z.enum(['Pending', 'In Progress', 'Completed', 'Overdue']),
  dueDate: z.string().min(1, 'Due date is required'),
});

export const AuditSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  departmentId: z.string().min(1, 'Department is required'),
  auditorId: z.string().min(1, 'Auditor is required'),
  auditDate: z.string().min(1, 'Audit date is required'),
  status: z.enum(['Scheduled', 'In Progress', 'Completed', 'Cancelled']),
  riskLevel: z.enum(['Low', 'Medium', 'High', 'Critical']),
  overallScore: z.number().min(0).max(100).optional().nullable(),
  recommendation: z.string().optional().nullable(),
  summary: z.string().optional().nullable(),
});

export const RiskAssessmentSchema = z.object({
  departmentId: z.string().min(1, 'Department is required'),
  title: z.string().min(1, 'Title is required').max(255),
  description: z.string().min(1, 'Description is required'),
  riskLevel: z.enum(['Low', 'Medium', 'High', 'Critical']),
  mitigationPlan: z.string().optional().nullable(),
  ownerId: z.string().min(1, 'Owner is required'),
  impact: z.enum(['Low', 'Medium', 'High']),
  probability: z.enum(['Low', 'Medium', 'High']),
  status: z.string(),
});

export type PolicyInput = z.infer<typeof PolicySchema>;
export type ComplianceRequirementInput = z.infer<typeof ComplianceRequirementSchema>;
export type AuditInput = z.infer<typeof AuditSchema>;
export type RiskAssessmentInput = z.infer<typeof RiskAssessmentSchema>;
