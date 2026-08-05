const Skeleton = ({ className = '', variant = 'text', count = 1 }) => {
  const variants = {
    text: 'h-4 w-full',
    title: 'h-6 w-3/4',
    avatar: 'h-10 w-10 rounded-full',
    card: 'h-32 w-full',
    thumbnail: 'h-20 w-20 rounded-xl',
    button: 'h-10 w-24 rounded-xl',
    badge: 'h-6 w-16 rounded-lg',
  };

  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`skeleton ${variants[variant]} ${className}`}
        />
      ))}
    </>
  );
};

// Pre-built skeleton layouts
export const JobCardSkeleton = () => (
  <div className="glass-card p-5 space-y-4">
    <div className="flex items-start justify-between">
      <div className="space-y-2 flex-1">
        <Skeleton variant="title" />
        <Skeleton className="w-1/2" />
      </div>
      <Skeleton variant="badge" />
    </div>
    <div className="flex gap-2">
      <Skeleton variant="badge" />
      <Skeleton variant="badge" />
    </div>
    <div className="flex justify-between items-center">
      <Skeleton className="w-1/3 h-4" />
      <Skeleton variant="button" />
    </div>
  </div>
);

export const StatCardSkeleton = () => (
  <div className="glass-card p-6 space-y-3">
    <div className="flex items-center justify-between">
      <Skeleton variant="avatar" />
      <Skeleton variant="badge" />
    </div>
    <Skeleton variant="title" />
    <Skeleton className="w-1/2" />
  </div>
);

export default Skeleton;
