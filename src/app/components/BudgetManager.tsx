'use client';

import React, { useState, useRef } from 'react';
import { Budget, BudgetCategory, Transaction } from '@/types';
import { PlusIcon, PencilIcon, TrashIcon, ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

interface BudgetManagerProps {
  budgets: Budget[];
  transactions: Transaction[];
  onCreateBudget: (budget: Omit<Budget, 'id'>) => void;
  onUpdateBudget: (id: string, budget: Partial<Budget>) => void;
  onDeleteBudget: (id: string) => void;
  isDarkMode: boolean;
}

const BudgetManager: React.FC<BudgetManagerProps> = ({
  budgets,
  transactions,
  onCreateBudget,
  onUpdateBudget,
  onDeleteBudget,
}) => {
  // Debug logging for props
  console.log('🔧 BudgetManager - Props received:', {
    budgets: budgets?.length || 0,
    transactions: transactions?.length || 0,
    budgetsList: budgets,
    transactionsList: transactions
  });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Food & Dining' as BudgetCategory,
    amount: '',
    startDate: '',
    endDate: '',
    isRecurring: false,
    recurringType: 'monthly' as 'weekly' | 'monthly' | 'yearly'
  });

  // Carousel state
  const carouselRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerView = 3; // Number of budgets to show at once
  const maxIndex = Math.max(0, budgets.length - itemsPerView);

  const scrollToIndex = (index: number) => {
    if (carouselRef.current) {
      const itemHeight = carouselRef.current.scrollHeight / budgets.length;
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

  const categories: BudgetCategory[] = [
    'Food & Dining', 'Transportation', 'Entertainment', 'Shopping', 'Bills & Utilities', 'Healthcare', 'Other'
  ];

  const resetForm = () => {
    setFormData({
      name: '',
      category: 'Food & Dining',
      amount: '',
      startDate: '',
      endDate: '',
      isRecurring: false,
      recurringType: 'monthly'
    });
    setEditingBudget(null);
    setIsFormOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.amount || !formData.startDate || !formData.endDate) {
      alert('Please fill in all required fields');
      return;
    }

    const budgetData = {
      name: formData.name,
      category: formData.category,
      amount: parseFloat(formData.amount),
      startDate: formData.startDate,
      endDate: formData.endDate,
      isRecurring: formData.isRecurring,
      recurringType: formData.recurringType,
      createdAt: new Date().toISOString()
    };

    if (editingBudget) {
      onUpdateBudget(editingBudget.id, budgetData);
    } else {
      onCreateBudget(budgetData);
    }

    resetForm();
  };

  const handleEdit = (budget: Budget) => {
    setEditingBudget(budget);
    setFormData({
      name: budget.name,
      category: budget.category,
      amount: budget.amount.toString(),
      startDate: budget.startDate,
      endDate: budget.endDate,
      isRecurring: budget.isRecurring,
      recurringType: budget.recurringType || 'monthly'
    });
    setIsFormOpen(true);
  };

  const calculateBudgetSpent = (budget: Budget): number => {
    const budgetStart = new Date(budget.startDate);
    const budgetEnd = new Date(budget.endDate);
    
    console.log(`\n--- Calculating budget spent for: ${budget.name} ---`);
    console.log('Budget category:', budget.category);
    console.log('Budget date range:', budget.startDate, 'to', budget.endDate);
    console.log('Total transactions:', transactions.length);
    
    const filteredTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.date);
      const matchesType = t.type === 'expense';
      const matchesCategory = t.category === budget.category;
      const matchesDate = transactionDate >= budgetStart && transactionDate <= budgetEnd;
      
      console.log(`Transaction: ${t.amount} | ${t.category} | ${t.type} | ${t.date}`);
      console.log(`  Matches type (expense): ${matchesType}`);
      console.log(`  Matches category: ${matchesCategory} (transaction: ${t.category}, budget: ${budget.category})`);
      console.log(`  Matches date: ${matchesDate} (${transactionDate.toISOString()} between ${budgetStart.toISOString()} and ${budgetEnd.toISOString()})`);
      console.log(`  Included: ${matchesType && matchesCategory && matchesDate}`);
      
      return matchesType && matchesCategory && matchesDate;
    });
    
    const total = filteredTransactions.reduce((sum, t) => sum + Math.abs(t.amount), 0);
    console.log(`Filtered transactions count: ${filteredTransactions.length}`);
    console.log(`Total spent: ${total}`);
    console.log('--- End calculation ---\n');
    
    return total;
  };

  const getBudgetStatus = (budget: Budget) => {
    const spent = calculateBudgetSpent(budget);
    const percentage = (spent / budget.amount) * 100;
    
    if (percentage >= 100) return 'exceeded';
    if (percentage >= 80) return 'warning';
    return 'good';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'exceeded': return 'text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400';
      case 'warning': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400';
      default: return 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-colors">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Budget Manager</h2>
        <button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <PlusIcon className="h-4 w-4" />
          Create Budget
        </button>
      </div>

      {/* Budget Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md mx-4 transition-colors">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              {editingBudget ? 'Edit Budget' : 'Create New Budget'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Budget Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as BudgetCategory }))}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Budget Amount
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="recurring"
                  checked={formData.isRecurring}
                  onChange={(e) => setFormData(prev => ({ ...prev, isRecurring: e.target.checked }))}
                  className="rounded"
                />
                <label htmlFor="recurring" className="text-sm text-gray-700 dark:text-gray-300">
                  Recurring Budget
                </label>
              </div>

              {formData.isRecurring && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Recurring Type
                  </label>
                  <select
                    value={formData.recurringType}
                    onChange={(e) => setFormData(prev => ({ ...prev, recurringType: e.target.value as 'weekly' | 'monthly' | 'yearly' }))}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
              )}

              <div className="flex gap-2 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingBudget ? 'Update' : 'Create'} Budget
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Budget Carousel */}
      <div className="relative">
        {budgets.length > itemsPerView && (
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
          style={{ maxHeight: '420px' }} // Height for exactly 3 budget items
        >
          {budgets.length === 0 ? (
            <div className="w-full text-center py-8 text-gray-500 dark:text-gray-400">
              <p>No budgets created yet.</p>
              <p className="text-sm">Create your first budget to start tracking your spending!</p>
            </div>
          ) : (
            budgets.map(budget => {
              const spent = calculateBudgetSpent(budget);
              const percentage = Math.min((spent / budget.amount) * 100, 100);
              const status = getBudgetStatus(budget);
              const isActive = new Date() >= new Date(budget.startDate) && new Date() <= new Date(budget.endDate);

              return (
                <div 
                  key={budget.id} 
                  className="flex-shrink-0 w-full border dark:border-gray-600 rounded-lg p-4 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{budget.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {budget.category} • {budget.startDate} to {budget.endDate}
                        {budget.isRecurring && <span className="ml-2 text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded">
                          {budget.recurringType}
                        </span>}
                        {isActive && <span className="ml-2 text-xs px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded">
                          Active
                        </span>}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(budget)}
                        className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onDeleteBudget(budget.id)}
                        className="p-2 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/20 rounded transition-colors"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="mb-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600 dark:text-gray-400">
                        ${spent.toFixed(2)} spent of ${budget.amount.toFixed(2)}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(status)}`}>
                        {percentage.toFixed(0)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          status === 'exceeded' ? 'bg-red-500' :
                          status === 'warning' ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      />
                    </div>
                  </div>

                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Remaining: ${Math.max(0, budget.amount - spent).toFixed(2)}
                  </p>
                </div>
              );
            })
          )}
        </div>

        {budgets.length > itemsPerView && (
          <button
            onClick={goToNext}
            disabled={currentIndex >= maxIndex}
            className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-4 z-10 p-3 rounded-full shadow-lg bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:text-gray-400 dark:disabled:text-gray-500 transition-all"
          >
            <ChevronDownIcon className="w-5 h-5" />
          </button>
        )}

        {/* Carousel Dots */}
        {budgets.length > itemsPerView && (
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

export default BudgetManager;
