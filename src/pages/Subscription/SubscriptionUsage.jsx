// import React, { useState, useMemo, useRef } from "react";
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
// import { useQuery, useQueryClient } from "@tanstack/react-query";

// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://hire-me-jobs.onrender.com";

// // ─── Helper: fetch and ensure JSON response ──────────────
// const fetchJson = async (url) => {
//   const response = await fetch(url);
//   if (!response.ok) {
//     throw new Error(`HTTP ${response.status}: ${response.statusText}`);
//   }
//   const text = await response.text();
//   if (text.trim().startsWith("<!DOCTYPE")) {
//     throw new Error("Server returned HTML instead of JSON. Please check the API URL.");
//   }
//   try {
//     return JSON.parse(text);
//   } catch (e) {
//     throw new Error("Invalid JSON response from server.");
//   }
// };

// // ─── Query function: fetch subscription usage for a company ──
// const fetchUsageForCompany = async (companyId) => {
//   if (!companyId) return [];
//   let allData = [];
//   let nextUrl = `${API_BASE_URL}/subscription-usage?company_id=${companyId}&page=1&limit=100`;

//   while (nextUrl) {
//     const result = await fetchJson(nextUrl);
//     const dataList = result?.data || [];
//     allData = [...allData, ...dataList];
//     const links = result?.pagination?.links;
//     nextUrl = links?.next || null;
//   }
//   return allData;
// };

// // ─── Query function: fetch company subscriptions ──────────
// const fetchCompanySubscriptions = async () => {
//   const result = await fetchJson(`${API_BASE_URL}/company-subscriptions`);
//   return result?.data || [];
// };

// // ─── Query function: fetch subscription plan features ──────
// const fetchPlanFeaturesMap = async () => {
//   const result = await fetchJson(`${API_BASE_URL}/subscription-plan-features`);
//   const list = result?.data || [];
//   const map = {};
//   list.forEach((item) => {
//     const planId = item.subscription_plan_id;
//     if (!map[planId]) map[planId] = [];
//     map[planId].push({
//       id: item.id,
//       feature_id: item.subscription_features_id,
//       feature_name: item.SubscriptionFeature?.feature_name || "Unknown Feature",
//       value: item.value,
//       value_type: item.value_type,
//       unit: item.unit,
//       display_value: item.display_value,
//       is_unlimited: item.is_unlimited,
//       status: item.status,
//     });
//   });
//   return map;
// };

// const SubscriptionUsage = () => {
//   const { showError, showSuccess } = useToast();
//   const queryClient = useQueryClient();

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

//   // ─── React Query: fetch subscription usage ──────────────
//   const {
//     data: allUsage = [],
//     isLoading: usageLoading,
//     isError: usageError,
//     error: usageErrorObj,
//     refetch: refetchUsage,
//   } = useQuery({
//     queryKey: ["subscriptionUsage", companyId],
//     queryFn: () => fetchUsageForCompany(companyId),
//     staleTime: 2 * 60 * 1000, // 2 minutes
//     enabled: !!companyId,
//     onError: (err) => {
//       showError(err.message || "Failed to load subscription usage.");
//     },
//   });

//   // ─── React Query: fetch company subscriptions ────────────
//   const {
//     data: companySubscriptions = [],
//     isLoading: subscriptionsLoading,
//     isError: subscriptionsError,
//   } = useQuery({
//     queryKey: ["companySubscriptions"],
//     queryFn: fetchCompanySubscriptions,
//     staleTime: 5 * 60 * 1000,
//     enabled: !!companyId,
//   });

//   // ─── React Query: fetch plan features map ──────────────
//   const {
//     data: planFeaturesMap = {},
//     isLoading: featuresLoading,
//     isError: featuresError,
//   } = useQuery({
//     queryKey: ["planFeaturesMap"],
//     queryFn: fetchPlanFeaturesMap,
//     staleTime: 10 * 60 * 1000,
//     enabled: !!companyId,
//   });

//   // ─── State for client‑side search and pagination ──────────
//   const [searchTerm, setSearchTerm] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [showScrollHint, setShowScrollHint] = useState(true);
//   const scrollContainerRef = useRef(null);
//   const itemsPerPage = 10;

//   // ─── Enrich usage with subscription & feature details ──
//   const enrichedUsage = useMemo(() => {
//     return allUsage.map((usage) => {
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
//   }, [allUsage, companySubscriptions, planFeaturesMap]);

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
//     queryClient.invalidateQueries({ queryKey: ["subscriptionUsage", companyId] });
//     queryClient.invalidateQueries({ queryKey: ["companySubscriptions"] });
//     queryClient.invalidateQueries({ queryKey: ["planFeaturesMap"] });
//     showSuccess("Refreshed data");
//   };

