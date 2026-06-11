import { useState, useMemo } from 'react';
import { Plus, Search, Trash2, Edit2, Filter } from 'lucide-react';
import { useAppContext } from '@/lib/context';
import { t } from '@/lib/i18n';
import { formatCurrency, formatDate, getCategoryEmoji, getCategoryLabel } from '@/lib/utils';
import Modal from '@/components/Modal';
import TransactionForm from '@/components/TransactionForm';
import EmptyState from '@/components/EmptyState';
import { Transaction, TransactionType } from '@/types';
import clsx from 'clsx';

export default function Transactions() {
  const { data, addTransaction, updateTransaction, deleteTransaction, lang } = useAppContext();
  const [showAdd, setShowAdd] = useState(false);
  const [editTx, setEditTx] = useState<Transaction | null>(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | TransactionType>('all');

  const filtered = useMemo(() => {
    let txs = [...data.transactions];
    if (filter !== 'all') txs = txs.filter((tx) => tx.type === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      txs = txs.filter(
        (tx) =>
          tx.description.toLowerCase().includes(q) ||
          tx.category.toLowerCase().includes(q) ||
          tx.note.toLowerCase().includes(q)
      );
    }
    return txs;
  }, [data.transactions, filter, search]);

  const totalIncome = useMemo(() => filtered.filter((tx) => tx.type === 'income').reduce((s, tx) => s + tx.amount, 0), [filtered]);
  const totalExpense = useMemo(() => filtered.filter((tx) => tx.type === 'expense').reduce((s, tx) => s + tx.amount, 0), [filtered]);

  const handleAdd = (tx: Omit<Transaction, 'id'>) => {
    addTransaction(tx);
    setShowAdd(false);
  };

  const handleEdit = (tx: Omit<Transaction, 'id'>) => {
    if (editTx) {
      updateTransaction(editTx.id, tx);
      setEditTx(null);
    }
  };

  const filterLabels: Record<'all' | TransactionType, string> = {
    all: t(lang, 'all'),
    income: t(lang, 'income'),
    expense: t(lang, 'expense'),
  };

  return (
    <div className="px-4 py-5 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{t(lang, 'ledger')}</h1>
        <button onClick={() => setShowAdd(true)} className="btn-primary">
          <Plus size={18} /> {t(lang, 'add')}
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
        <input
          type="text"
          className="input pl-9"
          placeholder={t(lang, 'searchTransactions')}
          value={search}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
        />
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {(['all', 'income', 'expense'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={clsx(
              'px-3 py-1.5 rounded-xl text-xs font-semibold transition-all',
              filter === f
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
            )}
          >
            <Filter size={10} className="inline mr-1" />
            {filterLabels[f]}
          </button>
        ))}
      </div>

      {/* Summary row */}
      {filtered.length > 0 && (
        <div className="flex gap-3">
          <div className="flex-1 bg-green-50 dark:bg-green-900/20 rounded-xl p-3">
            <p className="text-xs text-green-600 dark:text-green-400 font-medium">{t(lang, 'income')}</p>
            <p className="text-sm font-bold text-green-700 dark:text-green-400">{formatCurrency(totalIncome, data.currency)}</p>
          </div>
          <div className="flex-1 bg-red-50 dark:bg-red-900/20 rounded-xl p-3">
            <p className="text-xs text-red-500 dark:text-red-400 font-medium">{t(lang, 'expenses')}</p>
            <p className="text-sm font-bold text-red-600 dark:text-red-400">{formatCurrency(totalExpense, data.currency)}</p>
          </div>
        </div>
      )}

      {/* List */}
      {filtered.length === 0 ? (
        <EmptyState
          icon="📒"
          title={t(lang, 'noTransactionsFound')}
          description={t(lang, 'startTracking')}
          action={
            <button onClick={() => setShowAdd(true)} className="btn-primary">
              <Plus size={16} /> {t(lang, 'addTransaction')}
            </button>
          }
        />
      ) : (
        <div className="space-y-2">
          {filtered.map((tx) => (
            <div key={tx.id} className="card py-3 flex items-center gap-3">
              <div
                className={clsx(
                  'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-lg',
                  tx.type === 'income'
                    ? 'bg-green-50 dark:bg-green-900/30'
                    : 'bg-red-50 dark:bg-red-900/30'
                )}
              >
                {getCategoryEmoji(tx.category)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 dark:text-gray-100 text-sm truncate">
                  {tx.description || getCategoryLabel(tx.category)}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  {getCategoryLabel(tx.category)} · {formatDate(tx.date)}
                </p>
              </div>
              <div className="flex items-center gap-1.5">
                <p
                  className={clsx(
                    'font-bold text-sm',
                    tx.type === 'income'
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-500 dark:text-red-400'
                  )}
                >
                  {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount, data.currency)}
                </p>
                <button
                  onClick={() => setEditTx(tx)}
                  className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 dark:text-gray-500"
                >
                  <Edit2 size={14} />
                </button>
                <button
                  onClick={() => deleteTransaction(tx.id)}
                  className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 text-gray-400 dark:text-gray-500 hover:text-red-500"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title={t(lang, 'newTransaction')}>
        <TransactionForm onSubmit={handleAdd} onCancel={() => setShowAdd(false)} />
      </Modal>

      <Modal open={!!editTx} onClose={() => setEditTx(null)} title={t(lang, 'editTransaction')}>
        {editTx && (
          <TransactionForm
            initial={editTx}
            onSubmit={handleEdit}
            onCancel={() => setEditTx(null)}
          />
        )}
      </Modal>
    </div>
  );
}
