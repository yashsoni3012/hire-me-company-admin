// import React, { useState, useEffect, useMemo } from "react";
// import {
//   TbRefresh,
//   TbSearch,
//   TbCheck,
//   TbX,
//   TbChevronLeft,
//   TbChevronRight,
//   TbChevronsLeft,
//   TbChevronsRight,
// } from "react-icons/tb";
// import { useAuth } from "../../context/AuthContext";
// import { useToast } from "../../context/ToastContext";

// // ✅ Use a fallback if the environment variable is missing
// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://hire-me-jobs.onrender.com";

// const SubscriptionTransaction = () => {
//   const { user } = useAuth();
//   const { showError } = useToast();

//   // ─── State ──────────────────────────────────────────────────
//   const [allTransactions, setAllTransactions] = useState([]);
//   const [plansMap, setPlansMap] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");

//   // Client-side pagination
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 10;

//   // ─── Get company_id from the logged‑in user ──────────────
//   const getCompanyId = () => {
//     if (user?.Companies && user.Companies.length > 0) {
//       return user.Companies[0].company_id;
//     }
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
//     // If response is HTML (e.g., error page), throw error
//     if (text.trim().startsWith("<!DOCTYPE")) {
//       throw new Error("Server returned HTML instead of JSON. Please check the API URL.");
//     }
//     try {
//       return JSON.parse(text);
//     } catch (e) {
//       throw new Error("Invalid JSON response from server.");
//     }
//   };

//   // ─── 1. Fetch subscription plans ──────────────────────────
//   const fetchPlans = async () => {
//     try {
//       const url = `${API_BASE_URL}/subscription-plans`;
//       const result = await fetchJson(url);
//       const planList = result?.data || [];
//       const map = {};
//       planList.forEach((p) => {
//         map[p.id] = p.plan_name;
//       });
//       setPlansMap(map);
//     } catch (err) {
//       console.error("Failed to fetch plans:", err);
//       // Don't set error here – we can still show transactions without plan names
//       setPlansMap({});
//     }
//   };

//   // ─── 2. Fetch ALL transactions ────────────────────────────
//   const fetchAllTransactions = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       let allData = [];
//       let nextUrl = `${API_BASE_URL}/subscription-transactions?page=1&limit=100`;

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

//       setAllTransactions(allData);
//     } catch (err) {
//       setError(err.message || "Failed to load transactions.");
//       showError(err.message || "Failed to load transactions.");
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
//       await fetchPlans();
//       await fetchAllTransactions();
//     };
//     init();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   // ─── Filter transactions for the current company ──────────
//   const companyTransactions = useMemo(() => {
//     if (!companyId) return [];
//     return allTransactions.filter(
//       (tx) => tx.Company?.company_id === companyId
//     );
//   }, [allTransactions, companyId]);

//   // ─── Client‑side search ────────────────────────────────────
//   const filteredTransactions = useMemo(() => {
//     if (!searchTerm.trim()) return companyTransactions;
//     const term = searchTerm.toLowerCase().trim();
//     return companyTransactions.filter((tx) => {
//       const companyName = tx.Company?.company_name || "";
//       const planName = tx.SubscriptionPlan?.plan_name || "";
//       const transactionNo = tx.transaction_no || "";
//       const gateway = tx.payment_gateway || "";
//       return (
//         companyName.toLowerCase().includes(term) ||
//         planName.toLowerCase().includes(term) ||
//         transactionNo.toLowerCase().includes(term) ||
//         gateway.toLowerCase().includes(term)
//       );
//     });
//   }, [companyTransactions, searchTerm]);

//   // ─── Client‑side pagination ────────────────────────────────
//   const totalItems = filteredTransactions.length;
//   const totalPages = Math.ceil(totalItems / itemsPerPage);
//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
//   const currentItems = filteredTransactions.slice(startIndex, endIndex);

//   const goToPage = (page) => {
//     if (page < 1 || page > totalPages) return;
//     setCurrentPage(page);
//   };

//   const handleRefresh = () => {
//     fetchAllTransactions();
//   };

