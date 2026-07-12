// ─── ENVIRONMENTAL ──────────────────────────────────────────────────────────

export const emissionsData = [
  { month: "Jan", tCO2e: 412 },
  { month: "Feb", tCO2e: 389 },
  { month: "Mar", tCO2e: 445 },
  { month: "Apr", tCO2e: 398 },
  { month: "May", tCO2e: 421 },
  { month: "Jun", tCO2e: 367 },
  { month: "Jul", tCO2e: 343 },
  { month: "Aug", tCO2e: 358 },
  { month: "Sep", tCO2e: 372 },
  { month: "Oct", tCO2e: 329 },
  { month: "Nov", tCO2e: 315 },
  { month: "Dec", tCO2e: 298 },
];

export const sustainabilityGoals = [
  { id: "G-01", name: "Net Zero Scope 1 Emissions", target: 0, actual: 142, unit: "tCO2e", deadline: "2025-12-31", progress: 72 },
  { id: "G-02", name: "Renewable Energy Usage", target: 100, actual: 63, unit: "%", deadline: "2025-06-30", progress: 63 },
  { id: "G-03", name: "Reduce Fleet Emissions", target: 50, actual: 31, unit: "tCO2e", deadline: "2025-09-30", progress: 62 },
  { id: "G-04", name: "Supplier Carbon Audit", target: 100, actual: 78, unit: "suppliers", deadline: "2025-12-31", progress: 78 },
];

export const emissionFactors = [
  { id: "EF-001", name: "Electricity — Grid (National)", category: "Energy", value: 0.342, unit: "kgCO2e/kWh", lastUpdated: "2025-03-15" },
  { id: "EF-002", name: "Natural Gas Combustion", category: "Energy", value: 2.034, unit: "kgCO2e/m³", lastUpdated: "2025-03-15" },
  { id: "EF-003", name: "Diesel — Road Transport", category: "Fleet", value: 2.68, unit: "kgCO2e/litre", lastUpdated: "2025-01-10" },
  { id: "EF-004", name: "Air Travel — Short Haul", category: "Travel", value: 0.255, unit: "kgCO2e/km", lastUpdated: "2025-02-01" },
  { id: "EF-005", name: "Air Travel — Long Haul", category: "Travel", value: 0.195, unit: "kgCO2e/km", lastUpdated: "2025-02-01" },
  { id: "EF-006", name: "Refrigerant R-410A", category: "Refrigerants", value: 2088, unit: "kgCO2e/kg", lastUpdated: "2024-12-01" },
  { id: "EF-007", name: "Paper — Office Use", category: "Materials", value: 0.009, unit: "kgCO2e/sheet", lastUpdated: "2024-11-20" },
  { id: "EF-008", name: "Wastewater Treatment", category: "Waste", value: 0.708, unit: "kgCO2e/m³", lastUpdated: "2025-01-05" },
];

export const carbonTransactions = [
  { id: "CT-0981", date: "2025-07-08", department: "Manufacturing", source: "Manufacturing", amount: 12.4, origin: "Auto" },
  { id: "CT-0980", date: "2025-07-07", department: "Logistics", source: "Fleet", amount: 3.2, origin: "Auto" },
  { id: "CT-0979", date: "2025-07-06", department: "Finance", source: "Purchase", amount: 0.8, origin: "Manual" },
  { id: "CT-0978", date: "2025-07-05", department: "Engineering", source: "Expense", amount: 1.1, origin: "Manual" },
  { id: "CT-0977", date: "2025-07-04", department: "Manufacturing", source: "Manufacturing", amount: 15.7, origin: "Auto" },
  { id: "CT-0976", date: "2025-07-03", department: "HR", source: "Expense", amount: 0.3, origin: "Manual" },
  { id: "CT-0975", date: "2025-07-02", department: "Logistics", source: "Fleet", amount: 4.9, origin: "Auto" },
  { id: "CT-0974", date: "2025-07-01", department: "Sales", source: "Purchase", amount: 2.2, origin: "Manual" },
  { id: "CT-0973", date: "2025-06-30", department: "Manufacturing", source: "Manufacturing", amount: 18.3, origin: "Auto" },
];

