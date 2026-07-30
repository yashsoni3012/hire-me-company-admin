// import React, { useState, useEffect, useMemo, useRef } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import {
//   TbArrowLeft,
//   TbMail,
//   TbPhone,
//   TbCalendar,
//   TbSearch,
//   TbRefresh,
//   TbBriefcase,
//   TbFolder,
//   TbChevronLeft,
//   TbChevronRight,
//   TbChevronsLeft,
//   TbChevronsRight,
//   TbChevronDown,
//   TbCheck,
//   TbUsers,
//   TbCircleCheck,
//   TbBuildingSkyscraper,
//   TbMapPin,
//   TbCurrencyRupee,
//   TbFileText,
//   TbBrandLinkedin,
//   TbBrandWhatsapp,
//   TbMessage,
//   TbFolderSymlink,
//   TbHeart,
//   TbHeartFilled,
//   TbMessageCircle,
//   TbClock,
//   TbSparkles,
//   TbNotes,
//   TbCalendarDue,
// } from "react-icons/tb";
// import { useToast } from "../../context/ToastContext";
// import { useAuth } from "../../context/AuthContext";
// import { API_BASE_URL } from "../../config/api";
// import CommentSection from "../../pages/JobListing/CommentSection";

// const VIEWED_STATUS_ID = 3;
// const APPLICATION_STATUSES_URL =
//   "https://hire-me-jobs.onrender.com/application-statuses";

// // API service – all endpoints used in this component
// const applicantsApiService = {
//   getApplicantsByJobId: async (jobId) => {
//     const response = await fetch(
//       `${API_BASE_URL}/candidate-profile-job-application?job_id=${jobId}`,
//     );
//     if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
//     return response.json();
//   },

//   getCandidateFullProfile: async (candidateId) => {
//     const response = await fetch(
//       `${API_BASE_URL}/candidate-full-profile/${candidateId}`,
//     );
//     if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
//     return response.json();
//   },

//   logResumeDownload: async (data) => {
//     const response = await fetch(`${API_BASE_URL}/resume-download-logs`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(data),
//     });
//     if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
//     return response.json();
//   },

//   updateApplicationStatus: async (applicationId, statusId) => {
//     const response = await fetch(
//       `${API_BASE_URL}/candidate-profile-job-application/${applicationId}`,
//       {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ application_statuses_id: statusId }),
//       },
//     );
//     if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
//     return response.json();
//   },

//   updateJobApplicationStatus: async (jobApplicationId, statusId) => {
//     const response = await fetch(
//       `${API_BASE_URL}/job-applications/${jobApplicationId}`,
//       {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ application_statuses_id: statusId }),
//       },
//     );
//     if (!response.ok) {
//       let msg = `HTTP error! status: ${response.status}`;
//       try {
//         const err = await response.json();
//         if (err.message) msg = err.message;
//       } catch (_) {}
//       throw new Error(msg);
//     }
//     return response.json();
//   },

//   postApplicationLog: async (data) => {
//     const response = await fetch(`${API_BASE_URL}/application-logs`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(data),
//     });
//     if (!response.ok) {
//       let msg = `HTTP error! status: ${response.status}`;
//       try {
//         const err = await response.json();
//         if (err.message) msg = err.message;
//       } catch (_) {}
//       throw new Error(msg);
//     }
//     return response.json();
//   },

//   postApplicationNote: async (data) => {
//     const response = await fetch(`${API_BASE_URL}/application-notes`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(data),
//     });
//     if (!response.ok) {
//       let errorMsg = `HTTP error! status: ${response.status}`;
//       try {
//         const errorData = await response.json();
//         if (errorData.message) errorMsg = errorData.message;
//       } catch (e) {}
//       throw new Error(errorMsg);
//     }
//     return response.json();
//   },

//   getJobApplicationsByJobId: async (jobId) => {
//     const response = await fetch(
//       `${API_BASE_URL}/job-applications?job_id=${jobId}`,
//     );
//     if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
//     return response.json();
//   },

//   getJobApplicationByCandidate: async (jobId, candidateId) => {
//     const response = await fetch(
//       `${API_BASE_URL}/job-applications?job_id=${jobId}&candidate_id=${candidateId}`,
//     );
//     if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
//     return response.json();
//   },

//   getApplicationStatuses: async () => {
//     const response = await fetch(APPLICATION_STATUSES_URL);
//     if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
//     return response.json();
//   },

//   getJobById: async (jobId) => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/jobs/${jobId}`);
//       if (response.ok) return response.json();
//     } catch (_) {}
//     const listResponse = await fetch(`${API_BASE_URL}/jobs`);
//     if (!listResponse.ok)
//       throw new Error(`HTTP error! status: ${listResponse.status}`);
//     return listResponse.json();
//   },

//   getCompanyUsers: async () => {
//     const response = await fetch(`${API_BASE_URL}/company-users`);
//     if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
//     return response.json();
//   },

//   getCompanies: async () => {
//     const response = await fetch(`${API_BASE_URL}/companies`);
//     if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
//     return response.json();
//   },
// };

// // ---------------------------------------------------------------------------
// // Helpers
// // ---------------------------------------------------------------------------
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
//   return `${a}${b}`.toUpperCase() || "?";
// };

// const formatMonthYear = (dateString) => {
//   if (!dateString) return "";
//   const date = new Date(dateString);
//   if (isNaN(date.getTime())) return "";
//   return date.toLocaleDateString("en-IN", { month: "short", year: "numeric" });
// };

// const durationFromDates = (start, end) => {
//   if (!start) return "";
//   const startDate = new Date(start);
//   const endDate = end ? new Date(end) : new Date();
//   if (isNaN(startDate.getTime())) return "";
//   let months =
//     (endDate.getFullYear() - startDate.getFullYear()) * 12 +
//     (endDate.getMonth() - startDate.getMonth());
//   if (months < 0) months = 0;
//   const years = Math.floor(months / 12);
//   const remMonths = months % 12;
//   if (years === 0) return `${remMonths}m`;
//   if (remMonths === 0) return `${years}y`;
//   return `${years}y ${remMonths}m`;
// };

// const formatSalaryLac = (amount) => {
//   const num = Number(amount);
//   if (!num || isNaN(num)) return null;
//   const lac = num / 100000;
//   return `₹ ${lac % 1 === 0 ? lac.toFixed(0) : lac.toFixed(1)} Lac`;
// };

// const isRecentlyApplied = (dateString, days = 3) => {
//   if (!dateString) return false;
//   const date = new Date(dateString);
//   if (isNaN(date.getTime())) return false;
//   return (Date.now() - date.getTime()) / (1000 * 60 * 60 * 24) <= days;
// };

// // Normalize any status label to a lowercase, trimmed key
// const statusKey = (val) => (val || "").toString().trim().toLowerCase();

// const resolveCandidateBundle = (item) => {
//   const person =
//     item.candidate ||
//     item.Candidate ||
//     item.candidate_details ||
//     item.applicant ||
//     item;
//   const bundle = item;
//   return { person, bundle };
// };

// const resolveJobRecord = (result, jobId) => {
//   if (!result) return null;
//   const data = result.data ?? result;
//   if (Array.isArray(data)) {
//     return data.find((j) => String(j.id) === String(jobId)) || null;
//   }
//   if (data && typeof data === "object" && data.id) return data;
//   return null;
// };

// // ---------------------------------------------------------------------------
// // Transform: raw applicants + raw job-applications -> UI-ready applicant list
// // ---------------------------------------------------------------------------
// const transformApplicants = (rawList, jobApps, jobId) => {
//   let jobAppsMapByCandidate = {};
//   let jobAppsMapById = {};
//   jobApps.forEach((app) => {
//     const candidateId =
//       app.candidate_id || app.candidateId || app.Candidate?.id;
//     if (candidateId && app.id) {
//       const info = {
//         job_application_id: app.id,
//         status_id: app.ApplicationStatus?.id ?? null,
//         status_name: statusKey(app.ApplicationStatus?.name),
//         job_id: app.job_id || app.Job?.id || Number(jobId),
//       };
//       jobAppsMapByCandidate[candidateId] = info;
//       jobAppsMapById[app.id] = info;
//     }
//   });

//   return rawList.map((item) => {
//     const { person: c, bundle } = resolveCandidateBundle(item);
//     const profile = bundle.candidate_profiles || {};

//     const candidateId =
//       item.candidate_id ??
//       item.candidateId ??
//       item.candidate_uuid ??
//       c.candidate_id ??
//       c.candidateId ??
//       (c !== item ? c.id : undefined);

//     let jobAppInfo = jobAppsMapById[item.id] || null;
//     if (!jobAppInfo) {
//       jobAppInfo = jobAppsMapByCandidate[candidateId] || null;
//     }

//     const jobAppId =
//       jobAppInfo?.job_application_id || item.job_application_id || null;
//     const statusId = jobAppInfo?.status_id ?? null;
//     const statusName =
//       jobAppInfo?.status_name ||
//       statusKey(item.status) ||
//       statusKey(c.status) ||
//       "pending";

//     const rawSkills = asList(
//       bundle.candidate_skills || c.candidate_skills || item.candidate_skills,
//     );
//     const skillNames = rawSkills
//       .map((s) => {
//         if (typeof s === "string") return s;
//         return s.skill_name || s.name || null;
//       })
//       .filter(Boolean);

//     const experienceList = asList(
//       bundle.candidate_experience ||
//         c.candidate_experience ||
//         item.candidate_experience,
//     );
//     const currentExp =
//       experienceList.find((e) => e.is_current_company) || experienceList[0];
//     const currentRole = currentExp
//       ? {
//           designation:
//             currentExp.designation ||
//             currentExp.job_title ||
//             profile.headline ||
//             "N/A",
//           company: currentExp.company_name || "",
//           duration_label: currentExp.start_date
//             ? `${formatMonthYear(currentExp.start_date)} to ${
//                 currentExp.is_current_company
//                   ? "Present"
//                   : formatMonthYear(currentExp.end_date)
//               } - ${durationFromDates(currentExp.start_date, currentExp.end_date)}`
//             : "",
//         }
//       : profile.headline
//         ? { designation: profile.headline, company: "", duration_label: "" }
//         : null;

//     const totalExperience =
//       c.total_experience_label ||
//       profile.total_experience_label ||
//       (currentExp?.start_date
//         ? durationFromDates(currentExp.start_date, currentExp.end_date)
//         : "");

//     const preferences =
//       bundle.candidate_preferences ||
//       c.candidate_preferences ||
//       item.candidate_preferences ||
//       {};
//     const expectedSalaryLabel = formatSalaryLac(
//       profile.expected_salary ??
//         preferences?.preferred_salary ??
//         currentExp?.salary,
//     );
//     const noticePeriod =
//       asName(profile.notice_period_id, "") ||
//       asName(preferences?.notice_period_id, "") ||
//       (c.notice_period_days
//         ? `${c.notice_period_days} days notice period`
//         : "");
//     const currentLocation =
//       asName(profile.current_city_id, "") ||
//       profile.current_address ||
//       asName(c.city, "") ||
//       asName(preferences?.preferred_city_id?.[0], "");
//     const preferredLocations = asList(preferences?.preferred_city_id)
//       .map((cty) => asName(cty))
//       .filter((v) => v && v !== "N/A");

//     const educationList = asList(
//       bundle.candidate_education ||
//         c.candidate_education ||
//         item.candidate_education,
//     );
//     const latestEdu = educationList[0];
//     const educationLabel = latestEdu
//       ? `${asName(latestEdu.education_sub_category_id, latestEdu.education_type || "")}${
//           latestEdu.college_name ? ` - ${latestEdu.college_name}` : ""
//         }${latestEdu.passing_year ? `, ${latestEdu.passing_year}` : ""}`
//       : "";

//     const socialLinks = asList(
//       bundle.candidate_social_links ||
//         c.candidate_social_links ||
//         item.candidate_social_links,
//     );

//     return {
//       application_id: item.id || item.application_id,
//       job_application_id: jobAppId,
//       status_id: statusId,
//       job_id: jobAppInfo?.job_id || Number(jobId),
//       candidate_id: candidateId,
//       first_name: c.first_name || "",
//       last_name: c.last_name || "",
//       full_name:
//         `${c.first_name || ""} ${c.last_name || ""}`.trim() ||
//         "Unnamed candidate",
//       email: c.email || "N/A",
//       mobile: c.mobile || "",
//       mobile_verified: !!(c.mobile_verified || c.is_mobile_verified),
//       email_verified: !!c.email_verified,
//       profile_photo: c.profile_photo || profile.profile_photo || null,
//       status: statusName,
//       applied_at: item.applied_at || item.created_at || item.createdAt,
//       updated_at: item.updated_at || item.updatedAt,
//       is_newly_added: isRecentlyApplied(
//         item.applied_at || item.created_at || item.createdAt,
//       ),
//       is_favourite: !!item.is_favourite,
//       skills: skillNames,
//       current_role: currentRole,
//       total_experience: totalExperience,
//       expected_salary_label: expectedSalaryLabel,
//       notice_period: noticePeriod,
//       current_location: currentLocation,
//       preferred_locations: preferredLocations,
//       education_label: educationLabel,
//       summary: profile.career_summary || profile.headline || "",
//       resume_url: c.resume_url || c.resume || "",
//       linkedin_url:
//         c.linkedin_url ||
//         socialLinks.find(
//           (l) => (l.social_type || "").toLowerCase() === "linkedin",
//         )?.social_url ||
//         "",
//     };
//   });
// };

// // ---------------------------------------------------------------------------
// // Shared status → color palette
// // ---------------------------------------------------------------------------
// const STATUS_COLOR_MAP = {
//   active: { badge: "bg-green-50 text-green-700 border-green-200", dot: "bg-green-500" },
//   inactive: { badge: "bg-red-50 text-red-700 border-red-200", dot: "bg-red-500" },
//   pending: { badge: "bg-amber-50 text-amber-700 border-amber-200", dot: "bg-amber-500" },
//   shortlisted: { badge: "bg-blue-50 text-blue-700 border-blue-200", dot: "bg-blue-500" },
//   rejected: { badge: "bg-red-50 text-red-700 border-red-200", dot: "bg-red-500" },
//   viewed: { badge: "bg-purple-50 text-purple-700 border-purple-200", dot: "bg-purple-500" },
//   interview: { badge: "bg-indigo-50 text-indigo-700 border-indigo-200", dot: "bg-indigo-500" },
//   hired: { badge: "bg-emerald-50 text-emerald-700 border-emerald-200", dot: "bg-emerald-500" },
//   draft: { badge: "bg-gray-50 text-gray-600 border-gray-200", dot: "bg-gray-400" },
//   published: { badge: "bg-green-50 text-green-700 border-green-200", dot: "bg-green-500" },
//   closed: { badge: "bg-red-50 text-red-700 border-red-200", dot: "bg-red-500" },
//   expired: { badge: "bg-red-50 text-red-700 border-red-200", dot: "bg-red-500" },
// };
// const DEFAULT_STATUS_COLOR = { badge: "bg-gray-50 text-gray-700 border-gray-200", dot: "bg-gray-400" };
// const statusColor = (status) => STATUS_COLOR_MAP[statusKey(status)] || DEFAULT_STATUS_COLOR;

// // ---------------------------------------------------------------------------
// // Reusable bits
// // ---------------------------------------------------------------------------
// const StatusBadge = ({ status }) => {
//   const cls = statusColor(status).badge;
//   return (
//     <span
//       className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${cls}`}
//     >
//       {status ? status.charAt(0).toUpperCase() + status.slice(1) : "Unknown"}
//     </span>
//   );
// };

// const HighlightedText = ({ text, terms = [] }) => {
//   if (!text) return null;
//   if (!terms.length) return <>{text}</>;
//   const pattern = new RegExp(`(${terms.filter(Boolean).join("|")})`, "gi");
//   const parts = text.split(pattern);
//   return (
//     <>
//       {parts.map((part, i) =>
//         terms.some((t) => t && t.toLowerCase() === part.toLowerCase()) ? (
//           <mark key={i} className="bg-yellow-200 text-gray-900 rounded px-0.5">
//             {part}
//           </mark>
//         ) : (
//           <React.Fragment key={i}>{part}</React.Fragment>
//         ),
//       )}
//     </>
//   );
// };

