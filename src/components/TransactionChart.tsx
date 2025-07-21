'use client';

import React, { useMemo } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Transaction, CategoryData, MonthlyData } from '@/types';

interface TransactionChartProps {
  transactions: Transaction[];
  isDarkMode: boolean;
}

const COLORS = [
  '#8884d8',
  '#82ca9d',
  '#ffc658',
  '#ff7c7c',
  '#8dd1e1',
  '#d084d0',
  '#ffb347',
  '#87ceeb',
  '#dda0dd',
  '#98fb98',
];

export default function TransactionChart({ transactions, isDarkMode }: TransactionChartProps) {
  // Calculate expense categories data
  const expenseCategories = useMemo((): CategoryData[] => {
    const expenses = transactions.filter(t => t.type === 'expense');
    const categoryTotals = expenses.reduce((acc, transaction) => {
      acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
      return acc;
    }, {} as Record<string, number>);

    const totalExpenses = Object.values(categoryTotals).reduce((sum, amount) => sum + amount, 0);

    return Object.entries(categoryTotals).map(([category, amount]) => ({
      category,
      amount,
      percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0,
    }));
  }, [transactions]);

  // Calculate monthly data
  const monthlyData = useMemo((): MonthlyData[] => {
    const monthlyTotals = transactions.reduce((acc, transaction) => {
      const date = new Date(transaction.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!acc[monthKey]) {
        acc[monthKey] = { month: monthKey, income: 0, expenses: 0, netSavings: 0 };
      }

      if (transaction.type === 'income') {
        acc[monthKey].income += transaction.amount;
      } else {
        acc[monthKey].expenses += transaction.amount;
      }

      return acc;
    }, {} as Record<string, MonthlyData>);

    // Calculate net savings and format month names
    return Object.values(monthlyTotals)
      .map(data => ({
        ...data,
        netSavings: data.income - data.expenses,
        month: new Date(data.month + '-01').toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'short' 
        }),
      }))
      .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime())
      .slice(-6); // Show last 6 months
  }, [transactions]);

  const textColor = isDarkMode ? '#e5e7eb' : '#374151';
  const gridColor = isDarkMode ? '#374151' : '#e5e7eb';

  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{color: string; dataKey: string; name: string; value: number; payload: {percentage: number}}>; label?: string }) => {
    if (active && payload && payload.length) {
      return (
        <div className={`p-3 rounded-lg shadow-lg border ${
          isDarkMode 
            ? 'bg-gray-800 border-gray-600 text-gray-100' 
            : 'bg-white border-gray-200 text-gray-900'
        }`}>
          <p className="font-semibold">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.dataKey === 'amount' 
                ? `${entry.name}: $${entry.value.toFixed(2)} (${entry.payload.percentage.toFixed(1)}%)`
                : `${entry.name}: $${entry.value.toFixed(2)}`
              }
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`p-6 rounded-lg shadow-md ${
      isDarkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'
    }`}>
      <h2 className="text-2xl font-bold mb-6">Financial Overview</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Expense Categories Pie Chart */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Expenses by Category</h3>
          {expenseCategories.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={expenseCategories}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ category, percentage }) => 
                    percentage > 5 ? `${category} (${percentage.toFixed(1)}%)` : ''
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="amount"
                >
                  {expenseCategories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              <p>No expense data available</p>
            </div>
          )}
        </div>

        {/* Monthly Income vs Expenses Bar Chart */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Monthly Income vs Expenses</h3>
          {monthlyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis 
                  dataKey="month" 
                  tick={{ fill: textColor, fontSize: 12 }}
                  axisLine={{ stroke: gridColor }}
                />
                <YAxis 
                  tick={{ fill: textColor, fontSize: 12 }}
                  axisLine={{ stroke: gridColor }}
                  tickFormatter={(value) => `$${value.toLocaleString()}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar 
                  dataKey="income" 
                  fill="#10b981" 
                  name="Income"
                  radius={[2, 2, 0, 0]}
                />
                <Bar 
                  dataKey="expenses" 
                  fill="#ef4444" 
                  name="Expenses"
                  radius={[2, 2, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              <p>No monthly data available</p>
            </div>
          )}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={`p-4 rounded-lg ${
          isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
        }`}>
          <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
            Total Categories
          </h4>
          <p className="text-2xl font-bold">
            {expenseCategories.length}
          </p>
        </div>
        
        <div className={`p-4 rounded-lg ${
          isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
        }`}>
          <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
            Months Tracked
          </h4>
          <p className="text-2xl font-bold">
            {monthlyData.length}
          </p>
        </div>

        <div className={`p-4 rounded-lg ${
          isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
        }`}>
          <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
            Avg Monthly Savings
          </h4>
          <p className={`text-2xl font-bold ${
            monthlyData.length > 0 && (monthlyData.reduce((sum, data) => sum + data.netSavings, 0) / monthlyData.length) >= 0
              ? 'text-green-600' 
              : 'text-red-600'
          }`}>
            ${monthlyData.length > 0 
              ? (monthlyData.reduce((sum, data) => sum + data.netSavings, 0) / monthlyData.length).toFixed(0)
              : '0'
            }
          </p>
        </div>
      </div>
    </div>
  );
}
