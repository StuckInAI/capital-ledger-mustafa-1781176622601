import { createContext, useContext } from 'react';
import { AppData, Transaction, Debt, Capital, Budget } from '@/types';

type AppDataContextType = {
  data: AppData;
  addTransaction: (tx: Omit<Transaction, 'id'>) => void;
  updateTransaction: (id: string, tx: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  addDebt: (debt: Omit<Debt, 'id'>) => void;
  updateDebt: (id: string, debt: Partial<Debt>) => void;
  deleteDebt: (id: string) => void;
  addCapital: (capital: Omit<Capital, 'id'>) => void;
  updateCapital: (id: string, capital: Partial<Capital>) => void;
  deleteCapital: (id: string) => void;
  addBudget: (budget: Omit<Budget, 'id'>) => void;
  deleteBudget: (id: string) => void;
  updateSettings: (settings: Partial<Pick<AppData, 'currency' | 'userName' | 'googleConnected' | 'darkMode'>>) => void;
  replaceAllData: (newData: AppData) => void;
};

export const AppDataContext = createContext<AppDataContextType>(null as any);

export function useAppContext(): AppDataContextType {
  return useContext(AppDataContext);
}