// const SkillChip = ({ label, highlighted }) => (
//   <span
//     className={`text-sm ${
//       highlighted
//         ? "bg-yellow-200 text-gray-900 font-medium px-1 rounded"
//         : "text-gray-700"
//     }`}
//   >
//     {label}
//   </span>
// );

// // ---------------------------------------------------------------------------
// // CandidateCard Component
// // ---------------------------------------------------------------------------
// const CandidateCard = ({
//   applicant,
//   onCardClick,
//   onToggleFavourite,
//   jobSkillTerms,
//   onOpenResume,
//   onCommentClick,
//   statusOptions = [],
//   statusOptionsLoading = false,
//   onMoveTo,
//   isSelected = false,
//   onSelectToggle = null,
//   showCheckbox = false,
// }) => {
//   const [favourite, setFavourite] = useState(!!applicant.is_favourite);
//   const [resumeLoading, setResumeLoading] = useState(false);
//   const [showMoveToMenu, setShowMoveToMenu] = useState(false);
//   const [movingStatusId, setMovingStatusId] = useState(null);
//   const moveToRef = useRef(null);

//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (moveToRef.current && !moveToRef.current.contains(e.target)) {
//         setShowMoveToMenu(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const handleFavourite = (e) => {
//     e.stopPropagation();
//     setFavourite((f) => !f);
//     onToggleFavourite && onToggleFavourite(applicant);
//   };

//   const handleResumeClick = async (e) => {
//     e.stopPropagation();
//     if (!applicant.candidate_id) return;
//     setResumeLoading(true);
//     await onOpenResume(applicant.candidate_id);
//     setResumeLoading(false);
//   };

//   const handleMoveToToggle = (e) => {
//     e.stopPropagation();
//     setShowMoveToMenu((v) => !v);
//   };

//   const handleMoveToSelect = async (e, statusOption) => {
//     e.stopPropagation();
//     if (!onMoveTo) return;
//     setMovingStatusId(statusOption.id);
//     await onMoveTo(applicant, statusOption);
//     setMovingStatusId(null);
//     setShowMoveToMenu(false);
//   };

//   const stopPropagation = (e) => e.stopPropagation();

//   const skillNames = applicant.skills || [];
//   const visibleSkills = skillNames.slice(0, 8);
//   const extraSkillsCount = skillNames.length - visibleSkills.length;

//   return (
//     <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-purple-200 transition-all w-full overflow-visible">
//       {/* Top meta bar */}
//       <div className="flex flex-wrap items-center justify-between gap-2 px-5 py-2.5 bg-gray-50 border-b border-gray-100 text-xs text-gray-500">
//         <div className="flex items-center gap-4">
//           <span className="flex items-center gap-1">
//             <TbCalendar size={13} />
//             Applied on: {formatDate(applicant.applied_at)}
//           </span>
//           <span>
//             Stage: <StatusBadge status={applicant.status} />
//           </span>
//         </div>
//         {applicant.updated_at && (
//           <span>Updated: {formatDate(applicant.updated_at)}</span>
//         )}
//       </div>

//       <div
//         className="flex flex-col lg:flex-row gap-5 p-5 cursor-pointer"
//         onClick={() => onCardClick(applicant)}
//       >
//         {/* ─────────────── LEFT COLUMN ─────────────── */}
//         <div className="flex-1 min-w-0 flex gap-2">
//           {/* Checkbox */}
//           {showCheckbox && (
//             <div
//               className="flex items-start pt-1"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <input
//                 type="checkbox"
//                 checked={isSelected}
//                 onChange={(e) => {
//                   e.stopPropagation();
//                   if (onSelectToggle) onSelectToggle();
//                 }}
//                 className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500 cursor-pointer mt-4"
//               />
//             </div>
//           )}

//           {/* Avatar */}
//           <div
//             className="shrink-0 w-14 h-14 rounded-full bg-purple-100 text-purple-700 font-semibold text-lg flex items-center justify-center overflow-hidden"
//             onClick={(e) => {
//               e.stopPropagation();
//               onCardClick(applicant);
//             }}
//           >
//             {applicant.profile_photo ? (
//               <img
//                 src={applicant.profile_photo}
//                 alt={applicant.full_name}
//                 className="w-full h-full object-cover"
//               />
//             ) : (
//               initials(applicant.first_name, applicant.last_name)
//             )}
//           </div>

//           <div className="flex-1 min-w-0">
//             <div className="flex items-center gap-2 flex-wrap">
//               <button
//                 type="button"
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   onCardClick(applicant);
//                 }}
//                 className="text-base font-semibold text-gray-900 hover:text-purple-700 hover:underline"
//               >
//                 {applicant.full_name}
//               </button>
//               {applicant.is_newly_added && (
//                 <span className="flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-200">
//                   <TbSparkles size={12} />
//                   Newly added
//                 </span>
//               )}
//               {applicant.email_verified && (
//                 <span className="flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
//                   <TbCircleCheck size={12} />
//                   Email verified
//                 </span>
//               )}
//             </div>

//             <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
//               {applicant.total_experience && (
//                 <span className="flex items-center gap-1">
//                   <TbBriefcase size={13} />
//                   {applicant.total_experience}
//                 </span>
//               )}
//               {applicant.expected_salary_label && (
//                 <span className="flex items-center gap-1">
//                   <TbCurrencyRupee size={13} />
//                   {applicant.expected_salary_label}
//                 </span>
//               )}
//               {applicant.notice_period && (
//                 <span className="flex items-center gap-1">
//                   <TbClock size={13} />
//                   {applicant.notice_period}
//                 </span>
//               )}
//               {applicant.current_location && (
//                 <span className="flex items-center gap-1">
//                   <TbMapPin size={13} />
//                   {applicant.current_location}
//                 </span>
//               )}
//             </div>

//             {applicant.current_role && (
//               <div className="mt-2.5 text-sm">
//                 <span className="text-gray-400">Current: </span>
//                 <span className="text-gray-800 font-medium">
//                   {applicant.current_role.designation}
//                 </span>
//                 {applicant.current_role.company && (
//                   <span className="text-gray-600">
//                     {" "}
//                     {applicant.current_role.company}
//                   </span>
//                 )}
//                 {applicant.current_role.duration_label && (
//                   <span className="text-gray-400">
//                     {" "}
//                     · {applicant.current_role.duration_label}
//                   </span>
//                 )}
//               </div>
//             )}

//             {skillNames.length > 0 ? (
//               <div className="mt-2 text-sm text-gray-700 leading-relaxed">
//                 <span className="text-gray-400">Skills: </span>
//                 {visibleSkills.map((skill, i) => (
//                   <React.Fragment key={i}>
//                     <SkillChip
//                       label={skill}
//                       highlighted={jobSkillTerms?.some(
//                         (t) => t.toLowerCase() === skill.toLowerCase(),
//                       )}
//                     />
//                     {i < visibleSkills.length - 1 && ", "}
//                   </React.Fragment>
//                 ))}
//                 {extraSkillsCount > 0 && (
//                   <button
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       onCardClick(applicant);
//                     }}
//                     className="ml-1 text-purple-600 font-medium hover:underline"
//                   >
//                     +{extraSkillsCount} More
//                   </button>
//                 )}
//               </div>
//             ) : (
//               <div className="mt-2 text-sm text-gray-400 italic">
//                 No skills added
//               </div>
//             )}

//             {applicant.preferred_locations?.length > 0 && (
//               <div className="mt-2 text-sm">
//                 <span className="text-gray-400">Pref. location: </span>
//                 <span className="text-gray-700">
//                   {applicant.preferred_locations.join(", ")}
//                 </span>
//               </div>
//             )}

//             {applicant.education_label && (
//               <div className="mt-1 text-sm">
//                 <span className="text-gray-400">Education: </span>
//                 <span className="text-gray-700">
//                   <HighlightedText
//                     text={applicant.education_label}
//                     terms={jobSkillTerms}
//                   />
//                 </span>
//               </div>
//             )}

//             {/* Row 1: Comment / Move to / Favourite */}
//             <div
//               className="mt-3 flex items-center gap-4 text-xs text-gray-500"
//               onClick={stopPropagation}
//             >
//               <button
//                 className="flex items-center gap-1 hover:text-gray-700"
//                 onClick={() => onCommentClick(applicant)}
//               >
//                 <TbMessage size={14} /> Comment
//               </button>

//               {/* Individual Move To dropdown */}
//               <div className="relative" ref={moveToRef}>
//                 <button
//                   onClick={handleMoveToToggle}
//                   className="flex items-center gap-1 hover:text-gray-700"
//                 >
//                   <TbFolderSymlink size={14} /> Move to
//                   <TbChevronDown
//                     size={12}
//                     className={`transition-transform ${
//                       showMoveToMenu ? "rotate-180" : ""
//                     }`}
//                   />
//                 </button>

//                 {showMoveToMenu && (
//                   <div className="absolute left-0 bottom-full mb-2 w-52 bg-white border border-gray-200 rounded-lg shadow-lg z-[1000] py-1 max-h-64 overflow-y-auto">
//                     {statusOptionsLoading ? (
//                       <div className="px-3 py-3 flex items-center justify-center">
//                         <span className="inline-block w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
//                       </div>
//                     ) : statusOptions.length === 0 ? (
//                       <div className="px-3 py-2 text-xs text-gray-400">
//                         No statuses available
//                       </div>
//                     ) : (
//                       statusOptions.map((opt) => {
//                         const isCurrent =
//                           statusKey(applicant.status) === statusKey(opt.name);
//                         const isMoving = movingStatusId === opt.id;
//                         return (
//                           <button
//                             key={opt.id}
//                             onClick={(e) => handleMoveToSelect(e, opt)}
//                             disabled={isMoving}
//                             className={`w-full text-left px-3 py-2 text-xs capitalize flex items-center justify-between gap-2 hover:bg-purple-50 hover:text-purple-700 transition-colors disabled:opacity-50 ${
//                               isCurrent
//                                 ? "text-purple-600 font-medium bg-purple-50"
//                                 : "text-gray-700"
//                             }`}
//                           >
//                             <span>{opt.name}</span>
//                             {isMoving ? (
//                               <span className="inline-block w-3 h-3 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
//                             ) : (
//                               isCurrent && <TbCheck size={14} />
//                             )}
//                           </button>
//                         );
//                       })
//                     )}
//                   </div>
//                 )}
//               </div>

//               <button
//                 onClick={handleFavourite}
//                 className={`flex items-center gap-1 hover:text-gray-700 ${
//                   favourite ? "text-red-500" : ""
//                 }`}
//               >
//                 {favourite ? (
//                   <TbHeartFilled size={14} />
//                 ) : (
//                   <TbHeart size={14} />
//                 )}
//                 Favourite
//               </button>
//             </div>

//             {/* Row 2: Phone / Email / WhatsApp / SMS / Resume */}
//             <div
//               className="mt-3 pt-3 border-t border-gray-100 flex flex-wrap items-center gap-2"
//               onClick={stopPropagation}
//             >
//               {applicant.mobile && (
//                 <span className="flex items-center gap-1.5 text-xs font-medium text-gray-700 border border-gray-200 rounded-lg px-2.5 py-1.5">
//                   <TbPhone size={13} className="text-green-600" />
//                   {applicant.mobile}
//                   {applicant.mobile_verified && (
//                     <TbCircleCheck size={12} className="text-green-600" />
//                   )}
//                 </span>
//               )}

//               <a
//                 href={
//                   applicant.email && applicant.email !== "N/A"
//                     ? `mailto:${applicant.email}`
//                     : undefined
//                 }
//                 onClick={(e) => e.stopPropagation()}
//                 className="flex items-center gap-1 text-xs font-medium text-gray-600 border border-gray-200 rounded-lg px-2.5 py-1.5 hover:bg-gray-50 hover:text-purple-700 hover:border-purple-200 transition-colors"
//               >
//                 <TbMail size={13} /> Email
//               </a>

//               <button className="flex items-center gap-1 text-xs font-medium text-gray-400 border border-gray-100 rounded-lg px-2.5 py-1.5 cursor-not-allowed">
//                 <TbBrandWhatsapp size={13} /> WhatsApp
//               </button>

//               <button className="flex items-center gap-1 text-xs font-medium text-gray-600 border border-gray-200 rounded-lg px-2.5 py-1.5 hover:bg-gray-50 hover:text-purple-700 hover:border-purple-200 transition-colors">
//                 <TbMessageCircle size={13} /> SMS
//               </button>

//               <button
//                 onClick={handleResumeClick}
//                 disabled={resumeLoading}
//                 className="flex items-center gap-1 text-xs font-medium text-purple-600 border border-purple-200 rounded-lg px-2.5 py-1.5 hover:bg-purple-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 {resumeLoading ? (
//                   <span className="inline-block w-3 h-3 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
//                 ) : (
//                   <TbFileText size={13} />
//                 )}
//                 {resumeLoading ? "Loading..." : "Resume"}
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* ─────────────── RIGHT COLUMN — Profile Summary ─────────────── */}
//         <div className="w-full lg:w-80 shrink-0 lg:border-l lg:border-gray-100 lg:pl-5 flex flex-col gap-3">
//           <div
//             className="flex items-center justify-between gap-2"
//             onClick={stopPropagation}
//           >
//             <p className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
//               <TbNotes size={14} className="text-purple-500" />
//               Profile Summary
//             </p>
//             {applicant.linkedin_url && (
//               <a
//                 href={applicant.linkedin_url}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 onClick={(e) => e.stopPropagation()}
//                 className="flex items-center gap-1 text-xs font-medium text-blue-600 border border-gray-200 rounded-lg px-2.5 py-1 hover:bg-gray-50 shrink-0"
//               >
//                 <TbBrandLinkedin size={14} /> LinkedIn
//               </a>
//             )}
//           </div>

//           <div className="flex-1 bg-gray-50/70 border border-gray-100 rounded-xl p-3.5 flex flex-col">
//             {applicant.summary ? (
//               <>
//                 <p className="text-sm text-gray-600 leading-relaxed line-clamp-[9]">
//                   <HighlightedText
//                     text={applicant.summary}
//                     terms={jobSkillTerms}
//                   />
//                 </p>
//                 <button
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     onCardClick(applicant);
//                   }}
//                   className="text-xs text-purple-600 font-medium hover:underline mt-2 self-start"
//                 >
//                   Read full profile →
//                 </button>
//               </>
//             ) : (
//               <p className="text-sm text-gray-400 italic">
//                 No summary added by candidate yet
//               </p>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // ---------------------------------------------------------------------------
// // Main Component
// // ---------------------------------------------------------------------------
// export default function JobApplicants() {
//   const { id: jobId } = useParams();
//   const navigate = useNavigate();
//   const { showError, showSuccess } = useToast();
//   const { user } = useAuth();
//   const queryClient = useQueryClient();

//   const [searchTerm, setSearchTerm] = useState("");
//   const [filterStatus, setFilterStatus] = useState("all"); // always stored lowercase

//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage] = useState(6);

//   // Comment modal state
//   const [showCommentModal, setShowCommentModal] = useState(false);
//   const [selectedApplicant, setSelectedApplicant] = useState(null);
//   const [selectedApplicationId, setSelectedApplicationId] = useState(null);
//   const [commentLoading, setCommentLoading] = useState(false);

//   // Multi-select state
//   const [selectedApplicants, setSelectedApplicants] = useState(new Set());
//   const [showBulkMoveDropdown, setShowBulkMoveDropdown] = useState(false);
//   const bulkMoveDropdownRef = useRef(null);

//   const applicantsQueryKey = ["applicants", jobId];

//   // ─── Query: company users → { id: email } map ──────────────────
//   const companyUsersQuery = useQuery({
//     queryKey: ["companyUsers"],
//     queryFn: async () => {
//       const result = await applicantsApiService.getCompanyUsers();
//       const list = result?.data || result || [];
//       const map = {};
//       list.forEach((u) => {
//         const id = u.id || u.company_user_id;
//         const email = u.email || u.company_user_email;
//         if (id && email) map[id] = email;
//       });
//       return { list, map };
//     },
//     staleTime: 5 * 60 * 1000,
//   });
//   const userMap = companyUsersQuery.data?.map || {};

