
// import React, { useState, useEffect, useMemo, useRef } from "react";
// import {
//   TbRefresh,
//   TbSearch,
//   TbCheck,
//   TbX,
//   TbChevronLeft,
//   TbChevronRight,
//   TbChevronsLeft,
//   TbChevronsRight,
//   TbBuildingSkyscraper,
//   TbDatabase,
//   TbArrowRight,
// } from "react-icons/tb";
// import { useToast } from "../../context/ToastContext";

// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://hire-me-jobs.onrender.com";

// const SubscriptionUsage = () => {
//   const { showError, showSuccess } = useToast();

//   // ─── State ──────────────────────────────────────────────────
//   const [allUsage, setAllUsage] = useState([]);
//   const [companySubscriptions, setCompanySubscriptions] = useState([]);
//   const [planFeaturesMap, setPlanFeaturesMap] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [showScrollHint, setShowScrollHint] = useState(true);

//   // Client-side pagination
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 10;

//   const scrollContainerRef = useRef(null);

//   // ─── Get company_id from localStorage ─────────────────────
//   const getCompanyId = () => {
//     try {
//       const storedUser = localStorage.getItem("user");
//       if (storedUser) {
//         const parsed = JSON.parse(storedUser);
//         if (parsed.Companies && parsed.Companies.length > 0) {
//           return parsed.Companies[0].company_id;
//         }
//       }
//       const storedCompanyId = localStorage.getItem("company_id");
//       if (storedCompanyId) {
//         return Number(storedCompanyId);
//       }
//     } catch (_) {}
//     return null;
//   };

//   const companyId = getCompanyId();

//   // ─── Helper: fetch with JSON check ──────────────────────
//   const fetchJson = async (url) => {
//     const response = await fetch(url);
//     if (!response.ok) {
//       throw new Error(`HTTP ${response.status}: ${response.statusText}`);
//     }
//     const text = await response.text();
//     if (text.trim().startsWith("<!DOCTYPE")) {
//       throw new Error("Server returned HTML instead of JSON. Please check the API URL.");
//     }
//     try {
//       return JSON.parse(text);
//     } catch (e) {
//       throw new Error("Invalid JSON response from server.");
//     }
//   };

//   // ─── 1. Fetch company subscriptions ──────────────────────
//   const fetchCompanySubscriptions = async () => {
//     try {
//       const result = await fetchJson(`${API_BASE_URL}/company-subscriptions`);
//       const list = result?.data || [];
//       setCompanySubscriptions(list);
//       return list;
//     } catch (err) {
//       console.error("Failed to fetch company subscriptions:", err);
//       return [];
//     }
//   };

//   // ─── 2. Fetch subscription plan features ──────────────────
//   const fetchPlanFeatures = async () => {
//     try {
//       const result = await fetchJson(`${API_BASE_URL}/subscription-plan-features`);
//       const list = result?.data || [];
//       const map = {};
//       list.forEach((item) => {
//         const planId = item.subscription_plan_id;
//         if (!map[planId]) map[planId] = [];
//         map[planId].push({
//           id: item.id,
//           feature_id: item.subscription_features_id,
//           feature_name: item.SubscriptionFeature?.feature_name || "Unknown Feature",
//           value: item.value,
//           value_type: item.value_type,
//           unit: item.unit,
//           display_value: item.display_value,
//           is_unlimited: item.is_unlimited,
//           status: item.status,
//         });
//       });
//       setPlanFeaturesMap(map);
//       return map;
//     } catch (err) {
//       console.error("Failed to fetch plan features:", err);
//       return {};
//     }
//   };

//   // ─── 3. Fetch ALL subscription usage (follow pagination) ──
//   const fetchAllUsage = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       let allData = [];
//       let nextUrl = `${API_BASE_URL}/subscription-usage?page=1&limit=100`;

//       while (nextUrl) {
//         const result = await fetchJson(nextUrl);
//         const dataList = result?.data || [];
//         allData = [...allData, ...dataList];

//         const links = result?.pagination?.links;
//         if (links && links.next) {
//           nextUrl = links.next;
//         } else {
//           nextUrl = null;
//         }
//       }