//   // ─── Helpers ─────────────────────────────────────────────────
//   const formatDate = (dateStr) => {
//     if (!dateStr) return "—";
//     return new Date(dateStr).toLocaleDateString("en-IN", {
//       day: "2-digit",
//       month: "short",
//       year: "numeric",
//     });
//   };

//   const formatCurrency = (amount) => {
//     if (amount == null || isNaN(amount)) return "—";
//     return new Intl.NumberFormat("en-IN", {
//       style: "currency",
//       currency: "INR",
//       minimumFractionDigits: 2,
//     }).format(Number(amount));
//   };

//   const statusBadge = (isActive) => {
//     if (isActive) {
//       return (
//         <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-medium whitespace-nowrap">
//           <span className="w-1.5 h-1.5 bg-green-500 rounded-full shrink-0" />
//           Active
//         </span>
//       );
//     }
//     return (
//       <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-xs font-medium whitespace-nowrap">
//         <span className="w-1.5 h-1.5 bg-red-500 rounded-full shrink-0" />
//         Inactive
//       </span>
//     );
//   };

//   const paymentStatusBadge = (status) => {
//     const s = status?.toLowerCase() || "";
//     if (s === "success" || s === "captured") {
//       return <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-medium whitespace-nowrap">Success</span>;
//     } else if (s === "pending") {
//       return <span className="px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 text-xs font-medium whitespace-nowrap">Pending</span>;
//     } else if (s === "failed") {
//       return <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-xs font-medium whitespace-nowrap">Failed</span>;
//     }
//     return <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs font-medium whitespace-nowrap">{status || "—"}</span>;
//   };

//   // ─── Render ─────────────────────────────────────────────────
//   if (loading) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
//         <div className="inline-block animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-4 border-purple-600 border-t-transparent"></div>
//         <p className="mt-4 text-gray-500 text-sm">Loading transactions...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
//         <p className="text-red-500 font-medium text-sm sm:text-base">{error}</p>
//         <button
//           onClick={handleRefresh}
//           className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 active:bg-purple-800 transition-colors"
//         >
//           <TbRefresh size={16} /> Retry
//         </button>
//       </div>
//     );
//   }

//   const companyName =
//     companyTransactions.length > 0
//       ? companyTransactions[0].Company?.company_name
//       : null;

//   return (
//     <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-8">
//       {/* ─── Header ──────────────────────────────────────────── */}
//       <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
//         <div className="min-w-0">
//           <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
//             Subscription Transactions
//           </h1>
//           <p className="text-xs sm:text-sm text-gray-500 mt-1 break-words">
//             {companyName ? (
//               <>
//                 Showing transactions for{" "}
//                 <span className="font-medium text-gray-700">{companyName}</span>
//               </>
//             ) : (
//               "No transactions found for your company"
//             )}
//           </p>
//         </div>
//         <button
//           onClick={handleRefresh}
//           className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 active:bg-purple-800 transition-colors w-full sm:w-auto shrink-0"
//         >
//           <TbRefresh size={16} /> Refresh
//         </button>
//       </div>

//       {/* ─── Table Card ──────────────────────────────────────── */}
//       <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
//         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 sm:px-5 py-4 border-b border-gray-100">
//           <div className="relative w-full sm:w-72">
//             <TbSearch size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//             <input
//               type="text"
//               value={searchTerm}
//               onChange={(e) => {
//                 setSearchTerm(e.target.value);
//                 setCurrentPage(1);
//               }}
//               placeholder="Search by company, plan, or transaction no..."
//               className="w-full pl-9 pr-3 py-2 text-sm rounded-full border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-300 transition-colors"
//             />
//           </div>
//           <div className="text-xs sm:text-sm text-gray-500 sm:shrink-0">
//             {totalItems} total transaction{totalItems !== 1 ? "s" : ""}
//           </div>
//         </div>

