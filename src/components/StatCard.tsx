import clsx from 'clsx';

type StatCardProps = {
  label: string;
  value: string;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'red' | 'purple' | 'yellow';
  sub?: string;
};

const colorMap = {
  blue: 'bg-blue-50 text-blue-600',
  green: 'bg-green-50 text-green-600',
  red: 'bg-red-50 text-red-600',
  purple: 'bg-purple-50 text-purple-600',
  yellow: 'bg-yellow-50 text-yellow-600',
};

export default function StatCard({ label, value, icon, color, sub }: StatCardProps) {
  return (
    <div className="card flex items-center gap-3">
      <div className={clsx('w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0', colorMap[color])}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{label}</p>
        <p className="text-lg font-bold text-gray-900 truncate">{value}</p>
        {sub && <p className="text-xs text-gray-400">{sub}</p>}
      </div>
    </div>
  );
}
