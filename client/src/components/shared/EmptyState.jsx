import { HiOutlineInbox } from 'react-icons/hi';

const EmptyState = ({
  icon: Icon = HiOutlineInbox,
  title = 'No data found',
  description = 'Get started by creating a new item.',
  action,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 animate-fade-in">
      <div className="w-20 h-20 rounded-2xl bg-surface-100 dark:bg-surface-800 flex items-center justify-center mb-5">
        <Icon className="w-10 h-10 text-surface-400 dark:text-surface-500" />
      </div>
      <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-sm text-surface-500 dark:text-surface-400 text-center max-w-sm mb-6">
        {description}
      </p>
      {action}
    </div>
  );
};

export default EmptyState;