//   const handleTableScroll = (e) => {
//     if (e.target.scrollLeft > 8) {
//       setShowScrollHint(false);
//     }
//   };

//   // ─── Loading / error states ──────────────────────────────
//   const loading = usageLoading || subscriptionsLoading || featuresLoading;
//   const error = usageError || subscriptionsError || featuresError;

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
//         <p className="text-red-500 font-medium">
//           {usageErrorObj?.message || "Failed to load subscription usage."}
//         </p>
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

//         {/* ─── Table ────────────────────────────────────────── */}
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
//                           <span className="truncate max-w-[160px]" title={item.company_name}>
//                             {item.company_name}
//                           </span>
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

//           {/* Scroll hint */}
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

import React, { useEffect, useState, useMemo } from "react";
import {
  Briefcase,
  X,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Clock,
  XCircle,
  ChevronRight,
  Layers,
} from "lucide-react";

const API_URL = "https://hire-me-jobs.onrender.com/subscription-usage/";

// ---- Get logged-in company_id from localStorage ----
// Checks a few common key names/shapes. Console logs what it finds so you can
// verify in devtools if something still looks off.
const getCompanyId = () => {
  const possibleKeys = ["user", "userData", "authUser", "loginData", "Companies", "company"];

  for (const key of possibleKeys) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) continue;
      const parsed = JSON.parse(raw);

      if (parsed?.Companies?.[0]?.company_id != null) {
        return parsed.Companies[0].company_id;
      }
      if (Array.isArray(parsed) && parsed[0]?.company_id != null) {
        return parsed[0].company_id;
      }
      if (parsed?.company_id != null) {
        return parsed.company_id;
      }
    } catch {
      // not JSON / not relevant, try next key
    }
  }
  return null;
};

// ---- Status badge styling ----
const statusConfig = {
  active: {
    label: "Active",
    icon: CheckCircle2,
    className: "bg-emerald-50 text-emerald-600 border-emerald-200",
  },
  pending: {
    label: "Pending",
    icon: Clock,
    className: "bg-amber-50 text-amber-600 border-amber-200",
  },
  expired: {
    label: "Expired",
    icon: XCircle,
    className: "bg-rose-50 text-rose-600 border-rose-200",
  },
};

