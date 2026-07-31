// import React, { useState, useEffect, useMemo, useRef } from "react";
// import {
//   TbRefresh,
//   TbSearch,
//   TbChevronLeft,
//   TbChevronRight,
//   TbChevronsLeft,
//   TbChevronsRight,
//   TbBuildingSkyscraper,
//   TbFileInvoice,
//   TbArrowRight,
//   TbCheck,
//   TbX,
//   TbCurrencyRupee,
//   TbCalendar,
//   TbHash,
// } from "react-icons/tb";
// import { useToast } from "../../context/ToastContext";

// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://hire-me-jobs.onrender.com";

// const SubscriptionInvoice = () => {
//   const { showError, showSuccess } = useToast();

//   // ─── State ──────────────────────────────────────────────────
//   const [allInvoices, setAllInvoices] = useState([]);
//   const [transactionsMap, setTransactionsMap] = useState({});
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

//   // ─── 1. Fetch subscription transactions ──────────────────
//   const fetchTransactions = async () => {
//     try {
//       const result = await fetchJson(`${API_BASE_URL}/subscription-transactions`);
//       const list = result?.data || [];
//       // Build a map: transaction_id -> transaction details
//       const map = {};
//       list.forEach((tx) => {
//         map[tx.id] = {
//           transaction_no: tx.transaction_no,
//           base_price: tx.base_price,
//           discount_price: tx.discount_price,
//           gst_amount: tx.gst_amount,
//           final_amount: tx.final_amount,
//           payment_gateway: tx.payment_gateway,
//           payment_status: tx.payment_status,
//           payment_reference: tx.payment_reference,
//           gateway_order_id: tx.gateway_order_id,
//           plan_name: tx.SubscriptionPlan?.plan_name || "N/A",
//           subscription_type: tx.CompanySubscription?.subscription_type || "N/A",
//           offer_name: tx.SubscriptionPlanOffer?.offer_name || null,
//           coupon_code: tx.SubscriptionCoupon?.coupon_code || null,
//           created_at: tx.created_at,
//         };
//       });
//       setTransactionsMap(map);
//       return map;
//     } catch (err) {
//       console.error("Failed to fetch transactions:", err);
//       return {};
//     }
//   };

//   // ─── 2. Fetch ALL invoices (follow pagination) ──────────
//   const fetchAllInvoices = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       let allData = [];
//       let nextUrl = `${API_BASE_URL}/invoices?page=1&limit=100`;

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

//       setAllInvoices(allData);
//     } catch (err) {
//       setError(err.message || "Failed to load invoices.");
//       showError(err.message || "Failed to load invoices.");
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
//       await fetchTransactions();
//       await fetchAllInvoices();
//     };
//     init();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   // ─── Filter invoices for the current company ──────────────
//   const companyInvoices = useMemo(() => {
//     if (!companyId) return [];
//     return allInvoices.filter((invoice) => invoice.Company?.company_id === companyId);
//   }, [allInvoices, companyId]);

//   // ─── Enrich invoices with transaction details ────────────
//   const enrichedInvoices = useMemo(() => {
//     return companyInvoices.map((invoice) => {
//       const txId = invoice.SubscriptionTransaction?.id;
//       const tx = txId ? transactionsMap[txId] : null;

//       return {
//         ...invoice,
//         transaction: tx,
//         transaction_no: tx?.transaction_no || "—",
//         plan_name: tx?.plan_name || "N/A",
//         subscription_type: tx?.subscription_type || "N/A",
//         payment_gateway: tx?.payment_gateway || "—",
//         payment_status: tx?.payment_status || "—",
//         base_price: tx?.base_price || null,
//         discount_price: tx?.discount_price || null,
//         gst_amount: tx?.gst_amount || null,
//         final_amount: tx?.final_amount || null,
//         offer_name: tx?.offer_name || null,
//         coupon_code: tx?.coupon_code || null,
//         company_name: invoice.Company?.company_name || "N/A",
//       };
//     });
//   }, [companyInvoices, transactionsMap]);

