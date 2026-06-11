type EmptyStateProps = {
  icon: string;
  title: string;
  description: string;
  action?: React.ReactNode;
};

export default function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="card text-center py-10 space-y-3">
      <p className="text-4xl">{icon}</p>
      <div>
        <p className="font-semibold text-gray-700 dark:text-gray-300">{title}</p>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">{description}</p>
      </div>
      {action && <div className="flex justify-center pt-1">{action}</div>}
    </div>
  );
}
