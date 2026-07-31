

// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import {
//   TbArrowLeft,
//   TbUser,
//   TbMail,
//   TbPhone,
//   TbCalendar,
//   TbX,
//   TbBriefcase,
//   TbSchool,
//   TbCertificate,
//   TbAward,
//   TbLink,
//   TbFolder,
//   TbCircleCheck,
//   TbBuildingSkyscraper,
//   TbMapPin,
//   TbCurrencyRupee,
//   TbNotes,
// } from "react-icons/tb";
// import { useToast } from "../../context/ToastContext";
// import { API_BASE_URL } from "../../config/api";

// // Helper functions (reuse from JobApplicants or extract to a shared utils file)
// const asName = (val, fallback = "N/A") => {
//   if (!val) return fallback;
//   if (typeof val === "string" || typeof val === "number") return String(val);
//   if (typeof val === "object" && val.name) return val.name;
//   return fallback;
// };

// const asList = (val) => {
//   if (!val) return [];
//   return Array.isArray(val) ? val : [val];
// };

// const formatDate = (dateString, withTime = false) => {
//   if (!dateString) return "N/A";
//   const date = new Date(dateString);
//   if (isNaN(date.getTime())) return "N/A";
//   return date.toLocaleDateString("en-IN", {
//     day: "2-digit",
//     month: "short",
//     year: "numeric",
//     ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}),
//   });
// };

// const initials = (first, last) => {
//   const a = (first || "").trim().charAt(0);
//   const b = (last || "").trim().charAt(0);
//   const combined = `${a}${b}`.toUpperCase();
//   return combined || "?";
// };

// const StatusBadge = ({ status }) => {
//   const normalized = (status || "").toLowerCase();
//   const colors = {
//     active: "bg-green-50 text-green-700 border-green-200",
//     inactive: "bg-red-50 text-red-700 border-red-200",
//     pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
//     shortlisted: "bg-blue-50 text-blue-700 border-blue-200",
//     rejected: "bg-red-50 text-red-700 border-red-200",
//   };
//   const cls = colors[normalized] || "bg-gray-50 text-gray-700 border-gray-200";
//   return (
//     <span
//       className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${cls}`}
//     >
//       {status ? status.charAt(0).toUpperCase() + status.slice(1) : "Unknown"}
//     </span>
//   );
// };

// const SectionCard = ({ icon: Icon, title, count, children }) => (
//   <div className="bg-white rounded-xl border border-gray-200 p-5">
//     <div className="flex items-center gap-2 mb-4">
//       <div className="p-1.5 bg-purple-50 rounded-lg">
//         <Icon className="text-purple-600" size={18} />
//       </div>
//       <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
//       {typeof count === "number" && (
//         <span className="text-xs text-gray-400">({count})</span>
//       )}
//     </div>
//     {children}
//   </div>
// );

// const EmptyRow = ({ label }) => (
//   <p className="text-sm text-gray-400 italic">No {label} added yet</p>
// );

// export default function ApplicantDetails() {
//   const { jobId, candidateId } = useParams();
//   const navigate = useNavigate();
//   const { showError } = useToast();

//   const [profile, setProfile] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchProfile = async () => {
//       if (!candidateId) {
//         setError("No candidate ID provided");
//         setLoading(false);
//         return;
//       }
//       try {
//         setLoading(true);
//         const response = await fetch(
//           `${API_BASE_URL}/candidate-full-profile/${candidateId}`,
//         );
//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }
//         const result = await response.json();
//         const data = result?.data || result;
//         setProfile(data);
//       } catch (err) {
//         console.error("Error fetching candidate profile:", err);
//         setError(err.message);
//         showError("Failed to load candidate profile");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProfile();
//   }, [candidateId, showError]);