//   // ─── Client‑side search ────────────────────────────────────
//   const filteredInvoices = useMemo(() => {
//     if (!searchTerm.trim()) return enrichedInvoices;
//     const term = searchTerm.toLowerCase().trim();
//     return enrichedInvoices.filter((item) => {
//       const companyName = item.company_name.toLowerCase();
//       const invoiceNo = item.invoice_no?.toLowerCase() || "";
//       const planName = item.plan_name.toLowerCase();
//       const transactionNo = item.transaction_no.toLowerCase();
//       const status = item.invoice_status?.toLowerCase() || "";
//       return (
//         companyName.includes(term) ||
//         invoiceNo.includes(term) ||
//         planName.includes(term) ||
//         transactionNo.includes(term) ||
//         status.includes(term)
//       );
//     });
//   }, [enrichedInvoices, searchTerm]);

//   // ─── Client‑side pagination ────────────────────────────────
//   const totalItems = filteredInvoices.length;
//   const totalPages = Math.ceil(totalItems / itemsPerPage);
//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
//   const currentItems = filteredInvoices.slice(startIndex, endIndex);

//   const goToPage = (page) => {
//     if (page < 1 || page > totalPages) return;
//     setCurrentPage(page);
//   };

//   const handleRefresh = () => {
//     fetchAllInvoices();
//   };

//   const handleTableScroll = (e) => {
//     if (e.target.scrollLeft > 8) {
//       setShowScrollHint(false);
//     }
//   };

//   // ─── Helpers ─────────────────────────────────────────────────
//   const formatCurrency = (amount) => {
//     if (amount == null || isNaN(amount)) return "—";
//     return new Intl.NumberFormat("en-IN", {
//       style: "currency",
//       currency: "INR",
//       minimumFractionDigits: 2,
//     }).format(Number(amount));
//   };

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

//   const invoiceStatusBadge = (status) => {
//     const s = status?.toLowerCase() || "";
//     const map = {
//       paid: "bg-emerald-50 text-emerald-700 ring-emerald-200",
//       pending: "bg-amber-50 text-amber-700 ring-amber-200",
//       failed: "bg-rose-50 text-rose-700 ring-rose-200",
//       cancelled: "bg-gray-100 text-gray-600 ring-gray-200",
//       overdue: "bg-red-50 text-red-700 ring-red-200",
//     };
//     const label = status ? status.charAt(0).toUpperCase() + status.slice(1) : "—";
//     const cls = map[s] || "bg-gray-100 text-gray-600 ring-gray-200";
//     return (
//       <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ring-1 ring-inset whitespace-nowrap ${cls}`}>
//         {label}
//       </span>
//     );
//   };

//   const paymentStatusBadge = (status) => {
//     const s = status?.toLowerCase() || "";
//     const map = {
//       success: "bg-emerald-50 text-emerald-700 ring-emerald-200",
//       captured: "bg-emerald-50 text-emerald-700 ring-emerald-200",
//       pending: "bg-amber-50 text-amber-700 ring-amber-200",
//       failed: "bg-rose-50 text-rose-700 ring-rose-200",
//     };
//     const label = status ? status.charAt(0).toUpperCase() + status.slice(1) : "—";
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
//         <p className="mt-4 text-gray-500 text-sm text-center">Loading invoices...</p>
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
//               <TbFileInvoice className="text-purple-600" size={20} />
//             </span>
//             Subscription Invoices
//           </h1>
//           <p className="text-xs sm:text-sm text-gray-500 mt-1.5 ml-0.5">
//             View all your company's subscription invoices
//           </p>
//         </div>
//         <button
//           onClick={handleRefresh}
//           className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-purple-600 text-white text-sm font-semibold rounded-lg hover:bg-purple-700 active:bg-purple-800 shadow-sm shadow-purple-200 transition-colors w-full sm:w-auto"
//         >
//           <TbRefresh size={16} /> Refresh
//         </button>
//       </div>

//       {/* ─── Card ────────────────────────────────────────────── */}
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
//               placeholder="Search by invoice, company, plan..."
//               className="w-full pl-10 pr-3 py-2.5 text-sm rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-300 transition-colors"
//             />
//           </div>
//           <div className="text-xs sm:text-sm text-gray-500 font-medium whitespace-nowrap">
//             {totalItems} total invoice{totalItems !== 1 ? "s" : ""}
//           </div>
//         </div>