//   // ─── Query: resolve the logged-in user's company_user id ───────
//   const companyUserIdQuery = useQuery({
//     queryKey: ["companyUserId", user?.email, user?.id],
//     queryFn: async () => {
//       const list = companyUsersQuery.data?.list || [];
//       const cu = list.find(
//         (u) =>
//           u.email?.toLowerCase() === user.email?.toLowerCase() ||
//           u.id === user.id,
//       );
//       return cu ? cu.id : user.id;
//     },
//     enabled: !!user?.email && !!companyUsersQuery.data,
//     staleTime: 5 * 60 * 1000,
//   });
//   const companyUserId = companyUserIdQuery.data ?? user?.id ?? null;

//   // ─── Query: application statuses (folders) ──────────────────────
//   const statusOptionsQuery = useQuery({
//     queryKey: ["applicationStatuses"],
//     queryFn: async () => {
//       const result = await applicantsApiService.getApplicationStatuses();
//       // The API returns { data: { total_records, data: [...] } }
//       let list = result?.data?.data || result?.data || result || [];
//       // If list is still an object with a 'data' property, drill one more level
//       if (list && !Array.isArray(list) && list.data) {
//         list = list.data;
//       }
//       // Ensure we have an array
//       return Array.isArray(list) ? list : [];
//     },
//     staleTime: 10 * 60 * 1000,
//   });
//   const statusOptions = statusOptionsQuery.data || [];
//   const statusOptionsLoading = statusOptionsQuery.isLoading;

//   // ─── Query: job details for header ──────────────────────────────
//   const jobDetailsQuery = useQuery({
//     queryKey: ["jobDetails", jobId],
//     queryFn: async () => {
//       const result = await applicantsApiService.getJobById(jobId);
//       return resolveJobRecord(result, jobId);
//     },
//     enabled: !!jobId,
//     staleTime: 2 * 60 * 1000,
//   });
//   const jobDetails = jobDetailsQuery.data || null;
//   const jobLoading = jobDetailsQuery.isLoading;

//   // ─── Query: applicants (candidate applications + job-application status) ─
//   const applicantsQuery = useQuery({
//     queryKey: applicantsQueryKey,
//     queryFn: async () => {
//       const result = await applicantsApiService.getApplicantsByJobId(jobId);
//       let rawList = [];
//       if (Array.isArray(result)) rawList = result;
//       else if (Array.isArray(result?.data)) rawList = result.data;
//       else if (Array.isArray(result?.data?.applications))
//         rawList = result.data.applications;
//       else if (Array.isArray(result?.applications))
//         rawList = result.applications;
//       else if (Array.isArray(result?.data?.candidates))
//         rawList = result.data.candidates;

//       let jobApps = [];
//       try {
//         const jobAppsResult =
//           await applicantsApiService.getJobApplicationsByJobId(jobId);
//         jobApps = jobAppsResult?.data || jobAppsResult || [];
//       } catch (err) {
//         console.warn("Could not fetch job applications, falling back.", err);
//       }

//       return transformApplicants(rawList, jobApps, jobId);
//     },
//     enabled: !!jobId,
//     staleTime: 30 * 1000,
//   });

//   // Backfill missing status_id with the "pending" status once statuses load,
//   // without mutating the cache directly (kept as a derived value).
//   const applicants = useMemo(() => {
//     const list = applicantsQuery.data || [];
//     if (statusOptions.length === 0) return list;
//     const pendingStatus = statusOptions.find(
//       (s) => statusKey(s.name) === "pending",
//     );
//     if (!pendingStatus) return list;
//     return list.map((a) =>
//       a.status_id === null ? { ...a, status_id: pendingStatus.id } : a,
//     );
//   }, [applicantsQuery.data, statusOptions]);

//   const loading = applicantsQuery.isLoading;
//   const loadError = applicantsQuery.error?.message || null;

//   const fetchApplicants = () => {
//     queryClient.invalidateQueries({ queryKey: applicantsQueryKey });
//   };

//   useEffect(() => {
//     setCurrentPage(1);
//   }, [searchTerm, filterStatus]);

//   // ─── Close dropdown on outside click ──────────────────────────
//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (
//         bulkMoveDropdownRef.current &&
//         !bulkMoveDropdownRef.current.contains(e.target)
//       ) {
//         setShowBulkMoveDropdown(false);
//       }
//     };
//     if (showBulkMoveDropdown) {
//       document.addEventListener("mousedown", handleClickOutside);
//     }
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, [showBulkMoveDropdown]);

//   // Helper to patch the applicants cache in place (optimistic updates)
//   const patchApplicantsCache = (updater) => {
//     queryClient.setQueryData(applicantsQueryKey, (old) =>
//       old ? updater(old) : old,
//     );
//   };

//   const getValidJobApplicationId = async (candidateId) => {
//     try {
//       const result = await applicantsApiService.getJobApplicationByCandidate(
//         jobId,
//         candidateId,
//       );
//       const apps = result?.data || result || [];
//       if (apps.length > 0) {
//         return apps[0].id;
//       }
//       const fullResult =
//         await applicantsApiService.getJobApplicationsByJobId(jobId);
//       const allApps = fullResult?.data || fullResult || [];
//       const found = allApps.find(
//         (app) =>
//           app.candidate_id === candidateId ||
//           app.Candidate?.id === candidateId ||
//           app.candidateId === candidateId,
//       );
//       return found?.id || null;
//     } catch (err) {
//       console.error("Error fetching job application ID:", err);
//       return null;
//     }
//   };

//   // ─── Mutation: mark viewed on card click ────────────────────────
//   const markViewedMutation = useMutation({
//     mutationFn: ({ applicationId }) =>
//       applicantsApiService.updateApplicationStatus(
//         applicationId,
//         VIEWED_STATUS_ID,
//       ),
//     onSuccess: (_data, { applicationId }) => {
//       patchApplicantsCache((old) =>
//         old.map((a) =>
//           a.application_id === applicationId
//             ? { ...a, status: "viewed" }
//             : a,
//         ),
//       );
//       showSuccess("Application marked as Viewed");
//     },
//     onError: (error) => {
//       console.error("Failed to update application status:", error);
//     },
//   });

//   // ─── Handle card click ──────────────────────────────────────────
//   const handleCardClick = async (applicant) => {
//     if (!applicant.candidate_id) {
//       showError("Candidate ID missing");
//       return;
//     }
//     if (applicant.application_id) {
//       markViewedMutation.mutate({ applicationId: applicant.application_id });
//     }
//     navigate(`/jobs/${jobId}/applicants/${applicant.candidate_id}`);
//   };

//   // ─── Resume opener ──────────────────────────────────────────
//   const handleOpenResume = async (candidateId) => {
//     try {
//       const result =
//         await applicantsApiService.getCandidateFullProfile(candidateId);
//       const data = result?.data || result;
//       const resume = data?.candidate_resumes;
//       if (!resume || !resume.resume_file) {
//         showError("No resume available");
//         return;
//       }
//       const resumeId = resume.id;
//       if (!resumeId) {
//         showError("Resume ID not found");
//         return;
//       }

//       let cid = null;
//       if (user?.id) {
//         try {
//           const companiesResult = await applicantsApiService.getCompanies();
//           const companies =
//             companiesResult.data || companiesResult.results || companiesResult || [];
//           const found = companies.find(
//             (c) => c.CompanyUser?.company_user_id === user.id,
//           );
//           if (found) cid = found.id;
//         } catch (_) {}
//       }
//       if (!cid) {
//         showError("Company ID not found.");
//         return;
//       }

//       const userId = user?.id || null;
//       await applicantsApiService.logResumeDownload({
//         candidate_resume_id: resumeId,
//         company_id: cid,
//         downloaded_by: userId,
//         created_by: userId,
//         updated_by: userId,
//       });
//       const resumeUrl = resume.resume_file.startsWith("http")
//         ? resume.resume_file
//         : `${API_BASE_URL}${resume.resume_file}`;
//       window.open(resumeUrl, "_blank");
//     } catch (error) {
//       console.error("Error opening resume:", error);
//       showError("Failed to load resume");
//     }
//   };

//   // ─── Comment handlers ──────────────────────────────────────────
//   const handleCommentClick = async (applicant) => {
//     setSelectedApplicant(applicant);
//     if (applicant.candidate_id) {
//       const appId = await getValidJobApplicationId(applicant.candidate_id);
//       setSelectedApplicationId(appId);
//     } else {
//       setSelectedApplicationId(null);
//     }
//     setShowCommentModal(true);
//   };

//   const handleCommentClose = () => {
//     setShowCommentModal(false);
//     setSelectedApplicant(null);
//     setSelectedApplicationId(null);
//   };

//   const postCommentMutation = useMutation({
//     mutationFn: (payload) => applicantsApiService.postApplicationNote(payload),
//   });

//   const handleCommentSubmit = async (commentText) => {
//     if (!selectedApplicant) return;
//     if (!commentText.trim()) {
//       showError("Please enter a comment");
//       return;
//     }

//     let appId = selectedApplicationId;
//     if (!appId) {
//       appId = await getValidJobApplicationId(selectedApplicant.candidate_id);
//       if (!appId) {
//         showError("Could not find application for this candidate.");
//         return;
//       }
//     }

//     const creatorId = companyUserId || user?.id;
//     if (!creatorId) {
//       showError("User not authenticated.");
//       return;
//     }

//     setCommentLoading(true);
//     try {
//       await postCommentMutation.mutateAsync({
//         note: commentText.trim(),
//         is_status: true,
//         is_trending: false,
//         created_by: creatorId,
//         updated_by: creatorId,
//         application_id: appId,
//         company_user_id: creatorId,
//       });
//       showSuccess("Comment added successfully");
//       handleCommentClose();
//       handleCommentClick(selectedApplicant);
//     } catch (error) {
//       console.error("Error posting comment:", error);
//       showError(`Failed to add comment: ${error.message}`);
//     } finally {
//       setCommentLoading(false);
//     }
//   };

//   // ─── Individual Move to status mutation ─────────────────────────
//   const moveToStatusMutation = useMutation({
//     mutationFn: async ({ applicant, statusOption }) => {
//       let jobAppId = applicant.job_application_id;
//       if (!jobAppId && applicant.candidate_id) {
//         jobAppId = await getValidJobApplicationId(applicant.candidate_id);
//       }
//       if (!jobAppId) throw new Error("Job application ID missing");

//       await applicantsApiService.updateJobApplicationStatus(
//         jobAppId,
//         statusOption.id,
//       );

//       const fallbackOldStatusId =
//         applicant.status_id ??
//         statusOptions.find((s) => statusKey(s.name) === "pending")?.id ??
//         statusOptions[0]?.id ??
//         null;

//       try {
//         await applicantsApiService.postApplicationLog({
//           job_id: applicant.job_id || Number(jobId),
//           job_applications_id: jobAppId,
//           old_status_id: fallbackOldStatusId,
//           new_status_id: statusOption.id,
//           created_by: companyUserId ?? user?.id ?? null,
//           remarks: null,
//         });
//       } catch (logError) {
//         console.warn(
//           "Application log POST failed for individual move:",
//           logError,
//         );
//       }

//       return { jobAppId };
//     },
//     onMutate: async ({ applicant, statusOption }) => {
//       const previous = queryClient.getQueryData(applicantsQueryKey);
//       const matches = (a) =>
//         (applicant.application_id != null &&
//           a.application_id === applicant.application_id) ||
//         (applicant.job_application_id != null &&
//           a.job_application_id === applicant.job_application_id) ||
//         (applicant.candidate_id != null &&
//           a.candidate_id === applicant.candidate_id);
//       patchApplicantsCache((old) =>
//         old.map((a) =>
//           matches(a)
//             ? { ...a, status: statusKey(statusOption.name), status_id: statusOption.id }
//             : a,
//         ),
//       );
//       return { previous };
//     },
//     onError: (error, _vars, context) => {
//       console.error("Failed to move applicant status:", error);
//       if (context?.previous) {
//         queryClient.setQueryData(applicantsQueryKey, context.previous);
//       }
//       showError("Failed to update status");
//     },
//     onSuccess: (_data, { statusOption }) => {
//       showSuccess(`Moved to "${statusOption.name}"`);
//     },
//   });

//   const handleMoveToStatus = async (applicant, statusOption) => {
//     if (!statusOption?.id) {
//       showError("Invalid status selected");
//       return;
//     }
//     await moveToStatusMutation.mutateAsync({ applicant, statusOption });
//   };

//   // ─── Bulk Move mutation ──────────────────────────────────────────
//   const bulkMoveMutation = useMutation({
//     onMutate: (selectedFolder) => {
//       const previous = queryClient.getQueryData(applicantsQueryKey);
//       const targetIds = new Set(selectedApplicants);
//       patchApplicantsCache((old) =>
//         old.map((a) =>
//           targetIds.has(a.application_id || a.candidate_id)
//             ? {
//                 ...a,
//                 status: statusKey(selectedFolder.name),
//                 status_id: selectedFolder.id,
//               }
//             : a,
//         ),
//       );
//       return { previous };
//     },
//     mutationFn: async (selectedFolder) => {
//       const selectedApplicantObjects = Array.from(selectedApplicants)
//         .map((id) =>
//           applicants.find(
//             (a) => a.application_id === id || a.candidate_id === id,
//           ),
//         )
//         .filter(Boolean);

//       if (selectedApplicantObjects.length === 0) {
//         throw new Error("No valid applicants selected.");
//       }

//       const createdBy = companyUserId ?? user?.id;
//       if (!createdBy) {
//         throw new Error("You must be logged in to move applicants.");
//       }

//       const resolvedJobId =
//         selectedApplicantObjects.find((a) => a.job_id)?.job_id ??
//         Number(jobId);

//       let jobAppsById = {};
//       try {
//         const allJobAppsRes =
//           await applicantsApiService.getJobApplicationsByJobId(resolvedJobId);
//         const jobAppsList = allJobAppsRes?.data || allJobAppsRes || [];
//         jobAppsById = jobAppsList.reduce((acc, rec) => {
//           if (rec && rec.id) {
//             acc[rec.id] = {
//               status_id:
//                 rec.ApplicationStatus?.id ?? rec.application_statuses_id ?? null,
//               candidate_id: rec.candidate_id ?? rec.Candidate?.id ?? null,
//             };
//           }
//           return acc;
//         }, {});
//       } catch (e) {
//         console.warn(
//           "Could not fetch job-applications list for status resolution:",
//           e,
//         );
//       }

//       let totalMoved = 0;
//       let totalFailed = 0;

//       for (const applicant of selectedApplicantObjects) {
//         try {
//           if (!applicant.job_application_id) {
//             const foundId = await getValidJobApplicationId(
//               applicant.candidate_id,
//             );
//             if (foundId) applicant.job_application_id = foundId;
//           }

//           const jobAppId = applicant.job_application_id;
//           if (!jobAppId) {
//             console.warn(
//               "Skipping applicant without job_application_id:",
//               applicant,
//             );
//             totalFailed++;
//             continue;
//           }

//           let oldStatusId =
//             jobAppsById[jobAppId]?.status_id ?? applicant.status_id ?? null;
//           if (oldStatusId == null) {
//             const pending = statusOptions.find(
//               (s) => statusKey(s.name) === "pending",
//             );
//             oldStatusId = pending?.id ?? statusOptions[0]?.id ?? null;
//           }
//           if (oldStatusId == null) {
//             throw new Error("Could not determine old status ID");
//           }

//           await applicantsApiService.updateJobApplicationStatus(
//             jobAppId,
//             selectedFolder.id,
//           );

//           try {
//             await applicantsApiService.postApplicationLog({
//               job_id: resolvedJobId,
//               job_applications_id: jobAppId,
//               old_status_id: oldStatusId,
//               new_status_id: selectedFolder.id,
//               created_by: createdBy,
//               remarks: null,
//             });
//           } catch (logErr) {
//             console.warn(
//               "Failed to post application log for",
//               jobAppId,
//               logErr,
//             );
//           }

//           totalMoved++;
//         } catch (err) {
//           console.error(
//             "[BulkMove] Failed to update applicant:",
//             applicant,
//             err,
//           );
//           totalFailed++;
//         }
//       }