//   const candidate = profile?.candidate;
//   const candidateProfiles = profile?.candidate_profiles;
//   const completion = profile?.total_completion_percentage ?? 0;
//   const skills = asList(profile?.candidate_skills);
//   const education = asList(profile?.candidate_education);
//   const experience = asList(profile?.candidate_experience);
//   const preferences = profile?.candidate_preferences;
//   const certifications = asList(profile?.candidate_certification);
//   const awards = asList(profile?.candidate_awards);
//   const socialLinks = asList(profile?.candidate_social_links);
//   const projects = asList(profile?.candidate_projects);

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="flex flex-col items-center gap-3">
//           <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-purple-600 border-t-transparent"></div>
//           <p className="text-gray-500 text-sm">Loading profile...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error || !candidate) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
//         <div className="bg-white rounded-xl border border-gray-200 p-6 max-w-md w-full text-center">
//           <p className="text-red-500 font-medium">Failed to load profile</p>
//           <p className="text-sm text-gray-400 mt-1">
//             {error || "Candidate not found"}
//           </p>
//           <button
//             onClick={() => navigate(-1)}
//             className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors"
//           >
//             <TbArrowLeft size={16} /> Go Back
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // Extract career summary from candidate_profiles
//   const careerSummary = candidateProfiles?.career_summary || candidateProfiles?.headline || "";

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
//         {/* Back button */}
//         <div className="mb-6">
//           <button
//             onClick={() => navigate(-1)}
//             className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors"
//           >
//             <TbArrowLeft size={18} />
//             Back to applicants
//           </button>
//         </div>

//         {/* Main content */}
//         <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
//           {/* Header */}
//           <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
//             <h2 className="text-xl font-bold text-gray-900">
//               Candidate Profile
//             </h2>
//             <span className="text-sm text-gray-500">Job #{jobId}</span>
//           </div>

//           <div className="p-6 space-y-5">
//             {/* Basic info */}
//             <div className="bg-white rounded-xl border border-gray-200 p-5">
//               <div className="flex items-center gap-4">
//                 <div className="shrink-0 w-16 h-16 rounded-full bg-purple-100 text-purple-700 font-bold text-xl flex items-center justify-center overflow-hidden">
//                   {candidate.profile_photo ? (
//                     <img
//                       src={candidate.profile_photo}
//                       alt={`${candidate.first_name} ${candidate.last_name}`}
//                       className="w-full h-full object-cover"
//                     />
//                   ) : (
//                     initials(candidate.first_name, candidate.last_name)
//                   )}
//                 </div>
//                 <div className="flex-1 min-w-0">
//                   <div className="flex items-center gap-2 flex-wrap">
//                     <h3 className="text-lg font-semibold text-gray-900">
//                       {candidate.first_name} {candidate.last_name}
//                     </h3>
//                     <StatusBadge status={candidate.status} />
//                   </div>
//                   <div className="mt-1 flex items-center gap-1.5 text-sm text-gray-500">
//                     <TbMail size={14} />
//                     {candidate.email}
//                   </div>
//                   {candidate.mobile && (
//                     <div className="mt-1 flex items-center gap-1.5 text-sm text-gray-500">
//                       <TbPhone size={14} />
//                       {candidate.mobile}
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* Profile completion */}
//               <div className="mt-4">
//                 <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
//                   <span>Profile completion</span>
//                   <span className="font-medium text-gray-700">
//                     {completion}%
//                   </span>
//                 </div>
//                 <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
//                   <div
//                     className="h-full bg-purple-600 rounded-full transition-all"
//                     style={{
//                       width: `${Math.min(100, Math.max(0, completion))}%`,
//                     }}
//                   />
//                 </div>
//               </div>

//               <div className="mt-3 text-xs text-gray-400">
//                 Last login: {formatDate(candidate.last_login_at, true)}
//               </div>
//             </div>

//             {/* ✨ NEW: Profile Summary / Career Summary */}
//             <SectionCard icon={TbNotes} title="Profile Summary">
//               {careerSummary ? (
//                 <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
//                   {careerSummary}
//                 </div>
//               ) : (
//                 <EmptyRow label="summary" />
//               )}
//             </SectionCard>

