import { useMemo, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { useAppContext } from '@/lib/context';
import { formatCurrency, getCurrentMonth, getMonthTransactions, getCategoryColor, getCategoryLabel } from '@/lib/utils';
import { format, subMonths, startOfMonth, parseISO } from 'date-fns';
import { TransactionCategory } from '@/types';

export default function Reports() {
  const { data } = useAppContext();
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());

  const monthOptions = useMemo(() => {
    const opts: { value: string; label: string }[] = [];
    for (let i = 0; i < 6; i++) {
      const d = subMonths(new Date(), i);
      opts.push({
        value: format(d, 'yyyy-MM'),
        label: format(d, 'MMMM yyyy'),
      });
    }
    return opts;
  }, []);

  const monthTxs = useMemo(() => getMonthTransactions(data.transactions, selectedMonth), [data.transactions, selectedMonth]);

  const totalIncome = useMemo(() => monthTxs.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0), [monthTxs]);
  const totalExpense = useMemo(() => monthTxs.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0), [monthTxs]);
  const savings = totalIncome - totalExpense;

  // Category breakdown for expenses
  const categoryData = useMemo(() => {
    const map: Record<string, number> = {};
    monthTxs.filter((t) => t.type === 'expense').forEach((t) => {
      map[t.category] = (map[t.category] || 0) + t.amount;
    });
    return Object.entries(map)
      .map(([category, amount]) => ({
        category: category as TransactionCategory,
        label: getCategoryLabel(category as TransactionCategory),
        amount,
        color: getCategoryColor(category as TransactionCategory),
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [monthTxs]);

  // Last 6 months trend
  const trendData = useMemo(() => {
    return Array.from({ length: 6 }, (_, i) => {
      const d = subMonths(new Date(), 5 - i);
      const month = format(d, 'yyyy-MM');
      const txs = getMonthTransactions(data.transactions, month);
      return {
        month: format(d, 'MMM'),
        income: txs.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0),
        expense: txs.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0),
      };
    });
  }, [data.transactions]);

  const savingsRate = totalIncome > 0 ? Math.round((savings / totalIncome) * 100) : 0;

  return (
    <div className="px-4 py-5 space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
        <select
          className="input w-auto text-xs"
          value={selectedMonth}
          onChange={(e: any) => setSelectedMonth(e.target.value)}
        >
          {monthOptions.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-green-50 rounded-xl p-3 text-center">
          <p className="text-xs text-green-600 font-medium">Income</p>
          <p className="text-sm font-bold text-green-700">{formatCurrency(totalIncome, data.currency)}</p>
        </div>
        <div className="bg-red-50 rounded-xl p-3 text-center">
          <p className="text-xs text-red-500 font-medium">Expense</p>
          <p className="text-sm font-bold text-red-600">{formatCurrency(totalExpense, data.currency)}</p>
        </div>
        <div className={`${savings >= 0 ? 'bg-blue-50' : 'bg-orange-50'} rounded-xl p-3 text-center`}>
          <p className={`text-xs font-medium ${savings >= 0 ? 'text-blue-500' : 'text-orange-500'}`}>Saved</p>
          <p className={`text-sm font-bold ${savings >= 0 ? 'text-blue-700' : 'text-orange-600'}`}>{savingsRate}%</p>
        </div>
      </div>

      {/* 6-month trend */}
      <div className="card">
        <h3 className="font-bold text-gray-900 mb-3 text-sm">6-Month Trend</h3>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={trendData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip
              formatter={(v: any) => formatCurrency(Number(v), data.currency)}
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: 12 }}
            />
            <Bar dataKey="income" fill="#22c55e" radius={[4, 4, 0, 0]} name="Income" />
            <Bar dataKey="expense" fill="#ef4444" radius={[4, 4, 0, 0]} name="Expense" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Category Pie */}
      {categoryData.length > 0 && (
        <div className="card">
          <h3 className="font-bold text-gray-900 mb-3 text-sm">Expense Breakdown</h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={categoryData}
                dataKey="amount"
                nameKey="label"
                cx="50%"
                cy="50%"
                outerRadius={65}
                innerRadius={35}
              >
                {categoryData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(v: any) => formatCurrency(Number(v), data.currency)}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: 12 }}
              />
              <Legend
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: 11 }}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Category list */}
          <div className="mt-3 space-y-2">
            {categoryData.map((cat) => (
              <div key={cat.category} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: cat.color }} />
                <span className="text-xs text-gray-600 flex-1">{cat.label}</span>
                <span className="text-xs font-semibold text-gray-900">{formatCurrency(cat.amount, data.currency)}</span>
                <span className="text-xs text-gray-400">
                  {totalExpense > 0 ? Math.round((cat.amount / totalExpense) * 100) : 0}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {categoryData.length === 0 && monthTxs.length === 0 && (
        <div className="card text-center py-10">
          <p className="text-4xl mb-2">📊</p>
          <p className="text-gray-400 text-sm">No data for this month</p>
          <p className="text-gray-300 text-xs mt-1">Add transactions to see reports</p>
        </div>
      )}
    </div>
  );
}
