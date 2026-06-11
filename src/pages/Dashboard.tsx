import { useState, useMemo } from 'react';
import { TrendingUp, TrendingDown, Wallet, Users, Plus, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '@/lib/context';
import { formatCurrency, getCurrentMonth, getMonthTransactions, formatDate } from '@/lib/utils';
import StatCard from '@/components/StatCard';
import Modal from '@/components/Modal';
import TransactionForm from '@/components/TransactionForm';
import { Transaction } from '@/types';

export default function Dashboard() {
  const { data, addTransaction } = useAppContext();
  const navigate = useNavigate();
  const [showAdd, setShowAdd] = useState(false);

  const currentMonth = getCurrentMonth();
  const monthTxs = useMemo(() => getMonthTransactions(data.transactions, currentMonth), [data.transactions, currentMonth]);

  const totalIncome = useMemo(() => monthTxs.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0), [monthTxs]);
  const totalExpense = useMemo(() => monthTxs.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0), [monthTxs]);
  const balance = totalIncome - totalExpense;
  const totalCapital = useMemo(() => data.capitals.reduce((s, c) => s + c.amount, 0), [data.capitals]);
  const pendingDebts = useMemo(() => data.debts.filter((d) => d.status !== 'settled'), [data.debts]);
  const debtTotal = useMemo(() => pendingDebts.reduce((s, d) => s + (d.amount - d.paidAmount), 0), [pendingDebts]);

  const recentTxs = data.transactions.slice(0, 5);

  const handleAdd = (tx: Omit<Transaction, 'id'>) => {
    addTransaction(tx);
    setShowAdd(false);
  };

  const now = new Date();
  const greeting = now.getHours() < 12 ? 'Good morning' : now.getHours() < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="px-4 py-5 space-y-5">
      {/* Greeting */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 dark:text-gray-500 text-sm">{greeting} 👋</p>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {data.userName || 'Welcome!'}
          </h1>
        </div>
        <button onClick={() => setShowAdd(true)} className="btn-primary">
          <Plus size={18} />
          Add
        </button>
      </div>

      {/* Balance Card */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-5 text-white shadow-lg">
        <p className="text-blue-200 text-sm font-medium">This Month's Balance</p>
        <p className="text-4xl font-bold mt-1">{formatCurrency(balance, data.currency)}</p>
        <div className="flex gap-4 mt-4">
          <div className="flex items-center gap-1.5">
            <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center">
              <TrendingUp size={14} />
            </div>
            <div>
              <p className="text-blue-200 text-xs">Income</p>
              <p className="font-semibold text-sm">{formatCurrency(totalIncome, data.currency)}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center">
              <TrendingDown size={14} />
            </div>
            <div>
              <p className="text-blue-200 text-xs">Expenses</p>
              <p className="font-semibold text-sm">{formatCurrency(totalExpense, data.currency)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          label="Total Capital"
          value={formatCurrency(totalCapital, data.currency)}
          icon={<Wallet size={20} />}
          color="blue"
          sub={`${data.capitals.length} sources`}
        />
        <StatCard
          label="Pending Debts"
          value={formatCurrency(debtTotal, data.currency)}
          icon={<Users size={20} />}
          color="red"
          sub={`${pendingDebts.length} active`}
        />
      </div>

      {/* Recent Transactions */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-gray-900 dark:text-gray-100">Recent Transactions</h2>
          <button
            onClick={() => navigate('/transactions')}
            className="text-blue-600 dark:text-blue-400 text-sm flex items-center gap-1 hover:underline"
          >
            See all <ArrowRight size={14} />
          </button>
        </div>

        {recentTxs.length === 0 ? (
          <div className="card text-center py-8">
            <p className="text-3xl mb-2">📊</p>
            <p className="text-gray-400 dark:text-gray-500 text-sm">No transactions yet</p>
            <button onClick={() => setShowAdd(true)} className="text-blue-600 dark:text-blue-400 text-sm mt-2 hover:underline">
              Add your first one
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {recentTxs.map((tx) => (
              <div key={tx.id} className="card flex items-center gap-3 py-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    tx.type === 'income'
                      ? 'bg-green-50 dark:bg-green-900/30'
                      : 'bg-red-50 dark:bg-red-900/30'
                  }`}
                >
                  <span className="text-lg">
                    {tx.type === 'income' ? '⬆️' : '⬇️'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 dark:text-gray-100 text-sm truncate">
                    {tx.description || tx.category}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">{formatDate(tx.date)}</p>
                </div>
                <p
                  className={`font-bold text-sm ${
                    tx.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'
                  }`}
                >
                  {tx.type === 'income' ? '+' : '-'}
                  {formatCurrency(tx.amount, data.currency)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="New Transaction">
        <TransactionForm onSubmit={handleAdd} onCancel={() => setShowAdd(false)} />
      </Modal>
    </div>
  );
}