//       setAllUsage(allData);
//     } catch (err) {
//       setError(err.message || "Failed to load subscription usage.");
//       showError(err.message || "Failed to load subscription usage.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ─── Initial load ──────────────────────────────────────────
//   useEffect(() => {
//     if (!companyId) {
//       setLoading(false);
//       setError("No company associated with your account.");
//       return;
//     }
//     const init = async () => {
//       await fetchCompanySubscriptions();
//       await fetchPlanFeatures();
//       await fetchAllUsage();
//     };
//     init();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   // ─── Filter usage for the current company ────────────────
//   const companyUsage = useMemo(() => {
//     if (!companyId) return [];
//     return allUsage.filter((usage) => usage.company_id === companyId);
//   }, [allUsage, companyId]);

//   // ─── Enrich usage with subscription & feature details ──
//   const enrichedUsage = useMemo(() => {
//     return companyUsage.map((usage) => {
//       const subscription = companySubscriptions.find(
//         (sub) => sub.id === usage.company_subscription_id
//       );
//       const plan = subscription?.SubscriptionPlan;
//       const planFeatures = planFeaturesMap[plan?.subscription_plan_id] || [];
//       const feature = planFeatures.find(
//         (f) => f.feature_id === usage.subscription_features_id
//       );

//       return {
//         ...usage,
//         subscription,
//         plan,
//         feature,
//         plan_name: plan?.plan_name || "N/A",
//         feature_name: feature?.feature_name || usage.subscription_feature?.feature_name || "N/A",
//         feature_display_value: feature?.display_value || "N/A",
//         feature_is_unlimited: feature?.is_unlimited || false,
//         subscription_type: subscription?.subscription_type || "N/A",
//         subscription_status: subscription?.subscription_status || "N/A",
//         company_name: usage.Company?.company_name || "N/A",
//       };
//     });
//   }, [companyUsage, companySubscriptions, planFeaturesMap]);

//   // ─── Client‑side search ────────────────────────────────────
//   const filteredUsage = useMemo(() => {
//     if (!searchTerm.trim()) return enrichedUsage;
//     const term = searchTerm.toLowerCase().trim();
//     return enrichedUsage.filter((item) => {
//       const companyName = item.company_name.toLowerCase();
//       const planName = item.plan_name.toLowerCase();
//       const featureName = item.feature_name.toLowerCase();
//       return (
//         companyName.includes(term) ||
//         planName.includes(term) ||
//         featureName.includes(term)
//       );
//     });
//   }, [enrichedUsage, searchTerm]);

//   // ─── Client‑side pagination ────────────────────────────────
//   const totalItems = filteredUsage.length;
//   const totalPages = Math.ceil(totalItems / itemsPerPage);
//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
//   const currentItems = filteredUsage.slice(startIndex, endIndex);

//   const goToPage = (page) => {
//     if (page < 1 || page > totalPages) return;
//     setCurrentPage(page);
//   };

//   const handleRefresh = () => {
//     fetchAllUsage();
//   };

//   const handleTableScroll = (e) => {
//     if (e.target.scrollLeft > 8) {
//       setShowScrollHint(false);
//     }
//   };

//   // ─── Helpers ─────────────────────────────────────────────────
//   const formatDateTime = (dateStr) => {
//     if (!dateStr) return "—";
//     return new Date(dateStr).toLocaleString("en-IN", {
//       day: "2-digit",
//       month: "short",
//       year: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   };

//   const statusBadge = (isActive) => {
//     if (isActive) {
//       return (
//         <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold ring-1 ring-inset ring-emerald-200 whitespace-nowrap">
//           <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
//           Active
//         </span>
//       );
//     }
//     return (
//       <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-semibold ring-1 ring-inset ring-rose-200 whitespace-nowrap">
//         <span className="w-1.5 h-1.5 bg-rose-500 rounded-full" />
//         Inactive
//       </span>
//     );
//   };

//   const subscriptionStatusBadge = (status) => {
//     const s = status?.toLowerCase() || "";
//     const map = {
//       active: "bg-emerald-50 text-emerald-700 ring-emerald-200",
//       approved: "bg-emerald-50 text-emerald-700 ring-emerald-200",
//       pending: "bg-amber-50 text-amber-700 ring-amber-200",
//       expired: "bg-rose-50 text-rose-700 ring-rose-200",
//       cancelled: "bg-gray-100 text-gray-600 ring-gray-200",
//     };
//     const label =
//       s === "approved" ? "Active" : status ? status.charAt(0).toUpperCase() + status.slice(1) : "—";
//     const cls = map[s] || "bg-gray-100 text-gray-600 ring-gray-200";
//     return (
//       <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ring-1 ring-inset whitespace-nowrap ${cls}`}>
//         {label}
//       </span>
//     );
//   };

