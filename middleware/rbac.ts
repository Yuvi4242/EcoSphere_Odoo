import { DecodedJWT } from "./auth";

/**
 * Role Permissions Configuration:
 * - ADMIN: Access to all routes
 * - MANAGER: Access to dashboard features and modules
 * - EMPLOYEE: Access to dashboard core pages, settings, and gamification
 */
const ROLE_PERMISSIONS: Record<string, string[]> = {
  ADMIN: ["*"],
  MANAGER: [
    "/dashboard",
    "/dashboard/environmental",
    "/dashboard/social",
    "/dashboard/governance",
    "/dashboard/gamification",
    "/dashboard/reports",
    "/dashboard/settings",
  ],
  EMPLOYEE: [
    "/dashboard",
    "/dashboard/gamification",
    "/dashboard/settings",
  ],
};

export function checkRoleAccess(role: "ADMIN" | "MANAGER" | "EMPLOYEE", path: string): boolean {
  if (role === "ADMIN") return true;

  const allowedPaths = ROLE_PERMISSIONS[role] || [];
  
  // Exact or prefix match
  return allowedPaths.some(
    (allowedPath) => path === allowedPath || path.startsWith(`${allowedPath}/`)
  );
}
