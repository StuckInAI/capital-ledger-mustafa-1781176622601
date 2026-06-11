import { useState, useMemo } from 'react';
import { Plus, Trash2, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useAppContext } from '@/lib/context';
import { t } from '@/lib/i18n';
import { formatCurrency, formatDate } from '@/lib/utils';
import Modal from '@/components/Modal';
import EmptyState from '@/components/EmptyState';
import { Debt, DebtType, DebtStatus } from '@/types';
import clsx from 'clsx';

function DebtForm({ onSubmit, onCancel }: { onSubmit: (d: Omit<Debt, 'id'>) => void; onCancel: () => void }) {
  const { lang } = useAppContext();
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
      <div className="flex bg-gray-100 dark:bg-gray-700 rounded-xl p-1">
        {(['lent', 'borrowed'] as DebtType[]).map((tp) => (
          <button
            key={tp}
            type="button"
            onClick={() => setType(tp)}
            className={clsx(
              'flex-1 py-2 rounded-lg text-sm font-semibold transition-all',
              type === tp
                ? tp === 'lent'
                  ? 'bg-blue-500 text-white shadow'
                  : 'bg-orange-500 text-white shadow'
                : 'text-gray-500 dark:text-gray-400'
            )}
          >
            {tp === 'lent' ? `💸 ${t(lang, 'iLent')}` : `🤝 ${t(lang, 'iBorrowed')}`}
          </button>
        ))}
      </div>

      <div>
        <label className="label">{t(lang, 'personName')}</label>
        <input type="text" className="input" placeholder={t(lang, 'enterName')} value={person} onChange={(e: any) => setPerson(e.target.value)} required />
      </div>
      <div>
        <label className="label">{t(lang, 'amount')}</label>
        <input type="number" className="input" placeholder="0" value={amount} onChange={(e: any) => setAmount(e.target.value)} min="0" step="any" required />
      </div>
      <div>
        <label className="label">{t(lang, 'description')}</label>
        <input type="text" className="input" placeholder={t(lang, 'whatIsFor')} value={description} onChange={(e: any) => setDescription(e.target.value)} />
      </div>
      <div>
        <label className="label">{t(lang, 'date')}</label>
        <input type="date" className="input" value={date} onChange={(e: any) => setDate(e.target.value)} required />
      </div>
      <div>
        <label className="label">{t(lang, 'dueDate')}</label>
        <input type="date" className="input" value={dueDate} onChange={(e: any) => setDueDate(e.target.value)} />
      </div>

      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onCancel} className="btn-secondary flex-1 justify-center">{t(lang, 'cancel')}</button>
        <button type="submit" className="btn-primary flex-1 justify-center">{t(lang, 'addDebt')}</button>
      </div>
    </form>
  );
}

function PaymentModal({ debt, currency, onSettle, onClose }: { debt: Debt; currency: string; onSettle: (amount: number) => void; onClose: () => void }) {
  const { lang } = useAppContext();
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
      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
        <p className="text-sm text-gray-500 dark:text-gray-400">{t(lang, 'remainingAmount')}</p>
        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{formatCurrency(remaining, currency)}</p>
      </div>
      <div>
        <label className="label">{t(lang, 'paymentAmount')}</label>
        <input type="number" className="input" placeholder="0" value={amount} onChange={(e: any) => setAmount(e.target.value)} min="0" max={remaining} step="any" required />
      </div>
      <div className="flex gap-3">
        <button type="button" onClick={() => setAmount(remaining.toString())} className="btn-secondary flex-1 justify-center">{t(lang, 'fullAmount')}</button>
        <button type="submit" className="btn-primary flex-1 justify-center">{t(lang, 'recordPayment')}</button>
      </div>
    </form>
  );
}

