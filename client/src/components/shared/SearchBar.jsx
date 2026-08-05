import { HiSearch, HiX } from 'react-icons/hi';
import { useState, useEffect } from 'react';

const SearchBar = ({ value, onChange, placeholder = 'Search...', debounceMs = 300 }) => {
  const [localValue, setLocalValue] = useState(value || '');

  useEffect(() => {
    setLocalValue(value || '');
  }, [value]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (localValue !== value) {
        onChange(localValue);
      }
    }, debounceMs);
    return () => clearTimeout(timer);
  }, [localValue, debounceMs]);

  return (
    <div className="relative">
      <HiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
      <input
        type="text"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-11 pr-10 py-2.5 rounded-xl text-sm
                   border border-surface-300 dark:border-surface-600
                   bg-white dark:bg-surface-800
                   text-surface-900 dark:text-surface-100
                   placeholder:text-surface-400 dark:placeholder:text-surface-500
                   input-focus outline-none transition-all duration-200"
      />
      {localValue && (
        <button
          onClick={() => {
            setLocalValue('');
            onChange('');
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-md
                     hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
        >
          <HiX className="w-4 h-4 text-surface-400" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