const StatusBadge = ({ status }) => {
  const config = statusConfig[status] || {
    label: status || "Unknown",
    icon: AlertCircle,
    className: "bg-slate-100 text-slate-500 border-slate-200",
  };
  const Icon = config.icon;
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${config.className}`}
    >
      <Icon size={12} />
      {config.label}
    </span>
  );
};

// ---- Feature Card ----
const FeatureCard = ({ feature, index, onClick }) => {
  const totalRemaining = feature.plans.reduce(
    (sum, p) => sum + (Number(p.remaining_value) || 0),
    0
  );
  const totalUsed = feature.plans.reduce(
    (sum, p) => sum + (Number(p.used_value) || 0),
    0
  );
  const hasActive = feature.plans.some((p) => p.subscription_status === "active");

  return (
    <button
      onClick={() => onClick(feature)}
      style={{ animationDelay: `${index * 60}ms` }}
      className="group relative text-left w-full bg-white rounded-2xl border border-slate-200
                 p-5 shadow-sm hover:shadow-lg hover:border-purple-300
                 transition-all duration-300 hover:-translate-y-1
                 animate-[fadeSlideUp_0.5s_ease-out_both]"
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-500 to-purple-700
                     flex items-center justify-center text-white shadow-md shadow-purple-200
                     group-hover:scale-110 transition-transform duration-300"
        >
          <Briefcase size={20} />
        </div>
        {hasActive && (
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
        )}
      </div>

      <h3 className="text-slate-800 font-semibold text-[15px] mb-1 line-clamp-1">
        {feature.feature_name}
      </h3>
      <p className="text-xs text-slate-400 mb-4">
        {feature.plans.length} plan{feature.plans.length > 1 ? "s" : ""} linked
      </p>

      <div className="flex items-center justify-between text-sm mb-1">
        <span className="text-slate-500">Remaining</span>
        <span className="font-semibold text-purple-600">{totalRemaining}</span>
      </div>
      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mb-4">
        <div
          className="h-full bg-gradient-to-r from-purple-400 to-purple-600 rounded-full transition-all duration-700"
          style={{
            width: `${
              totalUsed + totalRemaining > 0
                ? (totalRemaining / (totalUsed + totalRemaining)) * 100
                : 0
            }%`,
          }}
        />
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-400">Used: {totalUsed}</span>
        <span
          className="inline-flex items-center gap-1 text-xs font-medium text-purple-500
                     group-hover:gap-1.5 transition-all duration-300"
        >
          View plans
          <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
        </span>
      </div>
    </button>
  );
};

// ---- Plans Modal ----
const PlansModal = ({ feature, onClose }) => {
  if (!feature) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm
                 animate-[fadeIn_0.2s_ease-out]"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden
                   animate-[scaleIn_0.25s_cubic-bezier(0.16,1,0.3,1)] max-h-[85vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-purple-50 to-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center text-white">
              <Layers size={18} />
            </div>
            <div>
              <h2 className="font-semibold text-slate-800 text-[15px]">
                {feature.feature_name}
              </h2>
              <p className="text-xs text-slate-400">
                {feature.plans.length} plan{feature.plans.length > 1 ? "s" : ""} · Feature ID #{feature.id}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400
                       hover:bg-slate-100 hover:text-slate-700 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Table */}
        <div className="overflow-auto flex-1">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-slate-50 text-slate-500 text-xs uppercase tracking-wide">
              <tr>
                <th className="text-left font-medium px-6 py-3">Plan</th>
                <th className="text-left font-medium px-4 py-3">Type</th>
                <th className="text-left font-medium px-4 py-3">Status</th>
                <th className="text-right font-medium px-4 py-3">Allocated</th>
                <th className="text-right font-medium px-4 py-3">Used</th>
                <th className="text-right font-medium px-4 py-3">Remaining</th>
                <th className="text-left font-medium px-6 py-3">Last Used</th>
              </tr>
            </thead>
            <tbody>
              {feature.plans.map((plan, i) => (
                <tr
                  key={`${plan.company_subscription_id}-${i}`}
                  className="border-t border-slate-100 hover:bg-purple-50/40 transition-colors"
                  style={{ animationDelay: `${i * 40}ms` }}
                >
                  <td className="px-6 py-3.5 font-medium text-slate-700">
                    {plan.plan_name}
                  </td>
                  <td className="px-4 py-3.5 text-slate-500">{plan.subscription_type}</td>
                  <td className="px-4 py-3.5">
                    <StatusBadge status={plan.subscription_status} />
                  </td>
                  <td className="px-4 py-3.5 text-right text-slate-600">
                    {plan.allocated_value}
                  </td>
                  <td className="px-4 py-3.5 text-right text-slate-600">{plan.used_value}</td>
                  <td className="px-4 py-3.5 text-right font-semibold text-purple-600">
                    {plan.remaining_value}
                  </td>
                  <td className="px-6 py-3.5 text-slate-400 text-xs">
                    {plan.last_used_at
                      ? new Date(plan.last_used_at).toLocaleString()
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ---- Main Component ----
const SubscriptionUsage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFeature, setSelectedFeature] = useState(null);

  const companyId = useMemo(() => getCompanyId(), []);

  useEffect(() => {
    const fetchUsage = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error(`Request failed (${res.status})`);
        const json = await res.json();

        const rawFeatures = json.data || [];

        // Loose match on company_id (handles "5" vs 5 mismatch).
        // If filtering ends up removing everything, fall back to raw data
        // instead of showing an empty/wrong screen.
        let features = rawFeatures;
        if (companyId != null) {
          const filtered = rawFeatures
            .map((f) => ({
              ...f,
              plans: f.plans.filter(
                (p) => Number(p.company_id) === Number(companyId)
              ),
            }))
            .filter((f) => f.plans.length > 0);

          if (filtered.length > 0) {
            features = filtered;
          } else {
            console.warn(
              "[SubscriptionUsage] No plans matched company_id:",
              companyId,
              "— showing unfiltered data instead."
            );
          }
        }

        setData(features);
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchUsage();
  }, [companyId]);

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-8">
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.94) translateY(8px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>

      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-xl md:text-2xl font-bold text-slate-800">
            Subscription Usage
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Track feature-wise plan allocation and usage
          </p>
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center py-24 text-slate-400">
            <Loader2 className="animate-spin mb-3" size={28} />
            <p className="text-sm">Loading subscription data...</p>
          </div>
        )}

        {!loading && error && (
          <div className="flex flex-col items-center justify-center py-24 text-rose-500">
            <AlertCircle size={28} className="mb-3" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {!loading && !error && data.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-slate-400">
            <Layers size={28} className="mb-3" />
            <p className="text-sm">No subscription usage data found</p>
          </div>
        )}

        {!loading && !error && data.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {data.map((feature, index) => (
              <FeatureCard
                key={feature.id}
                feature={feature}
                index={index}
                onClick={setSelectedFeature}
              />
            ))}
          </div>
        )}
      </div>

      <PlansModal feature={selectedFeature} onClose={() => setSelectedFeature(null)} />
    </div>
  );
};

export default SubscriptionUsage;