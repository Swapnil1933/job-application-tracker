import { useState, useEffect } from 'react';
import {
  HiOutlinePlus,
  HiOutlineGlobe,
  HiOutlineLocationMarker,
  HiOutlineTrash,
  HiOutlinePencil,
  HiStar,
  HiOutlineBriefcase,
  HiOutlineExternalLink,
  HiOutlinePlusCircle,
  HiOutlineCheckCircle,
  HiOutlineSparkles,
  HiOutlineCurrencyDollar,
} from 'react-icons/hi';
import { companyService } from '../services/resourceService';
import api from '../services/api';
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
  const [activeTab, setActiveTab] = useState('all');

  // Selected company modal for viewing vacancies
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [importingId, setImportingId] = useState(null);

  // Edit/Add modal state
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    website: '',
    industry: '',
    location: '',
    notes: '',
    rating: 5,
  });
  const [submitting, setSubmitting] = useState(false);

  // Delete state
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const res = await companyService.getAll({ search, filter: activeTab });
      setCompanies(res.data.data || []);
    } catch (error) {
      toast.error('Failed to load companies');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCompanies();
    }, 300);
    return () => clearTimeout(timer);
  }, [search, activeTab]);

  const handleOpenModal = (company = null) => {
    if (company) {
      setEditingId(company._id);
      setFormData({
        name: company.name || '',
        website: company.website || '',
        industry: company.industry || '',
        location: company.location || '',
        notes: company.notes || '',
        rating: company.rating || 5,
      });
    } else {
      setEditingId(null);
      setFormData({ name: '', website: '', industry: '', location: '', notes: '', rating: 5 });
    }
    setIsOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingId && !editingId.startsWith('live-')) {
        await companyService.update(editingId, formData);
        toast.success('Company updated');
      } else {
        await companyService.create(formData);
        toast.success('Company saved to targets');
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

  const handleImportJob = async (job) => {
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
        notes: `Imported live posting (${job.source}).`,
        status: 'Applied',
      });

      toast.success(res.data.message || 'Imported to tracker!');
      // Update local state
      if (selectedCompany) {
        setSelectedCompany((prev) => ({
          ...prev,
          liveVacancies: prev.liveVacancies.map((v) =>
            v.id === job.id ? { ...v, isImported: true } : v
          ),
        }));
      }
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white flex items-center gap-2">
            Companies & Live Vacancies
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-500/10 text-primary-600 dark:text-primary-400 border border-primary-500/20">
              <HiOutlineSparkles className="w-3.5 h-3.5" />
              Live Hiring Feed
            </span>
          </h1>
          <p className="text-surface-500 dark:text-surface-400 text-sm mt-1">
            Search companies to instantly see all open job vacancies and research notes.
          </p>
        </div>
        <Button icon={HiOutlinePlus} onClick={() => handleOpenModal()}>
          Add Target Company
        </Button>
      </div>

      {/* Search & Tabs */}
      <div className="glass-card p-4 space-y-4">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Type any company name (e.g. Google, Meta, OpenAI, Stripe) or role..."
        />

        {/* Tab Filters */}
        <div className="flex gap-2">
          {[
            { id: 'all', label: 'All Companies' },
            { id: 'hiring', label: '🔥 Actively Hiring Live' },
            { id: 'saved', label: '⭐ Saved Target Companies' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-primary-500 text-white shadow-sm shadow-primary-500/30'
                  : 'bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400 hover:bg-surface-200 dark:hover:bg-surface-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Companies Grid */}
      {loading ? (
        <div className="p-12 text-center text-surface-500">Loading companies & live open vacancies...</div>
      ) : companies.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {companies.map((c) => (
            <div
              key={c._id}
              className="glass-card p-5 hover-card group flex flex-col justify-between cursor-pointer border hover:border-primary-500/30 transition-all"
              onClick={() => setSelectedCompany(c)}
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {c.logo ? (
                      <img
                        src={c.logo}
                        alt={c.name}
                        className="w-10 h-10 rounded-xl object-contain bg-surface-50 dark:bg-surface-800 border p-1"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500/20 to-primary-700/20 text-primary-600 dark:text-primary-400 flex items-center justify-center font-bold text-base border border-primary-500/20">
                        {c.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h3 className="text-base font-bold text-surface-900 dark:text-white group-hover:text-primary-500 transition-colors">
                        {c.name}
                      </h3>
                      {c.industry && (
                        <span className="text-xs text-primary-600 dark:text-primary-400 font-medium">
                          {c.industry}
                        </span>
                      )}
                    </div>
                  </div>
                  {c.isSaved ? (
                    <div className="flex items-center text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                      <HiStar className="w-3.5 h-3.5 fill-current" />
                      <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 ml-1">
                        {c.rating || 5}
                      </span>
                    </div>
                  ) : (
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      Live Hiring
                    </span>
                  )}
                </div>

                {/* Location & Website */}
                <div className="space-y-1 text-xs text-surface-500 dark:text-surface-400 mb-3">
                  {c.location && (
                    <p className="flex items-center gap-1.5">
                      <HiOutlineLocationMarker className="w-3.5 h-3.5" />
                      {c.location}
                    </p>
                  )}
                  {c.website && (
                    <a
                      href={c.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-1.5 text-primary-600 dark:text-primary-400 hover:underline"
                    >
                      <HiOutlineGlobe className="w-3.5 h-3.5" />
                      {c.website.replace(/^https?:\/\//, '')}
                    </a>
                  )}
                </div>

                {/* Notes */}
                {c.notes && (
                  <p className="text-xs text-surface-600 dark:text-surface-300 bg-surface-50 dark:bg-surface-800/50 p-2.5 rounded-lg line-clamp-2 mb-3">
                    {c.notes}
                  </p>
                )}
              </div>

              {/* Footer: Live Vacancies pill & Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-surface-100 dark:border-surface-800">
                {c.totalVacancies > 0 ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    <HiOutlineBriefcase className="w-3.5 h-3.5" />
                    {c.totalVacancies} Open {c.totalVacancies === 1 ? 'Vacancy' : 'Vacancies'}
                  </span>
                ) : (
                  <span className="text-xs text-surface-400">No active live feed roles</span>
                )}

                <div className="flex items-center gap-1">
                  {c.isSaved && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenModal(c);
                        }}
                        className="p-1.5 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
                      >
                        <HiOutlinePencil className="w-4 h-4 text-surface-400" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteId(c._id);
                        }}
                        className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                      >
                        <HiOutlineTrash className="w-4 h-4 text-red-400" />
                      </button>
                    </>
                  )}
                  {!c.isSaved && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenModal(c);
                      }}
                      className="px-2.5 py-1 rounded-lg text-xs font-medium bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 hover:bg-primary-100 transition-colors"
                    >
                      + Save Target
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No companies found"
          description="Try searching another company name or adjust your filter."
        />
      )}

      {/* Selected Company Open Vacancies Modal */}
      {selectedCompany && (
        <Modal
          isOpen={!!selectedCompany}
          onClose={() => setSelectedCompany(null)}
          title={`${selectedCompany.name} — Open Vacancies & Profile`}
        >
          <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
            {/* Header info */}
            <div className="glass-card p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-surface-900 dark:text-white">
                    {selectedCompany.name}
                  </h2>
                  <p className="text-xs text-primary-600 dark:text-primary-400">
                    {selectedCompany.industry || 'Technology'} • {selectedCompany.location || 'Remote'}
                  </p>
                </div>
                {selectedCompany.website && (
                  <a
                    href={selectedCompany.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-medium text-primary-600 hover:underline"
                  >
                    Careers Portal <HiOutlineExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
              {selectedCompany.notes && (
                <p className="text-xs text-surface-600 dark:text-surface-300 pt-2 border-t border-surface-100 dark:border-surface-800">
                  {selectedCompany.notes}
                </p>
              )}
            </div>

            {/* Live Vacancies List */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-surface-900 dark:text-white flex items-center justify-between">
                <span>Active Job Vacancies ({selectedCompany.liveVacancies?.length || 0})</span>
                <span className="text-xs font-normal text-surface-500">Live Global Feed</span>
              </h3>

              {!selectedCompany.liveVacancies || selectedCompany.liveVacancies.length === 0 ? (
                <p className="text-xs text-surface-500 italic p-4 text-center glass-card">
                  No active live vacancies currently listed for this company. You can add a manual application anytime!
                </p>
              ) : (
                selectedCompany.liveVacancies.map((v) => (
                  <div
                    key={v.id}
                    className="p-3.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-sm font-semibold text-surface-900 dark:text-white">
                          {v.position}
                        </h4>
                        <div className="flex items-center gap-3 text-xs text-surface-500 mt-0.5">
                          <span>📍 {v.location}</span>
                          {v.salary && (
                            <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                              💵 {v.salary}
                            </span>
                          )}
                        </div>
                      </div>

                      {v.isImported ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          <HiOutlineCheckCircle className="w-3.5 h-3.5" />
                          Tracked
                        </span>
                      ) : (
                        <Button
                          size="sm"
                          disabled={importingId === v.id}
                          onClick={() => handleImportJob(v)}
                        >
                          <HiOutlinePlusCircle className="w-3.5 h-3.5 mr-1" />
                          {importingId === v.id ? 'Importing...' : 'Add to Tracker'}
                        </Button>
                      )}
                    </div>

                    {v.description && (
                      <p className="text-xs text-surface-600 dark:text-surface-400 line-clamp-2">
                        {v.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between pt-2 text-xs">
                      <div className="flex flex-wrap gap-1">
                        {v.tags?.slice(0, 3).map((t, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded text-[10px] bg-surface-100 dark:bg-surface-700 text-surface-600 dark:text-surface-300"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                      <a
                        href={v.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-primary-600 dark:text-primary-400 hover:underline font-medium"
                      >
                        Apply on Portal <HiOutlineExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </Modal>
      )}

      {/* Edit/Add Modal */}
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={editingId ? 'Edit Target Company' : 'Add Target Company'}
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
