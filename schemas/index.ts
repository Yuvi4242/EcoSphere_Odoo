// Shared constants & schema specifications for MongoDB models and Zod validators
export const AppScopes = [1, 2, 3] as const;
export const ActivityTypes = ["blood_donation", "tree_plantation", "other"] as const;
export const ReportTypes = ["ESG", "Carbon", "CSR", "Governance", "Custom"] as const;
export const UserRoles = ["ADMIN", "MANAGER", "EMPLOYEE"] as const;
export type AppScope = typeof AppScopes[number];
export type ActivityType = typeof ActivityTypes[number];
export type ReportType = typeof ReportTypes[number];
export type UserRole = typeof UserRoles[number];