//         {/* ─── Mobile / tablet card list (below lg) ───────────── */}
//         <div className="lg:hidden divide-y divide-gray-100">
//           {currentItems.length === 0 ? (
//             <div className="px-5 py-8 text-center text-gray-400 text-sm">
//               No transactions found
//             </div>
//           ) : (
//             currentItems.map((tx, index) => {
//               const txCompanyName = tx.Company?.company_name || "—";
//               const planName = tx.SubscriptionPlan?.plan_name || "—";
//               return (
//                 <div key={tx.id} className="px-4 sm:px-5 py-4 hover:bg-gray-50 transition-colors">
//                   <div className="flex items-start justify-between gap-3 mb-2">
//                     <div className="min-w-0">
//                       <p className="text-xs text-gray-400">#{startIndex + index + 1}</p>
//                       <p className="font-medium text-gray-800 break-words">{txCompanyName}</p>
//                     </div>
//                     <div className="shrink-0">{statusBadge(tx.is_status)}</div>
//                   </div>

//                   <div className="flex flex-wrap items-center gap-2 mb-3">
//                     <span className="inline-block bg-blue-50 text-blue-700 text-xs font-medium px-2 py-0.5 rounded">
//                       {planName}
//                     </span>
//                     {paymentStatusBadge(tx.payment_status)}
//                   </div>

//                   <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-sm">
//                     <div>
//                       <p className="text-xs text-gray-400">Transaction No</p>
//                       <p className="font-mono text-xs text-gray-700 break-all">
//                         {tx.transaction_no || "—"}
//                       </p>
//                     </div>
//                     <div>
//                       <p className="text-xs text-gray-400">Gateway</p>
//                       <p className="text-gray-700">{tx.payment_gateway || "—"}</p>
//                     </div>
//                     <div>
//                       <p className="text-xs text-gray-400">Base Price</p>
//                       <p className="text-gray-700">{formatCurrency(tx.base_price)}</p>
//                     </div>
//                     <div>
//                       <p className="text-xs text-gray-400">Discount</p>
//                       <p className="text-gray-700">{formatCurrency(tx.discount_price)}</p>
//                     </div>
//                     <div>
//                       <p className="text-xs text-gray-400">GST</p>
//                       <p className="text-gray-700">{formatCurrency(tx.gst_amount)}</p>
//                     </div>
//                     <div>
//                       <p className="text-xs text-gray-400">Final Amount</p>
//                       <p className="font-semibold text-gray-800">
//                         {formatCurrency(tx.final_amount)}
//                       </p>
//                     </div>
//                     <div className="col-span-2">
//                       <p className="text-xs text-gray-400">Created At</p>
//                       <p className="text-xs text-gray-500">{formatDate(tx.created_at)}</p>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })
//           )}
//         </div>

