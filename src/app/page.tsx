'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Transaction, TransactionFilters, Budget } from '@/types';
import TransactionForm from '@/app/components/TransactionForm';
import TransactionList from '@/app/components/TransactionList';
import Summary from '@/app/components/Summary';
import TransactionChart from '@/app/components/TransactionChart';
import SavingsGoals from '@/app/components/SavingsGoals';
import BudgetManager from '@/app/components/BudgetManager';
import { saveToLocalStorage, loadFromLocalStorage } from '@/app/utils/localStorage';
import { useAuth } from '@/contexts/AuthContext';
import { getTransactions, createTransaction as addTransactionDb, deleteTransaction as deleteTransactionDb, getBudgets, createBudget as addBudget, updateBudget, deleteBudget } from '@/lib/supabase-data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const { user, loading, signOut } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filters] = useState<TransactionFilters>({
    category: 'All',
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear()
  });
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [budgets, setBudgets] = useState<Budget[]>([]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Load data from Supabase and localStorage theme on component mount
  useEffect(() => {
    async function fetchData() {
      if (!user) return;
      
      try {
        const [transactionData, budgetData] = await Promise.all([
          getTransactions(),
          getBudgets()
        ]);
        
        setTransactions(transactionData || []);
        setBudgets(budgetData || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    // Load theme from localStorage
    const savedTheme = loadFromLocalStorage<string>('theme', 'light');
    setIsDarkMode(savedTheme === 'dark');
    
    // Apply theme to document
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    }

    fetchData();
  }, [user]);

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

  const addTransaction = async (transaction: Omit<Transaction, 'id'>) => {
    try {
      console.log('Adding transaction:', transaction);
      const newTransaction = await addTransactionDb(transaction);
      console.log('New transaction created:', newTransaction);
      if (newTransaction) {
        setTransactions(prev => {
          const updated = [...prev, newTransaction];
          console.log('Updated transactions list:', updated);
          return updated;
        });
      }
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      await deleteTransactionDb(id);
      setTransactions(prev => prev.filter(t => t.id !== id));
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

  const handleCreateBudget = async (budget: Omit<Budget, 'id' | 'createdAt'>) => {
    try {
      const newBudget = await addBudget(budget);
      if (newBudget) {
        setBudgets(prev => [...prev, newBudget]);
      }
    } catch (error) {
      console.error('Error creating budget:', error);
    }
  };

  const handleUpdateBudget = async (id: string, updatedBudget: Partial<Budget>) => {
    try {
      const updated = await updateBudget(id, updatedBudget);
      if (updated) {
        setBudgets(prev => prev.map(b => b.id === id ? updated : b));
      }
    } catch (error) {
      console.error('Error updating budget:', error);
    }
  };

  const handleDeleteBudget = async (id: string) => {
    try {
      await deleteBudget(id);
      setBudgets(prev => prev.filter(b => b.id !== id));
    } catch (error) {
      console.error('Error deleting budget:', error);
    }
  };

  const exportToCSV = () => {
    const csvContent = [
      ['Date', 'Description', 'Amount', 'Category', 'Type'],
      ...transactions.map(t => [
        t.date,
        t.description || t.title || '',
        t.amount.toString(),
        t.category,
        t.type
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 transition-all duration-500">
        {/* Premium Header */}
        <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-b border-slate-200/60 dark:border-slate-700/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo & Brand */}
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                    FinanceFlow
                  </h1>
                  <p className="text-xs text-slate-500 dark:text-slate-400 -mt-0.5">Smart Financial Management</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-3">
                <button
                  onClick={exportToCSV}
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 dark:text-emerald-300 dark:bg-emerald-900/20 dark:hover:bg-emerald-900/40 rounded-xl transition-all duration-200 hover:scale-105"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                  </svg>
                  Export
                </button>
                <button
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl transition-all duration-200 hover:scale-105"
                >
                  {isDarkMode ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                  )}
                </button>
                
                {/* User Info */}
                {user && (
                  <>
                    <div className="flex items-center space-x-2 px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={user.user_metadata?.avatar_url} alt={user.user_metadata?.full_name} />
                        <AvatarFallback>
                          <User className="h-3 w-3" />
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                        {user.user_metadata?.full_name || user.email}
                      </span>
                    </div>
                    <Button
                      onClick={signOut}
                      variant="outline"
                      size="sm"
                      className="flex items-center space-x-1 h-8"
                    >
                      <LogOut className="h-3 w-3" />
                      <span className="text-xs">Sign Out</span>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Hero Section - Financial Overview */}
          <section className="mb-12">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-purple-900 dark:from-white dark:via-blue-100 dark:to-purple-100 bg-clip-text text-transparent mb-3">
                Your Financial Dashboard
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto">
                Track, analyze, and optimize your finances with intelligent insights and beautiful visualizations.
              </p>
            </div>
            <Summary transactions={transactions} filters={filters} />
          </section>

          {/* Quick Actions */}
          <section className="mb-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="order-2 lg:order-1">
                <TransactionForm onAddTransaction={addTransaction} />
              </div>
              <div className="order-1 lg:order-2">
                <SavingsGoals isDarkMode={isDarkMode} />
              </div>
            </div>
          </section>

          {/* Analytics Section */}
          <section className="mb-12">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Analytics & Insights</h3>
              <p className="text-slate-600 dark:text-slate-400">Understand your spending patterns and financial trends</p>
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              <TransactionChart transactions={transactions} isDarkMode={isDarkMode} />
              <BudgetManager
                budgets={budgets}
                transactions={transactions}
                onCreateBudget={handleCreateBudget}
                onUpdateBudget={handleUpdateBudget}
                onDeleteBudget={handleDeleteBudget}
                isDarkMode={isDarkMode}
              />
            </div>
          </section>

          {/* Transaction History */}
          <section className="mb-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Transaction History</h3>
              <p className="text-slate-600 dark:text-slate-400">Review and manage your recent financial activities</p>
            </div>
            <TransactionList 
              transactions={transactions}
              categoryFilter={filters.category === 'All' ? 'all' : (filters.category as string)}
              startDate={`${filters.year}-${String(filters.month).padStart(2, '0')}-01`}
              endDate={`${filters.year}-${String(filters.month).padStart(2, '0')}-31`}
              onDeleteTransaction={deleteTransaction}
            />
          </section>
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="text-center text-slate-500 dark:text-slate-400 text-sm">
              <p>Built with ❤️ for better financial management • All data stored locally</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
