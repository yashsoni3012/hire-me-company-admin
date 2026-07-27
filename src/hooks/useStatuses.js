import { useQuery } from '@tanstack/react-query';

const API_BASE_URL = 'https://hire-me-jobs.onrender.com';

const fetchStatuses = async () => {
  const res = await fetch(`${API_BASE_URL}/application-statuses`);
  if (!res.ok) throw new Error('Failed to fetch statuses');
  const data = await res.json();
  // The API returns { data: [...] } or just [...]
  return data?.data || data || [];
};

export const useStatuses = () => {
  return useQuery({
    queryKey: ['application-statuses'],
    queryFn: fetchStatuses,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};