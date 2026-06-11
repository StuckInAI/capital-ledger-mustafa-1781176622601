import { format, startOfMonth, endOfMonth, isWithinInterval, parseISO } from 'date-fns';
import { Transaction, TransactionCategory } from '@/types';

export function formatCurrency(amount: number, currency: string = 'PKR'): string {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString()}`;
  }
}

export function formatDate(dateStr: string): string {
  try {
    return format(parseISO(dateStr), 'dd MMM yyyy');
  } catch {
    return dateStr;
  }
}

export function formatShortDate(dateStr: string): string {
  try {
    return format(parseISO(dateStr), 'dd MMM');
  } catch {
    return dateStr;
  }
}

export function getCurrentMonth(): string {
  return format(new Date(), 'yyyy-MM');
}

export function getMonthTransactions(transactions: Transaction[], month: string): Transaction[] {
  try {
    const [year, mon] = month.split('-').map(Number);
    const start = startOfMonth(new Date(year, mon - 1));
    const end = endOfMonth(new Date(year, mon - 1));
    return transactions.filter((t) => {
      try {
        return isWithinInterval(parseISO(t.date), { start, end });
      } catch {
        return false;
      }
    });
  } catch {
    return [];
  }
}

export function getCategoryColor(category: TransactionCategory): string {
  const colors: Record<TransactionCategory, string> = {
    salary: '#3b82f6',
    business: '#8b5cf6',
    investment: '#06b6d4',
    food: '#f97316',
    transport: '#eab308',
    shopping: '#ec4899',
    bills: '#64748b',
    health: '#10b981',
    entertainment: '#f59e0b',
    education: '#6366f1',
    rent: '#ef4444',
    other: '#9ca3af',
  };
  return colors[category] || '#9ca3af';
}

export function getCategoryLabel(category: TransactionCategory): string {
  const labels: Record<TransactionCategory, string> = {
    salary: 'Salary',
    business: 'Business',
    investment: 'Investment',
    food: 'Food',
    transport: 'Transport',
    shopping: 'Shopping',
    bills: 'Bills',
    health: 'Health',
    entertainment: 'Entertainment',
    education: 'Education',
    rent: 'Rent',
    other: 'Other',
  };
  return labels[category] || category;
}

export function getCategoryEmoji(category: TransactionCategory): string {
  const emojis: Record<TransactionCategory, string> = {
    salary: '💼',
    business: '🏢',
    investment: '📈',
    food: '🍔',
    transport: '🚗',
    shopping: '🛍️',
    bills: '📄',
    health: '🏥',
    entertainment: '🎬',
    education: '📚',
    rent: '🏠',
    other: '💰',
  };
  return emojis[category] || '💰';
}