export const departmentCarbon = [
  { department: "Manufacturing", tCO2e: 187.4, limit: 200 },
  { department: "Logistics", tCO2e: 92.1, limit: 100 },
  { department: "Engineering", tCO2e: 41.8, limit: 60 },
  { department: "Sales", tCO2e: 34.2, limit: 50 },
  { department: "Finance", tCO2e: 18.9, limit: 30 },
  { department: "HR", tCO2e: 12.4, limit: 25 },
  { department: "Marketing", tCO2e: 9.7, limit: 20 },
  { department: "Admin", tCO2e: 6.3, limit: 15 },
];

// ─── GAMIFICATION ────────────────────────────────────────────────────────────

export const challenges = [
  { id: "CH-31", title: "Carbon Audit Q3", points: 500, deadline: "2025-09-30", assignee: "Sarah K.", status: "todo" },
  { id: "CH-30", title: "Zero-Waste Office Week", points: 250, deadline: "2025-08-15", assignee: "Tom R.", status: "todo" },
  { id: "CH-29", title: "EV Fleet Transition Plan", points: 750, deadline: "2025-12-31", assignee: "Maria L.", status: "inprogress" },
  { id: "CH-28", title: "Supplier ESG Survey", points: 400, deadline: "2025-10-01", assignee: "James P.", status: "inprogress" },
  { id: "CH-27", title: "Diversity Training Module", points: 200, deadline: "2025-07-20", assignee: "Priya M.", status: "inprogress" },
  { id: "CH-26", title: "Solar Panel ROI Analysis", points: 350, deadline: "2025-08-01", assignee: "Alex T.", status: "done" },
  { id: "CH-25", title: "Emissions Report FY24", points: 600, deadline: "2025-06-30", assignee: "Sarah K.", status: "done" },
  { id: "CH-24", title: "Policy Acknowledgement Drive", points: 150, deadline: "2025-06-15", assignee: "Tom R.", status: "done" },
];

export const badges = [
  { id: "B-01", name: "Carbon Crusher", icon: "🌿", description: "Logged 50+ carbon transactions", earned: true, earnedDate: "2025-04-12" },
  { id: "B-02", name: "Green Champion", icon: "🏆", description: "Achieved a sustainability goal", earned: true, earnedDate: "2025-05-01" },
  { id: "B-03", name: "Policy Pro", icon: "📋", description: "Acknowledged all active policies", earned: true, earnedDate: "2025-03-20" },
  { id: "B-04", name: "Challenge Master", icon: "⚡", description: "Completed 10 challenges", earned: true, earnedDate: "2025-06-14" },
  { id: "B-05", name: "ESG Scholar", icon: "🎓", description: "Completed all training modules", earned: true, earnedDate: "2025-07-01" },
  { id: "B-06", name: "Diversity Advocate", icon: "🌈", description: "Participated in 3 CSR activities", earned: false, unlockRule: "Participate in 3 CSR activities" },
  { id: "B-07", name: "Audit Ace", icon: "🔍", description: "Passed 5 compliance audits", earned: false, unlockRule: "Pass 5 compliance audits" },
  { id: "B-08", name: "XP Legend", icon: "⭐", description: "Reach 10,000 XP", earned: false, unlockRule: "Unlock at 10,000 XP" },
  { id: "B-09", name: "Streak Keeper", icon: "🔥", description: "30-day logging streak", earned: false, unlockRule: "Maintain a 30-day logging streak" },
  { id: "B-10", name: "Top Contributor", icon: "💡", description: "Rank #1 on leaderboard", earned: false, unlockRule: "Reach #1 on the leaderboard" },
  { id: "B-11", name: "Fleet Fighter", icon: "🚗", description: "Reduce fleet emissions by 20%", earned: false, unlockRule: "Reduce fleet emissions by 20%" },
  { id: "B-12", name: "Zero Waste", icon: "♻️", description: "Zero waste office week completed", earned: false, unlockRule: "Complete Zero-Waste Office Week challenge" },
];

export const rewards = [
  { id: "R-01", name: "Extra Vacation Day", description: "One additional paid leave day", points: 5000, stock: 10, category: "Time Off" },
  { id: "R-02", name: "Wellness Subscription", description: "3-month premium wellness app", points: 2500, stock: 25, category: "Wellness" },
  { id: "R-03", name: "Eco Gift Hamper", description: "Sustainable living products kit", points: 1500, stock: 0, category: "Gifts" },
  { id: "R-04", name: "Learning Budget", description: "€200 toward any online course", points: 3000, stock: 15, category: "Learning" },
  { id: "R-05", name: "Team Lunch Voucher", description: "Lunch for you and your team", points: 1000, stock: 8, category: "Social" },
  { id: "R-06", name: "EcoSphere Swag Pack", description: "Branded sustainable merchandise", points: 500, stock: 50, category: "Gifts" },
];

export const leaderboard = [
  { rank: 1, name: "Sarah K.", avatar: "SK", department: "Engineering", xp: 9847, change: "+120" },
  { rank: 2, name: "Tom R.", avatar: "TR", department: "Manufacturing", xp: 8923, change: "+85" },
  { rank: 3, name: "Maria L.", avatar: "ML", department: "HR", xp: 8102, change: "+210" },
  { rank: 4, name: "James P.", avatar: "JP", department: "Finance", xp: 7654, change: "+34" },
  { rank: 5, name: "Priya M.", avatar: "PM", department: "Sales", xp: 6988, change: "+156" },
  { rank: 6, name: "Alex T.", avatar: "AT", department: "Logistics", xp: 6412, change: "-22" },
  { rank: 7, name: "Chen W.", avatar: "CW", department: "Engineering", xp: 5891, change: "+67" },
  { rank: 8, name: "Laura F.", avatar: "LF", department: "Marketing", xp: 5230, change: "+91" },
  { rank: 9, name: "David O.", avatar: "DO", department: "Admin", xp: 4782, change: "+12" },
  { rank: 10, name: "Nina B.", avatar: "NB", department: "Manufacturing", xp: 4234, change: "+44" },
];

export const redemptionHistory = [
  { id: "RH-01", reward: "Team Lunch Voucher", date: "2025-06-20", points: 1000 },
  { id: "RH-02", reward: "EcoSphere Swag Pack", date: "2025-04-05", points: 500 },
  { id: "RH-03", reward: "Wellness Subscription", date: "2025-02-14", points: 2500 },
];

// ─── GOVERNANCE ──────────────────────────────────────────────────────────────

export const audits = [
  { id: "AUD-014", name: "ISO 14001 Environmental Audit", department: "Manufacturing", date: "2025-07-10", status: "Passed", linkedIssues: 2 },
  { id: "AUD-013", name: "GDPR Data Compliance Review", department: "IT", date: "2025-07-01", status: "Failed", linkedIssues: 5 },
  { id: "AUD-012", name: "Health & Safety Audit", department: "Logistics", date: "2025-06-25", status: "Passed", linkedIssues: 0 },
  { id: "AUD-011", name: "Financial Controls Review", department: "Finance", date: "2025-09-15", status: "Scheduled", linkedIssues: 0 },
  { id: "AUD-010", name: "Supplier Code of Conduct", department: "Procurement", date: "2025-06-10", status: "Passed", linkedIssues: 1 },
  { id: "AUD-009", name: "Energy Management Audit", department: "Engineering", date: "2025-08-20", status: "Scheduled", linkedIssues: 0 },
];

export const auditFindings = {
  "AUD-014": [
    { id: "F-001", title: "Waste segregation non-conformance in Zone B", severity: "Medium", status: "Open" },
    { id: "F-002", title: "Missing environmental impact assessment for Line 3", severity: "Low", status: "Resolved" },
  ],
  "AUD-013": [
    { id: "F-003", title: "Data retention policy not enforced for EU customers", severity: "Critical", status: "Open" },
    { id: "F-004", title: "Missing consent records for marketing emails", severity: "High", status: "Open" },
    { id: "F-005", title: "Outdated privacy notice on customer portal", severity: "Medium", status: "Open" },
    { id: "F-006", title: "Log access controls insufficient", severity: "High", status: "Open" },
    { id: "F-007", title: "DPO contact not published", severity: "Low", status: "Open" },
  ],
};

export const complianceIssues = [
  { id: "CI-042", issue: "GDPR data retention not enforced", severity: "Critical", owner: "IT Team", ownerInitials: "IT", dueDate: "2025-07-05", status: "Open" },
  { id: "CI-041", issue: "Missing fire evacuation plan — Warehouse C", severity: "High", owner: "James P.", ownerInitials: "JP", dueDate: "2025-07-15", status: "Open" },
  { id: "CI-040", issue: "Annual policy review overdue — HR Policy v2.1", severity: "Medium", owner: "Priya M.", ownerInitials: "PM", dueDate: "2025-06-30", status: "Open" },
  { id: "CI-039", issue: "Supplier audit certificate expired", severity: "High", owner: "Maria L.", ownerInitials: "ML", dueDate: "2025-07-20", status: "In Progress" },
  { id: "CI-038", issue: "Emissions data gap — March 2025", severity: "Medium", owner: "Alex T.", ownerInitials: "AT", dueDate: "2025-08-01", status: "In Progress" },
  { id: "CI-037", issue: "Training completion below 80% threshold", severity: "Low", owner: "Sarah K.", ownerInitials: "SK", dueDate: "2025-09-01", status: "Resolved" },
  { id: "CI-036", issue: "Conflict of interest disclosure missing — 3 employees", severity: "High", owner: "Legal", ownerInitials: "LG", dueDate: "2025-06-01", status: "Resolved" },
];

export const policies = [
  { id: "POL-14", name: "Environmental Management Policy", category: "Environmental", version: "v3.2", effectiveDate: "2025-01-01", status: "Active", ackRate: 94 },
  { id: "POL-13", name: "Data Privacy & GDPR Policy", category: "Governance", version: "v2.1", effectiveDate: "2024-05-25", status: "Active", ackRate: 87 },
  { id: "POL-12", name: "Code of Conduct", category: "Social", version: "v5.0", effectiveDate: "2024-01-01", status: "Active", ackRate: 98 },
  { id: "POL-11", name: "Anti-Bribery & Corruption Policy", category: "Governance", version: "v2.0", effectiveDate: "2024-03-01", status: "Active", ackRate: 96 },
  { id: "POL-10", name: "Whistleblower Protection Policy", category: "Social", version: "v1.2", effectiveDate: "2024-07-01", status: "Active", ackRate: 82 },
  { id: "POL-09", name: "Supplier Code of Conduct", category: "Governance", version: "v1.4", effectiveDate: "2025-02-01", status: "Under Review", ackRate: 71 },
];

export const policyAcknowledgements = {
  "POL-14": [
    { employee: "Sarah K.", initials: "SK", department: "Engineering", status: "Acknowledged", date: "2025-01-15" },
    { employee: "Tom R.", initials: "TR", department: "Manufacturing", status: "Acknowledged", date: "2025-01-18" },
    { employee: "Maria L.", initials: "ML", department: "HR", status: "Pending", date: null },
    { employee: "James P.", initials: "JP", department: "Finance", status: "Acknowledged", date: "2025-01-20" },
    { employee: "Priya M.", initials: "PM", department: "Sales", status: "Pending", date: null },
  ],
};

// ─── SOCIAL ──────────────────────────────────────────────────────────────────

export const csrActivities = [
  { id: "CSR-22", name: "Community Tree Planting Drive", category: "Environmental", date: "2025-07-20", participants: 34, budget: 2400, status: "Upcoming" },
  { id: "CSR-21", name: "Local School STEM Workshop", category: "Education", date: "2025-07-05", participants: 12, budget: 800, status: "Completed" },
  { id: "CSR-20", name: "Food Bank Volunteer Day", category: "Community", date: "2025-06-28", participants: 28, budget: 0, status: "Completed" },
  { id: "CSR-19", name: "Coastal Cleanup Initiative", category: "Environmental", date: "2025-08-10", participants: 45, budget: 1200, status: "Pending Approval" },
  { id: "CSR-18", name: "Mental Health Awareness Week", category: "Wellness", date: "2025-06-10", participants: 80, budget: 3500, status: "Completed" },
];

export const diversityData = {
  gender: [
    { name: "Women", value: 44 },
    { name: "Men", value: 53 },
    { name: "Non-binary", value: 3 },
  ],
  ageGroups: [
    { group: "18–25", count: 18 },
    { group: "26–35", count: 34 },
    { group: "36–45", count: 27 },
    { group: "46–55", count: 14 },
    { group: "56+", count: 7 },
  ],
  leadership: [
    { name: "Women in Leadership", value: 38 },
    { name: "Men in Leadership", value: 59 },
    { name: "Non-binary in Leadership", value: 3 },
  ],
};

export const trainingModules = [
  { id: "TM-01", name: "ESG Fundamentals", type: "Mandatory", deptProgress: { Manufacturing: 82, Engineering: 91, Sales: 74, Finance: 95, HR: 100, Logistics: 68 } },
  { id: "TM-02", name: "GDPR & Data Privacy", type: "Mandatory", deptProgress: { Manufacturing: 67, Engineering: 88, Sales: 72, Finance: 100, HR: 95, Logistics: 55 } },
  { id: "TM-03", name: "Health & Safety", type: "Mandatory", deptProgress: { Manufacturing: 100, Engineering: 94, Sales: 89, Finance: 82, HR: 100, Logistics: 97 } },
  { id: "TM-04", name: "Unconscious Bias Training", type: "Optional", deptProgress: { Manufacturing: 45, Engineering: 62, Sales: 51, Finance: 70, HR: 88, Logistics: 38 } },
  { id: "TM-05", name: "Carbon Accounting Basics", type: "Optional", deptProgress: { Manufacturing: 78, Engineering: 84, Sales: 40, Finance: 55, HR: 32, Logistics: 60 } },
];

// ─── REPORTS ─────────────────────────────────────────────────────────────────

export const reportSummaries = {
  environmental: { totalEmissions: 4281, goalsOnTrack: 3, targetReduction: 15, renewableEnergyPct: 63 },
  social: { csrBudgetSpent: 12400, volunteersEngaged: 189, trainingCompletion: 78, diversityScore: 81 },
  governance: { policiesActive: 6, auditPassRate: 67, openComplianceIssues: 5, policyAckRate: 88 },
  esgScore: { total: 74, environmental: 71, social: 78, governance: 73 },
};

// ─── SETTINGS ────────────────────────────────────────────────────────────────

export const departments = [
  { id: "D-01", name: "Engineering", code: "ENG", head: "Sarah K.", employees: 42, status: "Active", parent: null },
  { id: "D-02", name: "Manufacturing", code: "MFG", head: "Tom R.", employees: 128, status: "Active", parent: null },
  { id: "D-03", name: "Finance", code: "FIN", head: "James P.", employees: 31, status: "Active", parent: null },
  { id: "D-04", name: "HR", code: "HR", head: "Priya M.", employees: 18, status: "Active", parent: null },
  { id: "D-05", name: "Sales", code: "SLS", head: "Maria L.", employees: 55, status: "Active", parent: null },
  { id: "D-06", name: "Logistics", code: "LOG", head: "Alex T.", employees: 47, status: "Active", parent: null },
  { id: "D-07", name: "Frontend Dev", code: "ENG-FE", head: "Chen W.", employees: 14, status: "Active", parent: "D-01" },
  { id: "D-08", name: "Backend Dev", code: "ENG-BE", head: "Nina B.", employees: 19, status: "Active", parent: "D-01" },
];

export const categories = [
  { id: "CAT-01", name: "Environmental Initiative", type: "CSR Activity", status: "Active" },
  { id: "CAT-02", name: "Community Outreach", type: "CSR Activity", status: "Active" },
  { id: "CAT-03", name: "Carbon Reduction", type: "Challenge", status: "Active" },
  { id: "CAT-04", name: "Waste Management", type: "Challenge", status: "Active" },
  { id: "CAT-05", name: "Employee Wellness", type: "CSR Activity", status: "Inactive" },
];

export const users = [
  { id: "U-01", name: "Sarah K.", initials: "SK", email: "sarah.k@ecosphere.io", department: "Engineering", role: "Admin" },
  { id: "U-02", name: "Tom R.", initials: "TR", email: "tom.r@ecosphere.io", department: "Manufacturing", role: "Manager" },
  { id: "U-03", name: "Maria L.", initials: "ML", email: "maria.l@ecosphere.io", department: "HR", role: "Manager" },
  { id: "U-04", name: "James P.", initials: "JP", email: "james.p@ecosphere.io", department: "Finance", role: "Viewer" },
  { id: "U-05", name: "Priya M.", initials: "PM", email: "priya.m@ecosphere.io", department: "Sales", role: "Viewer" },
  { id: "U-06", name: "Alex T.", initials: "AT", email: "alex.t@ecosphere.io", department: "Logistics", role: "Manager" },
];
