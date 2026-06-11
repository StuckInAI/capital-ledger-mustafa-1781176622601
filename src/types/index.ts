export type TransactionType = 'income' | 'expense';

export type Transaction = {
  id: string;
  type: TransactionType;
  amount: number;
  category: string;
  description: string;
  note: string;
  date: string;
};

export type DebtType = 'lent' | 'borrowed';
export type DebtStatus = 'pending' | 'partial' | 'settled';

export type Debt = {
  id: string;
  type: DebtType;
  person: string;
  amount: number;
  paidAmount: number;
  date: string;
  dueDate: string;
  description: string;
  status: DebtStatus;
};

export type Capital = {
  id: string;
  name: string;
  amount: number;
  type: string;
  note: string;
  updatedAt: string;
};

export type Budget = {
  id: string;
  category: string;
  amount: number;
  month: string;
};

export type AppData = {
  transactions: Transaction[];
  debts: Debt[];
  capitals: Capital[];
  budgets: Budget[];
  currency: string;
  userName: string;
  googleConnected: boolean;
  darkMode: boolean;
};
