'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { saveToLocalStorage, loadFromLocalStorage } from '@/app/utils/localStorage';

export type Currency = 'USD' | 'INR';

export interface CurrencyInfo {
  code: Currency;
  symbol: string;
  name: string;
  locale: string;
  flag: string;
}

export const currencies: Record<Currency, CurrencyInfo> = {
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    locale: 'en-US',
    flag: '🇺🇸'
  },
  INR: {
    code: 'INR',
    symbol: '₹',
    name: 'Indian Rupee',
    locale: 'hi-IN',
    flag: '🇮🇳'
  }
};

interface CurrencyContextType {
  currency: Currency;
  currencyInfo: CurrencyInfo;
  setCurrency: (currency: Currency) => void;
  formatAmount: (amount: number) => string;
  isInitialized: boolean;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>('USD');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const savedCurrency = loadFromLocalStorage<Currency>('currency', null);
    if (savedCurrency && currencies[savedCurrency]) {
      setCurrencyState(savedCurrency);
    }
    setIsInitialized(true);
  }, []);

  const setCurrency = (newCurrency: Currency) => {
    setCurrencyState(newCurrency);
    saveToLocalStorage('currency', newCurrency);
  };

  const formatAmount = (amount: number): string => {
    const currencyInfo = currencies[currency];
    return new Intl.NumberFormat(currencyInfo.locale, {
      style: 'currency',
      currency: currencyInfo.code,
    }).format(amount);
  };

  const currencyInfo = currencies[currency];

  return (
    <CurrencyContext.Provider value={{
      currency,
      currencyInfo,
      setCurrency,
      formatAmount,
      isInitialized
    }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}
