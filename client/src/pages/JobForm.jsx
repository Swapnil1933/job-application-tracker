import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { HiOutlineArrowLeft } from 'react-icons/hi';
import { jobService } from '../services/resourceService';
import Input from '../components/shared/Input';
import Select from '../components/shared/Select';
import Button from '../components/shared/Button';
import toast from 'react-hot-toast';

const JobForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    company: '',
    position: '',
    status: 'Applied',
    type: 'Full-time',
    location: '',
    remote: false,
    salary: '',
    url: '',
    description: '',
    notes: '',
    deadline: '',
    appliedDate: new Date().toISOString().split('T')[0],
    tags: '',
  });

  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isEdit) {
      const fetchJob = async () => {
        try {
          const res = await jobService.getById(id);
          const job = res.data.data;
          setFormData({
            ...job,
            deadline: job.deadline ? new Date(job.deadline).toISOString().split('T')[0] : '',
            appliedDate: job.appliedDate ? new Date(job.appliedDate).toISOString().split('T')[0] : '',
            tags: job.tags ? job.tags.join(', ') : '',
          });
        } catch (error) {
          toast.error('Failed to load job details');
          navigate('/jobs');
        } finally {
          setLoading(false);
        }
      };
      fetchJob();
    }
  }, [id, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      ...formData,
      tags: formData.tags
        ? formData.tags.split(',').map((t) => t.trim()).filter(Boolean)
        : [],
    };

    try {
      if (isEdit) {
        await jobService.update(id, payload);
        toast.success('Job application updated');
      } else {
        await jobService.create(payload);
        toast.success('Job application created');
      }
      navigate('/jobs');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-surface-500">Loading application data...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <Link
        to="/jobs"
        className="inline-flex items-center gap-2 text-sm font-medium text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-white transition-colors"
      >
        <HiOutlineArrowLeft className="w-4 h-4" />
        Back to Applications
      </Link>

      <div className="glass-card p-6 md:p-8">
        <h1 className="text-2xl font-bold text-surface-900 dark:text-white mb-6">
          {isEdit ? 'Edit Application' : 'New Job Application'}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Company Name *"
              required
              placeholder="Google, Microsoft..."
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            />
            <Input
              label="Job Position *"
              required
              placeholder="Software Engineer, Product Designer..."
              value={formData.position}
              onChange={(e) => setFormData({ ...formData, position: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Select
              label="Status"
              options={['Applied', 'OA', 'Interview', 'Rejected', 'Offer']}
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            />
            <Select
              label="Employment Type"
              options={['Full-time', 'Part-time', 'Internship', 'Contract', 'Freelance']}
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            />
            <Input
              label="Applied Date"
              type="date"
              value={formData.appliedDate}
              onChange={(e) => setFormData({ ...formData, appliedDate: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Location"
              placeholder="New York, NY / Remote"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
            <Input
              label="Salary Range"
              placeholder="$120k - $150k"
              value={formData.salary}
              onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
            />
            <Input
              label="Application Deadline"
              type="date"
              value={formData.deadline}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Job Posting URL"
              type="url"
              placeholder="https://..."
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
            />
            <Input
              label="Tags (Comma Separated)"
              placeholder="React, Remote, High Priority"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="remote"
              className="rounded border-surface-300 dark:border-surface-600 text-primary-600 focus:ring-primary-500 w-4 h-4"
              checked={formData.remote}
              onChange={(e) => setFormData({ ...formData, remote: e.target.checked })}
            />
            <label htmlFor="remote" className="text-sm font-medium text-surface-700 dark:text-surface-300 cursor-pointer">
              Remote Work Position
            </label>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300">
              Description / Job Details
            </label>
            <textarea
              rows={4}
              className="w-full rounded-xl border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-100 p-3 text-sm input-focus outline-none"
              placeholder="Paste job description or requirements..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-surface-200 dark:border-surface-700">
            <Link to="/jobs">
              <Button variant="secondary" type="button">
                Cancel
              </Button>
            </Link>
            <Button type="submit" loading={submitting}>
              {isEdit ? 'Update Application' : 'Save Application'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobForm;
