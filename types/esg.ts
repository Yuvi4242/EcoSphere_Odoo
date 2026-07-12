export interface CarbonRecord {
  id: string;
  userId: string;
  scope: 1 | 2 | 3;
  category: string; // "electricity" | "fuel" | "travel" | "waste" etc.
  value: number; // e.g. kWh, liters, km
  co2e: number; // calculated CO2 equivalent in kg
  date: string;
  notes?: string;
}

export interface CsrActivity {
  id: string;
  title: string;
  description: string;
  date: string;
  type: "blood_donation" | "tree_plantation" | "other";
  volunteers: string[]; // user IDs
  impactMetric?: string; // e.g., "100 trees planted"
}

export interface Policy {
  id: string;
  title: string;
  description: string;
  version: string;
  publishedAt: string;
  acceptedBy: string[]; // user IDs
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  badgeReward?: string;
  type: "carbon" | "social" | "governance";
  deadline: string;
  completedBy: string[]; // user IDs
}

export interface EsgScoreCard {
  environmental: number;
  social: number;
  governance: number;
  overall: number;
}

export interface Department {
  id: string;
  name: string;
  parentDepartment?: string;
}

export interface Category {
  id: string;
  name: string;
  type: "Environmental" | "Social" | "Governance";
  description?: string;
}

export interface EmissionFactor {
  id: string;
  activityName: string;
  factor: number;
  unit: string;
  category: string;
}

export interface ProductESGProfile {
  id: string;
  name: string;
  description?: string;
  carbonFootprint: number;
  socialRating: number;
  governanceRating: number;
}

export interface EnvironmentalGoal {
  id: string;
  title: string;
  description?: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  deadline: string;
  status: "Active" | "Achieved" | "Failed";
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  triggerType: "XP" | "ChallengesCompleted" | "CSRParticipation";
  triggerValue: number;
}

export interface Reward {
  id: string;
  name: string;
  description: string;
  costXP: number;
  stock: number;
}

export interface EmployeeParticipation {
  id: string;
  userId: string;
  activityId: string;
  hoursVolunteered: number;
  status: "Pending" | "Approved" | "Rejected";
  proofUrl?: string;
}

export interface ChallengeParticipation {
  id: string;
  userId: string;
  challengeId: string;
  status: "Pending" | "Completed" | "Failed";
  proofUrl?: string;
}

export interface PolicyAcknowledgement {
  id: string;
  userId: string;
  policyId: string;
  acknowledgedAt: string;
}

export interface Audit {
  id: string;
  title: string;
  auditor: string;
  date: string;
  findings?: string;
  scope: "Environmental" | "Social" | "Governance";
}

export interface ComplianceIssue {
  id: string;
  title: string;
  description: string;
  status: "Open" | "Resolved" | "Overdue";
  dueDate: string;
  owner: string;
}

export interface DepartmentScore {
  id: string;
  departmentId: string;
  environmentalScore: number;
  socialScore: number;
  governanceScore: number;
  overallScore: number;
  calculatedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: "Info" | "Alert" | "Achievement";
  isRead: boolean;
  createdAt: string;
}

export interface ESGConfig {
  id: string;
  environmentalWeight: number;
  socialWeight: number;
  governanceWeight: number;
  autoEmissionCalculation: boolean;
  evidenceRequirement: boolean;
  badgeAutoAward: boolean;
}

