import { useState, useMemo } from 'react';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import { useAppContext } from '@/lib/context';
import { formatCurrency } from '@/lib/utils';
import Modal from '@/components/Modal';
import EmptyState from '@/components/EmptyState';
import { Capital } from '@/types';
import clsx from 'clsx';

const CAPITAL_TYPES = ['cash', 'bank', 'investment', 'other'] as const;
type CapitalType = typeof CAPITAL_TYPES[number];

const typeEmoji: Record<CapitalType, string> = {
  cash: '💵',
  bank: '🏦',
  investment: '📈',
  other: '🏷️',
};

const typeColors: Record<CapitalType, string> = {
  cash: 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400',
  bank: 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
  investment: 'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
  other: 'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400',
};

function CapitalForm({
  initial,
  onSubmit,
  onCancel,
}: {
  initial?: Partial<Capital>;
  onSubmit: (c: Omit<Capital, 'id'>) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(initial?.name ?? '');
  const [amount, setAmount] = useState(initial?.amount?.toString() ?? '');
  const [type, setType] = useState<CapitalType>(initial?.type ?? 'cash');
  const [note, setNote] = useState(initial?.note ?? '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !amount || isNaN(Number(amount))) return;
    onSubmit({
      name,
      amount: Number(amount),
      type,
      note,
      updatedAt: new Date().toISOString(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="label">Name</label>
        <input type="text" className="input" placeholder="e.g. Main Bank Account" value={name} onChange={(e: any) => setName(e.target.value)} required />
      </div>

      <div>
        <label className="label">Type</label>
        <div className="grid grid-cols-4 gap-2">
          {CAPITAL_TYPES.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              className={clsx(
                'flex flex-col items-center gap-1 p-2 rounded-xl border text-xs font-medium transition-all',
                type === t
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                  : 'border-gray-100 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-200 dark:hover:border-gray-500'
              )}
            >
              <span className="text-xl">{typeEmoji[t]}</span>
              <span className="capitalize">{t}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="label">Amount</label>
        <input type="number" className="input" placeholder="0" value={amount} onChange={(e: any) => setAmount(e.target.value)} min="0" step="any" required />
      </div>

      <div>
        <label className="label">Note (optional)</label>
        <textarea className="input resize-none" rows={2} placeholder="Additional notes..." value={note} onChange={(e: any) => setNote(e.target.value)} />
      </div>

      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onCancel} className="btn-secondary flex-1 justify-center">Cancel</button>
        <button type="submit" className="btn-primary flex-1 justify-center">{initial?.id ? 'Update' : 'Add'} Capital</button>
      </div>
    </form>
  );
}

export default function Capitals() {
  const { data, addCapital, updateCapital, deleteCapital } = useAppContext();
  const [showAdd, setShowAdd] = useState(false);
  const [editCapital, setEditCapital] = useState<Capital | null>(null);

  const totalCapital = useMemo(() => data.capitals.reduce((s, c) => s + c.amount, 0), [data.capitals]);

  const byType = useMemo(() => {
    const map: Record<string, number> = {};
    data.capitals.forEach((c) => {
      map[c.type] = (map[c.type] || 0) + c.amount;
    });
    return map;
  }, [data.capitals]);

  const handleAdd = (c: Omit<Capital, 'id'>) => {
    addCapital(c);
    setShowAdd(false);
  };

  const handleEdit = (c: Omit<Capital, 'id'>) => {
    if (editCapital) {
      updateCapital(editCapital.id, c);
      setEditCapital(null);
    }
  };

  return (
    <div className="px-4 py-5 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Capital</h1>
        <button onClick={() => setShowAdd(true)} className="btn-primary">
          <Plus size={18} /> Add
        </button>
      </div>

      {/* Total */}
      <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl p-5 text-white">
        <p className="text-purple-200 text-sm font-medium">Total Capital</p>
        <p className="text-4xl font-bold mt-1">{formatCurrency(totalCapital, data.currency)}</p>
        <div className="flex gap-4 mt-4 flex-wrap">
          {CAPITAL_TYPES.filter((t) => (byType[t] || 0) > 0).map((t) => (
            <div key={t} className="flex items-center gap-1.5">
              <span>{typeEmoji[t]}</span>
              <div>
                <p className="text-purple-200 text-xs capitalize">{t}</p>
                <p className="font-semibold text-sm">{formatCurrency(byType[t] || 0, data.currency)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {data.capitals.length === 0 ? (
        <EmptyState
          icon="💰"
          title="No capital added"
          description="Track your cash, bank accounts, and investments"
          action={
            <button onClick={() => setShowAdd(true)} className="btn-primary">
              <Plus size={16} /> Add Capital
            </button>
          }
        />
      ) : (
        <div className="space-y-2">
          {data.capitals.map((cap) => (
            <div key={cap.id} className="card flex items-center gap-3">
              <div className={clsx('w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0', typeColors[cap.type as CapitalType])}>
                {typeEmoji[cap.type as CapitalType]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 dark:text-gray-100">{cap.name}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 capitalize">{cap.type}{cap.note ? ` · ${cap.note}` : ''}</p>
              </div>
              <div className="flex items-center gap-1.5">
                <p className="font-bold text-gray-900 dark:text-gray-100">{formatCurrency(cap.amount, data.currency)}</p>
                <button onClick={() => setEditCapital(cap)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 dark:text-gray-500">
                  <Edit2 size={14} />
                </button>
                <button onClick={() => deleteCapital(cap.id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 text-gray-400 dark:text-gray-500 hover:text-red-500">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Add Capital Source">
        <CapitalForm onSubmit={handleAdd} onCancel={() => setShowAdd(false)} />
      </Modal>

      <Modal open={!!editCapital} onClose={() => setEditCapital(null)} title="Edit Capital Source">
        {editCapital && (
          <CapitalForm
            initial={editCapital}
            onSubmit={handleEdit}
            onCancel={() => setEditCapital(null)}
          />
        )}
      </Modal>
    </div>
  );
}
