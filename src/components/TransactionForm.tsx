import { useState } from 'react';
import { Transaction, TransactionType, TransactionCategory } from '@/types';
import { generateId } from '@/lib/storage';
import clsx from 'clsx';

const INCOME_CATEGORIES: TransactionCategory[] = ['salary', 'business', 'investment', 'other'];
const EXPENSE_CATEGORIES: TransactionCategory[] = [
  'food', 'transport', 'shopping', 'bills', 'health', 'entertainment', 'education', 'rent', 'other',
];

const categoryEmojis: Record<TransactionCategory, string> = {
  salary: '💼', business: '🏢', investment: '📈', food: '🍔', transport: '🚗',
  shopping: '🛍️', bills: '📄', health: '🏥', entertainment: '🎬', education: '📚',
  rent: '🏠', other: '💰',
};

type TransactionFormProps = {
  initial?: Partial<Transaction>;
  onSubmit: (tx: Omit<Transaction, 'id'>) => void;
  onCancel: () => void;
};

export default function TransactionForm({ initial, onSubmit, onCancel }: TransactionFormProps) {
  const [type, setType] = useState<TransactionType>(initial?.type ?? 'expense');
  const [amount, setAmount] = useState(initial?.amount?.toString() ?? '');
  const [category, setCategory] = useState<TransactionCategory>(initial?.category ?? 'food');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [date, setDate] = useState(initial?.date ?? new Date().toISOString().slice(0, 10));
  const [note, setNote] = useState(initial?.note ?? '');

  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const handleTypeChange = (t: TransactionType) => {
    setType(t);
    setCategory(t === 'income' ? 'salary' : 'food');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) return;
    onSubmit({
      type,
      amount: Number(amount),
      category,
      description,
      date,
      note,
      tags: [],
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Type Toggle */}
      <div className="flex bg-gray-100 rounded-xl p-1">
        {(['income', 'expense'] as TransactionType[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => handleTypeChange(t)}
            className={clsx(
              'flex-1 py-2 rounded-lg text-sm font-semibold transition-all capitalize',
              type === t
                ? t === 'income'
                  ? 'bg-green-500 text-white shadow'
                  : 'bg-red-500 text-white shadow'
                : 'text-gray-500'
            )}
          >
            {t === 'income' ? '⬆️ Income' : '⬇️ Expense'}
          </button>
        ))}
      </div>

      {/* Amount */}
      <div>
        <label className="label">Amount</label>
        <input
          type="number"
          className="input text-xl font-bold"
          placeholder="0"
          value={amount}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAmount(e.target.value)}
          min="0"
          step="any"
          required
          autoFocus
        />
      </div>

      {/* Category */}
      <div>
        <label className="label">Category</label>
        <div className="grid grid-cols-4 gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={clsx(
                'flex flex-col items-center gap-1 p-2 rounded-xl border text-xs font-medium transition-all',
                category === cat
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-100 bg-gray-50 text-gray-600 hover:border-gray-200'
              )}
            >
              <span className="text-lg">{categoryEmojis[cat]}</span>
              <span className="capitalize text-center leading-tight">{cat}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="label">Description</label>
        <input
          type="text"
          className="input"
          placeholder="What was this for?"
          value={description}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDescription(e.target.value)}
        />
      </div>

      {/* Date */}
      <div>
        <label className="label">Date</label>
        <input
          type="date"
          className="input"
          value={date}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDate(e.target.value)}
          required
        />
      </div>

      {/* Note */}
      <div>
        <label className="label">Note (optional)</label>
        <textarea
          className="input resize-none"
          rows={2}
          placeholder="Additional notes..."
          value={note}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNote(e.target.value)}
        />
      </div>

      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onCancel} className="btn-secondary flex-1 justify-center">
          Cancel
        </button>
        <button
          type="submit"
          className={clsx(
            'flex-1 justify-center font-semibold px-4 py-2 rounded-xl text-white transition-colors flex items-center gap-2',
            type === 'income' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'
          )}
        >
          {initial?.id ? 'Update' : 'Add'} {type === 'income' ? 'Income' : 'Expense'}
        </button>
      </div>
    </form>
  );
}
