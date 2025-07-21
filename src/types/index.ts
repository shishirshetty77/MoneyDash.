export interface Transaction {
  id: string;
  title: string;
  amount: number;
  category: string;
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