//         {/* ─── Desktop table (lg and up) ──────────────────────── */}
//         <div className="hidden lg:block overflow-x-auto">
//           <table className="w-full text-sm text-left text-gray-600">
//             <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-200">
//               <tr>
//                 <th className="px-5 py-3 font-medium whitespace-nowrap">#</th>
//                 <th className="px-5 py-3 font-medium whitespace-nowrap">Company</th>
//                 <th className="px-5 py-3 font-medium whitespace-nowrap">Plan</th>
//                 <th className="px-5 py-3 font-medium whitespace-nowrap">Transaction No</th>
//                 <th className="px-5 py-3 font-medium whitespace-nowrap">Base Price</th>
//                 <th className="px-5 py-3 font-medium whitespace-nowrap">Discount</th>
//                 <th className="px-5 py-3 font-medium whitespace-nowrap">GST</th>
//                 <th className="px-5 py-3 font-medium whitespace-nowrap">Final Amount</th>
//                 <th className="px-5 py-3 font-medium whitespace-nowrap">Gateway</th>
//                 <th className="px-5 py-3 font-medium whitespace-nowrap">Payment Status</th>
//                 <th className="px-5 py-3 font-medium whitespace-nowrap">Status</th>
//                 <th className="px-5 py-3 font-medium whitespace-nowrap">Created At</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-100">
//               {currentItems.length === 0 ? (
//                 <tr>
//                   <td colSpan="12" className="px-5 py-8 text-center text-gray-400">
//                     No transactions found
//                   </td>
//                 </tr>
//               ) : (
//                 currentItems.map((tx, index) => {
//                   const txCompanyName = tx.Company?.company_name || "—";
//                   const planName = tx.SubscriptionPlan?.plan_name || "—";
//                   return (
//                     <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
//                       <td className="px-5 py-3 text-gray-500 whitespace-nowrap">
//                         {startIndex + index + 1}
//                       </td>
//                       <td className="px-5 py-3 font-medium text-gray-800 max-w-[180px] truncate">
//                         {txCompanyName}
//                       </td>
//                       <td className="px-5 py-3 whitespace-nowrap">
//                         <span className="inline-block bg-blue-50 text-blue-700 text-xs font-medium px-2 py-0.5 rounded">
//                           {planName}
//                         </span>
//                       </td>
//                       <td className="px-5 py-3 font-mono text-xs whitespace-nowrap">
//                         {tx.transaction_no || "—"}
//                       </td>
//                       <td className="px-5 py-3 whitespace-nowrap">{formatCurrency(tx.base_price)}</td>
//                       <td className="px-5 py-3 whitespace-nowrap">{formatCurrency(tx.discount_price)}</td>
//                       <td className="px-5 py-3 whitespace-nowrap">{formatCurrency(tx.gst_amount)}</td>
//                       <td className="px-5 py-3 font-semibold text-gray-800 whitespace-nowrap">
//                         {formatCurrency(tx.final_amount)}
//                       </td>
//                       <td className="px-5 py-3 whitespace-nowrap">{tx.payment_gateway || "—"}</td>
//                       <td className="px-5 py-3 whitespace-nowrap">
//                         {paymentStatusBadge(tx.payment_status)}
//                       </td>
//                       <td className="px-5 py-3 whitespace-nowrap">{statusBadge(tx.is_status)}</td>
//                       <td className="px-5 py-3 text-xs text-gray-500 whitespace-nowrap">
//                         {formatDate(tx.created_at)}
//                       </td>
//                     </tr>
//                   );
//                 })
//               )}
//             </tbody>
//           </table>
//         </div>

//         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 sm:px-5 py-3 border-t border-gray-100">
//           <p className="text-xs text-gray-400 text-center sm:text-left">
//             Showing {totalItems === 0 ? 0 : startIndex + 1}–
//             {Math.min(endIndex, totalItems)} of {totalItems} transactions
//           </p>
//           {totalPages > 1 && (
//             <div className="flex items-center justify-center gap-1">
//               <button
//                 onClick={() => goToPage(1)}
//                 disabled={currentPage === 1}
//                 className="p-1.5 rounded border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//               >
//                 <TbChevronsLeft size={14} />
//               </button>
//               <button
//                 onClick={() => goToPage(currentPage - 1)}
//                 disabled={currentPage === 1}
//                 className="p-1.5 rounded border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//               >
//                 <TbChevronLeft size={14} />
//               </button>
//               <span className="px-2 sm:px-3 text-xs text-gray-600 whitespace-nowrap">
//                 Page {currentPage} of {totalPages}
//               </span>
//               <button
//                 onClick={() => goToPage(currentPage + 1)}
//                 disabled={currentPage === totalPages}
//                 className="p-1.5 rounded border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//               >
//                 <TbChevronRight size={14} />
//               </button>
//               <button
//                 onClick={() => goToPage(totalPages)}
//                 disabled={currentPage === totalPages}
//                 className="p-1.5 rounded border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//               >
//                 <TbChevronsRight size={14} />
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SubscriptionTransaction;

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
  TbCalendar,
  TbClock,
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

// ─── Query function: fetch company subscriptions for a company ──
const fetchSubscriptionsForCompany = async (companyId) => {
  if (!companyId) return [];
  let allData = [];
  let nextUrl = `${API_BASE_URL}/company-subscriptions?company_id=${companyId}&page=1&limit=100`;

  while (nextUrl) {
    const result = await fetchJson(nextUrl);
    const dataList = result?.data || [];
    allData = [...allData, ...dataList];
    const links = result?.pagination?.links;
    nextUrl = links?.next || null;
  }
  return allData;
};

// ─── Query function: fetch subscription plans ──────────────
const fetchPlans = async () => {
  const result = await fetchJson(`${API_BASE_URL}/subscription-plans`);
  // Ensure we return an array
  const planList = result?.data || [];
  return Array.isArray(planList) ? planList : [];
};

