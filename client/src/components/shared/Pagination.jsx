import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';

const Pagination = ({ page, pages, onPageChange }) => {
  if (pages <= 1) return null;

  const getPageNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, page - delta); i <= Math.min(pages - 1, page + delta); i++) {
      range.push(i);
    }

    if (page - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (page + delta < pages - 1) {
      rangeWithDots.push('...', pages);
    } else if (pages > 1) {
      rangeWithDots.push(pages);
    }

    return [...new Set(rangeWithDots)];
  };

  return (
    <div className="flex items-center justify-center gap-1.5 mt-6">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="p-2 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800
                   disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <HiChevronLeft className="w-5 h-5" />
      </button>

      {getPageNumbers().map((pageNum, idx) => (
        <button
          key={idx}
          onClick={() => typeof pageNum === 'number' && onPageChange(pageNum)}
          disabled={pageNum === '...'}
          className={`
            min-w-[40px] h-10 rounded-xl text-sm font-medium transition-all duration-200
            ${pageNum === page
              ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/25'
              : pageNum === '...'
                ? 'cursor-default text-surface-400'
                : 'hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-600 dark:text-surface-400'
            }
          `}
        >
          {pageNum}
        </button>
      ))}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === pages}
        className="p-2 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800
                   disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <HiChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};

export default Pagination;
