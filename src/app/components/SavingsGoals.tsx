'use client';

import React, { useState, useRef } from 'react';
import { PlusIcon, TrashIcon, ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  category: string;
}

interface SavingsGoalsProps {
  isDarkMode: boolean;
}

export default function SavingsGoals({ isDarkMode }: SavingsGoalsProps) {
  const [goals, setGoals] = useState<SavingsGoal[]>([
    {
      id: '1',
      name: 'Emergency Fund',
      targetAmount: 10000,
      currentAmount: 6500,
      deadline: '2024-12-31',
      category: 'Emergency',
    },
    {
      id: '2',
      name: 'Vacation to Europe',
      targetAmount: 5000,
      currentAmount: 2300,
      deadline: '2024-08-15',
      category: 'Travel',
    },
    {
      id: '3',
      name: 'New Car Down Payment',
      targetAmount: 8000,
      currentAmount: 3200,
      deadline: '2024-10-01',
      category: 'Transportation',
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [newGoal, setNewGoal] = useState({
    name: '',
    targetAmount: '',
    deadline: '',
    category: '',
  });

  const handleAddGoal = () => {
    if (newGoal.name && newGoal.targetAmount && newGoal.deadline && newGoal.category) {
      const goal: SavingsGoal = {
        id: Date.now().toString(),
        name: newGoal.name,
        targetAmount: parseFloat(newGoal.targetAmount),
        currentAmount: 0,
        deadline: newGoal.deadline,
        category: newGoal.category,
      };
      setGoals([...goals, goal]);
      setNewGoal({ name: '', targetAmount: '', deadline: '', category: '' });
      setShowForm(false);
    }
  };

  const handleDeleteGoal = (id: string) => {
    setGoals(goals.filter(goal => goal.id !== id));
  };

  const updateGoalProgress = (id: string, amount: number) => {
    setGoals(goals.map(goal => 
      goal.id === id 
        ? { ...goal, currentAmount: Math.max(0, goal.currentAmount + amount) }
        : goal
    ));
  };

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min(100, (current / target) * 100);
  };

  const getDaysUntilDeadline = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const carouselRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerView = 3; // Number of goals to show at once
  const maxIndex = Math.max(0, goals.length - itemsPerView);

  const scrollToIndex = (index: number) => {
    if (carouselRef.current) {
      const itemHeight = carouselRef.current.scrollHeight / goals.length;
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

  const cardBgColor = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const mutedTextColor = isDarkMode ? 'text-gray-300' : 'text-gray-600';
  const borderColor = isDarkMode ? 'border-gray-600' : 'border-gray-300';
  const inputBgColor = isDarkMode ? 'bg-gray-700' : 'bg-white';

  return (
    <div className={`p-6 rounded-lg shadow-md ${cardBgColor} ${textColor}`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Savings Goals</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <PlusIcon className="w-5 h-5" />
          Add Goal
        </button>
      </div>

      {/* Add New Goal Form */}
      {showForm && (
        <div className={`mb-6 p-4 rounded-lg border ${borderColor} ${inputBgColor}`}>
          <h3 className="text-lg font-semibold mb-4">New Savings Goal</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Goal name"
              value={newGoal.name}
              onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
              className={`px-3 py-2 rounded border ${borderColor} ${inputBgColor} ${textColor}`}
            />
            <input
              type="number"
              placeholder="Target amount ($)"
              value={newGoal.targetAmount}
              onChange={(e) => setNewGoal({ ...newGoal, targetAmount: e.target.value })}
              className={`px-3 py-2 rounded border ${borderColor} ${inputBgColor} ${textColor}`}
            />
            <input
              type="date"
              value={newGoal.deadline}
              onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
              className={`px-3 py-2 rounded border ${borderColor} ${inputBgColor} ${textColor}`}
            />
            <select
              value={newGoal.category}
              onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value })}
              className={`px-3 py-2 rounded border ${borderColor} ${inputBgColor} ${textColor}`}
            >
              <option value="">Select category</option>
              <option value="Emergency">Emergency</option>
              <option value="Travel">Travel</option>
              <option value="Transportation">Transportation</option>
              <option value="Home">Home</option>
              <option value="Education">Education</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleAddGoal}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
            >
              Add Goal
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Goals Carousel */}
      <div className="relative">
        {goals.length > itemsPerView && (
          <button
            onClick={goToPrevious}
            disabled={currentIndex === 0}
            className={`absolute left-1/2 top-0 transform -translate-x-1/2 -translate-y-4 z-10 p-3 rounded-full shadow-lg transition-all ${
              isDarkMode 
                ? 'bg-gray-700 hover:bg-gray-600 text-white disabled:bg-gray-800 disabled:text-gray-500' 
                : 'bg-white hover:bg-gray-50 text-gray-700 disabled:bg-gray-100 disabled:text-gray-400'
            }`}
          >
            <ChevronUpIcon className="w-5 h-5" />
          </button>
        )}

        <div 
          ref={carouselRef}
          className="flex flex-col space-y-4 overflow-y-auto scroll-smooth scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800"
          style={{ maxHeight: '540px' }} // Height for exactly 3 items (each ~180px including spacing)
        >
          {goals.map((goal) => {
            const progress = getProgressPercentage(goal.currentAmount, goal.targetAmount);
            const daysLeft = getDaysUntilDeadline(goal.deadline);
            const isOverdue = daysLeft < 0;
            
            return (
              <div 
                key={goal.id} 
                className={`flex-shrink-0 w-full p-4 rounded-lg border ${borderColor}`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-semibold">{goal.name}</h3>
                    <p className={`text-sm ${mutedTextColor}`}>{goal.category}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteGoal(goal.id)}
                    className="text-red-500 hover:text-red-600 transition-colors"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>

                <div className="mb-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span>${goal.currentAmount.toLocaleString()} saved</span>
                    <span>${goal.targetAmount.toLocaleString()} goal</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all duration-300 ${
                        progress === 100 ? 'bg-green-500' : 'bg-blue-500'
                      }`}
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <div className="text-sm mt-1">
                    <span className={progress === 100 ? 'text-green-500' : ''}>
                      {progress.toFixed(1)}% complete
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span className={`${isOverdue ? 'text-red-500' : mutedTextColor}`}>
                    {isOverdue 
                      ? `${Math.abs(daysLeft)} days overdue` 
                      : `${daysLeft} days left`
                    }
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        const amount = prompt('Enter amount to add to savings:');
                        if (amount && !isNaN(parseFloat(amount))) {
                          updateGoalProgress(goal.id, parseFloat(amount));
                        }
                      }}
                      className="px-3 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                    >
                      Add Money
                    </button>
                    <button
                      onClick={() => {
                        const amount = prompt('Enter amount to withdraw:');
                        if (amount && !isNaN(parseFloat(amount))) {
                          updateGoalProgress(goal.id, -parseFloat(amount));
                        }
                      }}
                      className="px-3 py-1 text-xs bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
                    >
                      Withdraw
                    </button>
                  </div>
                </div>

                {progress === 100 && (
                  <div className="mt-2 p-2 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded text-sm">
                    🎉 Goal achieved! Congratulations!
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {goals.length > itemsPerView && (
          <button
            onClick={goToNext}
            disabled={currentIndex >= maxIndex}
            className={`absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-4 z-10 p-3 rounded-full shadow-lg transition-all ${
              isDarkMode 
                ? 'bg-gray-700 hover:bg-gray-600 text-white disabled:bg-gray-800 disabled:text-gray-500' 
                : 'bg-white hover:bg-gray-50 text-gray-700 disabled:bg-gray-100 disabled:text-gray-400'
            }`}
          >
            <ChevronDownIcon className="w-5 h-5" />
          </button>
        )}

        {goals.length === 0 && (
          <div className="text-center py-8">
            <p className={mutedTextColor}>No savings goals yet. Create your first goal to get started!</p>
          </div>
        )}
        
        {/* Carousel Dots */}
        {goals.length > itemsPerView && (
          <div className="flex justify-center mt-4 space-x-2">
            {Array.from({ length: maxIndex + 1 }, (_, i) => (
              <button
                key={i}
                onClick={() => scrollToIndex(i)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i === currentIndex
                    ? 'bg-blue-500'
                    : isDarkMode 
                      ? 'bg-gray-600' 
                      : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