//             {/* Skills */}
//             <SectionCard
//               icon={TbCircleCheck}
//               title="Skills"
//               count={skills.length}
//             >
//               {skills.length === 0 ? (
//                 <EmptyRow label="skills" />
//               ) : (
//                 <div className="flex flex-wrap gap-2">
//                   {skills.map((skill) => (
//                     <span
//                       key={skill.id || skill.skill_id}
//                       className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded-full border border-purple-100"
//                     >
//                       {skill.skill_name || asName(skill.skill, `Skill #${skill.skill_id}`)}
//                       {skill.experience_months
//                         ? ` · ${skill.experience_months} mo`
//                         : ""}
//                     </span>
//                   ))}
//                 </div>
//               )}
//             </SectionCard>

//             {/* Education */}
//             <SectionCard
//               icon={TbSchool}
//               title="Education"
//               count={education.length}
//             >
//               {education.length === 0 ? (
//                 <EmptyRow label="education" />
//               ) : (
//                 <div className="space-y-3">
//                   {education.map((edu) => (
//                     <div
//                       key={edu.id}
//                       className="border border-gray-100 rounded-lg p-3"
//                     >
//                       <div className="flex items-center justify-between gap-2">
//                         <p className="font-medium text-gray-900 text-sm">
//                           {edu.college_name || "N/A"}
//                         </p>
//                         <span className="text-xs text-gray-400">
//                           {edu.passing_year}
//                         </span>
//                       </div>
//                       <p className="text-xs text-gray-500 mt-0.5">
//                         {asName(edu.education_category_id)} ·{" "}
//                         {asName(edu.education_sub_category_id)}
//                       </p>
//                       <p className="text-xs text-gray-500">
//                         {edu.education_type || "N/A"} ·{" "}
//                         {edu.percentage || "N/A"}%
//                       </p>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </SectionCard>

//             {/* Experience */}
//             <SectionCard
//               icon={TbBriefcase}
//               title="Experience"
//               count={experience.length}
//             >
//               {experience.length === 0 ? (
//                 <EmptyRow label="experience" />
//               ) : (
//                 <div className="space-y-3">
//                   {experience.map((exp) => (
//                     <div
//                       key={exp.id}
//                       className="border border-gray-100 rounded-lg p-3"
//                     >
//                       <div className="flex items-center justify-between gap-2 flex-wrap">
//                         <p className="font-medium text-gray-900 text-sm">
//                           {exp.job_title || "N/A"}{" "}
//                           {exp.designation ? `· ${exp.designation}` : ""}
//                         </p>
//                         {exp.is_current_company && (
//                           <span className="text-xs px-2 py-0.5 bg-green-50 text-green-700 rounded-full border border-green-200">
//                             Current
//                           </span>
//                         )}
//                       </div>
//                       <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-0.5">
//                         <TbBuildingSkyscraper size={13} />
//                         {exp.company_name || "N/A"}
//                       </div>
//                       <p className="text-xs text-gray-500 mt-0.5">
//                         {formatDate(exp.start_date)} —{" "}
//                         {exp.is_current_company
//                           ? "Present"
//                           : formatDate(exp.end_date)}
//                       </p>
//                       <p className="text-xs text-gray-500 mt-0.5">
//                         {asName(exp.industry_id)} · {asName(exp.workplace_id)} ·{" "}
//                         {asName(exp.job_types_id)}
//                       </p>
//                       {exp.salary && (
//                         <p className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
//                           <TbCurrencyRupee size={13} />
//                           {Number(exp.salary).toLocaleString("en-IN")}
//                         </p>
//                       )}
//                       {exp.job_description && (
//                         <p className="text-xs text-gray-600 mt-2 leading-relaxed">
//                           {exp.job_description}
//                         </p>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </SectionCard>

