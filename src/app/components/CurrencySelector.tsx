'use client';

import React, { useState } from 'react';
import { CurrencyDollarIcon } from '@heroicons/react/24/outline';

interface CurrencySelectorProps {
  onCurrencySelect: (currency: 'USD' | 'INR') => void;
  isDarkMode: boolean;
}

export default function CurrencySelector({ onCurrencySelect, isDarkMode }: CurrencySelectorProps) {
  const [selectedCurrency, setSelectedCurrency] = useState<'USD' | 'INR' | null>(null);

  const handleSubmit = () => {
    if (selectedCurrency) {
      onCurrencySelect(selectedCurrency);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`p-8 rounded-lg shadow-xl max-w-md w-full mx-4 ${
        isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
      }`}>
        <div className="text-center mb-6">
          <CurrencyDollarIcon className="h-16 w-16 mx-auto mb-4 text-blue-500" />
          <h2 className="text-2xl font-bold mb-2">Choose Your Currency</h2>
          <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Select your preferred currency for the finance tracker
          </p>
        </div>

        <div className="space-y-4 mb-6">
          <div
            onClick={() => setSelectedCurrency('USD')}
            className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
              selectedCurrency === 'USD'
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : isDarkMode 
                  ? 'border-gray-600 hover:border-gray-500' 
                  : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">US Dollar (USD)</h3>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  United States Dollar - $
                </p>
              </div>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                selectedCurrency === 'USD' 
                  ? 'border-blue-500 bg-blue-500' 
                  : isDarkMode ? 'border-gray-500' : 'border-gray-300'
              }`}>
                {selectedCurrency === 'USD' && (
                  <div className="w-3 h-3 rounded-full bg-white"></div>
                )}
              </div>
            </div>
          </div>

          <div
            onClick={() => setSelectedCurrency('INR')}
            className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
              selectedCurrency === 'INR'
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : isDarkMode 
                  ? 'border-gray-600 hover:border-gray-500' 
                  : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Indian Rupee (INR)</h3>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Indian Rupee - ₹
                </p>
              </div>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                selectedCurrency === 'INR' 
                  ? 'border-blue-500 bg-blue-500' 
                  : isDarkMode ? 'border-gray-500' : 'border-gray-300'
              }`}>
                {selectedCurrency === 'INR' && (
                  <div className="w-3 h-3 rounded-full bg-white"></div>
                )}
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!selectedCurrency}
          className={`w-full py-3 px-4 rounded-lg font-semibold transition-all ${
            selectedCurrency
              ? 'bg-blue-500 hover:bg-blue-600 text-white'
              : isDarkMode
                ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          Continue with {selectedCurrency || 'Selected Currency'}
        </button>
      </div>
    </div>
  );
}
