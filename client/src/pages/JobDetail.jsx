import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  HiOutlineArrowLeft,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineExternalLink,
  HiOutlineCalendar,
  HiOutlineLocationMarker,
  HiOutlineDocumentText,
  HiOutlineUpload,
  HiOutlinePlus,
} from 'react-icons/hi';
import { jobService, noteService } from '../services/resourceService';
import StatusBadge from '../components/shared/StatusBadge';
import Button from '../components/shared/Button';
import Modal from '../components/shared/Modal';
import Input from '../components/shared/Input';
import Select from '../components/shared/Select';
import ConfirmDialog from '../components/shared/ConfirmDialog';
import Skeleton from '../components/shared/Skeleton';
import toast from 'react-hot-toast';

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resumeUploading, setResumeUploading] = useState(false);
  
  // Note Modal state
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [noteForm, setNoteForm] = useState({ content: '', type: 'General' });
  const [noteSubmitting, setNoteSubmitting] = useState(false);

  // Delete State
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchJobDetails = async () => {
    try {
      const [jobRes, notesRes] = await Promise.all([
        jobService.getById(id),
        noteService.getByJob(id),
      ]);
      setJob(jobRes.data.data);
      setNotes(notesRes.data.data);
    } catch (error) {
      toast.error('Failed to load job details');
      navigate('/jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobDetails();
  }, [id]);

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('resume', file);

    setResumeUploading(true);
    try {
      const res = await jobService.uploadResume(id, formData);
      setJob(res.data.data);
      toast.success('Resume uploaded successfully');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to upload resume');
    } finally {
      setResumeUploading(false);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!noteForm.content.trim()) return;

    setNoteSubmitting(true);
    try {
      const res = await noteService.create({
        job: id,
        content: noteForm.content,
        type: noteForm.type,
      });
      setNotes([res.data.data, ...notes]);
      setIsNoteModalOpen(false);
      setNoteForm({ content: '', type: 'General' });
      toast.success('Note added');
    } catch (error) {
      toast.error('Failed to add note');
    } finally {
      setNoteSubmitting(false);
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      await noteService.delete(noteId);
      setNotes(notes.filter((n) => n._id !== noteId));
      toast.success('Note removed');
    } catch (error) {
      toast.error('Failed to delete note');
    }
  };

  const handleDeleteJob = async () => {
    setDeleting(true);
    try {
      await jobService.delete(id);
      toast.success('Job application deleted');
      navigate('/jobs');
    } catch (error) {
      toast.error('Failed to delete application');
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <Skeleton className="h-6 w-32" />
        <div className="glass-card p-6 space-y-4">
          <Skeleton variant="title" />
          <Skeleton className="w-1/3" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Back button & Actions */}
      <div className="flex items-center justify-between">
        <Link
          to="/jobs"
          className="inline-flex items-center gap-2 text-sm font-medium text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-white transition-colors"
        >
          <HiOutlineArrowLeft className="w-4 h-4" />
          Back to Applications
        </Link>
        <div className="flex items-center gap-2">
          <Link to={`/jobs/${id}/edit`}>
            <Button variant="secondary" size="sm" icon={HiOutlinePencil}>
              Edit
            </Button>
          </Link>
          <Button
            variant="danger"
            size="sm"
            icon={HiOutlineTrash}
            onClick={() => setIsDeleteOpen(true)}
          >
            Delete
          </Button>
        </div>
      </div>

      {/* Main Info Card */}
      <div className="glass-card p-6 md:p-8 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl md:text-3xl font-bold text-surface-900 dark:text-white">
                {job.position}
              </h1>
              <StatusBadge status={job.status} size="lg" />
            </div>
            <p className="text-lg font-medium text-surface-600 dark:text-surface-300">
              {job.company}
            </p>
          </div>

          {job.url && (
            <a
              href={job.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-100 dark:bg-surface-800 text-sm font-medium text-primary-600 dark:text-primary-400 hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors w-fit"
            >
              View Posting
              <HiOutlineExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 py-4 border-y border-surface-200 dark:border-surface-700">
          <div>
            <span className="text-xs text-surface-400 font-medium">LOCATION</span>
            <p className="text-sm font-medium text-surface-800 dark:text-surface-200 mt-1 flex items-center gap-1">
              <HiOutlineLocationMarker className="w-4 h-4 text-surface-400" />
              {job.location || 'N/A'} {job.remote ? '(Remote)' : ''}
            </p>
          </div>
          <div>
            <span className="text-xs text-surface-400 font-medium">JOB TYPE</span>
            <p className="text-sm font-medium text-surface-800 dark:text-surface-200 mt-1">
              {job.type}
            </p>
          </div>
          <div>
            <span className="text-xs text-surface-400 font-medium">SALARY</span>
            <p className="text-sm font-medium text-surface-800 dark:text-surface-200 mt-1">
              {job.salary || 'Not specified'}
            </p>
          </div>
          <div>
            <span className="text-xs text-surface-400 font-medium">APPLIED DATE</span>
            <p className="text-sm font-medium text-surface-800 dark:text-surface-200 mt-1 flex items-center gap-1">
              <HiOutlineCalendar className="w-4 h-4 text-surface-400" />
              {new Date(job.appliedDate).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Description & Tags */}
        {job.tags?.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {job.tags.map((tag, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 text-xs font-medium bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 rounded-lg border border-primary-200/50 dark:border-primary-800/50"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {job.description && (
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-surface-900 dark:text-white mb-2">
              Job Description
            </h3>
            <p className="text-sm text-surface-600 dark:text-surface-400 whitespace-pre-line leading-relaxed">
              {job.description}
            </p>
          </div>
        )}
      </div>

      {/* Resume Section */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-4 flex items-center gap-2">
          <HiOutlineDocumentText className="w-5 h-5 text-primary-500" />
          Attached Resume
        </h3>

        {job.resume ? (
          <div className="flex items-center justify-between p-4 rounded-xl bg-surface-50 dark:bg-surface-800/50 border border-surface-200 dark:border-surface-700">
            <div className="flex items-center gap-3">
              <HiOutlineDocumentText className="w-8 h-8 text-primary-500" />
              <div>
                <p className="text-sm font-medium text-surface-900 dark:text-white">
                  {job.resume}
                </p>
                <p className="text-xs text-surface-400">Uploaded for this application</p>
              </div>
            </div>
            <a
              href={`/uploads/resumes/${job.resume}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary-600 dark:text-primary-400 hover:underline font-medium"
            >
              Download
            </a>
          </div>
        ) : (
          <div className="border-2 border-dashed border-surface-300 dark:border-surface-700 rounded-2xl p-6 text-center">
            <HiOutlineUpload className="w-8 h-8 mx-auto text-surface-400 mb-2" />
            <p className="text-sm text-surface-600 dark:text-surface-400 mb-3">
              Upload a specific resume version for this application (PDF, DOCX)
            </p>
            <label className="inline-block">
              <Button
                variant="secondary"
                size="sm"
                loading={resumeUploading}
                onClick={() => document.getElementById('resume-file-input').click()}
              >
                Choose File
              </Button>
              <input
                id="resume-file-input"
                type="file"
                className="hidden"
                accept=".pdf,.doc,.docx"
                onChange={handleResumeUpload}
              />
            </label>
          </div>
        )}
      </div>

      {/* Notes & Activity Log */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-surface-900 dark:text-white">
            Notes & Prep
          </h3>
          <Button
            size="sm"
            icon={HiOutlinePlus}
            onClick={() => setIsNoteModalOpen(true)}
          >
            Add Note
          </Button>
        </div>

        {notes.length > 0 ? (
          <div className="space-y-4">
            {notes.map((note) => (
              <div
                key={note._id}
                className="p-4 rounded-xl bg-surface-50 dark:bg-surface-800/50 border border-surface-200 dark:border-surface-700 relative group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-0.5 text-xs font-semibold rounded bg-surface-200 dark:bg-surface-700 text-surface-700 dark:text-surface-300">
                    {note.type}
                  </span>
                  <button
                    onClick={() => handleDeleteNote(note._id)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded transition-opacity"
                  >
                    <HiOutlineTrash className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-sm text-surface-800 dark:text-surface-200 whitespace-pre-line">
                  {note.content}
                </p>
                <span className="text-[10px] text-surface-400 mt-2 block">
                  {new Date(note.createdAt).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-surface-400 text-center py-6">
            No notes added yet. Keep track of interview questions, recruiters, or research here.
          </p>
        )}
      </div>

      {/* Note Modal */}
      <Modal
        isOpen={isNoteModalOpen}
        onClose={() => setIsNoteModalOpen(false)}
        title="Add Application Note"
      >
        <form onSubmit={handleAddNote} className="space-y-4">
          <Select
            label="Note Type"
            options={['General', 'Interview Prep', 'Follow-up', 'Research', 'Feedback']}
            value={noteForm.type}
            onChange={(e) => setNoteForm({ ...noteForm, type: e.target.value })}
          />
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300">
              Content
            </label>
            <textarea
              rows={4}
              required
              className="w-full rounded-xl border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-100 p-3 text-sm input-focus outline-none"
              placeholder="Write down notes, prep details, contacts..."
              value={noteForm.content}
              onChange={(e) => setNoteForm({ ...noteForm, content: e.target.value })}
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setIsNoteModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={noteSubmitting}>
              Save Note
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteJob}
        title="Delete Application"
        message="Are you sure you want to delete this job application? All attached notes and files will also be removed."
        loading={deleting}
      />
    </div>
  );
};

export default JobDetail;
