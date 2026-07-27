import { useQuery } from '@tanstack/react-query';

const API_BASE_URL = 'https://hire-me-jobs.onrender.com';

const fetchJobDetails = async (jobId) => {
  const res = await fetch(`${API_BASE_URL}/jobs/${jobId}`);
  if (!res.ok) throw new Error('Job not found');
  return res.json();
};

export const useJobDetails = (jobId) => {
  return useQuery({
    queryKey: ['job', jobId],
    queryFn: () => fetchJobDetails(jobId),
    enabled: !!jobId,
    staleTime: 2 * 60 * 1000,
  });
};