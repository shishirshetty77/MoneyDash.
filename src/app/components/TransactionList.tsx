'use client';

import React, { useRef, useState } from 'react';
import { Transaction } from '../../types';
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

interface TransactionListProps {
  transactions: Transaction[];
  onDeleteTransaction: (id: string) => void;
  categoryFilter: string | 'all';
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
  // Carousel state
  const carouselRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerView = 3; // Number of transactions to show at once

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

  const maxIndex = Math.max(0, sortedTransactions.length - itemsPerView);

  const scrollToIndex = (index: number) => {
    if (carouselRef.current) {
      const itemHeight = carouselRef.current.scrollHeight / sortedTransactions.length;
      carouselRef.current.scrollTo({
        top: itemHeight * index,
        behavior: 'smooth'
      });
      setCurrentIndex(index);
    }
  };

  const goToPrevious = () => {
    const newIndex = Math.max(0, currentIndex - 1);
    scrollToIndex(newIndex);
  };

  const goToNext = () => {
    const newIndex = Math.min(maxIndex, currentIndex + 1);
    scrollToIndex(newIndex);
  };

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
      
      {/* Transaction Carousel */}
      <div className="relative">
        {sortedTransactions.length > itemsPerView && (
          <button
            onClick={goToPrevious}
            disabled={currentIndex === 0}
            className="absolute left-1/2 top-0 transform -translate-x-1/2 -translate-y-4 z-10 p-3 rounded-full shadow-lg bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:text-gray-400 dark:disabled:text-gray-500 transition-all"
          >
            <ChevronUpIcon className="w-5 h-5" />
          </button>
        )}

        <div
          ref={carouselRef}
          className="flex flex-col space-y-4 overflow-y-auto scroll-smooth scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800"
          style={{ maxHeight: '360px' }} // Height for exactly 3 transaction items
        >
          {sortedTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex-shrink-0 w-full flex flex-col p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex-1 mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      transaction.type === 'income'
                        ? 'bg-green-500' 
                        : 'bg-red-500'
                    }`}
                  ></div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-800 dark:text-white text-sm">
                      {transaction.description || transaction.title || 'No description'}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-1">
                      <span className="capitalize">{transaction.category}</span>
                      <span>•</span>
                      <span>{formatDate(transaction.date)}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="text-right">
                  <div
                    className={`font-semibold text-sm ${
                      transaction.type === 'income'
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}
                  >
                    {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {transaction.type === 'income' ? 'Income' : 'Expense'}
                  </div>
                </div>
                
                <button
                  onClick={() => onDeleteTransaction(transaction.id)}
                  className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors ml-3"
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

        {sortedTransactions.length > itemsPerView && (
          <button
            onClick={goToNext}
            disabled={currentIndex >= maxIndex}
            className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-4 z-10 p-3 rounded-full shadow-lg bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:text-gray-400 dark:disabled:text-gray-500 transition-all"
          >
            <ChevronDownIcon className="w-5 h-5" />
          </button>
        )}

        {/* Carousel Dots */}
        {sortedTransactions.length > itemsPerView && (
          <div className="flex justify-center mt-4 space-x-2">
            {Array.from({ length: maxIndex + 1 }, (_, i) => (
              <button
                key={i}
                onClick={() => scrollToIndex(i)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i === currentIndex
                    ? 'bg-blue-500'
                    : 'bg-gray-300 dark:bg-gray-600'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionList;
