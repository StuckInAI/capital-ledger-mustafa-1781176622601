import { useState, useMemo } from 'react';
import { TrendingUp, TrendingDown, Wallet, Users, Plus, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '@/lib/context';
import { t } from '@/lib/i18n';
import { formatCurrency, getCurrentMonth, getMonthTransactions, formatDate } from '@/lib/utils';
import StatCard from '@/components/StatCard';
import Modal from '@/components/Modal';
import TransactionForm from '@/components/TransactionForm';
import { Transaction } from '@/types';

export default function Dashboard() {
  const { data, addTransaction, lang } = useAppContext();
  const navigate = useNavigate();
  const [showAdd, setShowAdd] = useState(false);

  const currentMonth = getCurrentMonth();
  const monthTxs = useMemo(() => getMonthTransactions(data.transactions, currentMonth), [data.transactions, currentMonth]);

  const totalIncome = useMemo(() => monthTxs.filter((tx) => tx.type === 'income').reduce((s, tx) => s + tx.amount, 0), [monthTxs]);
  const totalExpense = useMemo(() => monthTxs.filter((tx) => tx.type === 'expense').reduce((s, tx) => s + tx.amount, 0), [monthTxs]);
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
  const greetingKey = now.getHours() < 12 ? 'goodMorning' : now.getHours() < 18 ? 'goodAfternoon' : 'goodEvening';

  return (
    <div className="px-4 py-5 space-y-5">
      {/* Greeting */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 dark:text-gray-500 text-sm">{t(lang, greetingKey)} 👋</p>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {data.userName || t(lang, 'welcome')}
          </h1>
        </div>
        <button onClick={() => setShowAdd(true)} className="btn-primary">
          <Plus size={18} />
          {t(lang, 'add')}
        </button>
      </div>

      {/* Balance Card */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-5 text-white shadow-lg">
        <p className="text-blue-200 text-sm font-medium">{t(lang, 'thisMonthBalance')}</p>
        <p className="text-4xl font-bold mt-1">{formatCurrency(balance, data.currency)}</p>
        <div className="flex gap-4 mt-4">
          <div className="flex items-center gap-1.5">
            <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center">
              <TrendingUp size={14} />
            </div>
            <div>
              <p className="text-blue-200 text-xs">{t(lang, 'income')}</p>
              <p className="font-semibold text-sm">{formatCurrency(totalIncome, data.currency)}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center">
              <TrendingDown size={14} />
            </div>
            <div>
              <p className="text-blue-200 text-xs">{t(lang, 'expenses')}</p>
              <p className="font-semibold text-sm">{formatCurrency(totalExpense, data.currency)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          label={t(lang, 'totalCapital')}
          value={formatCurrency(totalCapital, data.currency)}
          icon={<Wallet size={20} />}
          color="blue"
          sub={`${data.capitals.length} ${t(lang, 'sources')}`}
        />
        <StatCard
          label={t(lang, 'pendingDebts')}
          value={formatCurrency(debtTotal, data.currency)}
          icon={<Users size={20} />}
          color="red"
          sub={`${pendingDebts.length} ${t(lang, 'active')}`}
        />
      </div>

      {/* Recent Transactions */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-gray-900 dark:text-gray-100">{t(lang, 'recentTransactions')}</h2>
          <button
            onClick={() => navigate('/transactions')}
            className="text-blue-600 dark:text-blue-400 text-sm flex items-center gap-1 hover:underline"
          >
            {t(lang, 'seeAll')} <ArrowRight size={14} />
          </button>
        </div>

        {recentTxs.length === 0 ? (
          <div className="card text-center py-8">
            <p className="text-3xl mb-2">📊</p>
            <p className="text-gray-400 dark:text-gray-500 text-sm">{t(lang, 'noTransactions')}</p>
            <button onClick={() => setShowAdd(true)} className="text-blue-600 dark:text-blue-400 text-sm mt-2 hover:underline">
              {t(lang, 'addFirst')}
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
                  <span className="text-lg">{tx.type === 'income' ? '⬆️' : '⬇️'}</span>
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

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title={t(lang, 'newTransaction')}>
        <TransactionForm onSubmit={handleAdd} onCancel={() => setShowAdd(false)} />
      </Modal>
    </div>
  );
}
