import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { API_BASE_URL } from '../config/api';

const fetchJobApplications = async (jobId) => {
  if (!jobId) return [];
  const res = await fetch(`${API_BASE_URL}/job-applications?job_id=${jobId}`);
  if (!res.ok) throw new Error('Failed to fetch applicants');
  const data = await res.json();
  const raw = data?.data || data || [];
  return raw.map(item => {
    const candidate = item.Candidate || item.candidate || {};
    const statusObj = item.ApplicationStatus || {};
    const resume = item.CandidateResume || {};
    return {
      application_id: item.id,
      job_application_id: item.id,
      status_id: statusObj.id || null,
      status: (statusObj.name || 'pending').toLowerCase(),
      candidate_id: candidate.id || candidate.candidate_id,
      first_name: candidate.first_name || '',
      last_name: candidate.last_name || '',
      full_name: `${candidate.first_name || ''} ${candidate.last_name || ''}`.trim() || 'Unnamed',
      email: candidate.email || 'N/A',
      mobile: candidate.mobile || '',
      mobile_verified: !!candidate.mobile_verified,
      email_verified: !!candidate.email_verified,
      profile_photo: candidate.profile_photo || null,
      applied_at: item.applied_at || item.created_at || item.createdAt,
      updated_at: item.updated_at || item.updatedAt,
      is_newly_added: false, // compute if needed
      is_favourite: false,
      skills: candidate.skills || [],
      current_role: null,
      total_experience: candidate.total_experience || '',
      expected_salary_label: candidate.expected_salary ? formatSalaryLac(candidate.expected_salary) : null,
      notice_period: candidate.notice_period || '',
      current_location: candidate.current_city || candidate.city || '',
      preferred_locations: candidate.preferred_locations || [],
      education_label: candidate.education || '',
      summary: candidate.summary || candidate.profile_summary || '',
      resume_url: resume.resume_file || resume.file_url || '',
      linkedin_url: candidate.linkedin_url || '',
      _candidate: candidate,
      _application: item,
    };
  });
};

// Helper (copy from original)
const formatSalaryLac = (amount) => {
  const num = Number(amount);
  if (!num || isNaN(num)) return null;
  const lac = num / 100000;
  return `₹ ${lac % 1 === 0 ? lac.toFixed(0) : lac.toFixed(1)} Lac`;
};

export const useJobApplications = (jobId) => {
  return useQuery({
    queryKey: ['job-applications', jobId],
    queryFn: () => fetchJobApplications(jobId),
    enabled: !!jobId,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

export const useUpdateApplicationStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ jobApplicationId, statusId }) => {
      const res = await fetch(`${API_BASE_URL}/job-applications/${jobApplicationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ application_statuses_id: statusId }),
      });
      if (!res.ok) throw new Error('Update failed');
      return res.json();
    },
    onSuccess: (_, variables) => {
      // Invalidate the applicants list for the specific job
      queryClient.invalidateQueries(['job-applications']);
    },
  });
};

export const useBulkUpdateStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => {
      const res = await fetch(`${API_BASE_URL}/job-applications/update-status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Bulk update failed');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['job-applications']);
    },
  });
};