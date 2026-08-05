const statusConfig = {
  Applied: {
    className: 'status-applied',
    dot: 'bg-blue-500',
  },
  OA: {
    className: 'status-oa',
    dot: 'bg-amber-500',
  },
  Interview: {
    className: 'status-interview',
    dot: 'bg-purple-500',
  },
  Rejected: {
    className: 'status-rejected',
    dot: 'bg-red-500',
  },
  Offer: {
    className: 'status-offer',
    dot: 'bg-emerald-500',
  },
};

const StatusBadge = ({ status, size = 'md' }) => {
  const config = statusConfig[status] || statusConfig.Applied;

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm',
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 font-medium rounded-lg
        ${config.className}
        ${sizes[size]}
      `}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {status}
    </span>
  );
};

export default StatusBadge;
