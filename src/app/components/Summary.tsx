'use client';

import { Transaction, TransactionFilters } from '@/types';

interface SummaryProps {
  transactions: Transaction[];
  filters: TransactionFilters;
}

export default function Summary({ transactions, filters }: SummaryProps) {
  // Filter transactions based on current filters
  const filteredTransactions = transactions.filter((transaction) => {
    const transactionDate = new Date(transaction.date);
    const transactionMonth = transactionDate.getMonth() + 1;
    const transactionYear = transactionDate.getFullYear();

    return (
      transactionMonth === filters.month && transactionYear === filters.year
    );
  });

  // Calculate totals
  const income = filteredTransactions
    .filter((t) => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);

  const expenses = filteredTransactions
    .filter((t) => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const savings = income - expenses;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getMonthName = (month: number) => {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    return months[month - 1];
  };

  return (
    <div className="relative">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900/40 dark:via-blue-900/20 dark:to-purple-900/40 rounded-3xl opacity-60"></div>
      <div className="absolute inset-0 bg-white/40 dark:bg-slate-900/60 backdrop-blur-2xl rounded-3xl border border-white/20 dark:border-slate-700/50 shadow-2xl"></div>
      
      <div className="relative z-10 p-8 md:p-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-6">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-purple-900 dark:from-white dark:via-blue-100 dark:to-purple-100 bg-clip-text text-transparent mb-3">
            {getMonthName(filters.month)} {filters.year}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            Your financial performance at a glance
          </p>
        </div>

        {/* Main Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-8">
          {/* Income Card */}
        <div className="group relative overflow-hidden bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950 dark:to-emerald-900 rounded-xl p-6 border border-emerald-200 dark:border-emerald-800 transition-all duration-300 hover:scale-105 hover:shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/10 to-emerald-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-emerald-500 rounded-full shadow-lg">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 11l5-5m0 0l5 5m-5-5v12"
                  />
                </svg>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
                  Income
                </p>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-4xl xl:text-5xl font-bold text-emerald-700 dark:text-emerald-300 transition-all duration-300 group-hover:text-emerald-600 break-words">
                {formatCurrency(income)}
              </p>
            </div>
          </div>
        </div>

        {/* Expenses Card */}
        <div className="group relative overflow-hidden bg-gradient-to-br from-rose-50 to-rose-100 dark:from-rose-950 dark:to-rose-900 rounded-xl p-6 border border-rose-200 dark:border-rose-800 transition-all duration-300 hover:scale-105 hover:shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-rose-400/10 to-rose-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-rose-500 rounded-full shadow-lg">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 13l-5 5m0 0l-5-5m5 5V6"
                  />
                </svg>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-rose-600 dark:text-rose-400 uppercase tracking-wide">
                  Expenses
                </p>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-4xl xl:text-5xl font-bold text-rose-700 dark:text-rose-300 transition-all duration-300 group-hover:text-rose-600 break-words">
                {formatCurrency(expenses)}
              </p>
            </div>
          </div>
        </div>

        {/* Savings/Deficit Card */}
        <div
          className={`group relative overflow-hidden ${
            savings >= 0
              ? 'bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800'
              : 'bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900 border-amber-200 dark:border-amber-800'
          } rounded-xl p-6 border transition-all duration-300 hover:scale-105 hover:shadow-lg`}
        >
          <div
            className={`absolute inset-0 ${
              savings >= 0
                ? 'bg-gradient-to-br from-blue-400/10 to-blue-600/10'
                : 'bg-gradient-to-br from-amber-400/10 to-amber-600/10'
            } opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
          ></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div
                className={`p-3 ${
                  savings >= 0 ? 'bg-blue-500' : 'bg-amber-500'
                } rounded-full shadow-lg`}
              >
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                  />
                </svg>
              </div>
              <div className="text-right">
                <p
                  className={`text-sm font-semibold ${
                    savings >= 0
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-amber-600 dark:text-amber-400'
                  } uppercase tracking-wide`}
                >
                  {savings >= 0 ? 'Net Savings' : 'Deficit'}
                </p>
              </div>
            </div>
            <div className="space-y-1">
              <p
                className={`text-4xl xl:text-5xl font-bold break-words ${
                  savings >= 0
                    ? 'text-blue-700 dark:text-blue-300 group-hover:text-blue-600'
                    : 'text-amber-700 dark:text-amber-300 group-hover:text-amber-600'
                } transition-all duration-300`}
              >
                {formatCurrency(Math.abs(savings))}
              </p>
            </div>
          </div>
        </div>
      </div>
      </div>

      {/* Summary Bar */}
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-gray-200 dark:bg-gray-700 rounded-lg">
              <svg
                className="w-5 h-5 text-gray-600 dark:text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total Transactions
              </p>
              <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {filteredTransactions.length}
              </p>
            </div>
          </div>

          {/* Visual Progress Bar */}
          <div className="flex-1 max-w-xs ml-8">
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
              <span>Expenses</span>
              <span>Income</span>
            </div>
            <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              {income > 0 && (
                <div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-rose-500 to-emerald-500 rounded-full transition-all duration-1000 ease-out"
                  style={{
                    width: `${Math.min((expenses / income) * 100, 100)}%`,
                  }}
                ></div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
