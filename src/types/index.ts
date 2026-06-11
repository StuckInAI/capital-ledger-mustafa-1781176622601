export type TransactionType = 'income' | 'expense';

export type TransactionCategory =
  | 'salary'
  | 'business'
  | 'investment'
  | 'food'
  | 'transport'
  | 'shopping'
  | 'bills'
  | 'health'
  | 'entertainment'
  | 'education'
  | 'rent'
  | 'other';

export type DebtType = 'lent' | 'borrowed';

export type DebtStatus = 'pending' | 'partial' | 'settled';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: TransactionCategory;
  description: string;
  date: string;
  tags: string[];
  note: string;
}

export interface Debt {
  id: string;
  type: DebtType;
  person: string;
  amount: number;
  paidAmount: number;
  date: string;
  dueDate: string;
  description: string;
  status: DebtStatus;
}

export interface Capital {
  id: string;
  name: string;
  amount: number;
  type: 'cash' | 'bank' | 'investment' | 'other';
  note: string;
  updatedAt: string;
}

export interface Budget {
  id: string;
  category: TransactionCategory;
  limit: number;
  month: string;
}

export interface AppData {
  transactions: Transaction[];
  debts: Debt[];
  capitals: Capital[];
  budgets: Budget[];
  currency: string;
  userName: string;
  googleConnected: boolean;
}
