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

// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// const SubscriptionPackage = () => {
//   const { user } = useAuth();
//   const { showError } = useToast();

//   // ─── State ──────────────────────────────────────────────────
//   const [allSubscriptions, setAllSubscriptions] = useState([]);
//   const [plansMap, setPlansMap] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");

//   // Client-side pagination
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 10;

//   // ─── Get logged‑in user ID (this is company_user_id) ──────
//   const getUserId = () => {
//     // Try from context first
//     if (user?.id) return user.id;
//     // Fallback to localStorage
//     try {
//       const stored = localStorage.getItem("user");
//       if (stored) {
//         const parsed = JSON.parse(stored);
//         if (parsed.id) return parsed.id;
//       }
//     } catch (_) {}
//     return null;
//   };

//   const userId = getUserId();

//   // ─── 1. Fetch subscription plans (for name mapping) ──────
//   const fetchPlans = async () => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/subscription-plans`);
//       if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
//       const result = await response.json();
//       const planList = result?.data || [];
//       const map = {};
//       planList.forEach((p) => {
//         map[p.id] = p.plan_name;
//       });
//       setPlansMap(map);
//     } catch (err) {
//       console.error("Failed to fetch plans:", err);
//     }
//   };

//   // ─── 2. Fetch ALL subscriptions (follow pagination) ──────
//   const fetchAllSubscriptions = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       let allData = [];
//       let nextUrl = `${API_BASE_URL}/company-subscriptions?page=1&limit=100`;

//       while (nextUrl) {
//         const response = await fetch(nextUrl);
//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }
//         const result = await response.json();
//         const dataList = result?.data || [];
//         allData = [...allData, ...dataList];

//         const links = result?.pagination?.links;
//         if (links && links.next) {
//           nextUrl = links.next;
//         } else {
//           nextUrl = null;
//         }
//       }

//       setAllSubscriptions(allData);
//     } catch (err) {
//       setError(err.message || "Failed to load subscriptions.");
//       showError(err.message || "Failed to load subscriptions.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ─── Initial load ──────────────────────────────────────────
//   useEffect(() => {
//     if (!userId) {
//       setLoading(false);
//       setError("You are not logged in.");
//       return;
//     }
//     const init = async () => {
//       await fetchPlans();
//       await fetchAllSubscriptions();
//     };
//     init();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   // ─── Filter subscriptions for the current user ────────────
//   const userSubscriptions = useMemo(() => {
//     if (!userId) return [];
//     return allSubscriptions.filter(
//       (sub) => sub.Company?.company_user_id === userId
//     );
//   }, [allSubscriptions, userId]);

//   // ─── Client‑side search ────────────────────────────────────
//   const filteredSubscriptions = useMemo(() => {
//     if (!searchTerm.trim()) return userSubscriptions;
//     const term = searchTerm.toLowerCase().trim();
//     return userSubscriptions.filter((sub) => {
//       const companyName = sub.Company?.company_name || "";
//       const planName = sub.SubscriptionPlan?.plan_name || "";
//       const type = sub.subscription_type || "";
//       return (
//         companyName.toLowerCase().includes(term) ||
//         planName.toLowerCase().includes(term) ||
//         type.toLowerCase().includes(term)
//       );
//     });
//   }, [userSubscriptions, searchTerm]);

//   // ─── Client‑side pagination ────────────────────────────────
//   const totalItems = filteredSubscriptions.length;
//   const totalPages = Math.ceil(totalItems / itemsPerPage);
//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
//   const currentItems = filteredSubscriptions.slice(startIndex, endIndex);

//   const goToPage = (page) => {
//     if (page < 1 || page > totalPages) return;
//     setCurrentPage(page);
//   };

//   // ─── Refresh handler ────────────────────────────────────────
//   const handleRefresh = () => {
//     fetchAllSubscriptions();
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

//   const statusBadge = (isActive) => {
//     if (isActive) {
//       return (
//         <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-medium">
//           <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
//           Active
//         </span>
//       );
//     }
//     return (
//       <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-xs font-medium">
//         <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
//         Inactive
//       </span>
//     );
//   };

//   // ─── Render ─────────────────────────────────────────────────
//   if (loading) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-[60vh]">
//         <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent"></div>
//         <p className="mt-4 text-gray-500 text-sm">Loading your subscriptions...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-[60vh]">
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

//   const companyName =
//     userSubscriptions.length > 0
//       ? userSubscriptions[0].Company?.company_name
//       : null;