//       return { totalMoved, totalFailed, selectedFolder };
//     },
//     onSuccess: ({ totalMoved, totalFailed, selectedFolder }) => {
//       if (totalMoved > 0) {
//         const folderLabel =
//           selectedFolder.name.charAt(0).toUpperCase() +
//           selectedFolder.name.slice(1);
//         const msg =
//           totalFailed === 0
//             ? `${totalMoved} applicant(s) moved to "${folderLabel}" successfully.`
//             : `⚠️ ${totalMoved} moved, ${totalFailed} failed.`;
//         showSuccess(msg);
//       } else {
//         showError("Failed to move any applicants.");
//       }
//       setSelectedApplicants(new Set());
//       fetchApplicants();
//     },
//     onError: (error, _selectedFolder, context) => {
//       console.error("[BulkMove] Unexpected error:", error);
//       if (context?.previous) {
//         queryClient.setQueryData(applicantsQueryKey, context.previous);
//       }
//       showError(error.message || "An unexpected error occurred. Please try again.");
//     },
//   });

//   const handleBulkMove = (selectedFolder) => {
//     if (bulkMoveMutation.isPending) return;
//     if (selectedApplicants.size === 0) {
//       showError("No applicants selected.");
//       return;
//     }
//     if (!selectedFolder?.id) {
//       showError("Please select a destination folder.");
//       return;
//     }
//     setShowBulkMoveDropdown(false);
//     bulkMoveMutation.mutate(selectedFolder);
//   };

//   const bulkActionLoading = bulkMoveMutation.isPending;

//   // ─── Selection handlers ──────────────────────────────────────────
//   const toggleSelectApplicant = (applicantId) => {
//     setSelectedApplicants((prev) => {
//       const newSet = new Set(prev);
//       if (newSet.has(applicantId)) {
//         newSet.delete(applicantId);
//       } else {
//         newSet.add(applicantId);
//       }
//       return newSet;
//     });
//   };

//   const toggleSelectAll = () => {
//     const visibleIds = currentApplicants
//       .map((a) => a.application_id || a.candidate_id)
//       .filter((id) => id);

//     if (
//       selectedApplicants.size === visibleIds.length &&
//       visibleIds.length > 0
//     ) {
//       setSelectedApplicants(new Set());
//     } else {
//       setSelectedApplicants(new Set(visibleIds));
//     }
//   };

//   const clearSelection = () => {
//     setSelectedApplicants(new Set());
//   };

//   // ─── Status counts for folders (case-insensitive) ────────────────
//   const statusCounts = useMemo(() => {
//     const counts = { all: applicants.length };
//     statusOptions.forEach((s) => {
//       counts[statusKey(s.name)] = applicants.filter(
//         (a) => statusKey(a.status) === statusKey(s.name),
//       ).length;
//     });
//     return counts;
//   }, [applicants, statusOptions]);

//   // Folders shown in the top filter bar: any status coming back from the
//   // API automatically appears here (nothing hardcoded), and any folder
//   // with zero applicants is hidden until it actually has some.
//   const visibleStatusFolders = useMemo(
//     () => statusOptions.filter((s) => (statusCounts[statusKey(s.name)] || 0) > 0),
//     [statusOptions, statusCounts],
//   );

//   // If the currently selected folder just emptied out (e.g. the last
//   // applicant in it was moved elsewhere), fall back to "All" instead of
//   // showing a filter with a folder that no longer exists.
//   useEffect(() => {
//     if (filterStatus === "all") return;
//     const stillVisible = visibleStatusFolders.some(
//       (s) => statusKey(s.name) === filterStatus,
//     );
//     if (!stillVisible && !loading) setFilterStatus("all");
//   }, [visibleStatusFolders, filterStatus, loading]);

//   // ─── Filtering & Pagination (status compared case-insensitively) ─
//   const filteredApplicants = useMemo(() => {
//     return applicants.filter((a) => {
//       const matchesSearch =
//         a.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         a.email.toLowerCase().includes(searchTerm.toLowerCase());
//       const matchesFilter =
//         filterStatus === "all" || statusKey(a.status) === statusKey(filterStatus);
//       return matchesSearch && matchesFilter;
//     });
//   }, [applicants, searchTerm, filterStatus]);

//   const totalItems = filteredApplicants.length;
//   const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const endIndex = startIndex + itemsPerPage;
//   const currentApplicants = filteredApplicants.slice(startIndex, endIndex);

//   const isAllSelected = () => {
//     const visibleIds = currentApplicants
//       .map((a) => a.application_id || a.candidate_id)
//       .filter((id) => id);
//     return (
//       visibleIds.length > 0 &&
//       visibleIds.every((id) => selectedApplicants.has(id))
//     );
//   };

//   const goToPage = (page) =>
//     setCurrentPage(Math.max(1, Math.min(page, totalPages)));

//   // ─── Job header derived values ──────────────────────────────────
//   const jobSalaryRange = jobDetails?.salary_confidential
//     ? "Confidential"
//     : jobDetails?.salary_min || jobDetails?.salary_max
//       ? `${formatSalaryLac(jobDetails.salary_min) || "—"} - ${
//           formatSalaryLac(jobDetails.salary_max) || "—"
//         }`
//       : null;

//   const jobExperienceRange =
//     jobDetails?.experience_type === "fresher"
//       ? "Fresher"
//       : jobDetails?.experience_min != null || jobDetails?.experience_max != null
//         ? `${jobDetails.experience_min ?? 0}-${jobDetails.experience_max ?? 0} yrs`
//         : null;

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
//         {/* ─── Header ──────────────────────────────────────────── */}
//         <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
//           <div className="flex items-start gap-3">
//             <button
//               onClick={() => navigate(-1)}
//               className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors shrink-0 mt-0.5"
//               aria-label="Go back"
//             >
//               <TbArrowLeft size={18} />
//             </button>
//             <div>
//               <div className="flex items-center gap-2 flex-wrap">
//                 <h1 className="text-2xl font-bold text-gray-900">
//                   {jobLoading
//                     ? "Loading job..."
//                     : jobDetails?.title || `Job #${jobId}`}
//                 </h1>
//                 {jobDetails?.job_status && (
//                   <StatusBadge status={jobDetails.job_status} />
//                 )}
//               </div>

//               <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
//                 {jobDetails?.Company?.company_name && (
//                   <span className="flex items-center gap-1">
//                     <TbBuildingSkyscraper size={14} />
//                     {jobDetails.Company.company_name}
//                   </span>
//                 )}
//                 {jobExperienceRange && (
//                   <span className="flex items-center gap-1">
//                     <TbBriefcase size={14} />
//                     {jobExperienceRange}
//                   </span>
//                 )}
//                 {jobSalaryRange && (
//                   <span className="flex items-center gap-1">
//                     <TbCurrencyRupee size={14} />
//                     {jobSalaryRange}
//                   </span>
//                 )}
//                 {jobDetails?.WorkplaceType?.name && (
//                   <span className="flex items-center gap-1">
//                     <TbMapPin size={14} />
//                     {jobDetails.WorkplaceType.name}
//                   </span>
//                 )}
//                 {jobDetails?.JobType?.name && (
//                   <span className="flex items-center gap-1">
//                     <TbFolder size={14} />
//                     {jobDetails.JobType.name}
//                   </span>
//                 )}
//                 {jobDetails?.expiry_date && (
//                   <span className="flex items-center gap-1">
//                     <TbCalendarDue size={14} />
//                     Expires {formatDate(jobDetails.expiry_date)}
//                   </span>
//                 )}
//               </div>

//               <p className="text-sm text-gray-500 mt-1">
//                 {totalItems} {totalItems === 1 ? "applicant" : "applicants"}
//               </p>

//               {/* Select All row */}
//               <div className="flex items-center gap-3 mt-2">
//                 <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
//                   <input
//                     type="checkbox"
//                     checked={isAllSelected()}
//                     onChange={toggleSelectAll}
//                     className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
//                   />
//                   <span className="font-medium">
//                     {selectedApplicants.size > 0
//                       ? `${selectedApplicants.size} selected`
//                       : "Select All"}
//                   </span>
//                 </label>
//                 {selectedApplicants.size > 0 && (
//                   <button
//                     onClick={clearSelection}
//                     className="text-xs text-gray-400 hover:text-gray-600"
//                   >
//                     Clear
//                   </button>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* ─── Status Folders ────────────────────────────────────── */}
//         <div className="mb-6 bg-white border border-gray-200 rounded-xl shadow-sm">
//           <div className="flex items-center gap-0.5 overflow-x-auto px-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
//             <button
//               onClick={() => setFilterStatus("all")}
//               className="group relative flex items-center gap-2 px-4 py-3.5 text-sm font-medium whitespace-nowrap transition-colors shrink-0"
//             >
//               <TbUsers
//                 size={15}
//                 className={
//                   filterStatus === "all"
//                     ? "text-purple-600"
//                     : "text-gray-400 group-hover:text-gray-500"
//                 }
//               />
//               <span
//                 className={
//                   filterStatus === "all"
//                     ? "text-gray-900"
//                     : "text-gray-500 group-hover:text-gray-700"
//                 }
//               >
//                 All
//               </span>
//               <span
//                 className={`inline-flex items-center justify-center min-w-[22px] h-[22px] px-1.5 rounded-md text-[11px] font-semibold tabular-nums ${
//                   filterStatus === "all"
//                     ? "bg-purple-600 text-white"
//                     : "bg-gray-100 text-gray-500 group-hover:bg-gray-200"
//                 }`}
//               >
//                 {statusCounts.all}
//               </span>
//               <span
//                 className={`absolute left-2 right-2 -bottom-px h-[2.5px] rounded-full transition-opacity ${
//                   filterStatus === "all"
//                     ? "bg-purple-600 opacity-100"
//                     : "opacity-0"
//                 }`}
//               />
//             </button>

//             {visibleStatusFolders.map((status) => {
//               const key = statusKey(status.name);
//               const isActive = filterStatus === key;
//               const dot = statusColor(status.name).dot;
//               return (
//                 <button
//                   key={status.id}
//                   onClick={() => setFilterStatus(key)}
//                   className="group relative flex items-center gap-2 px-4 py-3.5 text-sm font-medium whitespace-nowrap transition-colors shrink-0"
//                 >
//                   <span className={`w-2 h-2 rounded-full shrink-0 ${dot}`} />
//                   <span
//                     className={
//                       isActive
//                         ? "text-gray-900"
//                         : "text-gray-500 group-hover:text-gray-700"
//                     }
//                   >
//                     {status.name.charAt(0).toUpperCase() + status.name.slice(1)}
//                   </span>
//                   <span
//                     className={`inline-flex items-center justify-center min-w-[22px] h-[22px] px-1.5 rounded-md text-[11px] font-semibold tabular-nums ${
//                       isActive
//                         ? "bg-purple-600 text-white"
//                         : "bg-gray-100 text-gray-500 group-hover:bg-gray-200"
//                     }`}
//                   >
//                     {statusCounts[key] || 0}
//                   </span>
//                   <span
//                     className={`absolute left-2 right-2 -bottom-px h-[2.5px] rounded-full transition-opacity ${
//                       isActive ? "bg-purple-600 opacity-100" : "opacity-0"
//                     }`}
//                   />
//                 </button>
//               );
//             })}
//           </div>
//         </div>

//         {/* ─── Filters ───────────────────────────────────────────── */}
//         <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 shadow-sm">
//           <div className="flex flex-col sm:flex-row gap-3">
//             <div className="flex-1 relative">
//               <TbSearch
//                 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
//                 size={18}
//               />
//               <input
//                 type="text"
//                 placeholder="Search applicants by name or email..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500"
//               />
//             </div>
//             <div className="flex gap-2">
//               <select
//                 value={filterStatus}
//                 onChange={(e) => setFilterStatus(statusKey(e.target.value))}
//                 className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 bg-white"
//               >
//                 <option value="all">All Status</option>
//                 {statusOptions.map((s) => (
//                   <option key={s.id} value={statusKey(s.name)}>
//                     {s.name.charAt(0).toUpperCase() + s.name.slice(1)}
//                   </option>
//                 ))}
//               </select>
//               <button
//                 onClick={fetchApplicants}
//                 className="px-3 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition-colors"
//               >
//                 <TbRefresh
//                   size={18}
//                   className={`text-gray-500 ${loading ? "animate-spin" : ""}`}
//                 />
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* ─── Bulk Action Bar ────────────────────────────────────── */}
//         {selectedApplicants.size > 0 && (
//           <div
//             className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50
//               bg-white rounded-2xl shadow-2xl border border-gray-200
//               px-6 py-4 flex items-center gap-4
//               animate-in slide-in-from-bottom-4 duration-300"
//             style={{ minWidth: 320 }}
//           >
//             <div className="flex items-center gap-2">
//               <span className="flex items-center justify-center w-6 h-6 rounded-full bg-purple-100 text-purple-700 text-xs font-bold">
//                 {selectedApplicants.size}
//               </span>
//               <span className="text-sm font-semibold text-gray-700 whitespace-nowrap">
//                 Applicant{selectedApplicants.size > 1 ? "s" : ""} Selected
//               </span>
//             </div>

//             <div className="h-8 w-px bg-gray-200 shrink-0" />

//             <div className="relative" ref={bulkMoveDropdownRef}>
//               <button
//                 onClick={() =>
//                   !bulkActionLoading && setShowBulkMoveDropdown((v) => !v)
//                 }
//                 disabled={bulkActionLoading}
//                 className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold
//                   text-white bg-purple-600 rounded-lg hover:bg-purple-700
//                   active:bg-purple-800 transition-colors
//                   disabled:opacity-60 disabled:cursor-not-allowed
//                   focus:outline-none focus:ring-2 focus:ring-purple-500/40"
//               >
//                 {bulkActionLoading ? (
//                   <span className="inline-block w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
//                 ) : (
//                   <TbFolderSymlink size={15} />
//                 )}
//                 {bulkActionLoading ? "Moving..." : "Move to Folder"}
//                 <TbChevronDown
//                   size={13}
//                   className={`transition-transform duration-200 ${
//                     showBulkMoveDropdown ? "rotate-180" : ""
//                   }`}
//                 />
//               </button>

//               {showBulkMoveDropdown && (
//                 <div
//                   role="listbox"
//                   className="absolute bottom-full mb-2 left-0 w-56
//                     bg-white border border-gray-200 rounded-xl shadow-2xl
//                     z-[1100] py-1.5 overflow-y-auto"
//                   style={{ maxHeight: 260 }}
//                 >
//                   <div className="px-3 py-1.5 border-b border-gray-100 mb-1">
//                     <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
//                       Move to folder
//                     </p>
//                   </div>

//                   {statusOptionsLoading ? (
//                     <div className="px-3 py-4 flex items-center justify-center">
//                       <span className="inline-block w-5 h-5 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
//                     </div>
//                   ) : statusOptions.length === 0 ? (
//                     <div className="px-3 py-3 text-xs text-gray-400 text-center">
//                       No folders available
//                     </div>
//                   ) : (
//                     statusOptions.map((opt) => {
//                       const allInThisStatus = Array.from(selectedApplicants)
//                         .map((id) =>
//                           applicants.find(
//                             (a) => (a.application_id || a.candidate_id) === id,
//                           ),
//                         )
//                         .filter(Boolean)
//                         .every((a) => statusKey(a.status) === statusKey(opt.name));

//                       return (
//                         <button
//                           key={opt.id}
//                           role="option"
//                           aria-selected={allInThisStatus}
//                           onClick={() => handleBulkMove(opt)}
//                           className={`w-full text-left px-3 py-2.5 text-sm capitalize
//                             flex items-center justify-between gap-2
//                             hover:bg-purple-50 hover:text-purple-700
//                             transition-colors rounded-md mx-0
//                             ${
//                               allInThisStatus
//                                 ? "text-purple-600 font-semibold bg-purple-50/60"
//                                 : "text-gray-700"
//                             }`}
//                         >
//                           <span className="flex items-center gap-2">
//                             <TbFolder
//                               size={14}
//                               className="shrink-0 text-current opacity-70"
//                             />
//                             {opt.name.charAt(0).toUpperCase() +
//                               opt.name.slice(1)}
//                           </span>
//                           {allInThisStatus && (
//                             <TbCheck
//                               size={14}
//                               className="shrink-0 text-purple-600"
//                             />
//                           )}
//                         </button>
//                       );
//                     })
//                   )}
//                 </div>
//               )}
//             </div>

