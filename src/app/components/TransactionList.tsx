'use client';

import React from 'react';
import { Transaction, TransactionCategory } from '../../types';

interface TransactionListProps {
  transactions: Transaction[];
  onDeleteTransaction: (id: string) => void;
  categoryFilter: TransactionCategory | 'all';
  startDate: string;
  endDate: string;
}

const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  onDeleteTransaction,
  categoryFilter,
  startDate,
  endDate,
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(Math.abs(amount));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const filteredTransactions = transactions.filter(transaction => {
    const categoryMatch = categoryFilter === 'all' || transaction.category === categoryFilter;
    const dateMatch = transaction.date >= startDate && transaction.date <= endDate;
    return categoryMatch && dateMatch;
  });

  const sortedTransactions = [...filteredTransactions].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  if (sortedTransactions.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Transactions</h2>
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <p>No transactions found matching your filters.</p>
          <p className="text-sm mt-2">Add your first transaction to get started!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
        Transactions ({sortedTransactions.length})
      </h2>
      
      <div className="space-y-3">
        {sortedTransactions.map((transaction) => (
          <div
            key={transaction.id}
            className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <div
                  className={`w-3 h-3 rounded-full ${
                    transaction.amount > 0 
                      ? 'bg-green-500' 
                      : 'bg-red-500'
                  }`}
                ></div>
                <div>
                  <h3 className="font-medium text-gray-800 dark:text-white">
                    {transaction.description}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="capitalize">{transaction.category}</span>
                    <span>•</span>
                    <span>{formatDate(transaction.date)}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div
                  className={`font-semibold ${
                    transaction.amount > 0
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}
                >
                  {transaction.amount > 0 ? '+' : '-'}{formatCurrency(transaction.amount)}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {transaction.amount > 0 ? 'Income' : 'Expense'}
                </div>
              </div>
              
              <button
                onClick={() => onDeleteTransaction(transaction.id)}
                className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                title="Delete transaction"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionList;