//   return (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
//       {/* ─── Header ──────────────────────────────────────────── */}
//       <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">
//             Company Subscriptions
//           </h1>
//           <p className="text-sm text-gray-500 mt-1">
//             {companyName ? (
//               <>
//                 Showing subscriptions for{" "}
//                 <span className="font-medium text-gray-700">{companyName}</span>
//               </>
//             ) : (
//               "No subscriptions found for your company"
//             )}
//           </p>
//         </div>
//         <button
//           onClick={handleRefresh}
//           className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors"
//         >
//           <TbRefresh size={16} /> Refresh
//         </button>
//       </div>

//       {/* ─── Table Card ──────────────────────────────────────── */}
//       <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
//         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-gray-100">
//           <div className="relative w-full sm:w-72">
//             <TbSearch size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//             <input
//               type="text"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               placeholder="Search by plan or type..."
//               className="w-full pl-9 pr-3 py-2 text-sm rounded-full border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-300 transition-colors"
//             />
//           </div>
//           <div className="text-sm text-gray-500">
//             {totalItems} total subscription{totalItems !== 1 ? "s" : ""}
//           </div>
//         </div>

//         <div className="overflow-x-auto">
//           <table className="w-full text-sm text-left text-gray-600">
//             <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-200">
//               <tr>
//                 <th className="px-5 py-3 font-medium">#</th>
//                 <th className="px-5 py-3 font-medium">Company</th>
//                 <th className="px-5 py-3 font-medium">Plan</th>
//                 <th className="px-5 py-3 font-medium">Type</th>
//                 <th className="px-5 py-3 font-medium">Start Date</th>
//                 <th className="px-5 py-3 font-medium">Expiry Date</th>
//                 <th className="px-5 py-3 font-medium">Auto Renew</th>
//                 <th className="px-5 py-3 font-medium">Trial</th>
//                 <th className="px-5 py-3 font-medium">Status</th>
//                 <th className="px-5 py-3 font-medium">Created At</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-100">
//               {currentItems.length === 0 ? (
//                 <tr>
//                   <td colSpan="10" className="px-5 py-8 text-center text-gray-400">
//                     No subscriptions found
//                   </td>
//                 </tr>
//               ) : (
//                 currentItems.map((sub, index) => {
//                   const companyName = sub.Company?.company_name || "—";
//                   const planName = sub.SubscriptionPlan?.plan_name || "—";
//                   return (
//                     <tr key={sub.id} className="hover:bg-gray-50 transition-colors">
//                       <td className="px-5 py-3 text-gray-500">
//                         {startIndex + index + 1}
//                       </td>
//                       <td className="px-5 py-3 font-medium text-gray-800">
//                         {companyName}
//                       </td>
//                       <td className="px-5 py-3">
//                         <span className="inline-block bg-blue-50 text-blue-700 text-xs font-medium px-2 py-0.5 rounded">
//                           {planName}
//                         </span>
//                       </td>
//                       <td className="px-5 py-3 capitalize">
//                         {sub.subscription_type || "—"}
//                       </td>
//                       <td className="px-5 py-3">{formatDate(sub.start_date)}</td>
//                       <td className="px-5 py-3">{formatDate(sub.expiry_date)}</td>
//                       <td className="px-5 py-3">
//                         {sub.auto_renew ? (
//                           <span className="inline-flex items-center gap-1 text-green-600">
//                             <TbCheck size={14} /> Yes
//                           </span>
//                         ) : (
//                           <span className="inline-flex items-center gap-1 text-red-500">
//                             <TbX size={14} /> No
//                           </span>
//                         )}
//                       </td>
//                       <td className="px-5 py-3">
//                         {sub.is_trial ? (
//                           <span className="text-blue-600 text-xs font-medium">Trial</span>
//                         ) : (
//                           <span className="text-gray-400 text-xs">—</span>
//                         )}
//                       </td>
//                       <td className="px-5 py-3">{statusBadge(sub.is_status)}</td>
//                       <td className="px-5 py-3 text-xs text-gray-500">
//                         {formatDate(sub.created_at)}
//                       </td>
//                     </tr>
//                   );
//                 })
//               )}
//             </tbody>
//           </table>
//         </div>

//         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-3 border-t border-gray-100">
//           <p className="text-xs text-gray-400">
//             Showing {totalItems === 0 ? 0 : startIndex + 1}–
//             {Math.min(endIndex, totalItems)} of {totalItems} subscriptions
//           </p>
//           {totalPages > 1 && (
//             <div className="flex items-center gap-1">
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
//               <span className="px-3 text-xs text-gray-600">
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

// export default SubscriptionPackage;