//             {/* Preferences */}
//             <SectionCard icon={TbMapPin} title="Preferences">
//               {!preferences ? (
//                 <EmptyRow label="preferences" />
//               ) : (
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
//                   <div>
//                     <p className="text-xs text-gray-400 mb-1">
//                       Preferred industry
//                     </p>
//                     <p className="text-gray-700">
//                       {asList(preferences.preferred_industry_id)
//                         .map((i) => asName(i))
//                         .join(", ") || "N/A"}
//                     </p>
//                   </div>
//                   <div>
//                     <p className="text-xs text-gray-400 mb-1">Preferred city</p>
//                     <p className="text-gray-700">
//                       {asList(preferences.preferred_city_id)
//                         .map((i) => asName(i))
//                         .join(", ") || "N/A"}
//                     </p>
//                   </div>
//                   <div>
//                     <p className="text-xs text-gray-400 mb-1">Workplace type</p>
//                     <p className="text-gray-700">
//                       {asList(preferences.preferred_workplace_type_id)
//                         .map((i) => asName(i))
//                         .join(", ") || "N/A"}
//                     </p>
//                   </div>
//                   <div>
//                     <p className="text-xs text-gray-400 mb-1">
//                       Expected salary
//                     </p>
//                     <p className="text-gray-700 flex items-center gap-1">
//                       <TbCurrencyRupee size={14} />
//                       {preferences.preferred_salary
//                         ? Number(preferences.preferred_salary).toLocaleString(
//                             "en-IN",
//                           )
//                         : "N/A"}
//                     </p>
//                   </div>
//                 </div>
//               )}
//             </SectionCard>

//             {/* Certifications */}
//             <SectionCard
//               icon={TbCertificate}
//               title="Certifications"
//               count={certifications.length}
//             >
//               {certifications.length === 0 ? (
//                 <EmptyRow label="certifications" />
//               ) : (
//                 <div className="space-y-2">
//                   {certifications.map((cert) => (
//                     <div
//                       key={cert.id}
//                       className="flex items-center justify-between border border-gray-100 rounded-lg p-3"
//                     >
//                       <div>
//                         <p className="text-sm font-medium text-gray-900">
//                           {cert.certificate_name}
//                         </p>
//                         <p className="text-xs text-gray-500">{cert.issuer}</p>
//                       </div>
//                       <span className="text-xs text-gray-400">
//                         {formatDate(cert.issue_date)}
//                       </span>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </SectionCard>

//             {/* Awards */}
//             <SectionCard icon={TbAward} title="Awards" count={awards.length}>
//               {awards.length === 0 ? (
//                 <EmptyRow label="awards" />
//               ) : (
//                 <div className="space-y-2">
//                   {awards.map((award) => (
//                     <div
//                       key={award.id}
//                       className="border border-gray-100 rounded-lg p-3"
//                     >
//                       <p className="text-sm font-medium text-gray-900">
//                         {award.title}
//                       </p>
//                       {award.description && (
//                         <p className="text-xs text-gray-500 mt-0.5">
//                           {award.description}
//                         </p>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </SectionCard>

//             {/* Social links */}
//             <SectionCard
//               icon={TbLink}
//               title="Social Links"
//               count={socialLinks.length}
//             >
//               {socialLinks.length === 0 ? (
//                 <EmptyRow label="social links" />
//               ) : (
//                 <div className="flex flex-wrap gap-2">
//                   {socialLinks.map((link) => (
//                     <a
//                       key={link.id}
//                       href={link.social_url}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="px-3 py-1.5 bg-purple-50 text-purple-700 text-xs font-medium rounded-lg border border-purple-100 hover:bg-purple-100 transition-colors capitalize"
//                     >
//                       {link.social_type}
//                     </a>
//                   ))}
//                 </div>
//               )}
//             </SectionCard>

