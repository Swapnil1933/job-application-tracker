import { useState, useEffect } from 'react';
import { HiOutlinePlus, HiOutlineCalendar, HiOutlineVideoCamera, HiOutlineTrash, HiOutlineExternalLink } from 'react-icons/hi';
import { interviewService, jobService } from '../services/resourceService';
import Button from '../components/shared/Button';
import Modal from '../components/shared/Modal';
import Input from '../components/shared/Input';
import Select from '../components/shared/Select';
import ConfirmDialog from '../components/shared/ConfirmDialog';
import EmptyState from '../components/shared/EmptyState';
import toast from 'react-hot-toast';

const InterviewList = () => {
  const [interviews, setInterviews] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    job: '',
    type: 'Technical',
    date: new Date().toISOString().slice(0, 16),
    location: '',
    link: '',
    notes: '',
    status: 'Scheduled',
  });
  const [submitting, setSubmitting] = useState(false);

  // Delete
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchData = async () => {
    try {
      const [intRes, jobRes] = await Promise.all([
        interviewService.getAll(),
        jobService.getAll({ limit: 100 }),
      ]);
      setInterviews(intRes.data.data);
      setJobs(jobRes.data.data);
      if (jobRes.data.data.length > 0 && !formData.job) {
        setFormData((prev) => ({ ...prev, job: jobRes.data.data[0]._id }));
      }
    } catch (error) {
      toast.error('Failed to load interviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.job) {
      toast.error('Please select an application');
      return;
    }
    setSubmitting(true);
    try {
      await interviewService.create(formData);
      toast.success('Interview scheduled');
      setIsOpen(false);
      fetchData();
    } catch (error) {
      toast.error('Failed to schedule interview');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await interviewService.delete(deleteId);
      toast.success('Interview cancelled');
      setDeleteId(null);
      fetchData();
    } catch (error) {
      toast.error('Failed to cancel interview');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white">Interview Schedule</h1>
          <p className="text-surface-500 dark:text-surface-400 mt-1">
            Keep track of technical rounds, phone screens, and behavioral interviews
          </p>
        </div>
        <Button icon={HiOutlinePlus} onClick={() => setIsOpen(true)}>
          Schedule Interview
        </Button>
      </div>

      {loading ? (
        <div className="p-8 text-center text-surface-500">Loading schedule...</div>
      ) : interviews.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {interviews.map((item) => (
            <div key={item._id} className="glass-card p-5 space-y-3 relative group">
              <div className="flex items-start justify-between">
                <div>
                  <span className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400">
                    {item.type} Round
                  </span>
                  <h3 className="text-lg font-bold text-surface-900 dark:text-white mt-2">
                    {item.job?.position || 'Position'}
                  </h3>
                  <p className="text-sm font-medium text-surface-600 dark:text-surface-300">
                    {item.job?.company || 'Company'}
                  </p>
                </div>
                <button
                  onClick={() => setDeleteId(item._id)}
                  className="opacity-0 group-hover:opacity-100 p-1.5 text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-opacity"
                >
                  <HiOutlineTrash className="w-4 h-4" />
                </button>
              </div>

              <div className="flex flex-wrap gap-4 text-xs text-surface-500 dark:text-surface-400 pt-2 border-t border-surface-100 dark:border-surface-700">
                <div className="flex items-center gap-1.5 text-primary-600 dark:text-primary-400 font-medium">
                  <HiOutlineCalendar className="w-4 h-4" />
                  {new Date(item.date).toLocaleString([], {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}
                </div>
                {item.link && (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    <HiOutlineVideoCamera className="w-4 h-4" />
                    Meeting Link
                    <HiOutlineExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>

              {item.notes && (
                <p className="text-xs text-surface-600 dark:text-surface-300 bg-surface-50 dark:bg-surface-800/50 p-2.5 rounded-lg">
                  {item.notes}
                </p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No interviews scheduled"
          description="Click 'Schedule Interview' to add your upcoming technical or behavioral rounds."
        />
      )}

      {/* Modal */}
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Schedule Interview">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select
            label="Related Job Application *"
            options={jobs.map((j) => ({ value: j._id, label: `${j.company} - ${j.position}` }))}
            value={formData.job}
            onChange={(e) => setFormData({ ...formData, job: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Round Type"
              options={['Phone', 'Video', 'Onsite', 'Technical', 'Behavioral', 'System Design', 'HR']}
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            />
            <Input
              label="Date & Time *"
              type="datetime-local"
              required
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
          </div>
          <Input
            label="Video Link / URL"
            placeholder="https://zoom.us/j/..."
            value={formData.link}
            onChange={(e) => setFormData({ ...formData, link: e.target.value })}
          />
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300">
              Prep Notes & Key Focus Areas
            </label>
            <textarea
              rows={3}
              className="w-full rounded-xl border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800 p-2.5 text-sm input-focus"
              placeholder="Topics to study, interviewer name..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={submitting}>
              Schedule
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Cancel Interview"
        message="Are you sure you want to remove this scheduled interview?"
        loading={deleting}
      />
    </div>
  );
};

export default InterviewList;
