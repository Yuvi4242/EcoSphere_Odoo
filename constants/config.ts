export const EMISSION_FACTORS = {
  electricity: 0.85, // kg CO2e per kWh
  naturalGas: 2.05,  // kg CO2e per m3
  diesel: 2.68,      // kg CO2e per liter
  petrol: 2.31,      // kg CO2e per liter
  flightShort: 0.15, // kg CO2e per km (short haul)
  flightLong: 0.19,  // kg CO2e per km (long haul)
  carStandard: 0.17, // kg CO2e per km
} as const;

export const DEPARTMENTS = [
  "Operations",
  "Facilities",
  "Human Resources",
  "Procurement",
  "IT & Engineering",
  "Finance",
  "Marketing & CSR",
] as const;

export const ROLES = {
  ADMIN: "Admin",
  MANAGER: "Manager",
  EMPLOYEE: "Employee",
} as const;

export const SIDEBAR_MENU = [
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: "LayoutDashboard",
    roles: ["ADMIN", "MANAGER", "EMPLOYEE"],
  },
  {
    title: "Environmental",
    path: "/dashboard/environmental",
    icon: "Leaf",
    roles: ["ADMIN", "MANAGER"],
  },
  {
    title: "Social Impact (CSR)",
    path: "/dashboard/social",
    icon: "Users",
    roles: ["ADMIN", "MANAGER"],
  },
  {
    title: "Governance",
    path: "/dashboard/governance",
    icon: "ShieldCheck",
    roles: ["ADMIN", "MANAGER"],
  },
  {
    title: "Gamification",
    path: "/dashboard/gamification",
    icon: "Trophy",
    roles: ["ADMIN", "MANAGER", "EMPLOYEE"],
  },
  {
    title: "Reports Builder",
    path: "/dashboard/reports",
    icon: "FileSpreadsheet",
    roles: ["ADMIN", "MANAGER"],
  },
  {
    title: "Settings",
    path: "/dashboard/settings",
    icon: "Settings",
    roles: ["ADMIN", "MANAGER", "EMPLOYEE"],
  },
];
