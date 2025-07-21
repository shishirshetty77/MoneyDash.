export interface Transaction {
  id: string;
  title: string;
  amount: number;
  category: BudgetCategory;
  type: 'income' | 'expense';
  date: string;
  createdAt: string;
}

export interface SavingsGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  createdAt: string;
}

export interface MonthlyData {
  month: string;
  income: number;
  expenses: number;
  netSavings: number;
}

export interface CategoryData {
  category: string;
  amount: number;
  percentage: number;
}

export type ThemeMode = 'light' | 'dark';

export interface AppSettings {
  theme: ThemeMode;
}

export type BudgetPeriod = 'weekly' | 'monthly';

export interface BudgetLimit {
  id: string;
  category: string;
  amount: number;
  period: BudgetPeriod;
  startDate: string; // ISO date string
  createdAt: string;
}

export interface BudgetStatus {
  category: string;
  budgetAmount: number;
  spentAmount: number;
  remainingAmount: number;
  percentageUsed: number;
  isOverspent: boolean;
  period: BudgetPeriod;
  periodStart: string;
  periodEnd: string;
}

export interface BudgetAlert {
  id: string;
  category: string;
  message: string;
  type: 'warning' | 'danger';
  threshold: number;
  currentPercentage: number;
  createdAt: string;
}

export interface BudgetSettings {
  enableAlerts: boolean;
  warningThreshold: number; // percentage (e.g., 80 for 80%)
  dangerThreshold: number; // percentage (e.g., 100 for 100%)
  enableRollover: boolean;
}

// Budget category type
export type BudgetCategory = 
  | 'Food & Dining'
  | 'Transportation'
  | 'Shopping'
  | 'Entertainment'
  | 'Bills & Utilities'
  | 'Healthcare'
  | 'Education'
  | 'Travel'
  | 'Personal Care'
  | 'Gifts & Donations'
  | 'Business'
  | 'Other';

// Budget interface for BudgetManager component
export interface Budget {
  id: string;
  name: string;
  category: BudgetCategory;
  amount: number;
  startDate: string;
  endDate: string;
  isRecurring: boolean;
  recurringType?: 'weekly' | 'monthly' | 'yearly';
  createdAt: string;
}