//             <button
//               onClick={() => {
//                 clearSelection();
//                 setShowBulkMoveDropdown(false);
//               }}
//               disabled={bulkActionLoading}
//               className="text-sm text-gray-400 hover:text-gray-600
//                 transition-colors disabled:opacity-50 disabled:cursor-not-allowed
//                 whitespace-nowrap"
//             >
//               Cancel
//             </button>
//           </div>
//         )}

//         {/* ─── Content ────────────────────────────────────────────── */}
//         {loading ? (
//           <div className="text-center py-12">
//             <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-purple-600 border-t-transparent"></div>
//             <p className="mt-2 text-gray-500 text-sm">Loading applicants...</p>
//           </div>
//         ) : loadError ? (
//           <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
//             <p className="text-red-500 font-medium">
//               Failed to load applicants
//             </p>
//             <p className="text-sm text-gray-400 mt-1">{loadError}</p>
//             <button
//               onClick={fetchApplicants}
//               className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors"
//             >
//               <TbRefresh size={16} /> Try again
//             </button>
//           </div>
//         ) : filteredApplicants.length === 0 ? (
//           <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
//             <TbUsers size={48} className="mx-auto text-gray-300 mb-3" />
//             <p className="text-gray-500">No applicants found</p>
//             <p className="text-sm text-gray-400 mt-1">
//               Try adjusting your search or filters
//             </p>
//           </div>
//         ) : (
//           <>
//             <div className="flex flex-col gap-4">
//               {currentApplicants.map((applicant) => (
//                 <CandidateCard
//                   key={applicant.application_id || applicant.candidate_id}
//                   applicant={applicant}
//                   onCardClick={handleCardClick}
//                   onToggleFavourite={() => {}}
//                   onOpenResume={handleOpenResume}
//                   onCommentClick={handleCommentClick}
//                   statusOptions={statusOptions}
//                   statusOptionsLoading={statusOptionsLoading}
//                   onMoveTo={handleMoveToStatus}
//                   isSelected={selectedApplicants.has(
//                     applicant.application_id || applicant.candidate_id,
//                   )}
//                   onSelectToggle={() =>
//                     toggleSelectApplicant(
//                       applicant.application_id || applicant.candidate_id,
//                     )
//                   }
//                   showCheckbox={true}
//                 />
//               ))}
//             </div>

//             {totalPages > 1 && (
//               <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white rounded-xl border border-gray-200 px-4 py-3 shadow-sm">
//                 <div className="text-sm text-gray-500">
//                   Showing{" "}
//                   <span className="font-medium text-gray-700">
//                     {startIndex + 1}
//                   </span>{" "}
//                   to{" "}
//                   <span className="font-medium text-gray-700">
//                     {Math.min(endIndex, totalItems)}
//                   </span>{" "}
//                   of{" "}
//                   <span className="font-medium text-gray-700">
//                     {totalItems}
//                   </span>{" "}
//                   applicants
//                 </div>
//                 <div className="flex items-center gap-1">
//                   <button
//                     onClick={() => goToPage(1)}
//                     disabled={currentPage === 1}
//                     className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//                   >
//                     <TbChevronsLeft size={16} />
//                   </button>
//                   <button
//                     onClick={() => goToPage(currentPage - 1)}
//                     disabled={currentPage === 1}
//                     className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//                   >
//                     <TbChevronLeft size={16} />
//                   </button>
//                   <span className="px-3 text-sm text-gray-600">
//                     Page {currentPage} of {totalPages}
//                   </span>
//                   <button
//                     onClick={() => goToPage(currentPage + 1)}
//                     disabled={currentPage === totalPages}
//                     className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//                   >
//                     <TbChevronRight size={16} />
//                   </button>
//                   <button
//                     onClick={() => goToPage(totalPages)}
//                     disabled={currentPage === totalPages}
//                     className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//                   >
//                     <TbChevronsRight size={16} />
//                   </button>
//                 </div>
//               </div>
//             )}
//           </>
//         )}
//       </div>

//       {/* ─── Comment Modal ────────────────────────────────────────── */}
//       <CommentSection
//         isOpen={showCommentModal}
//         applicant={selectedApplicant}
//         applicationId={selectedApplicationId}
//         onClose={handleCommentClose}
//         onSubmit={handleCommentSubmit}
//         loading={commentLoading}
//         currentUserId={companyUserId}
//         userMap={userMap}
//       />
//     </div>
//   );
// }

import React, { useState, useEffect, useMemo, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  TbArrowLeft,
  TbMail,
  TbPhone,
  TbCalendar,
  TbSearch,
  TbRefresh,
  TbBriefcase,
  TbFolder,
  TbChevronLeft,
  TbChevronRight,
  TbChevronsLeft,
  TbChevronsRight,
  TbChevronDown,
  TbCheck,
  TbUsers,
  TbCircleCheck,
  TbBuildingSkyscraper,
  TbMapPin,
  TbCurrencyRupee,
  TbFileText,
  TbBrandLinkedin,
  TbBrandWhatsapp,
  TbMessage,
  TbFolderSymlink,
  TbHeart,
  TbHeartFilled,
  TbMessageCircle,
  TbClock,
  TbSparkles,
  TbNotes,
  TbCalendarDue,
} from "react-icons/tb";
import { useToast } from "../../context/ToastContext";
import { useAuth } from "../../context/AuthContext";
import { API_BASE_URL } from "../../config/api";
import CommentSection from "../../pages/JobListing/CommentSection";

const VIEWED_STATUS_ID = 3;
const APPLICATION_STATUSES_URL =
  "https://hire-me-jobs.onrender.com/application-statuses";

// API service – all endpoints used in this component
const applicantsApiService = {
  getApplicantsByJobId: async (jobId) => {
    const response = await fetch(
      `${API_BASE_URL}/candidate-profile-job-application?job_id=${jobId}`,
    );
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
  },

  getCandidateFullProfile: async (candidateId) => {
    const response = await fetch(
      `${API_BASE_URL}/candidate-full-profile/${candidateId}`,
    );
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
  },

  logResumeDownload: async (data) => {
    const response = await fetch(`${API_BASE_URL}/resume-download-logs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
  },

  updateApplicationStatus: async (applicationId, statusId) => {
    const response = await fetch(
      `${API_BASE_URL}/candidate-profile-job-application/${applicationId}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ application_statuses_id: statusId }),
      },
    );
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
  },

  updateJobApplicationStatus: async (jobApplicationId, statusId) => {
    const response = await fetch(
      `${API_BASE_URL}/job-applications/${jobApplicationId}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ application_statuses_id: statusId }),
      },
    );
    if (!response.ok) {
      let msg = `HTTP error! status: ${response.status}`;
      try {
        const err = await response.json();
        if (err.message) msg = err.message;
      } catch (_) {}
      throw new Error(msg);
    }
    return response.json();
  },

  postApplicationLog: async (data) => {
    const response = await fetch(`${API_BASE_URL}/application-logs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      let msg = `HTTP error! status: ${response.status}`;
      try {
        const err = await response.json();
        if (err.message) msg = err.message;
      } catch (_) {}
      throw new Error(msg);
    }
    return response.json();
  },

  postApplicationNote: async (data) => {
    const response = await fetch(`${API_BASE_URL}/application-notes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      let errorMsg = `HTTP error! status: ${response.status}`;
      try {
        const errorData = await response.json();
        if (errorData.message) errorMsg = errorData.message;
      } catch (e) {}
      throw new Error(errorMsg);
    }
    return response.json();
  },

  getJobApplicationsByJobId: async (jobId) => {
    const response = await fetch(
      `${API_BASE_URL}/job-applications?job_id=${jobId}`,
    );
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
  },

  getJobApplicationByCandidate: async (jobId, candidateId) => {
    const response = await fetch(
      `${API_BASE_URL}/job-applications?job_id=${jobId}&candidate_id=${candidateId}`,
    );
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
  },

  getApplicationStatuses: async () => {
    const response = await fetch(APPLICATION_STATUSES_URL);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
  },

  getJobById: async (jobId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/jobs/${jobId}`);
      if (response.ok) return response.json();
    } catch (_) {}
    const listResponse = await fetch(`${API_BASE_URL}/jobs`);
    if (!listResponse.ok)
      throw new Error(`HTTP error! status: ${listResponse.status}`);
    return listResponse.json();
  },

  getCompanyUsers: async () => {
    const response = await fetch(`${API_BASE_URL}/company-users`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
  },

  getCompanies: async () => {
    const response = await fetch(`${API_BASE_URL}/companies`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
  },
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
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
  return `${a}${b}`.toUpperCase() || "?";
};

const formatMonthYear = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-IN", { month: "short", year: "numeric" });
};

const durationFromDates = (start, end) => {
  if (!start) return "";
  const startDate = new Date(start);
  const endDate = end ? new Date(end) : new Date();
  if (isNaN(startDate.getTime())) return "";
  let months =
    (endDate.getFullYear() - startDate.getFullYear()) * 12 +
    (endDate.getMonth() - startDate.getMonth());
  if (months < 0) months = 0;
  const years = Math.floor(months / 12);
  const remMonths = months % 12;
  if (years === 0) return `${remMonths}m`;
  if (remMonths === 0) return `${years}y`;
  return `${years}y ${remMonths}m`;
};

const formatSalaryLac = (amount) => {
  const num = Number(amount);
  if (!num || isNaN(num)) return null;
  const lac = num / 100000;
  return `₹ ${lac % 1 === 0 ? lac.toFixed(0) : lac.toFixed(1)} Lac`;
};

const isRecentlyApplied = (dateString, days = 3) => {
  if (!dateString) return false;
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return false;
  return (Date.now() - date.getTime()) / (1000 * 60 * 60 * 24) <= days;
};

// Normalize any status label to a lowercase, trimmed key
const statusKey = (val) => (val || "").toString().trim().toLowerCase();

const resolveCandidateBundle = (item) => {
  const person =
    item.candidate ||
    item.Candidate ||
    item.candidate_details ||
    item.applicant ||
    item;
  const bundle = item;
  return { person, bundle };
};

const resolveJobRecord = (result, jobId) => {
  if (!result) return null;
  const data = result.data ?? result;
  if (Array.isArray(data)) {
    return data.find((j) => String(j.id) === String(jobId)) || null;
  }
  if (data && typeof data === "object" && data.id) return data;
  return null;
};

// ---------------------------------------------------------------------------
// Transform: raw applicants + raw job-applications -> UI-ready applicant list
// ---------------------------------------------------------------------------
const transformApplicants = (rawList, jobApps, jobId) => {
  let jobAppsMapByCandidate = {};
  let jobAppsMapById = {};
  jobApps.forEach((app) => {
    const candidateId =
      app.candidate_id || app.candidateId || app.Candidate?.id;
    if (candidateId && app.id) {
      const info = {
        job_application_id: app.id,
        status_id: app.ApplicationStatus?.id ?? null,
        status_name: statusKey(app.ApplicationStatus?.name),
        job_id: app.job_id || app.Job?.id || Number(jobId),
      };
      jobAppsMapByCandidate[candidateId] = info;
      jobAppsMapById[app.id] = info;
    }
  });

  return rawList.map((item) => {
    const { person: c, bundle } = resolveCandidateBundle(item);
    const profile = bundle.candidate_profiles || {};

    const candidateId =
      item.candidate_id ??
      item.candidateId ??
      item.candidate_uuid ??
      c.candidate_id ??
      c.candidateId ??
      (c !== item ? c.id : undefined);

    let jobAppInfo = jobAppsMapById[item.id] || null;
    if (!jobAppInfo) {
      jobAppInfo = jobAppsMapByCandidate[candidateId] || null;
    }

    const jobAppId =
      jobAppInfo?.job_application_id || item.job_application_id || null;
    const statusId = jobAppInfo?.status_id ?? null;
    const statusName =
      jobAppInfo?.status_name ||
      statusKey(item.status) ||
      statusKey(c.status) ||
      "pending";

    const rawSkills = asList(
      bundle.candidate_skills || c.candidate_skills || item.candidate_skills,
    );
    const skillNames = rawSkills
      .map((s) => {
        if (typeof s === "string") return s;
        return s.skill_name || s.name || null;
      })
      .filter(Boolean);

    const experienceList = asList(
      bundle.candidate_experience ||
        c.candidate_experience ||
        item.candidate_experience,
    );
    const currentExp =
      experienceList.find((e) => e.is_current_company) || experienceList[0];
    const currentRole = currentExp
      ? {
          designation:
            currentExp.designation ||
            currentExp.job_title ||
            profile.headline ||
            "N/A",
          company: currentExp.company_name || "",
          duration_label: currentExp.start_date
            ? `${formatMonthYear(currentExp.start_date)} to ${
                currentExp.is_current_company
                  ? "Present"
                  : formatMonthYear(currentExp.end_date)
              } - ${durationFromDates(currentExp.start_date, currentExp.end_date)}`
            : "",
        }
      : profile.headline
        ? { designation: profile.headline, company: "", duration_label: "" }
        : null;

    const totalExperience =
      c.total_experience_label ||
      profile.total_experience_label ||
      (currentExp?.start_date
        ? durationFromDates(currentExp.start_date, currentExp.end_date)
        : "");

    const preferences =
      bundle.candidate_preferences ||
      c.candidate_preferences ||
      item.candidate_preferences ||
      {};
    const expectedSalaryLabel = formatSalaryLac(
      profile.expected_salary ??
        preferences?.preferred_salary ??
        currentExp?.salary,
    );
    const noticePeriod =
      asName(profile.notice_period_id, "") ||
      asName(preferences?.notice_period_id, "") ||
      (c.notice_period_days
        ? `${c.notice_period_days} days notice period`
        : "");
    const currentLocation =
      asName(profile.current_city_id, "") ||
      profile.current_address ||
      asName(c.city, "") ||
      asName(preferences?.preferred_city_id?.[0], "");
    const preferredLocations = asList(preferences?.preferred_city_id)
      .map((cty) => asName(cty))
      .filter((v) => v && v !== "N/A");

    const educationList = asList(
      bundle.candidate_education ||
        c.candidate_education ||
        item.candidate_education,
    );
    const latestEdu = educationList[0];
    const educationLabel = latestEdu
      ? `${asName(latestEdu.education_sub_category_id, latestEdu.education_type || "")}${
          latestEdu.college_name ? ` - ${latestEdu.college_name}` : ""
        }${latestEdu.passing_year ? `, ${latestEdu.passing_year}` : ""}`
      : "";

    const socialLinks = asList(
      bundle.candidate_social_links ||
        c.candidate_social_links ||
        item.candidate_social_links,
    );

    return {
      application_id: item.id || item.application_id,
      job_application_id: jobAppId,
      status_id: statusId,
      job_id: jobAppInfo?.job_id || Number(jobId),
      candidate_id: candidateId,
      first_name: c.first_name || "",
      last_name: c.last_name || "",
      full_name:
        `${c.first_name || ""} ${c.last_name || ""}`.trim() ||
        "Unnamed candidate",
      email: c.email || "N/A",
      mobile: c.mobile || "",
      mobile_verified: !!(c.mobile_verified || c.is_mobile_verified),
      email_verified: !!c.email_verified,
      profile_photo: c.profile_photo || profile.profile_photo || null,
      status: statusName,
      applied_at: item.applied_at || item.created_at || item.createdAt,
      updated_at: item.updated_at || item.updatedAt,
      is_newly_added: isRecentlyApplied(
        item.applied_at || item.created_at || item.createdAt,
      ),
      is_favourite: !!item.is_favourite,
      skills: skillNames,
      current_role: currentRole,
      total_experience: totalExperience,
      expected_salary_label: expectedSalaryLabel,
      notice_period: noticePeriod,
      current_location: currentLocation,
      preferred_locations: preferredLocations,
      education_label: educationLabel,
      summary: profile.career_summary || profile.headline || "",
      resume_url: c.resume_url || c.resume || "",
      linkedin_url:
        c.linkedin_url ||
        socialLinks.find(
          (l) => (l.social_type || "").toLowerCase() === "linkedin",
        )?.social_url ||
        "",
    };
  });
};

// ---------------------------------------------------------------------------
// Shared status → color palette
// ---------------------------------------------------------------------------
const STATUS_COLOR_MAP = {
  active: { badge: "bg-green-50 text-green-700 border-green-200", dot: "bg-green-500" },
  inactive: { badge: "bg-red-50 text-red-700 border-red-200", dot: "bg-red-500" },
  pending: { badge: "bg-amber-50 text-amber-700 border-amber-200", dot: "bg-amber-500" },
  shortlisted: { badge: "bg-blue-50 text-blue-700 border-blue-200", dot: "bg-blue-500" },
  rejected: { badge: "bg-red-50 text-red-700 border-red-200", dot: "bg-red-500" },
  viewed: { badge: "bg-purple-50 text-purple-700 border-purple-200", dot: "bg-purple-500" },
  interview: { badge: "bg-indigo-50 text-indigo-700 border-indigo-200", dot: "bg-indigo-500" },
  hired: { badge: "bg-emerald-50 text-emerald-700 border-emerald-200", dot: "bg-emerald-500" },
  draft: { badge: "bg-gray-50 text-gray-600 border-gray-200", dot: "bg-gray-400" },
  published: { badge: "bg-green-50 text-green-700 border-green-200", dot: "bg-green-500" },
  closed: { badge: "bg-red-50 text-red-700 border-red-200", dot: "bg-red-500" },
  expired: { badge: "bg-red-50 text-red-700 border-red-200", dot: "bg-red-500" },
};
const DEFAULT_STATUS_COLOR = { badge: "bg-gray-50 text-gray-700 border-gray-200", dot: "bg-gray-400" };
const statusColor = (status) => STATUS_COLOR_MAP[statusKey(status)] || DEFAULT_STATUS_COLOR;