//   // ─── Render ─────────────────────────────────────────────────
//   if (loading) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
//         <div className="inline-block animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-4 border-purple-600 border-t-transparent"></div>
//         <p className="mt-4 text-gray-500 text-sm text-center">Loading subscription usage...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
//         <p className="text-red-500 font-medium">{error}</p>
//         <button
//           onClick={handleRefresh}
//           className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors"
//         >
//           <TbRefresh size={16} /> Retry
//         </button>
//       </div>
//     );
//   }

//   if (!companyId) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
//         <p className="text-yellow-600 font-medium">Company not found</p>
//         <p className="text-sm text-gray-400 mt-1">
//           Please ensure your account is linked to a company.
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
//       {/* ─── Header ──────────────────────────────────────────── */}
//       <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4 mb-5 sm:mb-6">
//         <div>
//           <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
//             <span className="p-2 bg-purple-50 rounded-xl">
//               <TbDatabase className="text-purple-600" size={20} />
//             </span>
//             Subscription Usage
//           </h1>
//           <p className="text-xs sm:text-sm text-gray-500 mt-1.5 ml-0.5">
//             Track your company's subscription feature usage
//           </p>
//         </div>
//         <button
//           onClick={handleRefresh}
//           className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-purple-600 text-white text-sm font-semibold rounded-lg hover:bg-purple-700 active:bg-purple-800 shadow-sm shadow-purple-200 transition-colors w-full sm:w-auto"
//         >
//           <TbRefresh size={16} /> Refresh
//         </button>
//       </div>

//       {/* ─── Card ──────────────────────────────────────── */}
//       <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
//         {/* Top bar */}
//         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 sm:px-6 py-4 border-b border-gray-100">
//           <div className="relative w-full sm:w-80">
//             <TbSearch size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
//             <input
//               type="text"
//               value={searchTerm}
//               onChange={(e) => {
//                 setSearchTerm(e.target.value);
//                 setCurrentPage(1);
//               }}
//               placeholder="Search by company, plan, or feature..."
//               className="w-full pl-10 pr-3 py-2.5 text-sm rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-300 transition-colors"
//             />
//           </div>
//           <div className="text-xs sm:text-sm text-gray-500 font-medium whitespace-nowrap">
//             {totalItems} total usage record{totalItems !== 1 ? "s" : ""}
//           </div>
//         </div>

