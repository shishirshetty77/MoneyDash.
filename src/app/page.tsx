import Image from "next/image";

'use client';

import { useState, useEffect } from 'react';
import { Transaction, TransactionCategory, TransactionFilters } from '@/types';
import TransactionForm from '@/app/components/TransactionForm';
import TransactionList from '@/app/components/TransactionList';
import Summary from '@/app/components/Summary';
import TransactionChart from '@/app/components/TransactionChart';
import SavingsGoals from '@/app/components/SavingsGoals';
import { saveToLocalStorage, loadFromLocalStorage } from '@/app/utils/localStorage';

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filters, setFilters] = useState<TransactionFilters>({
    category: 'All',
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear()
  });
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedTransactions = loadFromLocalStorage<Transaction[]>('transactions', []);
    const savedTheme = loadFromLocalStorage<string>('theme', 'light');
    
    setTransactions(savedTransactions);
    setIsDarkMode(savedTheme === 'dark');
    
    // Apply theme to document
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Save transactions to localStorage whenever they change
  useEffect(() => {
    saveToLocalStorage('transactions', transactions);
  }, [transactions]);

  // Save theme to localStorage whenever it changes
  useEffect(() => {
    const theme = isDarkMode ? 'dark' : 'light';
    saveToLocalStorage('theme', theme);
    
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
    };
    setTransactions(prev => [...prev, newTransaction]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const exportToCSV = () => {
    const csvContent = [
      ['Date', 'Title', 'Amount', 'Category'],
      ...transactions.map(t => [
        t.date,
        t.title,
        t.amount.toString(),
        t.category
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <header className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Personal Finance Tracker
              </h1>
              <div className="flex gap-2">
                <button
                  onClick={exportToCSV}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Export CSV
                </button>
                <button
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  {isDarkMode ? '🌙' : '☀️'}
                </button>
              </div>
            </div>
          </header>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Form and Goals */}
            <div className="space-y-8">
              <TransactionForm onAddTransaction={addTransaction} />
              <SavingsGoals transactions={transactions} isDarkMode={isDarkMode} />
            </div>

            {/* Middle Column - Summary and Chart */}
            <div className="space-y-8">
              <Summary transactions={transactions} filters={filters} />
              <TransactionChart transactions={transactions} isDarkMode={isDarkMode} />
            </div>

            {/* Right Column - Transaction List */}
            <div>
              <TransactionList 
                transactions={transactions}
                filters={filters}
                onFiltersChange={setFilters}
                onDeleteTransaction={deleteTransaction}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