//         {/* ─── Table ────────────────────────────────────────── */}
//         <div className="relative">
//           <div
//             ref={scrollContainerRef}
//             onScroll={handleTableScroll}
//             className="overflow-x-auto"
//           >
//             <table className="w-full min-w-[1200px] text-sm text-left border-collapse">
//               <thead className="text-[11px] text-gray-500 uppercase tracking-wide bg-gray-50/80 border-b border-gray-200 sticky top-0 z-10">
//                 <tr>
//                   <th className="px-4 sm:px-5 py-3.5 font-semibold whitespace-nowrap">#</th>
//                   <th className="px-4 sm:px-5 py-3.5 font-semibold whitespace-nowrap">Invoice No</th>
//                   <th className="px-4 sm:px-5 py-3.5 font-semibold whitespace-nowrap">Company</th>
//                   <th className="px-4 sm:px-5 py-3.5 font-semibold whitespace-nowrap">Plan</th>
//                   <th className="px-4 sm:px-5 py-3.5 font-semibold whitespace-nowrap">Transaction</th>
//                   <th className="px-4 sm:px-5 py-3.5 font-semibold whitespace-nowrap text-right">Subtotal</th>
//                   <th className="px-4 sm:px-5 py-3.5 font-semibold whitespace-nowrap text-right">GST</th>
//                   <th className="px-4 sm:px-5 py-3.5 font-semibold whitespace-nowrap text-right">Grand Total</th>
//                   <th className="px-4 sm:px-5 py-3.5 font-semibold whitespace-nowrap">Payment</th>
//                   <th className="px-4 sm:px-5 py-3.5 font-semibold whitespace-nowrap">Invoice Status</th>
//                   <th className="px-4 sm:px-5 py-3.5 font-semibold whitespace-nowrap">Status</th>
//                   <th className="px-4 sm:px-5 py-3.5 font-semibold whitespace-nowrap">Created</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-100">
//                 {currentItems.length === 0 ? (
//                   <tr>
//                     <td colSpan="12" className="px-5 py-16 text-center">
//                       <div className="flex flex-col items-center gap-2">
//                         <TbFileInvoice size={28} className="text-gray-300" />
//                         <p className="text-gray-400 text-sm">No invoices found</p>
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
//                       <td className="px-4 sm:px-5 py-3.5 font-mono text-xs font-semibold text-gray-700 whitespace-nowrap">
//                         <span className="inline-block bg-gray-100 px-2.5 py-1 rounded-lg">
//                           {item.invoice_no || "—"}
//                         </span>
//                       </td>
//                       <td className="px-4 sm:px-5 py-3.5 font-semibold text-gray-800">
//                         <div className="flex items-center gap-2">
//                           <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-gray-100 shrink-0">
//                             <TbBuildingSkyscraper size={14} className="text-gray-500" />
//                           </span>
//                           <span className="truncate max-w-[140px]">{item.company_name}</span>
//                         </div>
//                       </td>
//                       <td className="px-4 sm:px-5 py-3.5">
//                         <span className="inline-block bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-full ring-1 ring-inset ring-blue-100">
//                           {item.plan_name}
//                         </span>
//                       </td>
//                       <td className="px-4 sm:px-5 py-3.5">
//                         <div className="flex flex-col gap-0.5">
//                           <span className="font-mono text-xs text-gray-600">
//                             {item.transaction_no}
//                           </span>
//                           {item.payment_gateway !== "—" && (
//                             <span className="text-[10px] text-gray-400">
//                               {item.payment_gateway}
//                             </span>
//                           )}
//                         </div>
//                       </td>
//                       <td className="px-4 sm:px-5 py-3.5 text-right tabular-nums font-medium text-gray-700">
//                         {formatCurrency(item.subtotal)}
//                       </td>
//                       <td className="px-4 sm:px-5 py-3.5 text-right tabular-nums text-gray-600">
//                         {formatCurrency(item.gst)}
//                       </td>
//                       <td className="px-4 sm:px-5 py-3.5 text-right tabular-nums font-bold text-gray-900">
//                         {formatCurrency(item.grand_total)}
//                       </td>
//                       <td className="px-4 sm:px-5 py-3.5">
//                         {paymentStatusBadge(item.payment_status)}
//                       </td>
//                       <td className="px-4 sm:px-5 py-3.5">
//                         {invoiceStatusBadge(item.invoice_status)}
//                       </td>
//                       <td className="px-4 sm:px-5 py-3.5">
//                         {statusBadge(item.is_status)}
//                       </td>
//                       <td className="px-4 sm:px-5 py-3.5 text-xs text-gray-500 whitespace-nowrap">
//                         {formatDate(item.created_at)}
//                       </td>
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
//             <span className="font-medium text-gray-700">{totalItems}</span> invoices
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

