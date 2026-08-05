import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  HiOutlinePlus,
  HiOutlineExternalLink,
  HiOutlineCalendar,
  HiOutlineLocationMarker,
  HiOutlineTrash,
  HiOutlinePencil,
} from 'react-icons/hi';
import { jobService } from '../services/resourceService';
import Button from '../components/shared/Button';
import SearchBar from '../components/shared/SearchBar';
import Select from '../components/shared/Select';
import StatusBadge from '../components/shared/StatusBadge';
import Pagination from '../components/shared/Pagination';
import EmptyState from '../components/shared/EmptyState';
import ConfirmDialog from '../components/shared/ConfirmDialog';
import { JobCardSkeleton } from '../components/shared/Skeleton';
import toast from 'react-hot-toast';

const JobList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const search = searchParams.get('search') || '';
  const status = searchParams.get('status') || 'All';
  const type = searchParams.get('type') || 'All';
  const sort = searchParams.get('sort') || '-createdAt';
  const page = parseInt(searchParams.get('page') || '1', 10);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await jobService.getAll({ search, status, type, sort, page, limit: 9 });
      setJobs(res.data.data);
      setPagination(res.data.pagination);
    } catch (error) {
      toast.error('Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [search, status, type, sort, page]);

  const updateParam = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value && value !== 'All' && value !== '') {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    if (key !== 'page') params.delete('page');
    setSearchParams(params);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await jobService.delete(deleteId);
      toast.success('Job deleted successfully');
      setDeleteId(null);
      fetchJobs();
    } catch (error) {
      toast.error('Failed to delete job');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white">Applications</h1>
          <p className="text-surface-500 dark:text-surface-400 mt-1">
            {pagination.total} total application{pagination.total !== 1 ? 's' : ''}
          </p>
        </div>
        <Link to="/jobs/new">
          <Button icon={HiOutlinePlus}>Add Application</Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="glass-card p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <SearchBar
            value={search}
            onChange={(val) => updateParam('search', val)}
            placeholder="Search jobs..."
          />
          <Select
            options={[
              { value: 'All', label: 'All Statuses' },
              'Applied', 'OA', 'Interview', 'Rejected', 'Offer',
            ]}
            value={status}
            onChange={(e) => updateParam('status', e.target.value)}
          />
          <Select
            options={[
              { value: 'All', label: 'All Types' },
              'Full-time', 'Part-time', 'Internship', 'Contract', 'Freelance',
            ]}
            value={type}
            onChange={(e) => updateParam('type', e.target.value)}
          />
          <Select
            options={[
              { value: '-createdAt', label: 'Newest First' },
              { value: 'createdAt', label: 'Oldest First' },
              { value: '-appliedDate', label: 'Recently Applied' },
              { value: 'company', label: 'Company A-Z' },
              { value: 'position', label: 'Position A-Z' },
            ]}
            value={sort}
            onChange={(e) => updateParam('sort', e.target.value)}
          />
        </div>
      </div>

      {/* Job Cards */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <JobCardSkeleton key={i} />)}
        </div>
      ) : jobs.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {jobs.map((job, i) => (
              <div
                key={job._id}
                className="glass-card p-5 hover-card animate-slide-up group"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/jobs/${job._id}`}
                      className="text-base font-semibold text-surface-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors line-clamp-1"
                    >
                      {job.position}
                    </Link>
                    <p className="text-sm text-surface-500 dark:text-surface-400 mt-0.5">
                      {job.company}
                    </p>
                  </div>
                  <StatusBadge status={job.status} size="sm" />
                </div>

                <div className="flex flex-wrap gap-2 mb-4 text-xs text-surface-500 dark:text-surface-400">
                  {job.location && (
                    <span className="flex items-center gap-1">
                      <HiOutlineLocationMarker className="w-3.5 h-3.5" />
                      {job.location}
                    </span>
                  )}
                  {job.type && (
                    <span className="px-2 py-0.5 bg-surface-100 dark:bg-surface-700 rounded-md">
                      {job.type}
                    </span>
                  )}
                  {job.remote && (
                    <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-md">
                      Remote
                    </span>
                  )}
                </div>

                {job.salary && (
                  <p className="text-sm font-medium text-surface-700 dark:text-surface-300 mb-3">
                    {job.salary}
                  </p>
                )}

                <div className="flex items-center justify-between pt-3 border-t border-surface-100 dark:border-surface-700">
                  <span className="flex items-center gap-1 text-xs text-surface-400">
                    <HiOutlineCalendar className="w-3.5 h-3.5" />
                    {new Date(job.appliedDate).toLocaleDateString()}
                  </span>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {job.url && (
                      <a href={job.url} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors">
                        <HiOutlineExternalLink className="w-4 h-4 text-surface-400" />
                      </a>
                    )}
                    <Link to={`/jobs/${job._id}/edit`} className="p-1.5 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors">
                      <HiOutlinePencil className="w-4 h-4 text-surface-400" />
                    </Link>
                    <button onClick={() => setDeleteId(job._id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors">
                      <HiOutlineTrash className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Pagination
            page={pagination.page}
            pages={pagination.pages}
            onPageChange={(p) => updateParam('page', p.toString())}
          />
        </>
      ) : (
        <EmptyState
          title="No applications found"
          description={search || status !== 'All' ? 'Try adjusting your filters.' : 'Start tracking your job search by adding your first application.'}
          action={
            !search && status === 'All' && (
              <Link to="/jobs/new">
                <Button icon={HiOutlinePlus}>Add Your First Job</Button>
              </Link>
            )
          }
        />
      )}

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Application"
        message="Are you sure you want to delete this job application? This action cannot be undone."
        loading={deleting}
      />
    </div>
  );
};

export default JobList;