//         {/* ─── Table (scrolls horizontally on smaller screens) ─────────── */}
//         <div className="relative">
//           <div
//             ref={scrollContainerRef}
//             onScroll={handleTableScroll}
//             className="overflow-x-auto"
//           >
//             <table className="w-full min-w-[1100px] text-sm text-left border-collapse">
//               <thead className="text-[11px] text-gray-500 uppercase tracking-wide bg-gray-50/80 border-b border-gray-200 sticky top-0 z-10">
//                 <tr>
//                   <th className="px-4 sm:px-5 py-3.5 font-semibold whitespace-nowrap">#</th>
//                   <th className="px-4 sm:px-5 py-3.5 font-semibold whitespace-nowrap">Company</th>
//                   <th className="px-4 sm:px-5 py-3.5 font-semibold whitespace-nowrap">Subscription Plan</th>
//                   <th className="px-4 sm:px-5 py-3.5 font-semibold whitespace-nowrap">Subscription Type</th>
//                   <th className="px-4 sm:px-5 py-3.5 font-semibold whitespace-nowrap">Feature</th>
//                   <th className="px-4 sm:px-5 py-3.5 font-semibold whitespace-nowrap text-right">Allocated</th>
//                   <th className="px-4 sm:px-5 py-3.5 font-semibold whitespace-nowrap text-right">Used</th>
//                   <th className="px-4 sm:px-5 py-3.5 font-semibold whitespace-nowrap text-right">Remaining</th>
//                   <th className="px-4 sm:px-5 py-3.5 font-semibold whitespace-nowrap text-center">Unlimited</th>
//                   <th className="px-4 sm:px-5 py-3.5 font-semibold whitespace-nowrap">Last Used</th>
//                   <th className="px-4 sm:px-5 py-3.5 font-semibold whitespace-nowrap">Status</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-100">
//                 {currentItems.length === 0 ? (
//                   <tr>
//                     <td colSpan="11" className="px-5 py-16 text-center">
//                       <div className="flex flex-col items-center gap-2">
//                         <TbDatabase size={28} className="text-gray-300" />
//                         <p className="text-gray-400 text-sm">No subscription usage records found</p>
//                       </div>
//                     </td>
//                   </tr>
//                 ) : (
//                   currentItems.map((item, index) => (
//                     <tr
//                       key={item.id}
//                       className={`transition-colors hover:bg-purple-50/40 ${
//                         index % 2 === 0 ? "bg-white" : "bg-gray-50/40"
//                       }`}
//                     >
//                       <td className="px-4 sm:px-5 py-3.5 text-gray-400 font-medium">
//                         {startIndex + index + 1}
//                       </td>
//                       <td className="px-4 sm:px-5 py-3.5 font-semibold text-gray-800">
//                         <div className="flex items-center gap-2">
//                           <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-gray-100 shrink-0">
//                             <TbBuildingSkyscraper size={14} className="text-gray-500" />
//                           </span>
//                           <span className="truncate max-w-[160px]">{item.company_name}</span>
//                         </div>
//                       </td>
//                       <td className="px-4 sm:px-5 py-3.5">
//                         <div className="flex flex-col gap-1 items-start">
//                           <span className="inline-block bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-full ring-1 ring-inset ring-blue-100">
//                             {item.plan_name}
//                           </span>
//                           {item.subscription_status && subscriptionStatusBadge(item.subscription_status)}
//                         </div>
//                       </td>
//                       <td className="px-4 sm:px-5 py-3.5 capitalize text-gray-600">
//                         {item.subscription_type || "—"}
//                       </td>
//                       <td className="px-4 sm:px-5 py-3.5">
//                         {/* ✅ Feature column with truncation + ellipsis */}
//                         <div className="max-w-[200px]">
//                           <div className="font-semibold text-gray-800 truncate" title={item.feature_name}>
//                             {item.feature_name}
//                           </div>
//                           {item.feature_display_value && item.feature_display_value !== "N/A" && (
//                             <div
//                               className="text-xs text-gray-400 mt-0.5 truncate"
//                               title={item.feature_display_value}
//                             >
//                               {item.feature_display_value}
//                             </div>
//                           )}
//                         </div>
//                       </td>
//                       <td className="px-4 sm:px-5 py-3.5 font-semibold text-gray-800 text-right tabular-nums">
//                         {item.allocated_value}
//                         {item.feature?.unit ? ` ${item.feature.unit}` : ""}
//                       </td>
//                       <td className="px-4 sm:px-5 py-3.5 text-right tabular-nums">
//                         <span className={`font-semibold ${item.used_value > 0 ? "text-blue-600" : "text-gray-400"}`}>
//                           {item.used_value}
//                         </span>
//                       </td>
//                       <td className="px-4 sm:px-5 py-3.5 text-right tabular-nums">
//                         <span className={`font-semibold ${item.remaining_value > 0 ? "text-emerald-600" : "text-rose-500"}`}>
//                           {item.remaining_value}
//                         </span>
//                       </td>
//                       <td className="px-4 sm:px-5 py-3.5 text-center">
//                         {item.feature_is_unlimited ? (
//                           <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 mx-auto">
//                             <TbCheck size={14} />
//                           </span>
//                         ) : (
//                           <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-gray-400 mx-auto">
//                             <TbX size={14} />
//                           </span>
//                         )}
//                       </td>
//                       <td className="px-4 sm:px-5 py-3.5 text-xs text-gray-500 whitespace-nowrap">
//                         {item.last_used_at ? formatDateTime(item.last_used_at) : "—"}
//                       </td>
//                       <td className="px-4 sm:px-5 py-3.5">{statusBadge(item.status)}</td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>

//           {/* Scroll hint gradient + label, mobile/tablet only */}
//           {currentItems.length > 0 && showScrollHint && (
//             <div className="lg:hidden pointer-events-none absolute top-0 right-0 h-full w-16 bg-gradient-to-l from-white via-white/80 to-transparent flex items-center justify-end pr-1">
//               <span className="flex items-center gap-0.5 text-gray-400 animate-pulse">
//                 <TbArrowRight size={16} />
//               </span>
//             </div>
//           )}
//         </div>