//             {/* Projects */}
//             <SectionCard
//               icon={TbFolder}
//               title="Projects"
//               count={projects.length}
//             >
//               {projects.length === 0 ? (
//                 <EmptyRow label="projects" />
//               ) : (
//                 <div className="space-y-3">
//                   {projects.map((project) => (
//                     <div
//                       key={project.id}
//                       className="border border-gray-100 rounded-lg p-3"
//                     >
//                       <div className="flex items-center justify-between gap-2 flex-wrap">
//                         <p className="text-sm font-medium text-gray-900">
//                           {project.project_title}
//                         </p>
//                         {project.project_url && (
//                           <a
//                             href={project.project_url}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="text-xs text-purple-600 hover:underline"
//                           >
//                             View project
//                           </a>
//                         )}
//                       </div>
//                       <p className="text-xs text-gray-500 mt-0.5">
//                         {project.candidate_role || "N/A"}
//                         {project.client_name ? ` · ${project.client_name}` : ""}
//                       </p>
//                       {project.technologies_used && (
//                         <p className="text-xs text-gray-500 mt-0.5">
//                           {project.technologies_used}
//                         </p>
//                       )}
//                       {project.team_size && (
//                         <p className="text-xs text-gray-500 mt-0.5">
//                           Team size: {project.team_size}
//                         </p>
//                       )}
//                       {project.project_description && (
//                         <p className="text-xs text-gray-600 mt-2 leading-relaxed">
//                           {project.project_description}
//                         </p>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </SectionCard>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  TbArrowLeft,
  TbUser,
  TbMail,
  TbPhone,
  TbCalendar,
  TbX,
  TbBriefcase,
  TbSchool,
  TbCertificate,
  TbAward,
  TbLink,
  TbFolder,
  TbCircleCheck,
  TbBuildingSkyscraper,
  TbMapPin,
  TbCurrencyRupee,
  TbNotes,
} from "react-icons/tb";
import { useToast } from "../../context/ToastContext";
import { API_BASE_URL } from "../../config/api";

// Fallback API URL if the imported one is undefined
const API_URL = API_BASE_URL || import.meta.env.VITE_API_BASE_URL || "https://hire-me-jobs.onrender.com";

// Helper functions (reuse from JobApplicants or extract to a shared utils file)
const asName = (val, fallback = "N/A") => {
  if (!val) return fallback;
  if (typeof val === "string" || typeof val === "number") return String(val);
  if (typeof val === "object" && val.name) return val.name;
  return fallback;
};

const asList = (val) => {
  if (!val) return [];
  return Array.isArray(val) ? val : [val];
};

const formatDate = (dateString, withTime = false) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "N/A";
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}),
  });
};

const initials = (first, last) => {
  const a = (first || "").trim().charAt(0);
  const b = (last || "").trim().charAt(0);
  const combined = `${a}${b}`.toUpperCase();
  return combined || "?";
};

const StatusBadge = ({ status }) => {
  const normalized = (status || "").toLowerCase();
  const colors = {
    active: "bg-green-50 text-green-700 border-green-200",
    inactive: "bg-red-50 text-red-700 border-red-200",
    pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
    shortlisted: "bg-blue-50 text-blue-700 border-blue-200",
    rejected: "bg-red-50 text-red-700 border-red-200",
  };
  const cls = colors[normalized] || "bg-gray-50 text-gray-700 border-gray-200";
  return (
    <span
      className={`px-2.5 py-0.5 rounded-full text-xs font-medium border whitespace-nowrap ${cls}`}
    >
      {status ? status.charAt(0).toUpperCase() + status.slice(1) : "Unknown"}
    </span>
  );
};

const SectionCard = ({ icon: Icon, title, count, children }) => (
  <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5">
    <div className="flex items-center gap-2 mb-3 sm:mb-4">
      <div className="p-1.5 bg-purple-50 rounded-lg shrink-0">
        <Icon className="text-purple-600" size={18} />
      </div>
      <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
      {typeof count === "number" && (
        <span className="text-xs text-gray-400">({count})</span>
      )}
    </div>
    {children}
  </div>
);

const EmptyRow = ({ label }) => (
  <p className="text-sm text-gray-400 italic">No {label} added yet</p>
);

export default function ApplicantDetails() {
  const { jobId, candidateId } = useParams();
  const navigate = useNavigate();
  const { showError } = useToast();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!candidateId) {
        setError("No candidate ID provided");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const response = await fetch(
          `${API_URL}/candidate-full-profile/${candidateId}`,
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        const data = result?.data || result;
        setProfile(data);
      } catch (err) {
        console.error("Error fetching candidate profile:", err);
        setError(err.message);
        showError("Failed to load candidate profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [candidateId, showError]);

  const candidate = profile?.candidate;
  const candidateProfiles = profile?.candidate_profiles;
  const completion = profile?.total_completion_percentage ?? 0;
  const skills = asList(profile?.candidate_skills);
  const education = asList(profile?.candidate_education);
  const experience = asList(profile?.candidate_experience);
  const preferences = profile?.candidate_preferences;
  const certifications = asList(profile?.candidate_certification);
  const awards = asList(profile?.candidate_awards);
  const socialLinks = asList(profile?.candidate_social_links);
  const projects = asList(profile?.candidate_projects);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="flex flex-col items-center gap-3">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-purple-600 border-t-transparent"></div>
          <p className="text-gray-500 text-sm">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !candidate) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl border border-gray-200 p-6 max-w-md w-full text-center">
          <p className="text-red-500 font-medium">Failed to load profile</p>
          <p className="text-sm text-gray-400 mt-1">
            {error || "Candidate not found"}
          </p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors"
          >
            <TbArrowLeft size={16} /> Go Back
          </button>
        </div>
      </div>
    );
  }

  // Extract career summary from candidate_profiles
  const careerSummary = candidateProfiles?.career_summary || candidateProfiles?.headline || "";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* Back button */}
        <div className="mb-4 sm:mb-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-2.5 sm:px-3 py-2 rounded-lg transition-colors text-sm sm:text-base"
          >
            <TbArrowLeft size={18} />
            <span className="hidden xs:inline sm:inline">Back to applicants</span>
            <span className="inline xs:hidden sm:hidden">Back</span>
          </button>
        </div>

        {/* Main content */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 flex flex-col xs:flex-row sm:flex-row items-start xs:items-center sm:items-center justify-between gap-1 sm:gap-2">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">
              Candidate Profile
            </h2>
            <span className="text-xs sm:text-sm text-gray-500">Job #{jobId}</span>
          </div>

          <div className="p-3 sm:p-6 space-y-4 sm:space-y-5">
            {/* Basic info */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5">
              <div className="flex flex-col xs:flex-row sm:flex-row items-start xs:items-center sm:items-center gap-3 sm:gap-4">
                <div className="shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-purple-100 text-purple-700 font-bold text-lg sm:text-xl flex items-center justify-center overflow-hidden">
                  {candidate.profile_photo ? (
                    <img
                      src={candidate.profile_photo}
                      alt={`${candidate.first_name} ${candidate.last_name}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    initials(candidate.first_name, candidate.last_name)
                  )}
                </div>
                <div className="flex-1 min-w-0 w-full">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 break-words">
                      {candidate.first_name} {candidate.last_name}
                    </h3>
                    <StatusBadge status={candidate.status} />
                  </div>
                  <div className="mt-1 flex items-center gap-1.5 text-xs sm:text-sm text-gray-500 break-all">
                    <TbMail size={14} className="shrink-0" />
                    {candidate.email}
                  </div>
                  {candidate.mobile && (
                    <div className="mt-1 flex items-center gap-1.5 text-xs sm:text-sm text-gray-500">
                      <TbPhone size={14} className="shrink-0" />
                      {candidate.mobile}
                    </div>
                  )}
                </div>
              </div>

              {/* Profile completion */}
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                  <span>Profile completion</span>
                  <span className="font-medium text-gray-700">
                    {completion}%
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-600 rounded-full transition-all"
                    style={{
                      width: `${Math.min(100, Math.max(0, completion))}%`,
                    }}
                  />
                </div>
              </div>

              <div className="mt-3 text-xs text-gray-400">
                Last login: {formatDate(candidate.last_login_at, true)}
              </div>
            </div>

            {/* Profile Summary / Career Summary */}
            <SectionCard icon={TbNotes} title="Profile Summary">
              {careerSummary ? (
                <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap break-words">
                  {careerSummary}
                </div>
              ) : (
                <EmptyRow label="summary" />
              )}
            </SectionCard>

            {/* Skills */}
            <SectionCard
              icon={TbCircleCheck}
              title="Skills"
              count={skills.length}
            >
              {skills.length === 0 ? (
                <EmptyRow label="skills" />
              ) : (
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <span
                      key={skill.id || skill.skill_id}
                      className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded-full border border-purple-100"
                    >
                      {skill.skill_name || asName(skill.skill, `Skill #${skill.skill_id}`)}
                      {skill.experience_months
                        ? ` · ${skill.experience_months} mo`
                        : ""}
                    </span>
                  ))}
                </div>
              )}
            </SectionCard>

            {/* Education */}
            <SectionCard
              icon={TbSchool}
              title="Education"
              count={education.length}
            >
              {education.length === 0 ? (
                <EmptyRow label="education" />
              ) : (
                <div className="space-y-3">
                  {education.map((edu) => (
                    <div
                      key={edu.id}
                      className="border border-gray-100 rounded-lg p-3"
                    >
                      <div className="flex items-start sm:items-center justify-between gap-2 flex-wrap">
                        <p className="font-medium text-gray-900 text-sm break-words">
                          {edu.college_name || "N/A"}
                        </p>
                        <span className="text-xs text-gray-400 shrink-0">
                          {edu.passing_year}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {asName(edu.education_category_id)} ·{" "}
                        {asName(edu.education_sub_category_id)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {edu.education_type || "N/A"} ·{" "}
                        {edu.percentage || "N/A"}%
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </SectionCard>

            {/* Experience */}
            <SectionCard
              icon={TbBriefcase}
              title="Experience"
              count={experience.length}
            >
              {experience.length === 0 ? (
                <EmptyRow label="experience" />
              ) : (
                <div className="space-y-3">
                  {experience.map((exp) => (
                    <div
                      key={exp.id}
                      className="border border-gray-100 rounded-lg p-3"
                    >
                      <div className="flex items-start sm:items-center justify-between gap-2 flex-wrap">
                        <p className="font-medium text-gray-900 text-sm break-words">
                          {exp.job_title || "N/A"}{" "}
                          {exp.designation ? `· ${exp.designation}` : ""}
                        </p>
                        {exp.is_current_company && (
                          <span className="text-xs px-2 py-0.5 bg-green-50 text-green-700 rounded-full border border-green-200 shrink-0">
                            Current
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-0.5">
                        <TbBuildingSkyscraper size={13} className="shrink-0" />
                        <span className="break-words">{exp.company_name || "N/A"}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {formatDate(exp.start_date)} —{" "}
                        {exp.is_current_company
                          ? "Present"
                          : formatDate(exp.end_date)}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {asName(exp.industry_id)} · {asName(exp.workplace_id)} ·{" "}
                        {asName(exp.job_types_id)}
                      </p>
                      {exp.salary && (
                        <p className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                          <TbCurrencyRupee size={13} />
                          {Number(exp.salary).toLocaleString("en-IN")}
                        </p>
                      )}
                      {exp.job_description && (
                        <p className="text-xs text-gray-600 mt-2 leading-relaxed break-words">
                          {exp.job_description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </SectionCard>

            {/* Preferences */}
            <SectionCard icon={TbMapPin} title="Preferences">
              {!preferences ? (
                <EmptyRow label="preferences" />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">
                      Preferred industry
                    </p>
                    <p className="text-gray-700 break-words">
                      {asList(preferences.preferred_industry_id)
                        .map((i) => asName(i))
                        .join(", ") || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Preferred city</p>
                    <p className="text-gray-700 break-words">
                      {asList(preferences.preferred_city_id)
                        .map((i) => asName(i))
                        .join(", ") || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Workplace type</p>
                    <p className="text-gray-700 break-words">
                      {asList(preferences.preferred_workplace_type_id)
                        .map((i) => asName(i))
                        .join(", ") || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">
                      Expected salary
                    </p>
                    <p className="text-gray-700 flex items-center gap-1">
                      <TbCurrencyRupee size={14} />
                      {preferences.preferred_salary
                        ? Number(preferences.preferred_salary).toLocaleString(
                            "en-IN",
                          )
                        : "N/A"}
                    </p>
                  </div>
                </div>
              )}
            </SectionCard>

            {/* Certifications */}
            <SectionCard
              icon={TbCertificate}
              title="Certifications"
              count={certifications.length}
            >
              {certifications.length === 0 ? (
                <EmptyRow label="certifications" />
              ) : (
                <div className="space-y-2">
                  {certifications.map((cert) => (
                    <div
                      key={cert.id}
                      className="flex flex-col xs:flex-row sm:flex-row items-start sm:items-center justify-between gap-1 sm:gap-2 border border-gray-100 rounded-lg p-3"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 break-words">
                          {cert.certificate_name}
                        </p>
                        <p className="text-xs text-gray-500 break-words">{cert.issuer}</p>
                      </div>
                      <span className="text-xs text-gray-400 shrink-0">
                        {formatDate(cert.issue_date)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </SectionCard>

            {/* Awards */}
            <SectionCard icon={TbAward} title="Awards" count={awards.length}>
              {awards.length === 0 ? (
                <EmptyRow label="awards" />
              ) : (
                <div className="space-y-2">
                  {awards.map((award) => (
                    <div
                      key={award.id}
                      className="border border-gray-100 rounded-lg p-3"
                    >
                      <p className="text-sm font-medium text-gray-900 break-words">
                        {award.title}
                      </p>
                      {award.description && (
                        <p className="text-xs text-gray-500 mt-0.5 break-words">
                          {award.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </SectionCard>

            {/* Social links – fixed missing <a> tag */}
            <SectionCard
              icon={TbLink}
              title="Social Links"
              count={socialLinks.length}
            >
              {socialLinks.length === 0 ? (
                <EmptyRow label="social links" />
              ) : (
                <div className="flex flex-wrap gap-2">
                  {socialLinks.map((link) => (
                    <a
                      key={link.id}
                      href={link.social_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-purple-50 text-purple-700 text-xs font-medium rounded-lg border border-purple-100 hover:bg-purple-100 transition-colors capitalize"
                    >
                      {link.social_type}
                    </a>
                  ))}
                </div>
              )}
            </SectionCard>

            {/* Projects */}
            <SectionCard
              icon={TbFolder}
              title="Projects"
              count={projects.length}
            >
              {projects.length === 0 ? (
                <EmptyRow label="projects" />
              ) : (
                <div className="space-y-3">
                  {projects.map((project) => (
                    <div
                      key={project.id}
                      className="border border-gray-100 rounded-lg p-3"
                    >
                      <div className="flex items-start sm:items-center justify-between gap-2 flex-wrap">
                        <p className="text-sm font-medium text-gray-900 break-words">
                          {project.project_title}
                        </p>
                        {project.project_url && (
                          <a
                            href={project.project_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-purple-600 hover:underline shrink-0"
                          >
                            View project
                          </a>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5 break-words">
                        {project.candidate_role || "N/A"}
                        {project.client_name ? ` · ${project.client_name}` : ""}
                      </p>
                      {project.technologies_used && (
                        <p className="text-xs text-gray-500 mt-0.5 break-words">
                          {project.technologies_used}
                        </p>
                      )}
                      {project.team_size && (
                        <p className="text-xs text-gray-500 mt-0.5">
                          Team size: {project.team_size}
                        </p>
                      )}
                      {project.project_description && (
                        <p className="text-xs text-gray-600 mt-2 leading-relaxed break-words">
                          {project.project_description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </SectionCard>
          </div>
        </div>
      </div>
    </div>
  );
}