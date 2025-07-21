'use client';

import { Transaction, TransactionFilters } from '@/types';

interface SummaryProps {
  transactions: Transaction[];
  filters: TransactionFilters;
}

export default function Summary({ transactions, filters }: SummaryProps) {
  // Filter transactions based on current filters
  const filteredTransactions = transactions.filter(transaction => {
    const transactionDate = new Date(transaction.date);
    const transactionMonth = transactionDate.getMonth() + 1;
    const transactionYear = transactionDate.getFullYear();
    
    return transactionMonth === filters.month && transactionYear === filters.year;
  });

  // Calculate totals
  const income = filteredTransactions
    .filter(t => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);
    
  const expenses = filteredTransactions
    .filter(t => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    
  const savings = income - expenses;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getMonthName = (month: number) => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[month - 1];
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-colors">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
        {getMonthName(filters.month)} {filters.year} Summary
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Income */}
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600 dark:text-green-400">Income</p>
              <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                {formatCurrency(income)}
              </p>
            </div>
            <div className="p-2 bg-green-100 dark:bg-green-800 rounded-full">
              <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
              </svg>
            </div>
          </div>
        </div>

        {/* Expenses */}
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-600 dark:text-red-400">Expenses</p>
              <p className="text-2xl font-bold text-red-700 dark:text-red-300">
                {formatCurrency(expenses)}
              </p>
            </div>
            <div className="p-2 bg-red-100 dark:bg-red-800 rounded-full">
              <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
              </svg>
            </div>
          </div>
        </div>

        {/* Savings */}
        <div className={`${savings >= 0 ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-orange-50 dark:bg-orange-900/20'} p-4 rounded-lg border ${savings >= 0 ? 'border-blue-200 dark:border-blue-700' : 'border-orange-200 dark:border-orange-700'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${savings >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-orange-600 dark:text-orange-400'}`}>
                {savings >= 0 ? 'Savings' : 'Deficit'}
              </p>
              <p className={`text-2xl font-bold ${savings >= 0 ? 'text-blue-700 dark:text-blue-300' : 'text-orange-700 dark:text-orange-300'}`}>
                {formatCurrency(Math.abs(savings))}
              </p>
            </div>
            <div className={`p-2 ${savings >= 0 ? 'bg-blue-100 dark:bg-blue-800' : 'bg-orange-100 dark:bg-orange-800'} rounded-full`}>
              <svg className={`w-6 h-6 ${savings >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-orange-600 dark:text-orange-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction Count */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
          <span>Total Transactions</span>
          <span className="font-semibold">{filteredTransactions.length}</span>
        </div>
      </div>
    </div>
  );
}
