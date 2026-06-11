import { useState, useMemo } from 'react';
import { Plus, Trash2, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useAppContext } from '@/lib/context';
import { formatCurrency, formatDate } from '@/lib/utils';
import Modal from '@/components/Modal';
import EmptyState from '@/components/EmptyState';
import { Debt, DebtType, DebtStatus } from '@/types';
import { generateId } from '@/lib/storage';
import clsx from 'clsx';

function DebtForm({ onSubmit, onCancel }: { onSubmit: (d: Omit<Debt, 'id'>) => void; onCancel: () => void }) {
  const [type, setType] = useState<DebtType>('lent');
  const [person, setPerson] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!person || !amount || isNaN(Number(amount)) || Number(amount) <= 0) return;
    onSubmit({
      type,
      person,
      amount: Number(amount),
      paidAmount: 0,
      date,
      dueDate,
      description,
      status: 'pending',
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex bg-gray-100 rounded-xl p-1">
        {(['lent', 'borrowed'] as DebtType[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setType(t)}
            className={clsx(
              'flex-1 py-2 rounded-lg text-sm font-semibold transition-all capitalize',
              type === t
                ? t === 'lent'
                  ? 'bg-blue-500 text-white shadow'
                  : 'bg-orange-500 text-white shadow'
                : 'text-gray-500'
            )}
          >
            {t === 'lent' ? '💸 I Lent' : '🤝 I Borrowed'}
          </button>
        ))}
      </div>

      <div>
        <label className="label">Person / Party Name</label>
        <input type="text" className="input" placeholder="Enter name" value={person} onChange={(e: any) => setPerson(e.target.value)} required />
      </div>
      <div>
        <label className="label">Amount</label>
        <input type="number" className="input" placeholder="0" value={amount} onChange={(e: any) => setAmount(e.target.value)} min="0" step="any" required />
      </div>
      <div>
        <label className="label">Description</label>
        <input type="text" className="input" placeholder="What is this for?" value={description} onChange={(e: any) => setDescription(e.target.value)} />
      </div>
      <div>
        <label className="label">Date</label>
        <input type="date" className="input" value={date} onChange={(e: any) => setDate(e.target.value)} required />
      </div>
      <div>
        <label className="label">Due Date (optional)</label>
        <input type="date" className="input" value={dueDate} onChange={(e: any) => setDueDate(e.target.value)} />
      </div>

      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onCancel} className="btn-secondary flex-1 justify-center">Cancel</button>
        <button type="submit" className="btn-primary flex-1 justify-center">Add Debt</button>
      </div>
    </form>
  );
}

function PaymentModal({ debt, currency, onSettle, onClose }: { debt: Debt; currency: string; onSettle: (amount: number) => void; onClose: () => void }) {
  const [amount, setAmount] = useState('');
  const remaining = debt.amount - debt.paidAmount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = Number(amount);
    if (!val || val <= 0 || val > remaining) return;
    onSettle(val);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-gray-50 rounded-xl p-4">
        <p className="text-sm text-gray-500">Remaining Amount</p>
        <p className="text-2xl font-bold text-gray-900">{formatCurrency(remaining, currency)}</p>
      </div>
      <div>
        <label className="label">Payment Amount</label>
        <input type="number" className="input" placeholder="0" value={amount} onChange={(e: any) => setAmount(e.target.value)} min="0" max={remaining} step="any" required />
      </div>
      <div className="flex gap-3">
        <button type="button" onClick={() => setAmount(remaining.toString())} className="btn-secondary flex-1 justify-center">Full Amount</button>
        <button type="submit" className="btn-primary flex-1 justify-center">Record Payment</button>
      </div>
    </form>
  );
}

export default function Debts() {
  const { data, addDebt, updateDebt, deleteDebt } = useAppContext();
  const [showAdd, setShowAdd] = useState(false);
  const [payDebt, setPayDebt] = useState<Debt | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | DebtType>('all');

  const filtered = useMemo(() => {
    if (activeTab === 'all') return data.debts;
    return data.debts.filter((d) => d.type === activeTab);
  }, [data.debts, activeTab]);

  const totalLent = useMemo(() => data.debts.filter((d) => d.type === 'lent' && d.status !== 'settled').reduce((s, d) => s + (d.amount - d.paidAmount), 0), [data.debts]);
  const totalBorrowed = useMemo(() => data.debts.filter((d) => d.type === 'borrowed' && d.status !== 'settled').reduce((s, d) => s + (d.amount - d.paidAmount), 0), [data.debts]);

  const handleAdd = (d: Omit<Debt, 'id'>) => {
    addDebt(d);
    setShowAdd(false);
  };

  const handleSettle = (debt: Debt, amount: number) => {
    const newPaid = debt.paidAmount + amount;
    const status: DebtStatus = newPaid >= debt.amount ? 'settled' : 'partial';
    updateDebt(debt.id, { paidAmount: newPaid, status });
    setPayDebt(null);
  };

  const statusIcon = (d: Debt) => {
    if (d.status === 'settled') return <CheckCircle size={14} className="text-green-500" />;
    if (d.status === 'partial') return <Clock size={14} className="text-yellow-500" />;
    return <AlertCircle size={14} className="text-red-400" />;
  };

  return (
    <div className="px-4 py-5 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Debts</h1>
        <button onClick={() => setShowAdd(true)} className="btn-primary">
          <Plus size={18} /> Add
        </button>
      </div>

      {/* Summary */}
      <div className="flex gap-3">
        <div className="flex-1 bg-blue-50 rounded-xl p-3">
          <p className="text-xs text-blue-500 font-medium">I Lent</p>
          <p className="text-sm font-bold text-blue-700">{formatCurrency(totalLent, data.currency)}</p>
        </div>
        <div className="flex-1 bg-orange-50 rounded-xl p-3">
          <p className="text-xs text-orange-500 font-medium">I Borrowed</p>
          <p className="text-sm font-bold text-orange-700">{formatCurrency(totalBorrowed, data.currency)}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {(['all', 'lent', 'borrowed'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={clsx(
              'px-3 py-1.5 rounded-xl text-xs font-semibold transition-all capitalize',
              activeTab === tab ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon="🤝"
          title="No debts recorded"
          description="Track money you've lent or borrowed"
          action={
            <button onClick={() => setShowAdd(true)} className="btn-primary">
              <Plus size={16} /> Add Debt
            </button>
          }
        />
      ) : (
        <div className="space-y-2">
          {filtered.map((debt) => {
            const remaining = debt.amount - debt.paidAmount;
            const progress = debt.amount > 0 ? (debt.paidAmount / debt.amount) * 100 : 0;
            return (
              <div key={debt.id} className="card space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className={clsx(
                        'w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0',
                        debt.type === 'lent' ? 'bg-blue-50' : 'bg-orange-50'
                      )}
                    >
                      {debt.type === 'lent' ? '💸' : '🤝'}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <p className="font-semibold text-gray-900 text-sm">{debt.person}</p>
                        {statusIcon(debt)}
                      </div>
                      <p className="text-xs text-gray-400">
                        {debt.type === 'lent' ? 'Lent to' : 'Borrowed from'} · {formatDate(debt.date)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={clsx('font-bold text-sm', debt.type === 'lent' ? 'text-blue-600' : 'text-orange-600')}>
                      {formatCurrency(debt.amount, data.currency)}
                    </p>
                    {debt.paidAmount > 0 && (
                      <p className="text-xs text-gray-400">Paid: {formatCurrency(debt.paidAmount, data.currency)}</p>
                    )}
                  </div>
                </div>

                {/* Progress */}
                {debt.amount > 0 && (
                  <div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={clsx('h-full rounded-full transition-all', debt.type === 'lent' ? 'bg-blue-500' : 'bg-orange-500')}
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      />
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-xs text-gray-400">{Math.round(progress)}% paid</span>
                      {debt.status !== 'settled' && (
                        <span className="text-xs text-gray-400">Remaining: {formatCurrency(remaining, data.currency)}</span>
                      )}
                    </div>
                  </div>
                )}

                {debt.description && <p className="text-xs text-gray-400">{debt.description}</p>}

                <div className="flex gap-2">
                  {debt.status !== 'settled' && (
                    <button
                      onClick={() => setPayDebt(debt)}
                      className="btn-primary flex-1 justify-center text-xs py-1.5"
                    >
                      <CheckCircle size={14} /> Record Payment
                    </button>
                  )}
                  <button
                    onClick={() => deleteDebt(debt.id)}
                    className="btn-danger py-1.5 px-3"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Add Debt">
        <DebtForm onSubmit={handleAdd} onCancel={() => setShowAdd(false)} />
      </Modal>

      <Modal open={!!payDebt} onClose={() => setPayDebt(null)} title="Record Payment">
        {payDebt && (
          <PaymentModal
            debt={payDebt}
            currency={data.currency}
            onSettle={(amount) => handleSettle(payDebt, amount)}
            onClose={() => setPayDebt(null)}
          />
        )}
      </Modal>
    </div>
  );
}