// export default SubscriptionInvoice;

import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  TbRefresh,
  TbSearch,
  TbChevronLeft,
  TbChevronRight,
  TbChevronsLeft,
  TbChevronsRight,
  TbBuildingSkyscraper,
  TbFileInvoice,
  TbArrowRight,
} from "react-icons/tb";
import { useToast } from "../../context/ToastContext";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://hire-me-jobs.onrender.com";

const SubscriptionInvoice = () => {
  const { showError, showSuccess } = useToast();

  // ─── State ──────────────────────────────────────────────────
  const [allInvoices, setAllInvoices] = useState([]);
  const [transactionsMap, setTransactionsMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showScrollHint, setShowScrollHint] = useState(true);

  // Client-side pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const scrollContainerRef = useRef(null);

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

  // ─── Helper: fetch with JSON check ──────────────────────
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

  // ─── 1. Fetch subscription transactions ──────────────────
  const fetchTransactions = async () => {
    try {
      const result = await fetchJson(`${API_BASE_URL}/subscription-transactions`);
      const list = result?.data || [];
      // Build a map: transaction_id -> transaction details
      const map = {};
      list.forEach((tx) => {
        map[tx.id] = {
          transaction_no: tx.transaction_no,
          base_price: tx.base_price,
          discount_price: tx.discount_price,
          gst_amount: tx.gst_amount,
          final_amount: tx.final_amount,
          payment_gateway: tx.payment_gateway,
          payment_status: tx.payment_status,
          payment_reference: tx.payment_reference,
          gateway_order_id: tx.gateway_order_id,
          plan_name: tx.SubscriptionPlan?.plan_name || "N/A",
          subscription_type: tx.CompanySubscription?.subscription_type || "N/A",
          offer_name: tx.SubscriptionPlanOffer?.offer_name || null,
          coupon_code: tx.SubscriptionCoupon?.coupon_code || null,
          created_at: tx.created_at,
        };
      });
      setTransactionsMap(map);
      return map;
    } catch (err) {
      console.error("Failed to fetch transactions:", err);
      return {};
    }
  };

  // ─── 2. Fetch ALL invoices (follow pagination) ──────────
  const fetchAllInvoices = async () => {
    setLoading(true);
    setError(null);
    try {
      let allData = [];
      let nextUrl = `${API_BASE_URL}/invoices?page=1&limit=100`;

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

      setAllInvoices(allData);
    } catch (err) {
      setError(err.message || "Failed to load invoices.");
      showError(err.message || "Failed to load invoices.");
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
      await fetchTransactions();
      await fetchAllInvoices();
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── Filter invoices for the current company ──────────────
  const companyInvoices = useMemo(() => {
    if (!companyId) return [];
    return allInvoices.filter((invoice) => invoice.Company?.company_id === companyId);
  }, [allInvoices, companyId]);

  // ─── Enrich invoices with transaction details ────────────
  const enrichedInvoices = useMemo(() => {
    return companyInvoices.map((invoice) => {
      const txId = invoice.SubscriptionTransaction?.id;
      const tx = txId ? transactionsMap[txId] : null;

      return {
        ...invoice,
        transaction: tx,
        transaction_no: tx?.transaction_no || "—",
        plan_name: tx?.plan_name || "N/A",
        subscription_type: tx?.subscription_type || "N/A",
        payment_gateway: tx?.payment_gateway || "—",
        payment_status: tx?.payment_status || "—",
        base_price: tx?.base_price || null,
        discount_price: tx?.discount_price || null,
        gst_amount: tx?.gst_amount || null,
        final_amount: tx?.final_amount || null,
        offer_name: tx?.offer_name || null,
        coupon_code: tx?.coupon_code || null,
        company_name: invoice.Company?.company_name || "N/A",
      };
    });
  }, [companyInvoices, transactionsMap]);

  // ─── Client‑side search ────────────────────────────────────
  const filteredInvoices = useMemo(() => {
    if (!searchTerm.trim()) return enrichedInvoices;
    const term = searchTerm.toLowerCase().trim();
    return enrichedInvoices.filter((item) => {
      const companyName = item.company_name.toLowerCase();
      const invoiceNo = item.invoice_no?.toLowerCase() || "";
      const planName = item.plan_name.toLowerCase();
      const transactionNo = item.transaction_no.toLowerCase();
      const status = item.invoice_status?.toLowerCase() || "";
      return (
        companyName.includes(term) ||
        invoiceNo.includes(term) ||
        planName.includes(term) ||
        transactionNo.includes(term) ||
        status.includes(term)
      );
    });
  }, [enrichedInvoices, searchTerm]);

  // ─── Client‑side pagination ────────────────────────────────
  const totalItems = filteredInvoices.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentItems = filteredInvoices.slice(startIndex, endIndex);

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handleRefresh = () => {
    fetchAllInvoices();
  };

  const handleTableScroll = (e) => {
    if (e.target.scrollLeft > 8) {
      setShowScrollHint(false);
    }
  };

  // ─── Helpers ─────────────────────────────────────────────────
  const formatCurrency = (amount) => {
    if (amount == null || isNaN(amount)) return "—";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(Number(amount));
  };

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

  const invoiceStatusBadge = (status) => {
    const s = status?.toLowerCase() || "";
    const map = {
      paid: "bg-emerald-50 text-emerald-700 ring-emerald-200",
      pending: "bg-amber-50 text-amber-700 ring-amber-200",
      failed: "bg-rose-50 text-rose-700 ring-rose-200",
      cancelled: "bg-gray-100 text-gray-600 ring-gray-200",
      overdue: "bg-red-50 text-red-700 ring-red-200",
    };
    const label = status ? status.charAt(0).toUpperCase() + status.slice(1) : "—";
    const cls = map[s] || "bg-gray-100 text-gray-600 ring-gray-200";
    return (
      <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ring-1 ring-inset whitespace-nowrap ${cls}`}>
        {label}
      </span>
    );
  };

  const paymentStatusBadge = (status) => {
    const s = status?.toLowerCase() || "";
    const map = {
      success: "bg-emerald-50 text-emerald-700 ring-emerald-200",
      captured: "bg-emerald-50 text-emerald-700 ring-emerald-200",
      pending: "bg-amber-50 text-amber-700 ring-amber-200",
      failed: "bg-rose-50 text-rose-700 ring-rose-200",
    };
    const label = status ? status.charAt(0).toUpperCase() + status.slice(1) : "—";
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
        <p className="mt-4 text-gray-500 text-sm text-center">Loading invoices...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
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
              <TbFileInvoice className="text-purple-600" size={20} />
            </span>
            Subscription Invoices
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1.5 ml-0.5">
            View all your company's subscription invoices
          </p>
        </div>
        <button
          onClick={handleRefresh}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-purple-600 text-white text-sm font-semibold rounded-lg hover:bg-purple-700 active:bg-purple-800 shadow-sm shadow-purple-200 transition-colors w-full sm:w-auto"
        >
          <TbRefresh size={16} /> Refresh
        </button>
      </div>

      {/* ─── Card ────────────────────────────────────────────── */}
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
              placeholder="Search by invoice, company, plan..."
              className="w-full pl-10 pr-3 py-2.5 text-sm rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-300 transition-colors"
            />
          </div>
          <div className="text-xs sm:text-sm text-gray-500 font-medium whitespace-nowrap">
            {totalItems} total invoice{totalItems !== 1 ? "s" : ""}
          </div>
        </div>

        {/* ─── Table ────────────────────────────────────────── */}
        <div className="relative">
          <div
            ref={scrollContainerRef}
            onScroll={handleTableScroll}
            className="overflow-x-auto"
          >
            <table className="w-full min-w-[1200px] text-sm text-left border-collapse">
              <thead className="text-[11px] text-gray-500 uppercase tracking-wide bg-gray-50/80 border-b border-gray-200 sticky top-0 z-10">
                <tr>
                  <th className="px-4 sm:px-5 py-3.5 font-semibold whitespace-nowrap">#</th>
                  <th className="px-4 sm:px-5 py-3.5 font-semibold whitespace-nowrap">Invoice No</th>
                  <th className="px-4 sm:px-5 py-3.5 font-semibold whitespace-nowrap">Company</th>
                  <th className="px-4 sm:px-5 py-3.5 font-semibold whitespace-nowrap">Plan</th>
                  <th className="px-4 sm:px-5 py-3.5 font-semibold whitespace-nowrap">Transaction</th>
                  <th className="px-4 sm:px-5 py-3.5 font-semibold whitespace-nowrap text-right">Subtotal</th>
                  <th className="px-4 sm:px-5 py-3.5 font-semibold whitespace-nowrap text-right">GST</th>
                  <th className="px-4 sm:px-5 py-3.5 font-semibold whitespace-nowrap text-right">Grand Total</th>
                  <th className="px-4 sm:px-5 py-3.5 font-semibold whitespace-nowrap">Payment</th>
                  <th className="px-4 sm:px-5 py-3.5 font-semibold whitespace-nowrap">Invoice Status</th>
                  <th className="px-4 sm:px-5 py-3.5 font-semibold whitespace-nowrap">Status</th>
                  <th className="px-4 sm:px-5 py-3.5 font-semibold whitespace-nowrap">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {currentItems.length === 0 ? (
                  <tr>
                    <td colSpan="12" className="px-5 py-16 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <TbFileInvoice size={28} className="text-gray-300" />
                        <p className="text-gray-400 text-sm">No invoices found</p>
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
                      <td className="px-4 sm:px-5 py-3.5 font-mono text-xs font-semibold text-gray-700 whitespace-nowrap">
                        <span className="inline-block bg-gray-100 px-2.5 py-1 rounded-lg">
                          {item.invoice_no || "—"}
                        </span>
                      </td>
                      <td className="px-4 sm:px-5 py-3.5 font-semibold text-gray-800">
                        <div className="flex items-center gap-2">
                          <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-gray-100 shrink-0">
                            <TbBuildingSkyscraper size={14} className="text-gray-500" />
                          </span>
                          <span className="truncate max-w-[140px]" title={item.company_name}>
                            {item.company_name}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 sm:px-5 py-3.5">
                        <span className="inline-block bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-full ring-1 ring-inset ring-blue-100 whitespace-nowrap">
                          {item.plan_name}
                        </span>
                      </td>
                      <td className="px-4 sm:px-5 py-3.5">
                        <div className="flex flex-col gap-0.5">
                          <span className="font-mono text-xs text-gray-600 whitespace-nowrap">
                            {item.transaction_no}
                          </span>
                          {item.payment_gateway !== "—" && (
                            <span className="text-[10px] text-gray-400 capitalize">
                              {item.payment_gateway}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 sm:px-5 py-3.5 text-right tabular-nums font-medium text-gray-700 whitespace-nowrap">
                        {formatCurrency(item.subtotal)}
                      </td>
                      <td className="px-4 sm:px-5 py-3.5 text-right tabular-nums text-gray-600 whitespace-nowrap">
                        {formatCurrency(item.gst)}
                      </td>
                      <td className="px-4 sm:px-5 py-3.5 text-right tabular-nums font-bold text-gray-900 whitespace-nowrap">
                        {formatCurrency(item.grand_total)}
                      </td>
                      <td className="px-4 sm:px-5 py-3.5">
                        {paymentStatusBadge(item.payment_status)}
                      </td>
                      <td className="px-4 sm:px-5 py-3.5">
                        {invoiceStatusBadge(item.invoice_status)}
                      </td>
                      <td className="px-4 sm:px-5 py-3.5">
                        {statusBadge(item.is_status)}
                      </td>
                      <td className="px-4 sm:px-5 py-3.5 text-xs text-gray-500 whitespace-nowrap">
                        {formatDate(item.created_at)}
                      </td>
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
            <span className="font-medium text-gray-700">{totalItems}</span> invoices
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

export default SubscriptionInvoice;