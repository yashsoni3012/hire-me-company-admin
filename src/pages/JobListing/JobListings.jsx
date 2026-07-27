import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TbBriefcase, TbEye, TbEdit, TbTrash, TbCalendar,
  TbUsers, TbTrendingUp, TbPlus, TbSearch,
  TbRefresh, TbChevronLeft, TbChevronRight,
  TbChevronsLeft, TbChevronsRight,
} from 'react-icons/tb';
import { useToast } from '../../context/ToastContext';
import { useJobs, useDeleteJob } from '../../hooks/useJobs';

// ─── Inline loading spinner component ──────────────────────────────
const LoadingSpinner = ({ fullScreen = false }) => (
  <div className={`flex items-center justify-center ${fullScreen ? 'min-h-screen' : 'py-12'}`}>
    <div className="text-center">
      <div className="w-9 h-9 border-4 border-gray-900 border-t-transparent rounded-full animate-spin mx-auto"></div>
      <p className="mt-2.5 text-gray-500 text-sm">Loading…</p>
    </div>
  </div>
);

// ─── Main component ──────────────────────────────────────────────────
export default function JobListings() {
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const { data: jobs = [], isLoading, error, refetch } = useJobs();
  const deleteMutation = useDeleteJob();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // Reset page on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus]);

  // ─── Delete handlers ──────────────────────────────────────────────
  const handleDeleteClick = (job) => {
    setJobToDelete(job);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!jobToDelete) return;
    setDeletingId(jobToDelete.id);
    setShowDeleteModal(false);
    try {
      await deleteMutation.mutateAsync(jobToDelete.id);
      showSuccess(`"${jobToDelete.title}" deleted successfully`);
    } catch (err) {
      showError(err.message || 'Delete failed');
    } finally {
      setDeletingId(null);
      setJobToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setJobToDelete(null);
  };

  // ─── Filter & pagination ──────────────────────────────────────────
  const filtered = jobs.filter(job => {
    const matchSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        job.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === 'all' || job.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentJobs = filtered.slice(startIndex, endIndex);

  const statusCounts = {
    all: jobs.length,
    active: jobs.filter(j => j.status === 'active').length,
    pending: jobs.filter(j => j.status === 'pending').length,
    closed: jobs.filter(j => j.status === 'closed').length,
    draft: jobs.filter(j => j.status === 'draft').length,
  };

  const totalApplications = jobs.reduce((sum, j) => sum + (j.applications || 0), 0);
  const trendingJobs = jobs.filter(j => j.is_trending).length;

  const formatDate = (date) => {
    if (!date) return 'N/A';
    const d = new Date(date);
    if (isNaN(d)) return date;
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  // ─── Status badge ──────────────────────────────────────────────────
  const StatusBadge = ({ status }) => {
    const colors = {
      active: 'bg-green-50 text-green-700 border-green-200',
      closed: 'bg-red-50 text-red-700 border-red-200',
      pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      draft: 'bg-gray-50 text-gray-700 border-gray-200',
    };
    return (
      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${colors[status] || colors.draft}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // ─── Loading & error states ───────────────────────────────────────
  if (isLoading) return <LoadingSpinner fullScreen />;
  if (error) return <div className="p-4 text-red-600">Error: {error.message}</div>;

  // ─── Render ──────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Jobs</h1>
            <p className="text-sm text-gray-500 mt-0.5">Manage your job postings</p>
          </div>
          <button
            onClick={() => navigate('/job-post')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors"
          >
            <TbPlus size={18} />
            Post New Job
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-50 rounded-lg"><TbBriefcase className="text-purple-600" size={20} /></div>
              <div><p className="text-2xl font-bold text-gray-900">{jobs.length}</p><p className="text-xs text-gray-500">Total Jobs</p></div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-50 rounded-lg"><TbTrendingUp className="text-green-600" size={20} /></div>
              <div><p className="text-2xl font-bold text-gray-900">{statusCounts.active}</p><p className="text-xs text-gray-500">Active Jobs</p></div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg"><TbUsers className="text-blue-600" size={20} /></div>
              <div><p className="text-2xl font-bold text-gray-900">{totalApplications}</p><p className="text-xs text-gray-500">Total Applications</p></div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-50 rounded-lg"><TbTrendingUp className="text-orange-600" size={20} /></div>
              <div><p className="text-2xl font-bold text-gray-900">{trendingJobs}</p><p className="text-xs text-gray-500">Trending</p></div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <TbSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search jobs by title or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 bg-white min-w-[130px]"
              >
                <option value="all">All ({statusCounts.all})</option>
                <option value="active">Active ({statusCounts.active})</option>
                <option value="pending">Pending ({statusCounts.pending})</option>
                <option value="closed">Closed ({statusCounts.closed})</option>
                <option value="draft">Draft ({statusCounts.draft})</option>
              </select>
              <button onClick={() => refetch()} className="px-3 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                <TbRefresh size={18} className="text-gray-500" />
              </button>
            </div>
          </div>
        </div>

        {/* Job List */}
        {currentJobs.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
            <TbBriefcase size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">No jobs found</p>
            <p className="text-sm text-gray-400 mt-1">Try adjusting your search or filters</p>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {currentJobs.map(job => (
                <div key={job.id} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-base font-semibold text-gray-900 truncate">{job.title}</h3>
                        {job.is_trending && (
                          <span className="flex items-center gap-1 text-xs text-red-500 font-medium bg-red-50 px-2 py-0.5 rounded-full">
                            <TbTrendingUp size={12} /> Trending
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
                        <span className="font-medium text-gray-700">{job.company}</span>
                        <span className="flex items-center gap-1"><TbCalendar size={14} /> Created: {formatDate(job.created_at)}</span>
                        <span className="flex items-center gap-1"><TbUsers size={14} /> {job.applications} {job.applications === 1 ? 'applicant' : 'applicants'}</span>
                        <StatusBadge status={job.status} />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => navigate(`/jobs/${job.id}/applicants`)}
                        className="px-4 py-1.5 text-sm font-medium text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                      >
                        View applications
                      </button>
                      <button
                        onClick={() => navigate(`/jobs/${job.id}/edit`)}
                        className="px-4 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        Manage job
                      </button>
                      <button
                        onClick={() => handleDeleteClick(job)}
                        disabled={deletingId === job.id}
                        className={`p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors ${deletingId === job.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {deletingId === job.id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-red-500 border-t-transparent"></div>
                        ) : (
                          <TbTrash size={18} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white rounded-xl border border-gray-200 px-4 py-3 shadow-sm">
                <div className="text-sm text-gray-500">
                  Showing <span className="font-medium text-gray-700">{startIndex + 1}</span> to{' '}
                  <span className="font-medium text-gray-700">{endIndex}</span> of{' '}
                  <span className="font-medium text-gray-700">{totalItems}</span> jobs
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <TbChevronsLeft size={16} />
                  </button>
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <TbChevronLeft size={16} />
                  </button>
                  <span className="px-3 text-sm text-gray-600">Page {currentPage} of {totalPages}</span>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <TbChevronRight size={16} />
                  </button>
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <TbChevronsRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && jobToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 animate-slide-in">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-50 rounded-full"><TbTrash className="text-red-500" size={24} /></div>
              <h3 className="text-lg font-semibold text-gray-900">Permanently Delete Job</h3>
            </div>
            <p className="text-gray-600 mb-2">
              Are you sure you want to permanently delete <span className="font-semibold text-gray-900">"{jobToDelete.title}"</span>?
            </p>
            <p className="text-sm text-red-500 mb-6">⚠️ This action cannot be undone.</p>
            <div className="flex items-center gap-3 justify-end">
              <button onClick={handleCancelDelete} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">Cancel</button>
              <button onClick={handleConfirmDelete} className="px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors flex items-center gap-2">
                <TbTrash size={16} /> Permanently Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}