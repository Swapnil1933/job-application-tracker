import { useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import {
  HiOutlineSearch,
  HiOutlineExternalLink,
  HiOutlinePlusCircle,
  HiOutlineCheckCircle,
  HiOutlineLocationMarker,
  HiOutlineCurrencyDollar,
  HiOutlineGlobeAlt,
  HiSparkles,
  HiOutlineRefresh,
} from 'react-icons/hi';
import Button from '../components/shared/Button';

const CATEGORIES = [
  'All',
  'Frontend',
  'Backend',
  'Full Stack',
  'DevOps',
  'Python',
  'React',
  'Data',
  'Remote',
];

const LiveJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [importingId, setImportingId] = useState(null);

  const fetchLiveJobs = async (searchQuery = search, category = selectedCategory) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (category && category !== 'All') params.append('category', category);

      const res = await api.get(`/api/external-jobs?${params.toString()}`);
      setJobs(res.data.data || []);
    } catch (error) {
      toast.error('Failed to load live company job postings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchLiveJobs(search, selectedCategory);
    }, 300);
    return () => clearTimeout(timer);
  }, [search, selectedCategory]);

  const handleImport = async (job) => {
    try {
      setImportingId(job.id);
      const res = await api.post('/api/external-jobs/import', {
        company: job.company,
        position: job.position,
        location: job.location,
        remote: job.remote,
        salary: job.salary,
        url: job.url,
        tags: job.tags,
        notes: `Imported live posting (${job.source}). ${job.description.substring(0, 120)}...`,
        status: 'Applied',
      });

      toast.success(res.data.message || 'Imported to tracker!');
      setJobs((prev) =>
        prev.map((j) => (j.id === job.id ? { ...j, isImported: true } : j))
      );
    } catch (error) {
      const msg = error.response?.data?.error || 'Import failed';
      toast.error(msg);
    } finally {
      setImportingId(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-surface-900 dark:text-white">
              Live Company Jobs
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live Global Feed
            </span>
          </div>
          <p className="text-surface-500 dark:text-surface-400 text-sm">
            Discover active company openings around the world & import them into your tracker with 1 click.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => fetchLiveJobs()}
          className="self-start sm:self-auto"
        >
          <HiOutlineRefresh className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh Live Data
        </Button>
      </div>

      {/* Search & Category Bar */}
      <div className="glass-card p-4 space-y-4">
        <div className="relative">
          <HiOutlineSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
          <input
            type="text"
            placeholder="Search live positions, company names, or tech skills..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-900 dark:text-white placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-sm"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 pt-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-primary-500 text-white shadow-sm shadow-primary-500/30'
                  : 'bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400 hover:bg-surface-200 dark:hover:bg-surface-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Job Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={n}
              className="glass-card p-5 space-y-4 animate-pulse"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-surface-200 dark:bg-surface-800" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-surface-200 dark:bg-surface-800 rounded w-3/4" />
                  <div className="h-3 bg-surface-200 dark:bg-surface-800 rounded w-1/2" />
                </div>
              </div>
              <div className="h-12 bg-surface-200 dark:bg-surface-800 rounded-xl" />
              <div className="flex justify-between pt-2">
                <div className="h-8 bg-surface-200 dark:bg-surface-800 rounded w-1/3" />
                <div className="h-8 bg-surface-200 dark:bg-surface-800 rounded w-1/3" />
              </div>
            </div>
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <div className="glass-card p-12 text-center space-y-3">
          <div className="w-12 h-12 mx-auto rounded-full bg-surface-100 dark:bg-surface-800 flex items-center justify-center text-surface-400">
            <HiOutlineSearch className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-surface-900 dark:text-white">
            No live jobs matching your search
          </h3>
          <p className="text-sm text-surface-500 dark:text-surface-400 max-w-md mx-auto">
            Try tweaking your search terms or selecting a different category filter above.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="glass-card p-5 flex flex-col justify-between hover:border-primary-500/30 transition-all group"
            >
              <div>
                {/* Company Logo & Meta */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    {job.logo ? (
                      <img
                        src={job.logo}
                        alt={job.company}
                        className="w-11 h-11 rounded-xl object-contain bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 p-1"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-500/20 to-primary-700/20 text-primary-600 dark:text-primary-400 flex items-center justify-center font-bold text-lg border border-primary-500/20">
                        {job.company.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-surface-900 dark:text-white group-hover:text-primary-500 transition-colors line-clamp-1">
                        {job.position}
                      </h3>
                      <p className="text-xs text-surface-500 dark:text-surface-400 font-medium">
                        {job.company}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-surface-100 dark:bg-surface-800 text-surface-500">
                    {job.source}
                  </span>
                </div>

                {/* Location & Salary Info */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-surface-500 dark:text-surface-400 mb-3">
                  <span className="flex items-center gap-1">
                    <HiOutlineLocationMarker className="w-3.5 h-3.5 text-surface-400" />
                    {job.location}
                  </span>
                  {job.salary && (
                    <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                      <HiOutlineCurrencyDollar className="w-3.5 h-3.5" />
                      {job.salary}
                    </span>
                  )}
                  {job.remote && (
                    <span className="flex items-center gap-1 text-primary-600 dark:text-primary-400 font-medium">
                      <HiOutlineGlobeAlt className="w-3.5 h-3.5" />
                      Remote
                    </span>
                  )}
                </div>

                {/* Description snippet */}
                {job.description && (
                  <p className="text-xs text-surface-600 dark:text-surface-400 line-clamp-2 mb-4 leading-relaxed">
                    {job.description}
                  </p>
                )}

                {/* Tags */}
                {job.tags && job.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {job.tags.slice(0, 4).map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Card Footer Actions */}
              <div className="flex items-center justify-between gap-2 pt-3 border-t border-surface-100 dark:border-surface-800">
                <a
                  href={job.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-surface-600 dark:text-surface-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
                >
                  Apply on Site
                  <HiOutlineExternalLink className="w-3.5 h-3.5" />
                </a>

                {job.isImported ? (
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    <HiOutlineCheckCircle className="w-4 h-4" />
                    In Tracker
                  </span>
                ) : (
                  <Button
                    size="sm"
                    variant="primary"
                    disabled={importingId === job.id}
                    onClick={() => handleImport(job)}
                  >
                    <HiOutlinePlusCircle className="w-4 h-4 mr-1.5" />
                    {importingId === job.id ? 'Importing...' : 'Add to Tracker'}
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LiveJobs;