// ---------------------------------------------------------------------------
// Reusable bits
// ---------------------------------------------------------------------------
const StatusBadge = ({ status }) => {
  const cls = statusColor(status).badge;
  return (
    <span
      className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${cls}`}
    >
      {status ? status.charAt(0).toUpperCase() + status.slice(1) : "Unknown"}
    </span>
  );
};

const HighlightedText = ({ text, terms = [] }) => {
  if (!text) return null;
  if (!terms.length) return <>{text}</>;
  const pattern = new RegExp(`(${terms.filter(Boolean).join("|")})`, "gi");
  const parts = text.split(pattern);
  return (
    <>
      {parts.map((part, i) =>
        terms.some((t) => t && t.toLowerCase() === part.toLowerCase()) ? (
          <mark key={i} className="bg-yellow-200 text-gray-900 rounded px-0.5">
            {part}
          </mark>
        ) : (
          <React.Fragment key={i}>{part}</React.Fragment>
        ),
      )}
    </>
  );
};

const SkillChip = ({ label, highlighted }) => (
  <span
    className={`text-sm ${
      highlighted
        ? "bg-yellow-200 text-gray-900 font-medium px-1 rounded"
        : "text-gray-700"
    }`}
  >
    {label}
  </span>
);

// ---------------------------------------------------------------------------
// CandidateCard Component
// ---------------------------------------------------------------------------
const CandidateCard = ({
  applicant,
  onCardClick,
  onToggleFavourite,
  jobSkillTerms,
  onOpenResume,
  onCommentClick,
  statusOptions = [],
  statusOptionsLoading = false,
  onMoveTo,
  isSelected = false,
  onSelectToggle = null,
  showCheckbox = false,
}) => {
  const [favourite, setFavourite] = useState(!!applicant.is_favourite);
  const [resumeLoading, setResumeLoading] = useState(false);
  const [showMoveToMenu, setShowMoveToMenu] = useState(false);
  const [movingStatusId, setMovingStatusId] = useState(null);
  const moveToRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (moveToRef.current && !moveToRef.current.contains(e.target)) {
        setShowMoveToMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleFavourite = (e) => {
    e.stopPropagation();
    setFavourite((f) => !f);
    onToggleFavourite && onToggleFavourite(applicant);
  };

  const handleResumeClick = async (e) => {
    e.stopPropagation();
    if (!applicant.candidate_id) return;
    setResumeLoading(true);
    await onOpenResume(applicant.candidate_id);
    setResumeLoading(false);
  };

  const handleMoveToToggle = (e) => {
    e.stopPropagation();
    setShowMoveToMenu((v) => !v);
  };

  const handleMoveToSelect = async (e, statusOption) => {
    e.stopPropagation();
    if (!onMoveTo) return;
    setMovingStatusId(statusOption.id);
    await onMoveTo(applicant, statusOption);
    setMovingStatusId(null);
    setShowMoveToMenu(false);
  };

  const stopPropagation = (e) => e.stopPropagation();

  const skillNames = applicant.skills || [];
  const visibleSkills = skillNames.slice(0, 8);
  const extraSkillsCount = skillNames.length - visibleSkills.length;

  // For individual move: exclude current status
  const otherStatuses = statusOptions.filter(
    (opt) => statusKey(opt.name) !== statusKey(applicant.status)
  );

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-purple-200 transition-all w-full overflow-visible">
      {/* Top meta bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-5 py-2.5 bg-gray-50 border-b border-gray-100 text-xs text-gray-500">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <TbCalendar size={13} />
            Applied on: {formatDate(applicant.applied_at)}
          </span>
          <span>
            Stage: <StatusBadge status={applicant.status} />
          </span>
        </div>
        {applicant.updated_at && (
          <span>Updated: {formatDate(applicant.updated_at)}</span>
        )}
      </div>

      <div
        className="flex flex-col lg:flex-row gap-5 p-5 cursor-pointer"
        onClick={() => onCardClick(applicant)}
      >
        {/* ─────────────── LEFT COLUMN ─────────────── */}
        <div className="flex-1 min-w-0 flex gap-2">
          {/* Checkbox */}
          {showCheckbox && (
            <div
              className="flex items-start pt-1"
              onClick={(e) => e.stopPropagation()}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={(e) => {
                  e.stopPropagation();
                  if (onSelectToggle) onSelectToggle();
                }}
                className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500 cursor-pointer mt-4"
              />
            </div>
          )}

          {/* Avatar */}
          <div
            className="shrink-0 w-14 h-14 rounded-full bg-purple-100 text-purple-700 font-semibold text-lg flex items-center justify-center overflow-hidden"
            onClick={(e) => {
              e.stopPropagation();
              onCardClick(applicant);
            }}
          >
            {applicant.profile_photo ? (
              <img
                src={applicant.profile_photo}
                alt={applicant.full_name}
                className="w-full h-full object-cover"
              />
            ) : (
              initials(applicant.first_name, applicant.last_name)
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onCardClick(applicant);
                }}
                className="text-base font-semibold text-gray-900 hover:text-purple-700 hover:underline"
              >
                {applicant.full_name}
              </button>
              {applicant.is_newly_added && (
                <span className="flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-200">
                  <TbSparkles size={12} />
                  Newly added
                </span>
              )}
              {applicant.email_verified && (
                <span className="flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  <TbCircleCheck size={12} />
                  Email verified
                </span>
              )}
            </div>

            <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
              {applicant.total_experience && (
                <span className="flex items-center gap-1">
                  <TbBriefcase size={13} />
                  {applicant.total_experience}
                </span>
              )}
              {applicant.expected_salary_label && (
                <span className="flex items-center gap-1">
                  <TbCurrencyRupee size={13} />
                  {applicant.expected_salary_label}
                </span>
              )}
              {applicant.notice_period && (
                <span className="flex items-center gap-1">
                  <TbClock size={13} />
                  {applicant.notice_period}
                </span>
              )}
              {applicant.current_location && (
                <span className="flex items-center gap-1">
                  <TbMapPin size={13} />
                  {applicant.current_location}
                </span>
              )}
            </div>

            {applicant.current_role && (
              <div className="mt-2.5 text-sm">
                <span className="text-gray-400">Current: </span>
                <span className="text-gray-800 font-medium">
                  {applicant.current_role.designation}
                </span>
                {applicant.current_role.company && (
                  <span className="text-gray-600">
                    {" "}
                    {applicant.current_role.company}
                  </span>
                )}
                {applicant.current_role.duration_label && (
                  <span className="text-gray-400">
                    {" "}
                    · {applicant.current_role.duration_label}
                  </span>
                )}
              </div>
            )}

            {skillNames.length > 0 ? (
              <div className="mt-2 text-sm text-gray-700 leading-relaxed">
                <span className="text-gray-400">Skills: </span>
                {visibleSkills.map((skill, i) => (
                  <React.Fragment key={i}>
                    <SkillChip
                      label={skill}
                      highlighted={jobSkillTerms?.some(
                        (t) => t.toLowerCase() === skill.toLowerCase(),
                      )}
                    />
                    {i < visibleSkills.length - 1 && ", "}
                  </React.Fragment>
                ))}
                {extraSkillsCount > 0 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onCardClick(applicant);
                    }}
                    className="ml-1 text-purple-600 font-medium hover:underline"
                  >
                    +{extraSkillsCount} More
                  </button>
                )}
              </div>
            ) : (
              <div className="mt-2 text-sm text-gray-400 italic">
                No skills added
              </div>
            )}

            {applicant.preferred_locations?.length > 0 && (
              <div className="mt-2 text-sm">
                <span className="text-gray-400">Pref. location: </span>
                <span className="text-gray-700">
                  {applicant.preferred_locations.join(", ")}
                </span>
              </div>
            )}

            {applicant.education_label && (
              <div className="mt-1 text-sm">
                <span className="text-gray-400">Education: </span>
                <span className="text-gray-700">
                  <HighlightedText
                    text={applicant.education_label}
                    terms={jobSkillTerms}
                  />
                </span>
              </div>
            )}

            {/* Row 1: Comment / Move to / Favourite */}
            <div
              className="mt-3 flex items-center gap-4 text-xs text-gray-500"
              onClick={stopPropagation}
            >
              <button
                className="flex items-center gap-1 hover:text-gray-700"
                onClick={() => onCommentClick(applicant)}
              >
                <TbMessage size={14} /> Comment
              </button>

              {/* Individual Move To dropdown */}
              <div className="relative" ref={moveToRef}>
                <button
                  onClick={handleMoveToToggle}
                  className="flex items-center gap-1 hover:text-gray-700"
                >
                  <TbFolderSymlink size={14} /> Move to
                  <TbChevronDown
                    size={12}
                    className={`transition-transform ${
                      showMoveToMenu ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {showMoveToMenu && (
                  <div className="absolute left-0 bottom-full mb-2 w-52 bg-white border border-gray-200 rounded-lg shadow-lg z-[1000] py-1 max-h-64 overflow-y-auto">
                    {statusOptionsLoading ? (
                      <div className="px-3 py-3 flex items-center justify-center">
                        <span className="inline-block w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
                      </div>
                    ) : otherStatuses.length === 0 ? (
                      <div className="px-3 py-2 text-xs text-gray-400">
                        No other statuses available
                      </div>
                    ) : (
                      otherStatuses.map((opt) => {
                        const isMoving = movingStatusId === opt.id;
                        return (
                          <button
                            key={opt.id}
                            onClick={(e) => handleMoveToSelect(e, opt)}
                            disabled={isMoving}
                            className="w-full text-left px-3 py-2 text-xs capitalize flex items-center justify-between gap-2 hover:bg-purple-50 hover:text-purple-700 transition-colors disabled:opacity-50 text-gray-700"
                          >
                            <span>{opt.name}</span>
                            {isMoving && (
                              <span className="inline-block w-3 h-3 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
                            )}
                          </button>
                        );
                      })
                    )}
                  </div>
                )}
              </div>

              <button
                onClick={handleFavourite}
                className={`flex items-center gap-1 hover:text-gray-700 ${
                  favourite ? "text-red-500" : ""
                }`}
              >
                {favourite ? (
                  <TbHeartFilled size={14} />
                ) : (
                  <TbHeart size={14} />
                )}
                Favourite
              </button>
            </div>

            {/* Row 2: Phone / Email / WhatsApp / SMS / Resume */}
            <div
              className="mt-3 pt-3 border-t border-gray-100 flex flex-wrap items-center gap-2"
              onClick={stopPropagation}
            >
              {applicant.mobile && (
                <span className="flex items-center gap-1.5 text-xs font-medium text-gray-700 border border-gray-200 rounded-lg px-2.5 py-1.5">
                  <TbPhone size={13} className="text-green-600" />
                  {applicant.mobile}
                  {applicant.mobile_verified && (
                    <TbCircleCheck size={12} className="text-green-600" />
                  )}
                </span>
              )}

              <a
                href={
                  applicant.email && applicant.email !== "N/A"
                    ? `mailto:${applicant.email}`
                    : undefined
                }
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1 text-xs font-medium text-gray-600 border border-gray-200 rounded-lg px-2.5 py-1.5 hover:bg-gray-50 hover:text-purple-700 hover:border-purple-200 transition-colors"
              >
                <TbMail size={13} /> Email
              </a>

              <button className="flex items-center gap-1 text-xs font-medium text-gray-400 border border-gray-100 rounded-lg px-2.5 py-1.5 cursor-not-allowed">
                <TbBrandWhatsapp size={13} /> WhatsApp
              </button>

              <button className="flex items-center gap-1 text-xs font-medium text-gray-600 border border-gray-200 rounded-lg px-2.5 py-1.5 hover:bg-gray-50 hover:text-purple-700 hover:border-purple-200 transition-colors">
                <TbMessageCircle size={13} /> SMS
              </button>

              <button
                onClick={handleResumeClick}
                disabled={resumeLoading}
                className="flex items-center gap-1 text-xs font-medium text-purple-600 border border-purple-200 rounded-lg px-2.5 py-1.5 hover:bg-purple-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {resumeLoading ? (
                  <span className="inline-block w-3 h-3 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <TbFileText size={13} />
                )}
                {resumeLoading ? "Loading..." : "Resume"}
              </button>
            </div>
          </div>
        </div>

        {/* ─────────────── RIGHT COLUMN — Profile Summary ─────────────── */}
        <div className="w-full lg:w-80 shrink-0 lg:border-l lg:border-gray-100 lg:pl-5 flex flex-col gap-3">
          <div
            className="flex items-center justify-between gap-2"
            onClick={stopPropagation}
          >
            <p className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              <TbNotes size={14} className="text-purple-500" />
              Profile Summary
            </p>
            {applicant.linkedin_url && (
              <a
                href={applicant.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1 text-xs font-medium text-blue-600 border border-gray-200 rounded-lg px-2.5 py-1 hover:bg-gray-50 shrink-0"
              >
                <TbBrandLinkedin size={14} /> LinkedIn
              </a>
            )}
          </div>

          <div className="flex-1 bg-gray-50/70 border border-gray-100 rounded-xl p-3.5 flex flex-col">
            {applicant.summary ? (
              <>
                <p className="text-sm text-gray-600 leading-relaxed line-clamp-[9]">
                  <HighlightedText
                    text={applicant.summary}
                    terms={jobSkillTerms}
                  />
                </p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onCardClick(applicant);
                  }}
                  className="text-xs text-purple-600 font-medium hover:underline mt-2 self-start"
                >
                  Read full profile →
                </button>
              </>
            ) : (
              <p className="text-sm text-gray-400 italic">
                No summary added by candidate yet
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------
export default function JobApplicants() {
  const { id: jobId } = useParams();
  const navigate = useNavigate();
  const { showError, showSuccess } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // always stored lowercase

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);

  // Comment modal state
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [selectedApplicationId, setSelectedApplicationId] = useState(null);
  const [commentLoading, setCommentLoading] = useState(false);

  // Multi-select state
  const [selectedApplicants, setSelectedApplicants] = useState(new Set());
  const [showBulkMoveDropdown, setShowBulkMoveDropdown] = useState(false);
  const bulkMoveDropdownRef = useRef(null);

  const applicantsQueryKey = ["applicants", jobId];

  // ─── Query: company users → { id: email } map ──────────────────
  const companyUsersQuery = useQuery({
    queryKey: ["companyUsers"],
    queryFn: async () => {
      const result = await applicantsApiService.getCompanyUsers();
      const list = result?.data || result || [];
      const map = {};
      list.forEach((u) => {
        const id = u.id || u.company_user_id;
        const email = u.email || u.company_user_email;
        if (id && email) map[id] = email;
      });
      return { list, map };
    },
    staleTime: 5 * 60 * 1000,
  });
  const userMap = companyUsersQuery.data?.map || {};

  // ─── Query: resolve the logged-in user's company_user id ───────
  const companyUserIdQuery = useQuery({
    queryKey: ["companyUserId", user?.email, user?.id],
    queryFn: async () => {
      const list = companyUsersQuery.data?.list || [];
      const cu = list.find(
        (u) =>
          u.email?.toLowerCase() === user.email?.toLowerCase() ||
          u.id === user.id,
      );
      return cu ? cu.id : user.id;
    },
    enabled: !!user?.email && !!companyUsersQuery.data,
    staleTime: 5 * 60 * 1000,
  });
  const companyUserId = companyUserIdQuery.data ?? user?.id ?? null;

  // ─── Query: application statuses (folders) ──────────────────────
  const statusOptionsQuery = useQuery({
    queryKey: ["applicationStatuses"],
    queryFn: async () => {
      const result = await applicantsApiService.getApplicationStatuses();
      // The API returns { data: { total_records, data: [...] } }
      let list = result?.data?.data || result?.data || result || [];
      // If list is still an object with a 'data' property, drill one more level
      if (list && !Array.isArray(list) && list.data) {
        list = list.data;
      }
      // Ensure we have an array
      return Array.isArray(list) ? list : [];
    },
    staleTime: 10 * 60 * 1000,
  });
  const statusOptions = statusOptionsQuery.data || [];
  const statusOptionsLoading = statusOptionsQuery.isLoading;

  // ─── Query: job details for header ──────────────────────────────
  const jobDetailsQuery = useQuery({
    queryKey: ["jobDetails", jobId],
    queryFn: async () => {
      const result = await applicantsApiService.getJobById(jobId);
      return resolveJobRecord(result, jobId);
    },
    enabled: !!jobId,
    staleTime: 2 * 60 * 1000,
  });
  const jobDetails = jobDetailsQuery.data || null;
  const jobLoading = jobDetailsQuery.isLoading;

  // ─── Query: applicants (candidate applications + job-application status) ─
  const applicantsQuery = useQuery({
    queryKey: applicantsQueryKey,
    queryFn: async () => {
      const result = await applicantsApiService.getApplicantsByJobId(jobId);
      let rawList = [];
      if (Array.isArray(result)) rawList = result;
      else if (Array.isArray(result?.data)) rawList = result.data;
      else if (Array.isArray(result?.data?.applications))
        rawList = result.data.applications;
      else if (Array.isArray(result?.applications))
        rawList = result.applications;
      else if (Array.isArray(result?.data?.candidates))
        rawList = result.data.candidates;

      let jobApps = [];
      try {
        const jobAppsResult =
          await applicantsApiService.getJobApplicationsByJobId(jobId);
        jobApps = jobAppsResult?.data || jobAppsResult || [];
      } catch (err) {
        console.warn("Could not fetch job applications, falling back.", err);
      }

      return transformApplicants(rawList, jobApps, jobId);
    },
    enabled: !!jobId,
    staleTime: 30 * 1000,
  });

  // Backfill missing status_id with the "pending" status once statuses load,
  // without mutating the cache directly (kept as a derived value).
  const applicants = useMemo(() => {
    const list = applicantsQuery.data || [];
    if (statusOptions.length === 0) return list;
    const pendingStatus = statusOptions.find(
      (s) => statusKey(s.name) === "pending",
    );
    if (!pendingStatus) return list;
    return list.map((a) =>
      a.status_id === null ? { ...a, status_id: pendingStatus.id } : a,
    );
  }, [applicantsQuery.data, statusOptions]);

  const loading = applicantsQuery.isLoading;
  const loadError = applicantsQuery.error?.message || null;

  const fetchApplicants = () => {
    queryClient.invalidateQueries({ queryKey: applicantsQueryKey });
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus]);

  // ─── Close dropdown on outside click ──────────────────────────
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        bulkMoveDropdownRef.current &&
        !bulkMoveDropdownRef.current.contains(e.target)
      ) {
        setShowBulkMoveDropdown(false);
      }
    };
    if (showBulkMoveDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showBulkMoveDropdown]);

  // Helper to patch the applicants cache in place (optimistic updates)
  const patchApplicantsCache = (updater) => {
    queryClient.setQueryData(applicantsQueryKey, (old) =>
      old ? updater(old) : old,
    );
  };

  const getValidJobApplicationId = async (candidateId) => {
    try {
      const result = await applicantsApiService.getJobApplicationByCandidate(
        jobId,
        candidateId,
      );
      const apps = result?.data || result || [];
      if (apps.length > 0) {
        return apps[0].id;
      }
      const fullResult =
        await applicantsApiService.getJobApplicationsByJobId(jobId);
      const allApps = fullResult?.data || fullResult || [];
      const found = allApps.find(
        (app) =>
          app.candidate_id === candidateId ||
          app.Candidate?.id === candidateId ||
          app.candidateId === candidateId,
      );
      return found?.id || null;
    } catch (err) {
      console.error("Error fetching job application ID:", err);
      return null;
    }
  };

  // ─── Mutation: mark viewed on card click ────────────────────────
  const markViewedMutation = useMutation({
    mutationFn: ({ applicationId }) =>
      applicantsApiService.updateApplicationStatus(
        applicationId,
        VIEWED_STATUS_ID,
      ),
    onSuccess: (_data, { applicationId }) => {
      patchApplicantsCache((old) =>
        old.map((a) =>
          a.application_id === applicationId
            ? { ...a, status: "viewed" }
            : a,
        ),
      );
      showSuccess("Application marked as Viewed");
    },
    onError: (error) => {
      console.error("Failed to update application status:", error);
    },
  });

  // ─── Handle card click ──────────────────────────────────────────
  const handleCardClick = async (applicant) => {
    if (!applicant.candidate_id) {
      showError("Candidate ID missing");
      return;
    }
    if (applicant.application_id) {
      markViewedMutation.mutate({ applicationId: applicant.application_id });
    }
    navigate(`/jobs/${jobId}/applicants/${applicant.candidate_id}`);
  };

  // ─── Resume opener ──────────────────────────────────────────
  const handleOpenResume = async (candidateId) => {
    try {
      const result =
        await applicantsApiService.getCandidateFullProfile(candidateId);
      const data = result?.data || result;
      const resume = data?.candidate_resumes;
      if (!resume || !resume.resume_file) {
        showError("No resume available");
        return;
      }
      const resumeId = resume.id;
      if (!resumeId) {
        showError("Resume ID not found");
        return;
      }

      let cid = null;
      if (user?.id) {
        try {
          const companiesResult = await applicantsApiService.getCompanies();
          const companies =
            companiesResult.data || companiesResult.results || companiesResult || [];
          const found = companies.find(
            (c) => c.CompanyUser?.company_user_id === user.id,
          );
          if (found) cid = found.id;
        } catch (_) {}
      }
      if (!cid) {
        showError("Company ID not found.");
        return;
      }

      const userId = user?.id || null;
      await applicantsApiService.logResumeDownload({
        candidate_resume_id: resumeId,
        company_id: cid,
        downloaded_by: userId,
        created_by: userId,
        updated_by: userId,
      });
      const resumeUrl = resume.resume_file.startsWith("http")
        ? resume.resume_file
        : `${API_BASE_URL}${resume.resume_file}`;
      window.open(resumeUrl, "_blank");
    } catch (error) {
      console.error("Error opening resume:", error);
      showError("Failed to load resume");
    }
  };

  // ─── Comment handlers ──────────────────────────────────────────
  const handleCommentClick = async (applicant) => {
    setSelectedApplicant(applicant);
    if (applicant.candidate_id) {
      const appId = await getValidJobApplicationId(applicant.candidate_id);
      setSelectedApplicationId(appId);
    } else {
      setSelectedApplicationId(null);
    }
    setShowCommentModal(true);
  };

  const handleCommentClose = () => {
    setShowCommentModal(false);
    setSelectedApplicant(null);
    setSelectedApplicationId(null);
  };

  const postCommentMutation = useMutation({
    mutationFn: (payload) => applicantsApiService.postApplicationNote(payload),
  });

  const handleCommentSubmit = async (commentText) => {
    if (!selectedApplicant) return;
    if (!commentText.trim()) {
      showError("Please enter a comment");
      return;
    }

    let appId = selectedApplicationId;
    if (!appId) {
      appId = await getValidJobApplicationId(selectedApplicant.candidate_id);
      if (!appId) {
        showError("Could not find application for this candidate.");
        return;
      }
    }

    const creatorId = companyUserId || user?.id;
    if (!creatorId) {
      showError("User not authenticated.");
      return;
    }

    setCommentLoading(true);
    try {
      await postCommentMutation.mutateAsync({
        note: commentText.trim(),
        is_status: true,
        is_trending: false,
        created_by: creatorId,
        updated_by: creatorId,
        application_id: appId,
        company_user_id: creatorId,
      });
      showSuccess("Comment added successfully");
      handleCommentClose();
      handleCommentClick(selectedApplicant);
    } catch (error) {
      console.error("Error posting comment:", error);
      showError(`Failed to add comment: ${error.message}`);
    } finally {
      setCommentLoading(false);
    }
  };

  // ─── Individual Move to status mutation ─────────────────────────
  const moveToStatusMutation = useMutation({
    mutationFn: async ({ applicant, statusOption }) => {
      let jobAppId = applicant.job_application_id;
      if (!jobAppId && applicant.candidate_id) {
        jobAppId = await getValidJobApplicationId(applicant.candidate_id);
      }
      if (!jobAppId) throw new Error("Job application ID missing");

      await applicantsApiService.updateJobApplicationStatus(
        jobAppId,
        statusOption.id,
      );

      const fallbackOldStatusId =
        applicant.status_id ??
        statusOptions.find((s) => statusKey(s.name) === "pending")?.id ??
        statusOptions[0]?.id ??
        null;

      try {
        await applicantsApiService.postApplicationLog({
          job_id: applicant.job_id || Number(jobId),
          job_applications_id: jobAppId,
          old_status_id: fallbackOldStatusId,
          new_status_id: statusOption.id,
          created_by: companyUserId ?? user?.id ?? null,
          remarks: null,
        });
      } catch (logError) {
        console.warn(
          "Application log POST failed for individual move:",
          logError,
        );
      }

      return { jobAppId };
    },
    onMutate: async ({ applicant, statusOption }) => {
      const previous = queryClient.getQueryData(applicantsQueryKey);
      const matches = (a) =>
        (applicant.application_id != null &&
          a.application_id === applicant.application_id) ||
        (applicant.job_application_id != null &&
          a.job_application_id === applicant.job_application_id) ||
        (applicant.candidate_id != null &&
          a.candidate_id === applicant.candidate_id);
      patchApplicantsCache((old) =>
        old.map((a) =>
          matches(a)
            ? { ...a, status: statusKey(statusOption.name), status_id: statusOption.id }
            : a,
        ),
      );
      return { previous };
    },
    onError: (error, _vars, context) => {
      console.error("Failed to move applicant status:", error);
      if (context?.previous) {
        queryClient.setQueryData(applicantsQueryKey, context.previous);
      }
      showError("Failed to update status");
    },
    onSuccess: (_data, { statusOption }) => {
      showSuccess(`Moved to "${statusOption.name}"`);
    },
  });

  const handleMoveToStatus = async (applicant, statusOption) => {
    if (!statusOption?.id) {
      showError("Invalid status selected");
      return;
    }
    await moveToStatusMutation.mutateAsync({ applicant, statusOption });
  };

  // ─── Bulk Move mutation ──────────────────────────────────────────
  const bulkMoveMutation = useMutation({
    onMutate: (selectedFolder) => {
      const previous = queryClient.getQueryData(applicantsQueryKey);
      const targetIds = new Set(selectedApplicants);
      patchApplicantsCache((old) =>
        old.map((a) =>
          targetIds.has(a.application_id || a.candidate_id)
            ? {
                ...a,
                status: statusKey(selectedFolder.name),
                status_id: selectedFolder.id,
              }
            : a,
        ),
      );
      return { previous };
    },
    mutationFn: async (selectedFolder) => {
      const selectedApplicantObjects = Array.from(selectedApplicants)
        .map((id) =>
          applicants.find(
            (a) => a.application_id === id || a.candidate_id === id,
          ),
        )
        .filter(Boolean);

      if (selectedApplicantObjects.length === 0) {
        throw new Error("No valid applicants selected.");
      }

      const createdBy = companyUserId ?? user?.id;
      if (!createdBy) {
        throw new Error("You must be logged in to move applicants.");
      }

      const resolvedJobId =
        selectedApplicantObjects.find((a) => a.job_id)?.job_id ??
        Number(jobId);

      let jobAppsById = {};
      try {
        const allJobAppsRes =
          await applicantsApiService.getJobApplicationsByJobId(resolvedJobId);
        const jobAppsList = allJobAppsRes?.data || allJobAppsRes || [];
        jobAppsById = jobAppsList.reduce((acc, rec) => {
          if (rec && rec.id) {
            acc[rec.id] = {
              status_id:
                rec.ApplicationStatus?.id ?? rec.application_statuses_id ?? null,
              candidate_id: rec.candidate_id ?? rec.Candidate?.id ?? null,
            };
          }
          return acc;
        }, {});
      } catch (e) {
        console.warn(
          "Could not fetch job-applications list for status resolution:",
          e,
        );
      }

      let totalMoved = 0;
      let totalFailed = 0;

      for (const applicant of selectedApplicantObjects) {
        try {
          if (!applicant.job_application_id) {
            const foundId = await getValidJobApplicationId(
              applicant.candidate_id,
            );
            if (foundId) applicant.job_application_id = foundId;
          }

          const jobAppId = applicant.job_application_id;
          if (!jobAppId) {
            console.warn(
              "Skipping applicant without job_application_id:",
              applicant,
            );
            totalFailed++;
            continue;
          }

          let oldStatusId =
            jobAppsById[jobAppId]?.status_id ?? applicant.status_id ?? null;
          if (oldStatusId == null) {
            const pending = statusOptions.find(
              (s) => statusKey(s.name) === "pending",
            );
            oldStatusId = pending?.id ?? statusOptions[0]?.id ?? null;
          }
          if (oldStatusId == null) {
            throw new Error("Could not determine old status ID");
          }

          await applicantsApiService.updateJobApplicationStatus(
            jobAppId,
            selectedFolder.id,
          );

          try {
            await applicantsApiService.postApplicationLog({
              job_id: resolvedJobId,
              job_applications_id: jobAppId,
              old_status_id: oldStatusId,
              new_status_id: selectedFolder.id,
              created_by: createdBy,
              remarks: null,
            });
          } catch (logErr) {
            console.warn(
              "Failed to post application log for",
              jobAppId,
              logErr,
            );
          }

          totalMoved++;
        } catch (err) {
          console.error(
            "[BulkMove] Failed to update applicant:",
            applicant,
            err,
          );
          totalFailed++;
        }
      }

      return { totalMoved, totalFailed, selectedFolder };
    },
    onSuccess: ({ totalMoved, totalFailed, selectedFolder }) => {
      if (totalMoved > 0) {
        const folderLabel =
          selectedFolder.name.charAt(0).toUpperCase() +
          selectedFolder.name.slice(1);
        const msg =
          totalFailed === 0
            ? `${totalMoved} applicant(s) moved to "${folderLabel}" successfully.`
            : `⚠️ ${totalMoved} moved, ${totalFailed} failed.`;
        showSuccess(msg);
      } else {
        showError("Failed to move any applicants.");
      }
      setSelectedApplicants(new Set());
      fetchApplicants();
    },
    onError: (error, _selectedFolder, context) => {
      console.error("[BulkMove] Unexpected error:", error);
      if (context?.previous) {
        queryClient.setQueryData(applicantsQueryKey, context.previous);
      }
      showError(error.message || "An unexpected error occurred. Please try again.");
    },
  });

  const handleBulkMove = (selectedFolder) => {
    if (bulkMoveMutation.isPending) return;
    if (selectedApplicants.size === 0) {
      showError("No applicants selected.");
      return;
    }
    if (!selectedFolder?.id) {
      showError("Please select a destination folder.");
      return;
    }
    setShowBulkMoveDropdown(false);
    bulkMoveMutation.mutate(selectedFolder);
  };

  const bulkActionLoading = bulkMoveMutation.isPending;

  // ─── Selection handlers ──────────────────────────────────────────
  const toggleSelectApplicant = (applicantId) => {
    setSelectedApplicants((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(applicantId)) {
        newSet.delete(applicantId);
      } else {
        newSet.add(applicantId);
      }
      return newSet;
    });
  };

  const toggleSelectAll = () => {
    const visibleIds = currentApplicants
      .map((a) => a.application_id || a.candidate_id)
      .filter((id) => id);

    if (
      selectedApplicants.size === visibleIds.length &&
      visibleIds.length > 0
    ) {
      setSelectedApplicants(new Set());
    } else {
      setSelectedApplicants(new Set(visibleIds));
    }
  };

  const clearSelection = () => {
    setSelectedApplicants(new Set());
  };

  // ─── Status counts for folders (case-insensitive) ────────────────
  const statusCounts = useMemo(() => {
    const counts = { all: applicants.length };
    statusOptions.forEach((s) => {
      counts[statusKey(s.name)] = applicants.filter(
        (a) => statusKey(a.status) === statusKey(s.name),
      ).length;
    });
    return counts;
  }, [applicants, statusOptions]);

  // Folders shown in the top filter bar: any status coming back from the
  // API automatically appears here (nothing hardcoded), and any folder
  // with zero applicants is hidden until it actually has some.
  const visibleStatusFolders = useMemo(
    () => statusOptions.filter((s) => (statusCounts[statusKey(s.name)] || 0) > 0),
    [statusOptions, statusCounts],
  );

  // If the currently selected folder just emptied out (e.g. the last
  // applicant in it was moved elsewhere), fall back to "All" instead of
  // showing a filter with a folder that no longer exists.
  useEffect(() => {
    if (filterStatus === "all") return;
    const stillVisible = visibleStatusFolders.some(
      (s) => statusKey(s.name) === filterStatus,
    );
    if (!stillVisible && !loading) setFilterStatus("all");
  }, [visibleStatusFolders, filterStatus, loading]);

  // ─── Filtering & Pagination (status compared case-insensitively) ─
  const filteredApplicants = useMemo(() => {
    return applicants.filter((a) => {
      const matchesSearch =
        a.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter =
        filterStatus === "all" || statusKey(a.status) === statusKey(filterStatus);
      return matchesSearch && matchesFilter;
    });
  }, [applicants, searchTerm, filterStatus]);

  const totalItems = filteredApplicants.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentApplicants = filteredApplicants.slice(startIndex, endIndex);

  const isAllSelected = () => {
    const visibleIds = currentApplicants
      .map((a) => a.application_id || a.candidate_id)
      .filter((id) => id);
    return (
      visibleIds.length > 0 &&
      visibleIds.every((id) => selectedApplicants.has(id))
    );
  };

  const goToPage = (page) =>
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));

  // ─── Job header derived values ──────────────────────────────────
  const jobSalaryRange = jobDetails?.salary_confidential
    ? "Confidential"
    : jobDetails?.salary_min || jobDetails?.salary_max
      ? `${formatSalaryLac(jobDetails.salary_min) || "—"} - ${
          formatSalaryLac(jobDetails.salary_max) || "—"
        }`
      : null;

  const jobExperienceRange =
    jobDetails?.experience_type === "fresher"
      ? "Fresher"
      : jobDetails?.experience_min != null || jobDetails?.experience_max != null
        ? `${jobDetails.experience_min ?? 0}-${jobDetails.experience_max ?? 0} yrs`
        : null;

  // ─── Compute bulk move options: exclude any status that any selected applicant is currently in ──
  const bulkMoveOptions = useMemo(() => {
    if (selectedApplicants.size === 0) return statusOptions;
    // Gather all status keys of selected applicants
    const selectedStatusKeys = new Set();
    selectedApplicants.forEach((id) => {
      const applicant = applicants.find(
        (a) => (a.application_id || a.candidate_id) === id,
      );
      if (applicant) {
        selectedStatusKeys.add(statusKey(applicant.status));
      }
    });
    // Filter out statuses that are currently held by at least one selected applicant
    return statusOptions.filter(
      (opt) => !selectedStatusKeys.has(statusKey(opt.name))
    );
  }, [selectedApplicants, statusOptions, applicants]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        {/* ─── Header ──────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
          <div className="flex items-start gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors shrink-0 mt-0.5"
              aria-label="Go back"
            >
              <TbArrowLeft size={18} />
            </button>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-bold text-gray-900">
                  {jobLoading
                    ? "Loading job..."
                    : jobDetails?.title || `Job #${jobId}`}
                </h1>
                {jobDetails?.job_status && (
                  <StatusBadge status={jobDetails.job_status} />
                )}
              </div>

              <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
                {jobDetails?.Company?.company_name && (
                  <span className="flex items-center gap-1">
                    <TbBuildingSkyscraper size={14} />
                    {jobDetails.Company.company_name}
                  </span>
                )}
                {jobExperienceRange && (
                  <span className="flex items-center gap-1">
                    <TbBriefcase size={14} />
                    {jobExperienceRange}
                  </span>
                )}
                {jobSalaryRange && (
                  <span className="flex items-center gap-1">
                    <TbCurrencyRupee size={14} />
                    {jobSalaryRange}
                  </span>
                )}
                {jobDetails?.WorkplaceType?.name && (
                  <span className="flex items-center gap-1">
                    <TbMapPin size={14} />
                    {jobDetails.WorkplaceType.name}
                  </span>
                )}
                {jobDetails?.JobType?.name && (
                  <span className="flex items-center gap-1">
                    <TbFolder size={14} />
                    {jobDetails.JobType.name}
                  </span>
                )}
                {jobDetails?.expiry_date && (
                  <span className="flex items-center gap-1">
                    <TbCalendarDue size={14} />
                    Expires {formatDate(jobDetails.expiry_date)}
                  </span>
                )}
              </div>

              <p className="text-sm text-gray-500 mt-1">
                {totalItems} {totalItems === 1 ? "applicant" : "applicants"}
              </p>

              {/* Select All row */}
              <div className="flex items-center gap-3 mt-2">
                <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isAllSelected()}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                  />
                  <span className="font-medium">
                    {selectedApplicants.size > 0
                      ? `${selectedApplicants.size} selected`
                      : "Select All"}
                  </span>
                </label>
                {selectedApplicants.size > 0 && (
                  <button
                    onClick={clearSelection}
                    className="text-xs text-gray-400 hover:text-gray-600"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ─── Status Folders ────────────────────────────────────── */}
        <div className="mb-6 bg-white border border-gray-200 rounded-xl shadow-sm">
          <div className="flex items-center gap-0.5 overflow-x-auto px-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <button
              onClick={() => setFilterStatus("all")}
              className="group relative flex items-center gap-2 px-4 py-3.5 text-sm font-medium whitespace-nowrap transition-colors shrink-0"
            >
              <TbUsers
                size={15}
                className={
                  filterStatus === "all"
                    ? "text-purple-600"
                    : "text-gray-400 group-hover:text-gray-500"
                }
              />
              <span
                className={
                  filterStatus === "all"
                    ? "text-gray-900"
                    : "text-gray-500 group-hover:text-gray-700"
                }
              >
                All
              </span>
              <span
                className={`inline-flex items-center justify-center min-w-[22px] h-[22px] px-1.5 rounded-md text-[11px] font-semibold tabular-nums ${
                  filterStatus === "all"
                    ? "bg-purple-600 text-white"
                    : "bg-gray-100 text-gray-500 group-hover:bg-gray-200"
                }`}
              >
                {statusCounts.all}
              </span>
              <span
                className={`absolute left-2 right-2 -bottom-px h-[2.5px] rounded-full transition-opacity ${
                  filterStatus === "all"
                    ? "bg-purple-600 opacity-100"
                    : "opacity-0"
                }`}
              />
            </button>

            {visibleStatusFolders.map((status) => {
              const key = statusKey(status.name);
              const isActive = filterStatus === key;
              const dot = statusColor(status.name).dot;
              return (
                <button
                  key={status.id}
                  onClick={() => setFilterStatus(key)}
                  className="group relative flex items-center gap-2 px-4 py-3.5 text-sm font-medium whitespace-nowrap transition-colors shrink-0"
                >
                  <span className={`w-2 h-2 rounded-full shrink-0 ${dot}`} />
                  <span
                    className={
                      isActive
                        ? "text-gray-900"
                        : "text-gray-500 group-hover:text-gray-700"
                    }
                  >
                    {status.name.charAt(0).toUpperCase() + status.name.slice(1)}
                  </span>
                  <span
                    className={`inline-flex items-center justify-center min-w-[22px] h-[22px] px-1.5 rounded-md text-[11px] font-semibold tabular-nums ${
                      isActive
                        ? "bg-purple-600 text-white"
                        : "bg-gray-100 text-gray-500 group-hover:bg-gray-200"
                    }`}
                  >
                    {statusCounts[key] || 0}
                  </span>
                  <span
                    className={`absolute left-2 right-2 -bottom-px h-[2.5px] rounded-full transition-opacity ${
                      isActive ? "bg-purple-600 opacity-100" : "opacity-0"
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* ─── Filters ───────────────────────────────────────────── */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <TbSearch
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search applicants by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(statusKey(e.target.value))}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 bg-white"
              >
                <option value="all">All Status</option>
                {statusOptions.map((s) => (
                  <option key={s.id} value={statusKey(s.name)}>
                    {s.name.charAt(0).toUpperCase() + s.name.slice(1)}
                  </option>
                ))}
              </select>
              <button
                onClick={fetchApplicants}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition-colors"
              >
                <TbRefresh
                  size={18}
                  className={`text-gray-500 ${loading ? "animate-spin" : ""}`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* ─── Bulk Action Bar ────────────────────────────────────── */}
        {selectedApplicants.size > 0 && (
          <div
            className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50
              bg-white rounded-2xl shadow-2xl border border-gray-200
              px-6 py-4 flex items-center gap-4
              animate-in slide-in-from-bottom-4 duration-300"
            style={{ minWidth: 320 }}
          >
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-purple-100 text-purple-700 text-xs font-bold">
                {selectedApplicants.size}
              </span>
              <span className="text-sm font-semibold text-gray-700 whitespace-nowrap">
                Applicant{selectedApplicants.size > 1 ? "s" : ""} Selected
              </span>
            </div>

            <div className="h-8 w-px bg-gray-200 shrink-0" />

            <div className="relative" ref={bulkMoveDropdownRef}>
              <button
                onClick={() =>
                  !bulkActionLoading && setShowBulkMoveDropdown((v) => !v)
                }
                disabled={bulkActionLoading}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold
                  text-white bg-purple-600 rounded-lg hover:bg-purple-700
                  active:bg-purple-800 transition-colors
                  disabled:opacity-60 disabled:cursor-not-allowed
                  focus:outline-none focus:ring-2 focus:ring-purple-500/40"
              >
                {bulkActionLoading ? (
                  <span className="inline-block w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <TbFolderSymlink size={15} />
                )}
                {bulkActionLoading ? "Moving..." : "Move to Folder"}
                <TbChevronDown
                  size={13}
                  className={`transition-transform duration-200 ${
                    showBulkMoveDropdown ? "rotate-180" : ""
                  }`}
                />
              </button>

              {showBulkMoveDropdown && (
                <div
                  role="listbox"
                  className="absolute bottom-full mb-2 left-0 w-56
                    bg-white border border-gray-200 rounded-xl shadow-2xl
                    z-[1100] py-1.5 overflow-y-auto"
                  style={{ maxHeight: 260 }}
                >
                  <div className="px-3 py-1.5 border-b border-gray-100 mb-1">
                    <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                      Move to folder
                    </p>
                  </div>

                  {statusOptionsLoading ? (
                    <div className="px-3 py-4 flex items-center justify-center">
                      <span className="inline-block w-5 h-5 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
                    </div>
                  ) : bulkMoveOptions.length === 0 ? (
                    <div className="px-3 py-3 text-xs text-gray-400 text-center">
                      All selected applicants already have every status? No new folder available.
                    </div>
                  ) : (
                    bulkMoveOptions.map((opt) => {
                      const allInThisStatus = Array.from(selectedApplicants)
                        .map((id) =>
                          applicants.find(
                            (a) => (a.application_id || a.candidate_id) === id,
                          ),
                        )
                        .filter(Boolean)
                        .every((a) => statusKey(a.status) === statusKey(opt.name));

                      return (
                        <button
                          key={opt.id}
                          role="option"
                          aria-selected={allInThisStatus}
                          onClick={() => handleBulkMove(opt)}
                          className={`w-full text-left px-3 py-2.5 text-sm capitalize
                            flex items-center justify-between gap-2
                            hover:bg-purple-50 hover:text-purple-700
                            transition-colors rounded-md mx-0
                            ${
                              allInThisStatus
                                ? "text-purple-600 font-semibold bg-purple-50/60"
                                : "text-gray-700"
                            }`}
                        >
                          <span className="flex items-center gap-2">
                            <TbFolder
                              size={14}
                              className="shrink-0 text-current opacity-70"
                            />
                            {opt.name.charAt(0).toUpperCase() +
                              opt.name.slice(1)}
                          </span>
                          {allInThisStatus && (
                            <TbCheck
                              size={14}
                              className="shrink-0 text-purple-600"
                            />
                          )}
                        </button>
                      );
                    })
                  )}
                </div>
              )}
            </div>

            <button
              onClick={() => {
                clearSelection();
                setShowBulkMoveDropdown(false);
              }}
              disabled={bulkActionLoading}
              className="text-sm text-gray-400 hover:text-gray-600
                transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                whitespace-nowrap"
            >
              Cancel
            </button>
          </div>
        )}

        {/* ─── Content ────────────────────────────────────────────── */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-purple-600 border-t-transparent"></div>
            <p className="mt-2 text-gray-500 text-sm">Loading applicants...</p>
          </div>
        ) : loadError ? (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
            <p className="text-red-500 font-medium">
              Failed to load applicants
            </p>
            <p className="text-sm text-gray-400 mt-1">{loadError}</p>
            <button
              onClick={fetchApplicants}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors"
            >
              <TbRefresh size={16} /> Try again
            </button>
          </div>
        ) : filteredApplicants.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
            <TbUsers size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">No applicants found</p>
            <p className="text-sm text-gray-400 mt-1">
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-4">
              {currentApplicants.map((applicant) => (
                <CandidateCard
                  key={applicant.application_id || applicant.candidate_id}
                  applicant={applicant}
                  onCardClick={handleCardClick}
                  onToggleFavourite={() => {}}
                  onOpenResume={handleOpenResume}
                  onCommentClick={handleCommentClick}
                  statusOptions={statusOptions}
                  statusOptionsLoading={statusOptionsLoading}
                  onMoveTo={handleMoveToStatus}
                  isSelected={selectedApplicants.has(
                    applicant.application_id || applicant.candidate_id,
                  )}
                  onSelectToggle={() =>
                    toggleSelectApplicant(
                      applicant.application_id || applicant.candidate_id,
                    )
                  }
                  showCheckbox={true}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white rounded-xl border border-gray-200 px-4 py-3 shadow-sm">
                <div className="text-sm text-gray-500">
                  Showing{" "}
                  <span className="font-medium text-gray-700">
                    {startIndex + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-medium text-gray-700">
                    {Math.min(endIndex, totalItems)}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium text-gray-700">
                    {totalItems}
                  </span>{" "}
                  applicants
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => goToPage(1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <TbChevronsLeft size={16} />
                  </button>
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <TbChevronLeft size={16} />
                  </button>
                  <span className="px-3 text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <TbChevronRight size={16} />
                  </button>
                  <button
                    onClick={() => goToPage(totalPages)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <TbChevronsRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* ─── Comment Modal ────────────────────────────────────────── */}
      <CommentSection
        isOpen={showCommentModal}
        applicant={selectedApplicant}
        applicationId={selectedApplicationId}
        onClose={handleCommentClose}
        onSubmit={handleCommentSubmit}
        loading={commentLoading}
        currentUserId={companyUserId}
        userMap={userMap}
      />
    </div>
  );
}