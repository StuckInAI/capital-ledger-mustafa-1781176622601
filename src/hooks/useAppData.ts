import { useState, useCallback, useEffect } from 'react';
import { AppData, Transaction, Debt, Capital, Budget } from '@/types';
import { loadData, saveData, generateId } from '@/lib/storage';

export function useAppData() {
  const [data, setData] = useState<AppData>(() => loadData());

  // Apply / remove dark class on <html>
  useEffect(() => {
    const root = document.documentElement;
    if (data.darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [data.darkMode]);

  const updateData = useCallback((updater: (prev: AppData) => AppData) => {
    setData((prev) => {
      const next = updater(prev);
      saveData(next);
      return next;
    });
  }, []);

  // Transactions
  const addTransaction = useCallback(
    (tx: Omit<Transaction, 'id'>) => {
      updateData((prev) => ({
        ...prev,
        transactions: [{ ...tx, id: generateId() }, ...prev.transactions],
      }));
    },
    [updateData]
  );

  const updateTransaction = useCallback(
    (id: string, tx: Partial<Transaction>) => {
      updateData((prev) => ({
        ...prev,
        transactions: prev.transactions.map((t) => (t.id === id ? { ...t, ...tx } : t)),
      }));
    },
    [updateData]
  );

  const deleteTransaction = useCallback(
    (id: string) => {
      updateData((prev) => ({
        ...prev,
        transactions: prev.transactions.filter((t) => t.id !== id),
      }));
    },
    [updateData]
  );

  // Debts
  const addDebt = useCallback(
    (debt: Omit<Debt, 'id'>) => {
      updateData((prev) => ({
        ...prev,
        debts: [{ ...debt, id: generateId() }, ...prev.debts],
      }));
    },
    [updateData]
  );

  const updateDebt = useCallback(
    (id: string, debt: Partial<Debt>) => {
      updateData((prev) => ({
        ...prev,
        debts: prev.debts.map((d) => (d.id === id ? { ...d, ...debt } : d)),
      }));
    },
    [updateData]
  );

  const deleteDebt = useCallback(
    (id: string) => {
      updateData((prev) => ({
        ...prev,
        debts: prev.debts.filter((d) => d.id !== id),
      }));
    },
    [updateData]
  );

  // Capitals
  const addCapital = useCallback(
    (capital: Omit<Capital, 'id'>) => {
      updateData((prev) => ({
        ...prev,
        capitals: [{ ...capital, id: generateId() }, ...prev.capitals],
      }));
    },
    [updateData]
  );

  const updateCapital = useCallback(
    (id: string, capital: Partial<Capital>) => {
      updateData((prev) => ({
        ...prev,
        capitals: prev.capitals.map((c) => (c.id === id ? { ...c, ...capital } : c)),
      }));
    },
    [updateData]
  );

  const deleteCapital = useCallback(
    (id: string) => {
      updateData((prev) => ({
        ...prev,
        capitals: prev.capitals.filter((c) => c.id !== id),
      }));
    },
    [updateData]
  );

  // Budgets
  const addBudget = useCallback(
    (budget: Omit<Budget, 'id'>) => {
      updateData((prev) => ({
        ...prev,
        budgets: [
          ...prev.budgets.filter(
            (b) => !(b.category === budget.category && b.month === budget.month)
          ),
          { ...budget, id: generateId() },
        ],
      }));
    },
    [updateData]
  );

  const deleteBudget = useCallback(
    (id: string) => {
      updateData((prev) => ({
        ...prev,
        budgets: prev.budgets.filter((b) => b.id !== id),
      }));
    },
    [updateData]
  );

  // Settings
  const updateSettings = useCallback(
    (settings: Partial<Pick<AppData, 'currency' | 'userName' | 'googleConnected' | 'darkMode'>>) => {
      updateData((prev) => ({ ...prev, ...settings }));
    },
    [updateData]
  );

  const replaceAllData = useCallback((newData: AppData) => {
    saveData(newData);
    setData(newData);
  }, []);

  return {
    data,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addDebt,
    updateDebt,
    deleteDebt,
    addCapital,
    updateCapital,
    deleteCapital,
    addBudget,
    deleteBudget,
    updateSettings,
    replaceAllData,
  };
}