import React, { useState, useEffect, useMemo } from "react";
import {
  TbRefresh,
  TbSearch,
  TbCheck,
  TbX,
  TbChevronLeft,
  TbChevronRight,
  TbChevronsLeft,
  TbChevronsRight,
} from "react-icons/tb";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";

// ✅ Use a fallback if the environment variable is missing
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://hire-me-jobs.onrender.com";

const SubscriptionTransaction = () => {
  const { user } = useAuth();
  const { showError } = useToast();

  // ─── State ──────────────────────────────────────────────────
  const [allTransactions, setAllTransactions] = useState([]);
  const [plansMap, setPlansMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Client-side pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // ─── Get company_id from the logged‑in user ──────────────
  const getCompanyId = () => {
    if (user?.Companies && user.Companies.length > 0) {
      return user.Companies[0].company_id;
    }
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

  // ─── Helper: fetch with JSON check ──────────────────────
  const fetchJson = async (url) => {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    const text = await response.text();
    // If response is HTML (e.g., error page), throw error
    if (text.trim().startsWith("<!DOCTYPE")) {
      throw new Error("Server returned HTML instead of JSON. Please check the API URL.");
    }
    try {
      return JSON.parse(text);
    } catch (e) {
      throw new Error("Invalid JSON response from server.");
    }
  };

  // ─── 1. Fetch subscription plans ──────────────────────────
  const fetchPlans = async () => {
    try {
      const url = `${API_BASE_URL}/subscription-plans`;
      const result = await fetchJson(url);
      const planList = result?.data || [];
      const map = {};
      planList.forEach((p) => {
        map[p.id] = p.plan_name;
      });
      setPlansMap(map);
    } catch (err) {
      console.error("Failed to fetch plans:", err);
      // Don't set error here – we can still show transactions without plan names
      setPlansMap({});
    }
  };

  // ─── 2. Fetch ALL transactions ────────────────────────────
  const fetchAllTransactions = async () => {
    setLoading(true);
    setError(null);
    try {
      let allData = [];
      let nextUrl = `${API_BASE_URL}/subscription-transactions?page=1&limit=100`;

      while (nextUrl) {
        const result = await fetchJson(nextUrl);
        const dataList = result?.data || [];
        allData = [...allData, ...dataList];

        const links = result?.pagination?.links;
        if (links && links.next) {
          nextUrl = links.next;
        } else {
          nextUrl = null;
        }
      }

      setAllTransactions(allData);
    } catch (err) {
      setError(err.message || "Failed to load transactions.");
      showError(err.message || "Failed to load transactions.");
    } finally {
      setLoading(false);
    }
  };

  // ─── Initial load ──────────────────────────────────────────
  useEffect(() => {
    if (!companyId) {
      setLoading(false);
      setError("No company associated with your account.");
      return;
    }
    const init = async () => {
      await fetchPlans();
      await fetchAllTransactions();
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── Filter transactions for the current company ──────────
  const companyTransactions = useMemo(() => {
    if (!companyId) return [];
    return allTransactions.filter(
      (tx) => tx.Company?.company_id === companyId
    );
  }, [allTransactions, companyId]);

  // ─── Client‑side search ────────────────────────────────────
  const filteredTransactions = useMemo(() => {
    if (!searchTerm.trim()) return companyTransactions;
    const term = searchTerm.toLowerCase().trim();
    return companyTransactions.filter((tx) => {
      const companyName = tx.Company?.company_name || "";
      const planName = tx.SubscriptionPlan?.plan_name || "";
      const transactionNo = tx.transaction_no || "";
      const gateway = tx.payment_gateway || "";
      return (
        companyName.toLowerCase().includes(term) ||
        planName.toLowerCase().includes(term) ||
        transactionNo.toLowerCase().includes(term) ||
        gateway.toLowerCase().includes(term)
      );
    });
  }, [companyTransactions, searchTerm]);

  // ─── Client‑side pagination ────────────────────────────────
  const totalItems = filteredTransactions.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentItems = filteredTransactions.slice(startIndex, endIndex);

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handleRefresh = () => {
    fetchAllTransactions();
  };

  // ─── Helpers ─────────────────────────────────────────────────
  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    if (amount == null || isNaN(amount)) return "—";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(Number(amount));
  };

  const statusBadge = (isActive) => {
    if (isActive) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-medium">
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
          Active
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-xs font-medium">
        <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
        Inactive
      </span>
    );
  };

  const paymentStatusBadge = (status) => {
    const s = status?.toLowerCase() || "";
    if (s === "success" || s === "captured") {
      return <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-medium">Success</span>;
    } else if (s === "pending") {
      return <span className="px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 text-xs font-medium">Pending</span>;
    } else if (s === "failed") {
      return <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-xs font-medium">Failed</span>;
    }
    return <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs font-medium">{status || "—"}</span>;
  };

  // ─── Render ─────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent"></div>
        <p className="mt-4 text-gray-500 text-sm">Loading transactions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <p className="text-red-500 font-medium">{error}</p>
        <button
          onClick={handleRefresh}
          className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors"
        >
          <TbRefresh size={16} /> Retry
        </button>
      </div>
    );
  }

  const companyName =
    companyTransactions.length > 0
      ? companyTransactions[0].Company?.company_name
      : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* ─── Header ──────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Subscription Transactions
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {companyName ? (
              <>
                Showing transactions for{" "}
                <span className="font-medium text-gray-700">{companyName}</span>
              </>
            ) : (
              "No transactions found for your company"
            )}
          </p>
        </div>
        <button
          onClick={handleRefresh}
          className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors"
        >
          <TbRefresh size={16} /> Refresh
        </button>
      </div>

      {/* ─── Table Card ──────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-gray-100">
          <div className="relative w-full sm:w-72">
            <TbSearch size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by company, plan, or transaction no..."
              className="w-full pl-9 pr-3 py-2 text-sm rounded-full border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-300 transition-colors"
            />
          </div>
          <div className="text-sm text-gray-500">
            {totalItems} total transaction{totalItems !== 1 ? "s" : ""}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-600">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-5 py-3 font-medium">#</th>
                <th className="px-5 py-3 font-medium">Company</th>
                <th className="px-5 py-3 font-medium">Plan</th>
                <th className="px-5 py-3 font-medium">Transaction No</th>
                <th className="px-5 py-3 font-medium">Base Price</th>
                <th className="px-5 py-3 font-medium">Discount</th>
                <th className="px-5 py-3 font-medium">GST</th>
                <th className="px-5 py-3 font-medium">Final Amount</th>
                <th className="px-5 py-3 font-medium">Gateway</th>
                <th className="px-5 py-3 font-medium">Payment Status</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Created At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan="12" className="px-5 py-8 text-center text-gray-400">
                    No transactions found
                  </td>
                </tr>
              ) : (
                currentItems.map((tx, index) => {
                  const companyName = tx.Company?.company_name || "—";
                  const planName = tx.SubscriptionPlan?.plan_name || "—";
                  return (
                    <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3 text-gray-500">
                        {startIndex + index + 1}
                      </td>
                      <td className="px-5 py-3 font-medium text-gray-800">
                        {companyName}
                      </td>
                      <td className="px-5 py-3">
                        <span className="inline-block bg-blue-50 text-blue-700 text-xs font-medium px-2 py-0.5 rounded">
                          {planName}
                        </span>
                      </td>
                      <td className="px-5 py-3 font-mono text-xs">
                        {tx.transaction_no || "—"}
                      </td>
                      <td className="px-5 py-3">{formatCurrency(tx.base_price)}</td>
                      <td className="px-5 py-3">{formatCurrency(tx.discount_price)}</td>
                      <td className="px-5 py-3">{formatCurrency(tx.gst_amount)}</td>
                      <td className="px-5 py-3 font-semibold text-gray-800">
                        {formatCurrency(tx.final_amount)}
                      </td>
                      <td className="px-5 py-3">{tx.payment_gateway || "—"}</td>
                      <td className="px-5 py-3">
                        {paymentStatusBadge(tx.payment_status)}
                      </td>
                      <td className="px-5 py-3">{statusBadge(tx.is_status)}</td>
                      <td className="px-5 py-3 text-xs text-gray-500">
                        {formatDate(tx.created_at)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-3 border-t border-gray-100">
          <p className="text-xs text-gray-400">
            Showing {totalItems === 0 ? 0 : startIndex + 1}–
            {Math.min(endIndex, totalItems)} of {totalItems} transactions
          </p>
          {totalPages > 1 && (
            <div className="flex items-center gap-1">
              <button
                onClick={() => goToPage(1)}
                disabled={currentPage === 1}
                className="p-1.5 rounded border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <TbChevronsLeft size={14} />
              </button>
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-1.5 rounded border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <TbChevronLeft size={14} />
              </button>
              <span className="px-3 text-xs text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <TbChevronRight size={14} />
              </button>
              <button
                onClick={() => goToPage(totalPages)}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <TbChevronsRight size={14} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionTransaction;