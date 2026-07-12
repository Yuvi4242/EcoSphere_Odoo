'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

// ==========================================
// TYPES DEFINITIONS
// ==========================================

export interface Department {
  id: string;
  name: string;
  code: string;
  head: string;
  employeeCount: number;
  carbonBudget: number; // in kg CO2 per month
  status: 'Active' | 'Inactive';
}

export interface EmissionFactor {
  id: string;
  name: string;
  category: 'Purchase' | 'Manufacturing' | 'Expense' | 'Fleet';
  co2Rate: number; // kg CO2 per unit
  unit: string; // e.g. kWh, Liters, km, kg
  status: 'Active' | 'Inactive';
}

export interface CarbonTransaction {
  id: string;
  date: string;
  category: 'Purchase' | 'Manufacturing' | 'Expense' | 'Fleet';
  description: string;
  value: number; // Qty
  unit: string;
  emissionFactorId: string;
  emissionFactorRate: number;
  calculatedEmissions: number; // in kg CO2
  departmentId: string;
  sourceRecordId?: string; // Links to mock ERP records
}

export interface SustainabilityGoal {
  id: string;
  name: string;
  category: 'Purchase' | 'Manufacturing' | 'Expense' | 'Fleet' | 'All';
  targetReductionPercent: number;
  targetValue: number; // Target emissions limit in kg CO2
  currentValue: number; // Cumulative emissions in period
  baselineValue: number; // Baseline emissions to compare
  startDate: string;
  endDate: string;
  departmentId: string; // 'all' or specific department
  status: 'Draft' | 'Active' | 'Achieved' | 'Failed';
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  unlockRule: string; // Description of rule e.g. "XP >= 200", "Completed Challenges >= 3"
  unlockType: 'xp' | 'transactions' | 'goals';
  unlockThreshold: number;
  icon: string; // Name of Lucide icon
  unlocked: boolean;
}

export interface Reward {
  id: string;
  name: string;
  description: string;
  pointsRequired: number;
  stock: number;
  status: 'Available' | 'Out of Stock' | 'Archived';
  icon: string;
}

export interface ComplianceIssue {
  id: string;
  auditName: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  description: string;
  owner: string;
  dueDate: string;
  status: 'Open' | 'Resolved';
}

export interface Notification {
  id: string;
  type: 'compliance' | 'approval' | 'policy' | 'badge' | 'goal' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface MockErpRecord {
  id: string;
  date: string;
  type: 'Purchase' | 'Manufacturing' | 'Expense' | 'Fleet';
  description: string;
  value: number;
  unit: string;
  departmentId: string;
  status: 'Pending' | 'Processed';
}

export interface UserProfile {
  name: string;
  role: string;
  xp: number;
  points: number;
  level: number;
  badges: string[]; // Badge IDs
}

export interface ESGSettings {
  weights: {
    environmental: number;
    social: number;
    governance: number;
  };
  autoEmission: boolean;
  evidenceRequired: boolean;
  badgeAutoAward: boolean;
  notifications: {
    email: boolean;
    inApp: boolean;
    complianceAlerts: boolean;
    badgeAlerts: boolean;
    goalAlerts: boolean;
  };
}

// Derived Scores interface
export interface DepartmentScore {
  departmentId: string;
  departmentName: string;
  environmentalScore: number;
  socialScore: number;
  governanceScore: number;
  totalScore: number;
  emissions: number;
}

interface ESGContextType {
  departments: Department[];
  emissionFactors: EmissionFactor[];
  carbonTransactions: CarbonTransaction[];
  sustainabilityGoals: SustainabilityGoal[];
  badges: Badge[];
  rewards: Reward[];
  complianceIssues: ComplianceIssue[];
  notifications: Notification[];
  mockErpRecords: MockErpRecord[];
  currentUser: UserProfile;
  settings: ESGSettings;
  departmentScores: DepartmentScore[];
  overallEsgScore: number;
  
  // State Mutators
  addDepartment: (dept: Omit<Department, 'id'>) => void;
  updateDepartment: (id: string, dept: Partial<Department>) => void;
  deleteDepartment: (id: string) => void;
  
  addEmissionFactor: (factor: Omit<EmissionFactor, 'id'>) => void;
  updateEmissionFactor: (id: string, factor: Partial<EmissionFactor>) => void;
  deleteEmissionFactor: (id: string) => void;
  
  addManualTransaction: (tx: {
    date: string;
    category: 'Purchase' | 'Manufacturing' | 'Expense' | 'Fleet';
    description: string;
    value: number;
    emissionFactorId: string;
    departmentId: string;
  }) => void;
  
  processErpRecord: (recordId: string) => boolean;
  
  addSustainabilityGoal: (goal: Omit<SustainabilityGoal, 'id' | 'currentValue' | 'status'>) => void;
  updateSustainabilityGoal: (id: string, goal: Partial<SustainabilityGoal>) => void;
  
  redeemReward: (rewardId: string) => boolean;
  resolveComplianceIssue: (id: string) => void;
  addComplianceIssue: (issue: Omit<ComplianceIssue, 'id' | 'status'>) => void;
  acknowledgePolicy: (policyName: string) => void;
  
  updateSettings: (settings: Partial<ESGSettings>) => void;
  markNotificationRead: (id: string) => void;
  clearAllNotifications: () => void;
  resetAllData: () => void;
}

// ==========================================
// DEFAULT SEED DATA
// ==========================================

const defaultDepartments: Department[] = [
  { id: 'd1', name: 'Manufacturing & Production', code: 'PROD', head: 'John Davis', employeeCount: 120, carbonBudget: 8000, status: 'Active' },
  { id: 'd2', name: 'Logistics & Fleet', code: 'LOG', head: 'Elena Rostova', employeeCount: 45, carbonBudget: 6000, status: 'Active' },
  { id: 'd3', name: 'HQ Administration', code: 'ADMIN', head: 'Robert Chen', employeeCount: 80, carbonBudget: 2000, status: 'Active' },
  { id: 'd4', name: 'Research & Development', code: 'R&D', head: 'Dr. Sarah Lin', employeeCount: 35, carbonBudget: 1500, status: 'Active' }
];

const defaultEmissionFactors: EmissionFactor[] = [
  { id: 'ef1', name: 'Grid Electricity', category: 'Manufacturing', co2Rate: 0.38, unit: 'kWh', status: 'Active' },
  { id: 'ef2', name: 'Natural Gas Heating', category: 'Manufacturing', co2Rate: 2.02, unit: 'm³', status: 'Active' },
  { id: 'ef3', name: 'Company Diesel Vehicle', category: 'Fleet', co2Rate: 2.68, unit: 'Liters', status: 'Active' },
  { id: 'ef4', name: 'Employee Travel (Petrol)', category: 'Fleet', co2Rate: 0.12, unit: 'km', status: 'Active' },
  { id: 'ef5', name: 'Office HVAC & Aircon', category: 'Expense', co2Rate: 0.45, unit: 'kWh', status: 'Active' },
  { id: 'ef6', name: 'Paper & Office Supplies', category: 'Purchase', co2Rate: 0.95, unit: 'kg', status: 'Active' }
];

const defaultCarbonTransactions: CarbonTransaction[] = [
  { id: 'tx1', date: '2026-07-01', category: 'Manufacturing', description: 'Monthly production line grid power consumption', value: 12000, unit: 'kWh', emissionFactorId: 'ef1', emissionFactorRate: 0.38, calculatedEmissions: 4560, departmentId: 'd1' },
  { id: 'tx2', date: '2026-07-03', category: 'Fleet', description: 'Logistics delivery truck refueling (Diesel)', value: 850, unit: 'Liters', emissionFactorId: 'ef3', emissionFactorRate: 2.68, calculatedEmissions: 2278, departmentId: 'd2' },
  { id: 'tx3', date: '2026-07-05', category: 'Expense', description: 'HQ Office central cooling systems', value: 3400, unit: 'kWh', emissionFactorId: 'ef5', emissionFactorRate: 0.45, calculatedEmissions: 1530, departmentId: 'd3' },
  { id: 'tx4', date: '2026-07-08', category: 'Purchase', description: 'Bulk recycled printer paper purchase', value: 400, unit: 'kg', emissionFactorId: 'ef6', emissionFactorRate: 0.95, calculatedEmissions: 380, departmentId: 'd3' },
  { id: 'tx5', date: '2026-07-09', category: 'Fleet', description: 'Sales reps client visits travel log', value: 1500, unit: 'km', emissionFactorId: 'ef4', emissionFactorRate: 0.12, calculatedEmissions: 180, departmentId: 'd2' }
];

const defaultSustainabilityGoals: SustainabilityGoal[] = [
  { id: 'g1', name: 'Reduce Fleet Carbon by 15%', category: 'Fleet', targetReductionPercent: 15, targetValue: 3000, currentValue: 2458, baselineValue: 3500, startDate: '2026-07-01', endDate: '2026-09-30', departmentId: 'd2', status: 'Active' },
  { id: 'g2', name: 'HQ Energy Conservation Target', category: 'Expense', targetReductionPercent: 10, targetValue: 1400, currentValue: 1530, baselineValue: 1600, startDate: '2026-07-01', endDate: '2026-07-31', departmentId: 'd3', status: 'Active' },
  { id: 'g3', name: 'Manufacturing Efficiency Initiative', category: 'Manufacturing', targetReductionPercent: 20, targetValue: 4000, currentValue: 4560, baselineValue: 5000, startDate: '2026-07-01', endDate: '2026-12-31', departmentId: 'd1', status: 'Active' }
];

const defaultBadges: Badge[] = [
  { id: 'b1', name: 'Carbon Auditor', description: 'Logged 3 or more Carbon Transactions manually', unlockRule: 'Log 3 manual transactions', unlockType: 'transactions', unlockThreshold: 3, icon: 'FileSpreadsheet', unlocked: false },
  { id: 'b2', name: 'Eco Pioneer', description: 'Accumulate 200 XP from sustainability goals and initiatives', unlockRule: 'Reach 200 XP', unlockType: 'xp', unlockThreshold: 200, icon: 'Leaf', unlocked: false },
  { id: 'b3', name: 'Goal Overachiever', description: 'Log a transaction that completes a sustainability goal', unlockRule: 'Complete 1 goal', unlockType: 'goals', unlockThreshold: 1, icon: 'Trophy', unlocked: false }
];

const defaultRewards: Reward[] = [
  { id: 'r1', name: 'Organic Cotton Eco-Tee', description: 'Premium EcoSphere branded 100% organic cotton t-shirt.', pointsRequired: 100, stock: 15, status: 'Available', icon: 'Shirt' },
  { id: 'r2', name: 'Bamboo Coffee Tumbler', description: 'Double-walled insulated thermos made from renewable bamboo.', pointsRequired: 50, stock: 8, status: 'Available', icon: 'CupSoda' },
  { id: 'r3', name: 'Tree Planting Certificate', description: 'We will plant 5 trees in your name with OneTreePlanted.', pointsRequired: 30, stock: 100, status: 'Available', icon: 'Trees' },
  { id: 'r4', name: 'Sustainable Gym Duffle Bag', description: 'Made from 100% recycled plastic water bottles.', pointsRequired: 150, stock: 0, status: 'Out of Stock', icon: 'ShoppingBag' }
];

const defaultComplianceIssues: ComplianceIssue[] = [
  { id: 'c1', auditName: 'EPA Gas Emissions Audit', severity: 'High', description: 'Boiler 3 carbon leakage exceeded statutory limit of 5% standard variance.', owner: 'John Davis', dueDate: '2026-07-20', status: 'Open' },
  { id: 'c2', auditName: 'HQ Waste Disposal Review', severity: 'Low', description: 'Recyclables mixed with solid waste in Admin floors on 2nd and 4th level.', owner: 'Robert Chen', dueDate: '2026-08-01', status: 'Open' }
];

const defaultNotifications: Notification[] = [
  { id: 'n1', type: 'compliance', title: 'New Compliance Issue Raised', message: 'EPA Gas Emissions Audit raised a High severity issue: Boiler 3 carbon leakage.', timestamp: '2026-07-12T10:15:00Z', read: false },
  { id: 'n2', type: 'system', title: 'Welcome to EcoSphere', message: 'The ESG Management Platform is online. Configure your settings and track emissions.', timestamp: '2026-07-12T09:00:00Z', read: true }
];

const defaultMockErpRecords: MockErpRecord[] = [
  { id: 'erp1', date: '2026-07-10', type: 'Fleet', description: 'Delivery Van Fleet mileage sheet - Week 27', value: 2400, unit: 'km', departmentId: 'd2', status: 'Pending' },
  { id: 'erp2', date: '2026-07-11', type: 'Manufacturing', description: 'Production Furnace gas meter log', value: 1200, unit: 'm³', departmentId: 'd1', status: 'Pending' },
  { id: 'erp3', date: '2026-07-11', type: 'Expense', description: 'R&D Labs electric utility sub-billing', value: 4500, unit: 'kWh', departmentId: 'd4', status: 'Pending' },
  { id: 'erp4', date: '2026-07-12', type: 'Purchase', description: 'Supplier Invoice: Recycled Packaging Materials', value: 800, unit: 'kg', departmentId: 'd1', status: 'Pending' }
];

const defaultUser: UserProfile = {
  name: 'Sarah Jenkins',
  role: 'ESG Operations Manager',
  xp: 120,
  points: 120,
  level: 2,
  badges: []
};

const defaultSettings: ESGSettings = {
  weights: {
    environmental: 40,
    social: 30,
    governance: 30
  },
  autoEmission: true,
  evidenceRequired: true,
  badgeAutoAward: true,
  notifications: {
    email: true,
    inApp: true,
    complianceAlerts: true,
    badgeAlerts: true,
    goalAlerts: true
  }
};

// ==========================================
// CONTEXT PROVIDER
// ==========================================

const ESGContext = createContext<ESGContextType | undefined>(undefined);

export const ESGProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  // States
  const [departments, setDepartments] = useState<Department[]>([]);
  const [emissionFactors, setEmissionFactors] = useState<EmissionFactor[]>([]);
  const [carbonTransactions, setCarbonTransactions] = useState<CarbonTransaction[]>([]);
  const [sustainabilityGoals, setSustainabilityGoals] = useState<SustainabilityGoal[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [complianceIssues, setComplianceIssues] = useState<ComplianceIssue[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [mockErpRecords, setMockErpRecords] = useState<MockErpRecord[]>([]);
  const [currentUser, setCurrentUser] = useState<UserProfile>(defaultUser);
  const [settings, setSettings] = useState<ESGSettings>(defaultSettings);

  // Load from local storage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const getStorage = <T,>(key: string, defaultValue: T): T => {
        const stored = localStorage.getItem(`ecosphere_${key}`);
        return stored ? JSON.parse(stored) : defaultValue;
      };

      setDepartments(getStorage('departments', defaultDepartments));
      setEmissionFactors(getStorage('emissionFactors', defaultEmissionFactors));
      setCarbonTransactions(getStorage('carbonTransactions', defaultCarbonTransactions));
      setSustainabilityGoals(getStorage('sustainabilityGoals', defaultSustainabilityGoals));
      setBadges(getStorage('badges', defaultBadges));
      setRewards(getStorage('rewards', defaultRewards));
      setComplianceIssues(getStorage('complianceIssues', defaultComplianceIssues));
      setNotifications(getStorage('notifications', defaultNotifications));
      setMockErpRecords(getStorage('mockErpRecords', defaultMockErpRecords));
      setCurrentUser(getStorage('user', defaultUser));
      setSettings(getStorage('settings', defaultSettings));
      
      setIsLoaded(true);
    }
  }, []);

  // Save to local storage whenever states change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('ecosphere_departments', JSON.stringify(departments));
      localStorage.setItem('ecosphere_emissionFactors', JSON.stringify(emissionFactors));
      localStorage.setItem('ecosphere_carbonTransactions', JSON.stringify(carbonTransactions));
      localStorage.setItem('ecosphere_sustainabilityGoals', JSON.stringify(sustainabilityGoals));
      localStorage.setItem('ecosphere_badges', JSON.stringify(badges));
      localStorage.setItem('ecosphere_rewards', JSON.stringify(rewards));
      localStorage.setItem('ecosphere_complianceIssues', JSON.stringify(complianceIssues));
      localStorage.setItem('ecosphere_notifications', JSON.stringify(notifications));
      localStorage.setItem('ecosphere_mockErpRecords', JSON.stringify(mockErpRecords));
      localStorage.setItem('ecosphere_user', JSON.stringify(currentUser));
      localStorage.setItem('ecosphere_settings', JSON.stringify(settings));
    }
  }, [isLoaded, departments, emissionFactors, carbonTransactions, sustainabilityGoals, badges, rewards, complianceIssues, notifications, mockErpRecords, currentUser, settings]);

  // Check compliance issues due dates and notify
  useEffect(() => {
    if (isLoaded && complianceIssues.length > 0) {
      const today = new Date();
      complianceIssues.forEach(issue => {
        if (issue.status === 'Open') {
          const dueDate = new Date(issue.dueDate);
          const timeDiff = dueDate.getTime() - today.getTime();
          const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
          
          if (daysDiff < 0) {
            // Overdue!
            const alertTitle = `OVERDUE: Compliance Issue - ${issue.auditName}`;
            const alertMsg = `The compliance issue "${issue.description}" is overdue since ${issue.dueDate}. Owner: ${issue.owner}`;
            
            // Check if already notified
            const alreadyNotified = notifications.some(n => n.title === alertTitle);
            if (!alreadyNotified) {
              triggerNotification('compliance', alertTitle, alertMsg);
            }
          }
        }
      });
    }
  }, [isLoaded, complianceIssues]);

  // Helper: Trigger notification
  const triggerNotification = (
    type: Notification['type'],
    title: string,
    message: string
  ) => {
    const newNotif: Notification = {
      id: `n_${Date.now()}`,
      type,
      title,
      message,
      timestamp: new Date().toISOString(),
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // Helper: Award XP
  const awardXp = (amount: number, reason: string) => {
    setCurrentUser(prev => {
      const newXp = prev.xp + amount;
      const newPoints = prev.points + amount;
      const newLevel = Math.floor(newXp / 100) + 1;
      
      if (newLevel > prev.level) {
        triggerNotification('system', 'Level Up!', `Congratulations! You reached Level ${newLevel}!`);
      }
      
      // Auto Badge Unlocking logic
      let updatedBadges = [...prev.badges];
      if (settings.badgeAutoAward) {
        badges.forEach(badge => {
          if (!prev.badges.includes(badge.id)) {
            let unlock = false;
            if (badge.unlockType === 'xp' && newXp >= badge.unlockThreshold) {
              unlock = true;
            }
            if (unlock) {
              updatedBadges.push(badge.id);
              triggerNotification('badge', 'Badge Unlocked!', `You have unlocked the "${badge.name}" badge: ${badge.description}`);
              setBadges(curr => curr.map(b => b.id === badge.id ? { ...b, unlocked: true } : b));
            }
          }
        });
      }
      
      return {
        ...prev,
        xp: newXp,
        points: newPoints,
        level: newLevel,
        badges: updatedBadges
      };
    });
  };

  // Recalculate Sustainability Goal progress in real time
  const recalculateGoalProgress = (
    goalsList: SustainabilityGoal[],
    transactionsList: CarbonTransaction[]
  ): SustainabilityGoal[] => {
    return goalsList.map(goal => {
      // Find matching transactions
      const matchingTxs = transactionsList.filter(tx => {
        const txDate = new Date(tx.date);
        const startDate = new Date(goal.startDate);
        const endDate = new Date(goal.endDate);
        const matchesDate = txDate >= startDate && txDate <= endDate;
        const matchesDept = goal.departmentId === 'all' || tx.departmentId === goal.departmentId;
        const matchesCat = goal.category === 'All' || tx.category === goal.category;
        return matchesDate && matchesDept && matchesCat;
      });

      const totalEmissionsInPeriod = matchingTxs.reduce((sum, tx) => sum + tx.calculatedEmissions, 0);
      
      let status = goal.status;
      if (goal.status === 'Active') {
        const today = new Date();
        const endDate = new Date(goal.endDate);
        if (today > endDate) {
          status = totalEmissionsInPeriod <= goal.targetValue ? 'Achieved' : 'Failed';
          if (status === 'Achieved') {
            awardXp(50, `Sustainability goal achieved: ${goal.name}`);
            triggerNotification('goal', 'Goal Achieved!', `Great job! Sustainability goal "${goal.name}" was successfully achieved.`);
          } else {
            triggerNotification('goal', 'Goal Failed', `Sustainability goal "${goal.name}" failed to meet its target.`);
          }
        }
      }

      return {
        ...goal,
        currentValue: parseFloat(totalEmissionsInPeriod.toFixed(1)),
        status
      };
    });
  };

  // Run auto award check for other badge categories
  const checkBadgeAwards = (transactionsCount: number, completedGoalsCount: number) => {
    if (!settings.badgeAutoAward) return;
    
    setCurrentUser(prev => {
      let updatedBadges = [...prev.badges];
      let stateChanged = false;

      badges.forEach(badge => {
        if (!prev.badges.includes(badge.id)) {
          let unlock = false;
          if (badge.unlockType === 'transactions' && transactionsCount >= badge.unlockThreshold) {
            unlock = true;
          } else if (badge.unlockType === 'goals' && completedGoalsCount >= badge.unlockThreshold) {
            unlock = true;
          }

          if (unlock) {
            updatedBadges.push(badge.id);
            stateChanged = true;
            triggerNotification('badge', 'Badge Unlocked!', `You have unlocked the "${badge.name}" badge: ${badge.description}`);
            setBadges(curr => curr.map(b => b.id === badge.id ? { ...b, unlocked: true } : b));
          }
        }
      });

      return stateChanged ? { ...prev, badges: updatedBadges } : prev;
    });
  };

  // ==========================================
  // STATE MUTATORS
  // ==========================================

  // Departments
  const addDepartment = (dept: Omit<Department, 'id'>) => {
    const newDept = { ...dept, id: `dept_${Date.now()}` };
    setDepartments(prev => [...prev, newDept]);
    triggerNotification('system', 'Department Added', `New department "${dept.name}" created.`);
  };

  const updateDepartment = (id: string, updated: Partial<Department>) => {
    setDepartments(prev => prev.map(d => d.id === id ? { ...d, ...updated } as Department : d));
  };

  const deleteDepartment = (id: string) => {
    setDepartments(prev => prev.filter(d => d.id !== id));
  };

  // Emission Factors
  const addEmissionFactor = (factor: Omit<EmissionFactor, 'id'>) => {
    const newFactor = { ...factor, id: `ef_${Date.now()}` };
    setEmissionFactors(prev => [...prev, newFactor]);
    triggerNotification('system', 'Emission Factor Configured', `New emission factor configured: ${factor.name}`);
  };

  const updateEmissionFactor = (id: string, updated: Partial<EmissionFactor>) => {
    setEmissionFactors(prev => prev.map(f => f.id === id ? { ...f, ...updated } as EmissionFactor : f));
  };

  const deleteEmissionFactor = (id: string) => {
    setEmissionFactors(prev => prev.filter(f => f.id !== id));
  };

  // Manual Carbon Transaction
  const addManualTransaction = (tx: {
    date: string;
    category: 'Purchase' | 'Manufacturing' | 'Expense' | 'Fleet';
    description: string;
    value: number;
    emissionFactorId: string;
    departmentId: string;
  }) => {
    const factor = emissionFactors.find(ef => ef.id === tx.emissionFactorId);
    if (!factor) return;

    const rate = factor.co2Rate;
    const calculatedEmissions = parseFloat((tx.value * rate).toFixed(2));

    const newTx: CarbonTransaction = {
      id: `tx_${Date.now()}`,
      date: tx.date,
      category: tx.category,
      description: tx.description,
      value: tx.value,
      unit: factor.unit,
      emissionFactorId: tx.emissionFactorId,
      emissionFactorRate: rate,
      calculatedEmissions,
      departmentId: tx.departmentId
    };

    const updatedTransactions = [newTx, ...carbonTransactions];
    setCarbonTransactions(updatedTransactions);
    
    // Update goal tracking
    setSustainabilityGoals(goals => recalculateGoalProgress(goals, updatedTransactions));

    // Award XP
    awardXp(15, `Logged manual carbon transaction: ${newTx.description}`);

    // Check Badges
    const manualCount = updatedTransactions.filter(t => !t.sourceRecordId).length;
    const completedGoals = sustainabilityGoals.filter(g => g.status === 'Achieved').length;
    checkBadgeAwards(manualCount, completedGoals);
  };

  // Process Mock ERP Records
  const processErpRecord = (recordId: string): boolean => {
    const record = mockErpRecords.find(r => r.id === recordId);
    if (!record || record.status === 'Processed') return false;

    // Find emission factor
    // We map record types to emission factors dynamically
    let matchingFactor: EmissionFactor | undefined;
    if (record.type === 'Fleet') {
      matchingFactor = emissionFactors.find(ef => ef.name.includes('Vehicle') || ef.name.includes('Travel'));
    } else if (record.type === 'Manufacturing') {
      matchingFactor = emissionFactors.find(ef => ef.name.includes('Grid') || ef.name.includes('Gas'));
    } else if (record.type === 'Expense') {
      matchingFactor = emissionFactors.find(ef => ef.name.includes('HVAC') || ef.name.includes('Electricity'));
    } else if (record.type === 'Purchase') {
      matchingFactor = emissionFactors.find(ef => ef.name.includes('Paper') || ef.name.includes('Supplies'));
    }

    // Default fallback if factor not matching
    if (!matchingFactor) {
      matchingFactor = emissionFactors.find(ef => ef.category === record.type);
    }

    if (!matchingFactor) return false;

    const rate = matchingFactor.co2Rate;
    const calculatedEmissions = parseFloat((record.value * rate).toFixed(2));

    const newTx: CarbonTransaction = {
      id: `tx_auto_${Date.now()}`,
      date: record.date,
      category: record.type,
      description: `Auto-calculated: ${record.description}`,
      value: record.value,
      unit: record.unit,
      emissionFactorId: matchingFactor.id,
      emissionFactorRate: rate,
      calculatedEmissions,
      departmentId: record.departmentId,
      sourceRecordId: record.id
    };

    // Update status
    setMockErpRecords(prev => prev.map(r => r.id === recordId ? { ...r, status: 'Processed' } : r));
    
    // Add transaction
    const updatedTransactions = [newTx, ...carbonTransactions];
    setCarbonTransactions(updatedTransactions);

    // Update goal tracking
    setSustainabilityGoals(goals => recalculateGoalProgress(goals, updatedTransactions));

    // Award XP
    awardXp(10, `Processed ERP Auto-emission transaction`);

    triggerNotification(
      'approval',
      'Auto Emission Processed',
      `Automatically calculated and logged ${calculatedEmissions} kg CO2 emissions for ${record.description}.`
    );

    return true;
  };

  // Sustainability Goals
  const addSustainabilityGoal = (goal: Omit<SustainabilityGoal, 'id' | 'currentValue' | 'status'>) => {
    const newGoal: SustainabilityGoal = {
      ...goal,
      id: `goal_${Date.now()}`,
      currentValue: 0,
      status: 'Active'
    };

    setSustainabilityGoals(prev => recalculateGoalProgress([...prev, newGoal], carbonTransactions));
    triggerNotification('goal', 'Sustainability Goal Activated', `New target set: ${goal.name}`);
  };

  const updateSustainabilityGoal = (id: string, updated: Partial<SustainabilityGoal>) => {
    setSustainabilityGoals(prev => prev.map(g => g.id === id ? { ...g, ...updated } as SustainabilityGoal : g));
  };

  // Gamification: Rewards
  const redeemReward = (rewardId: string): boolean => {
    const reward = rewards.find(r => r.id === rewardId);
    if (!reward || reward.status !== 'Available' || reward.stock <= 0) return false;
    if (currentUser.points < reward.pointsRequired) return false;

    // Deduct points
    setCurrentUser(prev => ({
      ...prev,
      points: prev.points - reward.pointsRequired
    }));

    // Update stock
    setRewards(prev => prev.map(r => {
      if (r.id === rewardId) {
        const nextStock = r.stock - 1;
        return {
          ...r,
          stock: nextStock,
          status: nextStock === 0 ? 'Out of Stock' : 'Available'
        } as Reward;
      }
      return r;
    }));

    triggerNotification(
      'badge',
      'Reward Redeemed!',
      `You successfully redeemed "${reward.name}" for ${reward.pointsRequired} Points. Item is ready for shipping!`
    );

    return true;
  };

  // Compliance
  const addComplianceIssue = (issue: Omit<ComplianceIssue, 'id' | 'status'>) => {
    const newIssue: ComplianceIssue = {
      ...issue,
      id: `comp_${Date.now()}`,
      status: 'Open'
    };
    setComplianceIssues(prev => [newIssue, ...prev]);
    triggerNotification(
      'compliance',
      'Compliance Violation Raised',
      `Violation raised in audit "${issue.auditName}". Owner: ${issue.owner}. Due date: ${issue.dueDate}`
    );
  };

  const resolveComplianceIssue = (id: string) => {
    setComplianceIssues(prev => prev.map(c => c.id === id ? { ...c, status: 'Resolved' } as ComplianceIssue : c));
    triggerNotification('compliance', 'Compliance Resolved', `A compliance issue has been marked resolved.`);
  };

  const acknowledgePolicy = (policyName: string) => {
    awardXp(10, `Acknowledged policy: ${policyName}`);
    triggerNotification('policy', 'Policy Acknowledged', `You have acknowledged the policy "${policyName}".`);
  };

  // Settings
  const updateSettings = (updated: Partial<ESGSettings>) => {
    setSettings(prev => ({ ...prev, ...updated }));
  };

  // Notifications
  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const resetAllData = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('ecosphere_departments');
      localStorage.removeItem('ecosphere_emissionFactors');
      localStorage.removeItem('ecosphere_carbonTransactions');
      localStorage.removeItem('ecosphere_sustainabilityGoals');
      localStorage.removeItem('ecosphere_badges');
      localStorage.removeItem('ecosphere_rewards');
      localStorage.removeItem('ecosphere_complianceIssues');
      localStorage.removeItem('ecosphere_notifications');
      localStorage.removeItem('ecosphere_mockErpRecords');
      localStorage.removeItem('ecosphere_user');
      localStorage.removeItem('ecosphere_settings');
      
      setDepartments(defaultDepartments);
      setEmissionFactors(defaultEmissionFactors);
      setCarbonTransactions(defaultCarbonTransactions);
      setSustainabilityGoals(defaultSustainabilityGoals);
      setBadges(defaultBadges);
      setRewards(defaultRewards);
      setComplianceIssues(defaultComplianceIssues);
      setNotifications(defaultNotifications);
      setMockErpRecords(defaultMockErpRecords);
      setCurrentUser(defaultUser);
      setSettings(defaultSettings);
    }
  };

  // ==========================================
  // SCORES CALCULATIONS (Dynamic)
  // ==========================================
  
  // Calculate aggregated department scores
  const getDepartmentScores = (): DepartmentScore[] => {
    return departments.map(dept => {
      // Calculate carbon emissions of department
      const deptTxs = carbonTransactions.filter(tx => tx.departmentId === dept.id);
      const totalEmissions = deptTxs.reduce((sum, tx) => sum + tx.calculatedEmissions, 0);

      // Environmental Score calculation:
      // Compare actual emissions to the carbon budget.
      // Score starts at 95. If emissions exceed budget, deduct points proportionally.
      let environmentalScore = 95;
      if (totalEmissions > 0) {
        const budgetPercent = (totalEmissions / dept.carbonBudget) * 100;
        if (budgetPercent <= 100) {
          // If within budget, score scales between 95 down to 75
          environmentalScore = Math.max(75, 95 - (budgetPercent / 100) * 20);
        } else {
          // If exceeding budget, score drops from 75 down to a floor of 10
          environmentalScore = Math.max(10, 75 - ((budgetPercent - 100) / 100) * 45);
        }
      }
      environmentalScore = Math.round(environmentalScore);

      // Social Score (Mock dynamic logic based on department size and mock activities)
      // Usually, it tracks CSR participation. Let's make it reflect a solid score base
      let socialScore = 80;
      if (dept.code === 'R&D') socialScore = 92;
      if (dept.code === 'ADMIN') socialScore = 85;
      if (dept.code === 'PROD') socialScore = 74;
      
      // Governance Score (Mock dynamic logic based on unresolved compliance issues)
      const openIssuesCount = complianceIssues.filter(c => c.owner === dept.head && c.status === 'Open').length;
      const governanceScore = Math.max(10, 95 - openIssuesCount * 25);

      // Total score: weighted average based on settings
      const { environmental, social, governance } = settings.weights;
      const totalWeight = environmental + social + governance;
      const totalScore = Math.round(
        (environmentalScore * environmental +
          socialScore * social +
          governanceScore * governance) /
          totalWeight
      );

      return {
        departmentId: dept.id,
        departmentName: dept.name,
        environmentalScore,
        socialScore,
        governanceScore,
        totalScore,
        emissions: parseFloat(totalEmissions.toFixed(1))
      };
    });
  };

  const currentDeptScores = getDepartmentScores();

  // Overall ESG Score is the weighted average of Department Total Scores
  const getOverallEsgScore = (): number => {
    if (currentDeptScores.length === 0) return 0;
    const totalEmployees = departments.reduce((sum, d) => sum + d.employeeCount, 0);
    
    // Employee-weighted average of department total scores is a realistic way to aggregate,
    // or just a simple average. Let's use simple average for simplicity or employee-weighted.
    // Standard average is fine.
    const sumScores = currentDeptScores.reduce((sum, s) => sum + s.totalScore, 0);
    return Math.round(sumScores / currentDeptScores.length);
  };

  const overallEsgScore = getOverallEsgScore();

  return (
    <ESGContext.Provider value={{
      departments,
      emissionFactors,
      carbonTransactions,
      sustainabilityGoals,
      badges,
      rewards,
      complianceIssues,
      notifications,
      mockErpRecords,
      currentUser,
      settings,
      departmentScores: currentDeptScores,
      overallEsgScore,
      
      addDepartment,
      updateDepartment,
      deleteDepartment,
      addEmissionFactor,
      updateEmissionFactor,
      deleteEmissionFactor,
      addManualTransaction,
      processErpRecord,
      addSustainabilityGoal,
      updateSustainabilityGoal,
      redeemReward,
      addComplianceIssue,
      resolveComplianceIssue,
      acknowledgePolicy,
      updateSettings,
      markNotificationRead,
      clearAllNotifications,
      resetAllData
    }}>
      {isLoaded ? children : <div className="flex items-center justify-center min-h-screen bg-background text-foreground font-sans">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-muted-foreground animate-pulse">Initializing EcoSphere ESG Data...</p>
        </div>
      </div>}
    </ESGContext.Provider>
  );
};

export const useESG = () => {
  const context = useContext(ESGContext);
  if (context === undefined) {
    throw new Error('useESG must be used within an ESGProvider');
  }
  return context;
};