const SubscriptionPackage = () => {
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

  // ─── React Query: fetch subscription plans ──────────────
  const {
    data: plans = [],
    isLoading: plansLoading,
  } = useQuery({
    queryKey: ["subscriptionPlans"],
    queryFn: fetchPlans,
    staleTime: 10 * 60 * 1000,
    enabled: !!companyId,
    onError: (err) => {
      console.error("Failed to fetch plans:", err);
    },
  });

  // ─── React Query: fetch subscriptions ─────────────────────
  const {
    data: subscriptions = [],
    isLoading: subscriptionsLoading,
    isError: subscriptionsError,
    error: subscriptionsErrorObj,
    refetch: refetchSubscriptions,
  } = useQuery({
    queryKey: ["companySubscriptions", companyId],
    queryFn: () => fetchSubscriptionsForCompany(companyId),
    staleTime: 2 * 60 * 1000, // 2 minutes
    enabled: !!companyId,
    onError: (err) => {
      showError(err.message || "Failed to load subscriptions.");
    },
  });

  // ─── Build a map plan_id -> plan_name for quick lookup ──
  const plansMap = useMemo(() => {
    const map = {};
    // Ensure plans is an array before iterating
    if (Array.isArray(plans)) {
      plans.forEach((p) => {
        map[p.id] = p.plan_name;
      });
    }
    return map;
  }, [plans]);

  // ─── State for client‑side search and pagination ──────────
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // ─── Enrich subscriptions with plan name (fallback) ──────
  const enrichedSubscriptions = useMemo(() => {
    // Ensure subscriptions is an array
    const subs = Array.isArray(subscriptions) ? subscriptions : [];
    return subs.map((sub) => {
      const planName =
        sub.SubscriptionPlan?.plan_name ||
        plansMap[sub.SubscriptionPlan?.subscription_plan_id] ||
        "N/A";
      return {
        ...sub,
        plan_name: planName,
        company_name: sub.Company?.company_name || "N/A",
      };
    });
  }, [subscriptions, plansMap]);

  // ─── Client‑side search ────────────────────────────────────
  const filteredSubscriptions = useMemo(() => {
    if (!searchTerm.trim()) return enrichedSubscriptions;
    const term = searchTerm.toLowerCase().trim();
    return enrichedSubscriptions.filter((item) => {
      const companyName = item.company_name.toLowerCase();
      const planName = item.plan_name.toLowerCase();
      const type = item.subscription_type?.toLowerCase() || "";
      const status = item.subscription_status?.toLowerCase() || "";
      return (
        companyName.includes(term) ||
        planName.includes(term) ||
        type.includes(term) ||
        status.includes(term)
      );
    });
  }, [enrichedSubscriptions, searchTerm]);

  // ─── Client‑side pagination ────────────────────────────────
  const totalItems = filteredSubscriptions.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentItems = filteredSubscriptions.slice(startIndex, endIndex);

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["companySubscriptions", companyId] });
    queryClient.invalidateQueries({ queryKey: ["subscriptionPlans"] });
    showSuccess("Refreshed data");
  };

  // ─── Loading / error states ──────────────────────────────
  const loading = subscriptionsLoading || plansLoading;
  const error = subscriptionsError;

  // ─── Helpers ─────────────────────────────────────────────────
  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
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
        <p className="mt-4 text-gray-500 text-sm text-center">Loading subscriptions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
        <p className="text-red-500 font-medium">
          {subscriptionsErrorObj?.message || "Failed to load subscriptions."}
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

  const companyName =
    subscriptions.length > 0
      ? subscriptions[0].Company?.company_name
      : null;

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
      {/* ─── Header ──────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4 mb-5 sm:mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
            <span className="p-2 bg-purple-50 rounded-xl">
              <TbBuildingSkyscraper className="text-purple-600" size={20} />
            </span>
            Company Subscriptions
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1.5 ml-0.5">
            {companyName ? (
              <>
                Showing subscriptions for{" "}
                <span className="font-medium text-gray-700">{companyName}</span>
              </>
            ) : (
              "No subscriptions found for your company"
            )}
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
              placeholder="Search by company, plan, or type..."
              className="w-full pl-10 pr-3 py-2.5 text-sm rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-300 transition-colors"
            />
          </div>
          <div className="text-xs sm:text-sm text-gray-500 font-medium whitespace-nowrap">
            {totalItems} total subscription{totalItems !== 1 ? "s" : ""}
          </div>
        </div>

        {/* ─── Table ────────────────────────────────────────── */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] text-sm text-left border-collapse">
            <thead className="text-[11px] text-gray-500 uppercase tracking-wide bg-gray-50/80 border-b border-gray-200 sticky top-0 z-10">
              <tr>
                <th className="px-4 sm:px-5 py-3.5 font-semibold whitespace-nowrap">#</th>
                <th className="px-4 sm:px-5 py-3.5 font-semibold whitespace-nowrap">Company</th>
                <th className="px-4 sm:px-5 py-3.5 font-semibold whitespace-nowrap">Plan</th>
                <th className="px-4 sm:px-5 py-3.5 font-semibold whitespace-nowrap">Type</th>
                <th className="px-4 sm:px-5 py-3.5 font-semibold whitespace-nowrap">Subscription Status</th>
                <th className="px-4 sm:px-5 py-3.5 font-semibold whitespace-nowrap">Start Date</th>
                <th className="px-4 sm:px-5 py-3.5 font-semibold whitespace-nowrap">Expiry Date</th>
                <th className="px-4 sm:px-5 py-3.5 font-semibold whitespace-nowrap text-center">Auto Renew</th>
                <th className="px-4 sm:px-5 py-3.5 font-semibold whitespace-nowrap text-center">Trial</th>
                <th className="px-4 sm:px-5 py-3.5 font-semibold whitespace-nowrap">Status</th>
                <th className="px-4 sm:px-5 py-3.5 font-semibold whitespace-nowrap">Created At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan="11" className="px-5 py-16 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <TbBuildingSkyscraper size={28} className="text-gray-300" />
                      <p className="text-gray-400 text-sm">No subscriptions found</p>
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
                      <span className="inline-block bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-full ring-1 ring-inset ring-blue-100 whitespace-nowrap">
                        {item.plan_name}
                      </span>
                    </td>
                    <td className="px-4 sm:px-5 py-3.5 capitalize text-gray-600">
                      {item.subscription_type || "—"}
                    </td>
                    <td className="px-4 sm:px-5 py-3.5">
                      {subscriptionStatusBadge(item.subscription_status)}
                    </td>
                    <td className="px-4 sm:px-5 py-3.5 text-xs text-gray-600 whitespace-nowrap">
                      {formatDate(item.start_date)}
                    </td>
                    <td className="px-4 sm:px-5 py-3.5 text-xs text-gray-600 whitespace-nowrap">
                      {formatDate(item.expiry_date)}
                    </td>
                    <td className="px-4 sm:px-5 py-3.5 text-center">
                      {item.auto_renew ? (
                        <span className="inline-flex items-center gap-1 text-emerald-600">
                          <TbCheck size={14} />
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-gray-400">
                          <TbX size={14} />
                        </span>
                      )}
                    </td>
                    <td className="px-4 sm:px-5 py-3.5 text-center">
                      {item.is_trial ? (
                        <span className="text-blue-600 text-xs font-medium">Trial</span>
                      ) : (
                        <span className="text-gray-400 text-xs">—</span>
                      )}
                    </td>
                    <td className="px-4 sm:px-5 py-3.5">{statusBadge(item.is_status)}</td>
                    <td className="px-4 sm:px-5 py-3.5 text-xs text-gray-500 whitespace-nowrap">
                      {formatDate(item.created_at)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 sm:px-6 py-4 border-t border-gray-100 bg-gray-50/40">
          <p className="text-xs text-gray-500 text-center sm:text-left">
            Showing <span className="font-medium text-gray-700">{totalItems === 0 ? 0 : startIndex + 1}</span>–
            <span className="font-medium text-gray-700">{Math.min(endIndex, totalItems)}</span> of{" "}
            <span className="font-medium text-gray-700">{totalItems}</span> subscriptions
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

export default SubscriptionPackage;