//         {/* Footer */}
//         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 sm:px-6 py-4 border-t border-gray-100 bg-gray-50/40">
//           <p className="text-xs text-gray-500 text-center sm:text-left">
//             Showing <span className="font-medium text-gray-700">{totalItems === 0 ? 0 : startIndex + 1}</span>–
//             <span className="font-medium text-gray-700">{Math.min(endIndex, totalItems)}</span> of{" "}
//             <span className="font-medium text-gray-700">{totalItems}</span> records
//           </p>
//           {totalPages > 1 && (
//             <div className="flex items-center justify-center gap-1">
//               <button
//                 onClick={() => goToPage(1)}
//                 disabled={currentPage === 1}
//                 className="p-1.5 rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
//               >
//                 <TbChevronsLeft size={15} />
//               </button>
//               <button
//                 onClick={() => goToPage(currentPage - 1)}
//                 disabled={currentPage === 1}
//                 className="p-1.5 rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
//               >
//                 <TbChevronLeft size={15} />
//               </button>
//               <span className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg whitespace-nowrap">
//                 Page {currentPage} of {totalPages}
//               </span>
//               <button
//                 onClick={() => goToPage(currentPage + 1)}
//                 disabled={currentPage === totalPages}
//                 className="p-1.5 rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
//               >
//                 <TbChevronRight size={15} />
//               </button>
//               <button
//                 onClick={() => goToPage(totalPages)}
//                 disabled={currentPage === totalPages}
//                 className="p-1.5 rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
//               >
//                 <TbChevronsRight size={15} />
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SubscriptionUsage;

import React, { useState, useMemo, useRef } from "react";
import {
  TbRefresh,
  TbSearch,
  TbCheck,
  TbX,
  TbChevronLeft,
  TbChevronRight,
  TbChevronsLeft,
  TbChevronsRight,
  TbBuildingSkyscraper,
  TbDatabase,
  TbArrowRight,
} from "react-icons/tb";
import { useToast } from "../../context/ToastContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://hire-me-jobs.onrender.com";

// ─── Helper: fetch and ensure JSON response ──────────────
const fetchJson = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  const text = await response.text();
  if (text.trim().startsWith("<!DOCTYPE")) {
    throw new Error("Server returned HTML instead of JSON. Please check the API URL.");
  }
  try {
    return JSON.parse(text);
  } catch (e) {
    throw new Error("Invalid JSON response from server.");
  }
};

// ─── Query function: fetch subscription usage for a company ──
const fetchUsageForCompany = async (companyId) => {
  if (!companyId) return [];
  let allData = [];
  let nextUrl = `${API_BASE_URL}/subscription-usage?company_id=${companyId}&page=1&limit=100`;

  while (nextUrl) {
    const result = await fetchJson(nextUrl);
    const dataList = result?.data || [];
    allData = [...allData, ...dataList];
    const links = result?.pagination?.links;
    nextUrl = links?.next || null;
  }
  return allData;
};

// ─── Query function: fetch company subscriptions ──────────
const fetchCompanySubscriptions = async () => {
  const result = await fetchJson(`${API_BASE_URL}/company-subscriptions`);
  return result?.data || [];
};

// ─── Query function: fetch subscription plan features ──────
const fetchPlanFeaturesMap = async () => {
  const result = await fetchJson(`${API_BASE_URL}/subscription-plan-features`);
  const list = result?.data || [];
  const map = {};
  list.forEach((item) => {
    const planId = item.subscription_plan_id;
    if (!map[planId]) map[planId] = [];
    map[planId].push({
      id: item.id,
      feature_id: item.subscription_features_id,
      feature_name: item.SubscriptionFeature?.feature_name || "Unknown Feature",
      value: item.value,
      value_type: item.value_type,
      unit: item.unit,
      display_value: item.display_value,
      is_unlimited: item.is_unlimited,
      status: item.status,
    });
  });
  return map;
};