export default function Debts() {
  const { data, addDebt, updateDebt, deleteDebt, lang } = useAppContext();
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

  const tabLabels: Record<'all' | DebtType, string> = {
    all: t(lang, 'all'),
    lent: t(lang, 'lent'),
    borrowed: t(lang, 'borrowed'),
  };

  return (
    <div className="px-4 py-5 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{t(lang, 'debts')}</h1>
        <button onClick={() => setShowAdd(true)} className="btn-primary">
          <Plus size={18} /> {t(lang, 'add')}
        </button>
      </div>

      {/* Summary */}
      <div className="flex gap-3">
        <div className="flex-1 bg-blue-50 dark:bg-blue-900/20 rounded-xl p-3">
          <p className="text-xs text-blue-500 dark:text-blue-400 font-medium">{t(lang, 'iLent')}</p>
          <p className="text-sm font-bold text-blue-700 dark:text-blue-400">{formatCurrency(totalLent, data.currency)}</p>
        </div>
        <div className="flex-1 bg-orange-50 dark:bg-orange-900/20 rounded-xl p-3">
          <p className="text-xs text-orange-500 dark:text-orange-400 font-medium">{t(lang, 'iBorrowed')}</p>
          <p className="text-sm font-bold text-orange-700 dark:text-orange-400">{formatCurrency(totalBorrowed, data.currency)}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {(['all', 'lent', 'borrowed'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={clsx(
              'px-3 py-1.5 rounded-xl text-xs font-semibold transition-all',
              activeTab === tab
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
            )}
          >
            {tabLabels[tab]}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon="🤝"
          title={t(lang, 'noDebtsRecorded')}
          description={t(lang, 'trackDebts')}
          action={
            <button onClick={() => setShowAdd(true)} className="btn-primary">
              <Plus size={16} /> {t(lang, 'addDebt')}
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
                        debt.type === 'lent'
                          ? 'bg-blue-50 dark:bg-blue-900/30'
                          : 'bg-orange-50 dark:bg-orange-900/30'
                      )}
                    >
                      {debt.type === 'lent' ? '💸' : '🤝'}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm">{debt.person}</p>
                        {statusIcon(debt)}
                      </div>
                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        {debt.type === 'lent' ? t(lang, 'lentTo') : t(lang, 'borrowedFrom')} · {formatDate(debt.date)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={clsx('font-bold text-sm', debt.type === 'lent' ? 'text-blue-600 dark:text-blue-400' : 'text-orange-600 dark:text-orange-400')}>
                      {formatCurrency(debt.amount, data.currency)}
                    </p>
                    {debt.paidAmount > 0 && (
                      <p className="text-xs text-gray-400 dark:text-gray-500">{t(lang, 'paid')}: {formatCurrency(debt.paidAmount, data.currency)}</p>
                    )}
                  </div>
                </div>

                {/* Progress */}
                {debt.amount > 0 && (
                  <div>
                    <div className="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className={clsx('h-full rounded-full transition-all', debt.type === 'lent' ? 'bg-blue-500' : 'bg-orange-500')}
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      />
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-xs text-gray-400 dark:text-gray-500">{Math.round(progress)}{t(lang, 'percentPaid')}</span>
                      {debt.status !== 'settled' && (
                        <span className="text-xs text-gray-400 dark:text-gray-500">{t(lang, 'remaining')}: {formatCurrency(remaining, data.currency)}</span>
                      )}
                    </div>
                  </div>
                )}

                {debt.description && <p className="text-xs text-gray-400 dark:text-gray-500">{debt.description}</p>}

                <div className="flex gap-2">
                  {debt.status !== 'settled' && (
                    <button
                      onClick={() => setPayDebt(debt)}
                      className="btn-primary flex-1 justify-center text-xs py-1.5"
                    >
                      <CheckCircle size={14} /> {t(lang, 'recordPayment')}
                    </button>
                  )}
                  <button onClick={() => deleteDebt(debt.id)} className="btn-danger py-1.5 px-3">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title={t(lang, 'addDebt')}>
        <DebtForm onSubmit={handleAdd} onCancel={() => setShowAdd(false)} />
      </Modal>

      <Modal open={!!payDebt} onClose={() => setPayDebt(null)} title={t(lang, 'recordPayment')}>
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
