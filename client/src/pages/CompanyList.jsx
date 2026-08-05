import { useState, useEffect } from 'react';
import { HiOutlinePlus, HiOutlineGlobe, HiOutlineLocationMarker, HiOutlineTrash, HiOutlinePencil, HiStar } from 'react-icons/hi';
import { companyService } from '../services/resourceService';
import Button from '../components/shared/Button';
import SearchBar from '../components/shared/SearchBar';
import Modal from '../components/shared/Modal';
import Input from '../components/shared/Input';
import ConfirmDialog from '../components/shared/ConfirmDialog';
import EmptyState from '../components/shared/EmptyState';
import toast from 'react-hot-toast';

const CompanyList = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Modal state
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    website: '',
    industry: '',
    location: '',
    notes: '',
    rating: 3,
  });
  const [submitting, setSubmitting] = useState(false);

  // Delete state
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchCompanies = async () => {
    try {
      const res = await companyService.getAll({ search });
      setCompanies(res.data.data);
    } catch (error) {
      toast.error('Failed to load companies');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, [search]);

  const handleOpenModal = (company = null) => {
    if (company) {
      setEditingId(company._id);
      setFormData(company);
    } else {
      setEditingId(null);
      setFormData({ name: '', website: '', industry: '', location: '', notes: '', rating: 3 });
    }
    setIsOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingId) {
        await companyService.update(editingId, formData);
        toast.success('Company updated');
      } else {
        await companyService.create(formData);
        toast.success('Company added');
      }
      setIsOpen(false);
      fetchCompanies();
    } catch (error) {
      toast.error('Failed to save company');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await companyService.delete(deleteId);
      toast.success('Company removed');
      setDeleteId(null);
      fetchCompanies();
    } catch (error) {
      toast.error('Failed to delete company');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white">Target Companies</h1>
          <p className="text-surface-500 dark:text-surface-400 mt-1">
            Manage company research, culture notes, and ratings
          </p>
        </div>
        <Button icon={HiOutlinePlus} onClick={() => handleOpenModal()}>
          Add Company
        </Button>
      </div>

      <div className="glass-card p-4">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search companies by name..."
        />
      </div>

      {loading ? (
        <div className="p-8 text-center text-surface-500">Loading companies...</div>
      ) : companies.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {companies.map((c) => (
            <div key={c._id} className="glass-card p-5 hover-card group">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg font-bold text-surface-900 dark:text-white">
                    {c.name}
                  </h3>
                  {c.industry && (
                    <span className="text-xs text-primary-600 dark:text-primary-400 font-medium">
                      {c.industry}
                    </span>
                  )}
                </div>
                <div className="flex items-center text-amber-400">
                  <HiStar className="w-4 h-4 fill-current" />
                  <span className="text-xs font-bold text-surface-700 dark:text-surface-300 ml-1">
                    {c.rating || 'N/A'}
                  </span>
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-surface-500 dark:text-surface-400 mb-4">
                {c.location && (
                  <p className="flex items-center gap-1.5">
                    <HiOutlineLocationMarker className="w-4 h-4" />
                    {c.location}
                  </p>
                )}
                {c.website && (
                  <a
                    href={c.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    <HiOutlineGlobe className="w-4 h-4" />
                    {c.website}
                  </a>
                )}
              </div>

              {c.notes && (
                <p className="text-xs text-surface-600 dark:text-surface-300 bg-surface-50 dark:bg-surface-800/50 p-2.5 rounded-lg line-clamp-2 mb-4">
                  {c.notes}
                </p>
              )}

              <div className="flex items-center justify-end gap-1 pt-3 border-t border-surface-100 dark:border-surface-700 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleOpenModal(c)}
                  className="p-1.5 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
                >
                  <HiOutlinePencil className="w-4 h-4 text-surface-400" />
                </button>
                <button
                  onClick={() => setDeleteId(c._id)}
                  className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                >
                  <HiOutlineTrash className="w-4 h-4 text-red-400" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No companies found"
          description="Keep track of target companies you're interested in applying to."
        />
      )}

      {/* Modal */}
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={editingId ? 'Edit Company' : 'Add Target Company'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Company Name *"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Industry"
              placeholder="Fintech, SaaS..."
              value={formData.industry}
              onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
            />
            <Input
              label="Location"
              placeholder="San Francisco, CA"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
          </div>
          <Input
            label="Website URL"
            type="url"
            placeholder="https://..."
            value={formData.website}
            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
          />
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300">
              Rating (1 to 5 Stars)
            </label>
            <input
              type="number"
              min="1"
              max="5"
              className="w-full rounded-xl border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800 p-2.5 text-sm input-focus"
              value={formData.rating}
              onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300">
              Research / Culture Notes
            </label>
            <textarea
              rows={3}
              className="w-full rounded-xl border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800 p-2.5 text-sm input-focus"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={submitting}>
              Save
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Company"
        message="Are you sure you want to remove this company?"
        loading={deleting}
      />
    </div>
  );
};

export default CompanyList;