const SubscriptionUsage = () => {
  const { showError, showSuccess } = useToast();
  const queryClient = useQueryClient();

  // ─── Get company_id from localStorage ─────────────────────
  const getCompanyId = () => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        if (parsed.Companies && parsed.Companies.length > 0) {
          return parsed.Companies[0].company_id;
        }
      }
      const storedCompanyId = localStorage.getItem("company_id");
      if (storedCompanyId) {
        return Number(storedCompanyId);
      }
    } catch (_) {}
    return null;
  };

  const companyId = getCompanyId();

  // ─── React Query: fetch subscription usage ──────────────
  const {
    data: allUsage = [],
    isLoading: usageLoading,
    isError: usageError,
    error: usageErrorObj,
    refetch: refetchUsage,
  } = useQuery({
    queryKey: ["subscriptionUsage", companyId],
    queryFn: () => fetchUsageForCompany(companyId),
    staleTime: 2 * 60 * 1000, // 2 minutes
    enabled: !!companyId,
    onError: (err) => {
      showError(err.message || "Failed to load subscription usage.");
    },
  });

  // ─── React Query: fetch company subscriptions ────────────
  const {
    data: companySubscriptions = [],
    isLoading: subscriptionsLoading,
    isError: subscriptionsError,
  } = useQuery({
    queryKey: ["companySubscriptions"],
    queryFn: fetchCompanySubscriptions,
    staleTime: 5 * 60 * 1000,
    enabled: !!companyId,
  });

  // ─── React Query: fetch plan features map ──────────────
  const {
    data: planFeaturesMap = {},
    isLoading: featuresLoading,
    isError: featuresError,
  } = useQuery({
    queryKey: ["planFeaturesMap"],
    queryFn: fetchPlanFeaturesMap,
    staleTime: 10 * 60 * 1000,
    enabled: !!companyId,
  });

  // ─── State for client‑side search and pagination ──────────
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showScrollHint, setShowScrollHint] = useState(true);
  const scrollContainerRef = useRef(null);
  const itemsPerPage = 10;

  // ─── Enrich usage with subscription & feature details ──
  const enrichedUsage = useMemo(() => {
    return allUsage.map((usage) => {
      const subscription = companySubscriptions.find(
        (sub) => sub.id === usage.company_subscription_id
      );
      const plan = subscription?.SubscriptionPlan;
      const planFeatures = planFeaturesMap[plan?.subscription_plan_id] || [];
      const feature = planFeatures.find(
        (f) => f.feature_id === usage.subscription_features_id
      );

      return {
        ...usage,
        subscription,
        plan,
        feature,
        plan_name: plan?.plan_name || "N/A",
        feature_name: feature?.feature_name || usage.subscription_feature?.feature_name || "N/A",
        feature_display_value: feature?.display_value || "N/A",
        feature_is_unlimited: feature?.is_unlimited || false,
        subscription_type: subscription?.subscription_type || "N/A",
        subscription_status: subscription?.subscription_status || "N/A",
        company_name: usage.Company?.company_name || "N/A",
      };
    });
  }, [allUsage, companySubscriptions, planFeaturesMap]);

  // ─── Client‑side search ────────────────────────────────────
  const filteredUsage = useMemo(() => {
    if (!searchTerm.trim()) return enrichedUsage;
    const term = searchTerm.toLowerCase().trim();
    return enrichedUsage.filter((item) => {
      const companyName = item.company_name.toLowerCase();
      const planName = item.plan_name.toLowerCase();
      const featureName = item.feature_name.toLowerCase();
      return (
        companyName.includes(term) ||
        planName.includes(term) ||
        featureName.includes(term)
      );
    });
  }, [enrichedUsage, searchTerm]);

  // ─── Client‑side pagination ────────────────────────────────
  const totalItems = filteredUsage.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentItems = filteredUsage.slice(startIndex, endIndex);

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["subscriptionUsage", companyId] });
    queryClient.invalidateQueries({ queryKey: ["companySubscriptions"] });
    queryClient.invalidateQueries({ queryKey: ["planFeaturesMap"] });
    showSuccess("Refreshed data");
  };

  const handleTableScroll = (e) => {
    if (e.target.scrollLeft > 8) {
      setShowScrollHint(false);
    }
  };

  // ─── Loading / error states ──────────────────────────────
  const loading = usageLoading || subscriptionsLoading || featuresLoading;
  const error = usageError || subscriptionsError || featuresError;

  // ─── Helpers ─────────────────────────────────────────────────
  const formatDateTime = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const statusBadge = (isActive) => {
    if (isActive) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold ring-1 ring-inset ring-emerald-200 whitespace-nowrap">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
          Active
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-semibold ring-1 ring-inset ring-rose-200 whitespace-nowrap">
        <span className="w-1.5 h-1.5 bg-rose-500 rounded-full" />
        Inactive
      </span>
    );
  };

  const subscriptionStatusBadge = (status) => {
    const s = status?.toLowerCase() || "";
    const map = {
      active: "bg-emerald-50 text-emerald-700 ring-emerald-200",
      approved: "bg-emerald-50 text-emerald-700 ring-emerald-200",
      pending: "bg-amber-50 text-amber-700 ring-amber-200",
      expired: "bg-rose-50 text-rose-700 ring-rose-200",
      cancelled: "bg-gray-100 text-gray-600 ring-gray-200",
    };
    const label =
      s === "approved" ? "Active" : status ? status.charAt(0).toUpperCase() + status.slice(1) : "—";
    const cls = map[s] || "bg-gray-100 text-gray-600 ring-gray-200";
    return (
      <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ring-1 ring-inset whitespace-nowrap ${cls}`}>
        {label}
      </span>
    );
  };

  // ─── Render ─────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <div className="inline-block animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-4 border-purple-600 border-t-transparent"></div>
        <p className="mt-4 text-gray-500 text-sm text-center">Loading subscription usage...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
        <p className="text-red-500 font-medium">
          {usageErrorObj?.message || "Failed to load subscription usage."}
        </p>
        <button
          onClick={handleRefresh}
          className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors"
        >
          <TbRefresh size={16} /> Retry
        </button>
      </div>
    );
  }

  if (!companyId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
        <p className="text-yellow-600 font-medium">Company not found</p>
        <p className="text-sm text-gray-400 mt-1">
          Please ensure your account is linked to a company.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
      {/* ─── Header ──────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4 mb-5 sm:mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
            <span className="p-2 bg-purple-50 rounded-xl">
              <TbDatabase className="text-purple-600" size={20} />
            </span>
            Subscription Usage
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1.5 ml-0.5">
            Track your company's subscription feature usage
          </p>
        </div>
        <button
          onClick={handleRefresh}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-purple-600 text-white text-sm font-semibold rounded-lg hover:bg-purple-700 active:bg-purple-800 shadow-sm shadow-purple-200 transition-colors w-full sm:w-auto"
        >
          <TbRefresh size={16} /> Refresh
        </button>
      </div>

      {/* ─── Card ──────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Top bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 sm:px-6 py-4 border-b border-gray-100">
          <div className="relative w-full sm:w-80">
            <TbSearch size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by company, plan, or feature..."
              className="w-full pl-10 pr-3 py-2.5 text-sm rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-300 transition-colors"
            />
          </div>
          <div className="text-xs sm:text-sm text-gray-500 font-medium whitespace-nowrap">
            {totalItems} total usage record{totalItems !== 1 ? "s" : ""}
          </div>
        </div>

        {/* ─── Table ────────────────────────────────────────── */}
        <div className="relative">
          <div
            ref={scrollContainerRef}
            onScroll={handleTableScroll}
            className="overflow-x-auto"
          >
            <table className="w-full min-w-[1100px] text-sm text-left border-collapse">
              <thead className="text-[11px] text-gray-500 uppercase tracking-wide bg-gray-50/80 border-b border-gray-200 sticky top-0 z-10">
                <tr>
                  <th className="px-4 sm:px-5 py-3.5 font-semibold whitespace-nowrap">#</th>
                  <th className="px-4 sm:px-5 py-3.5 font-semibold whitespace-nowrap">Company</th>
                  <th className="px-4 sm:px-5 py-3.5 font-semibold whitespace-nowrap">Subscription Plan</th>
                  <th className="px-4 sm:px-5 py-3.5 font-semibold whitespace-nowrap">Subscription Type</th>
                  <th className="px-4 sm:px-5 py-3.5 font-semibold whitespace-nowrap">Feature</th>
                  <th className="px-4 sm:px-5 py-3.5 font-semibold whitespace-nowrap text-right">Allocated</th>
                  <th className="px-4 sm:px-5 py-3.5 font-semibold whitespace-nowrap text-right">Used</th>
                  <th className="px-4 sm:px-5 py-3.5 font-semibold whitespace-nowrap text-right">Remaining</th>
                  <th className="px-4 sm:px-5 py-3.5 font-semibold whitespace-nowrap text-center">Unlimited</th>
                  <th className="px-4 sm:px-5 py-3.5 font-semibold whitespace-nowrap">Last Used</th>
                  <th className="px-4 sm:px-5 py-3.5 font-semibold whitespace-nowrap">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {currentItems.length === 0 ? (
                  <tr>
                    <td colSpan="11" className="px-5 py-16 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <TbDatabase size={28} className="text-gray-300" />
                        <p className="text-gray-400 text-sm">No subscription usage records found</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  currentItems.map((item, index) => (
                    <tr
                      key={item.id}
                      className={`transition-colors hover:bg-purple-50/40 ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50/40"
                      }`}
                    >
                      <td className="px-4 sm:px-5 py-3.5 text-gray-400 font-medium">
                        {startIndex + index + 1}
                      </td>
                      <td className="px-4 sm:px-5 py-3.5 font-semibold text-gray-800">
                        <div className="flex items-center gap-2">
                          <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-gray-100 shrink-0">
                            <TbBuildingSkyscraper size={14} className="text-gray-500" />
                          </span>
                          <span className="truncate max-w-[160px]" title={item.company_name}>
                            {item.company_name}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 sm:px-5 py-3.5">
                        <div className="flex flex-col gap-1 items-start">
                          <span className="inline-block bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-full ring-1 ring-inset ring-blue-100">
                            {item.plan_name}
                          </span>
                          {item.subscription_status && subscriptionStatusBadge(item.subscription_status)}
                        </div>
                      </td>
                      <td className="px-4 sm:px-5 py-3.5 capitalize text-gray-600">
                        {item.subscription_type || "—"}
                      </td>
                      <td className="px-4 sm:px-5 py-3.5">
                        <div className="max-w-[200px]">
                          <div className="font-semibold text-gray-800 truncate" title={item.feature_name}>
                            {item.feature_name}
                          </div>
                          {item.feature_display_value && item.feature_display_value !== "N/A" && (
                            <div
                              className="text-xs text-gray-400 mt-0.5 truncate"
                              title={item.feature_display_value}
                            >
                              {item.feature_display_value}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 sm:px-5 py-3.5 font-semibold text-gray-800 text-right tabular-nums">
                        {item.allocated_value}
                        {item.feature?.unit ? ` ${item.feature.unit}` : ""}
                      </td>
                      <td className="px-4 sm:px-5 py-3.5 text-right tabular-nums">
                        <span className={`font-semibold ${item.used_value > 0 ? "text-blue-600" : "text-gray-400"}`}>
                          {item.used_value}
                        </span>
                      </td>
                      <td className="px-4 sm:px-5 py-3.5 text-right tabular-nums">
                        <span className={`font-semibold ${item.remaining_value > 0 ? "text-emerald-600" : "text-rose-500"}`}>
                          {item.remaining_value}
                        </span>
                      </td>
                      <td className="px-4 sm:px-5 py-3.5 text-center">
                        {item.feature_is_unlimited ? (
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 mx-auto">
                            <TbCheck size={14} />
                          </span>
                        ) : (
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-gray-400 mx-auto">
                            <TbX size={14} />
                          </span>
                        )}
                      </td>
                      <td className="px-4 sm:px-5 py-3.5 text-xs text-gray-500 whitespace-nowrap">
                        {item.last_used_at ? formatDateTime(item.last_used_at) : "—"}
                      </td>
                      <td className="px-4 sm:px-5 py-3.5">{statusBadge(item.status)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Scroll hint */}
          {currentItems.length > 0 && showScrollHint && (
            <div className="lg:hidden pointer-events-none absolute top-0 right-0 h-full w-16 bg-gradient-to-l from-white via-white/80 to-transparent flex items-center justify-end pr-1">
              <span className="flex items-center gap-0.5 text-gray-400 animate-pulse">
                <TbArrowRight size={16} />
              </span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 sm:px-6 py-4 border-t border-gray-100 bg-gray-50/40">
          <p className="text-xs text-gray-500 text-center sm:text-left">
            Showing <span className="font-medium text-gray-700">{totalItems === 0 ? 0 : startIndex + 1}</span>–
            <span className="font-medium text-gray-700">{Math.min(endIndex, totalItems)}</span> of{" "}
            <span className="font-medium text-gray-700">{totalItems}</span> records
          </p>
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-1">
              <button
                onClick={() => goToPage(1)}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <TbChevronsLeft size={15} />
              </button>
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <TbChevronLeft size={15} />
              </button>
              <span className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg whitespace-nowrap">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <TbChevronRight size={15} />
              </button>
              <button
                onClick={() => goToPage(totalPages)}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <TbChevronsRight size={15} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionUsage;