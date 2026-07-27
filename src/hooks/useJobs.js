import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const API_BASE_URL = 'https://hire-me-jobs.onrender.com';

const fetchJobs = async () => {
  const res = await fetch(`${API_BASE_URL}/jobs`);
  if (!res.ok) throw new Error('Failed to fetch jobs');
  const data = await res.json();
  let jobs = [];
  if (Array.isArray(data)) jobs = data;
  else if (data.data && Array.isArray(data.data)) jobs = data.data;
  else if (data.jobs && Array.isArray(data.jobs)) jobs = data.jobs;
  else if (data.results && Array.isArray(data.results)) jobs = data.results;
  return jobs.map(job => ({
    id: job.id || job._id,
    title: job.title || job.job_title || 'Untitled',
    company: job.company_name || job.Company?.company_name || job.company || 'N/A',
    applications: job.application_count || job.applications || job.apps || 0,
    status: job.is_status === true || job.is_status === 1 || job.status === 'active' ? 'active' 
      : job.is_status === false || job.is_status === 0 || job.status === 'inactive' ? 'closed' 
      : job.status === 'pending' ? 'pending' : 'draft',
    created_at: job.created_at || job.createdAt || job.posted_date,
    is_trending: job.is_trending || false,
    views: job.views || job.job_views || 0,
  }));
};

export const useJobs = () => {
  return useQuery({
    queryKey: ['jobs'],
    queryFn: fetchJobs,
    staleTime: 2 * 60 * 1000,
  });
};

export const useDeleteJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const res = await fetch(`${API_BASE_URL}/jobs/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['jobs']);
    },
  });
};