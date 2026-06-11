import clsx from 'clsx';

type StatCardProps = {
  label: string;
  value: string;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'red' | 'purple' | 'yellow';
  sub?: string;
};

const colorMap = {
  blue: 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
  green: 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400',
  red: 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400',
  purple: 'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
  yellow: 'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400',
};

export default function StatCard({ label, value, icon, color, sub }: StatCardProps) {
  return (
    <div className="card flex items-center gap-3">
      <div className={clsx('w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0', colorMap[color])}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs text-gray-400 dark:text-gray-500 font-medium uppercase tracking-wide">{label}</p>
        <p className="text-lg font-bold text-gray-900 dark:text-gray-100 truncate">{value}</p>
        {sub && <p className="text-xs text-gray-400 dark:text-gray-500">{sub}</p>}
      </div>
    </div>
  );
}
