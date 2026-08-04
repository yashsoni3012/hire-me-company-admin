// import React, { useEffect, useState, useMemo } from "react";
// import {
//   Briefcase,
//   X,
//   Loader2,
//   AlertCircle,
//   CheckCircle2,
//   Clock,
//   XCircle,
//   ChevronRight,
//   Layers,
// } from "lucide-react";

// const API_URL = "https://hire-me-jobs.onrender.com/subscription-usage/";

// // ---- Get logged-in company_id from localStorage ----
// // Checks a few common key names/shapes. Console logs what it finds so you can
// // verify in devtools if something still looks off.
// const getCompanyId = () => {
//   const possibleKeys = ["user", "userData", "authUser", "loginData", "Companies", "company"];

//   for (const key of possibleKeys) {
//     try {
//       const raw = localStorage.getItem(key);
//       if (!raw) continue;
//       const parsed = JSON.parse(raw);

//       if (parsed?.Companies?.[0]?.company_id != null) {
//         return parsed.Companies[0].company_id;
//       }
//       if (Array.isArray(parsed) && parsed[0]?.company_id != null) {
//         return parsed[0].company_id;
//       }
//       if (parsed?.company_id != null) {
//         return parsed.company_id;
//       }
//     } catch {
//       // not JSON / not relevant, try next key
//     }
//   }
//   return null;
// };

// // ---- Status badge styling ----
// const statusConfig = {
//   active: {
//     label: "Active",
//     icon: CheckCircle2,
//     className: "bg-emerald-50 text-emerald-600 border-emerald-200",
//   },
//   pending: {
//     label: "Pending",
//     icon: Clock,
//     className: "bg-amber-50 text-amber-600 border-amber-200",
//   },
//   expired: {
//     label: "Expired",
//     icon: XCircle,
//     className: "bg-rose-50 text-rose-600 border-rose-200",
//   },
// };

// const StatusBadge = ({ status }) => {
//   const config = statusConfig[status] || {
//     label: status || "Unknown",
//     icon: AlertCircle,
//     className: "bg-slate-100 text-slate-500 border-slate-200",
//   };
//   const Icon = config.icon;
//   return (
//     <span
//       className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${config.className}`}
//     >
//       <Icon size={12} />
//       {config.label}
//     </span>
//   );
// };

// // ---- Feature Card ----
// const FeatureCard = ({ feature, index, onClick }) => {
//   const totalRemaining = feature.plans.reduce(
//     (sum, p) => sum + (Number(p.remaining_value) || 0),
//     0
//   );
//   const totalUsed = feature.plans.reduce(
//     (sum, p) => sum + (Number(p.used_value) || 0),
//     0
//   );
//   const hasActive = feature.plans.some((p) => p.subscription_status === "active");

//   return (
//     <button
//       onClick={() => onClick(feature)}
//       style={{ animationDelay: `${index * 60}ms` }}
//       className="group relative text-left w-full bg-white rounded-2xl border border-slate-200
//                  p-5 shadow-sm hover:shadow-lg hover:border-purple-300
//                  transition-all duration-300 hover:-translate-y-1
//                  animate-[fadeSlideUp_0.5s_ease-out_both]"
//     >
//       <div className="flex items-start justify-between mb-4">
//         <div
//           className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-500 to-purple-700
//                      flex items-center justify-center text-white shadow-md shadow-purple-200
//                      group-hover:scale-110 transition-transform duration-300"
//         >
//           <Briefcase size={20} />
//         </div>
//         {hasActive && (
//           <span className="relative flex h-2.5 w-2.5">
//             <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
//             <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
//           </span>
//         )}
//       </div>

//       <h3 className="text-slate-800 font-semibold text-[15px] mb-1 line-clamp-1">
//         {feature.feature_name}
//       </h3>
//       <p className="text-xs text-slate-400 mb-4">
//         {feature.plans.length} plan{feature.plans.length > 1 ? "s" : ""} linked
//       </p>

//       <div className="flex items-center justify-between text-sm mb-1">
//         <span className="text-slate-500">Remaining</span>
//         <span className="font-semibold text-purple-600">{totalRemaining}</span>
//       </div>
//       <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mb-4">
//         <div
//           className="h-full bg-gradient-to-r from-purple-400 to-purple-600 rounded-full transition-all duration-700"
//           style={{
//             width: `${
//               totalUsed + totalRemaining > 0
//                 ? (totalRemaining / (totalUsed + totalRemaining)) * 100
//                 : 0
//             }%`,
//           }}
//         />
//       </div>

//       <div className="flex items-center justify-between">
//         <span className="text-xs text-slate-400">Used: {totalUsed}</span>
//         <span
//           className="inline-flex items-center gap-1 text-xs font-medium text-purple-500
//                      group-hover:gap-1.5 transition-all duration-300"
//         >
//           View plans
//           <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
//         </span>
//       </div>
//     </button>
//   );
// };

// // ---- Plans Modal ----
// const PlansModal = ({ feature, onClose }) => {
//   if (!feature) return null;

//   return (
//     <div
//       className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm
//                  animate-[fadeIn_0.2s_ease-out]"
//       onClick={onClose}
//     >
//       <div
//         onClick={(e) => e.stopPropagation()}
//         className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden
//                    animate-[scaleIn_0.25s_cubic-bezier(0.16,1,0.3,1)] max-h-[85vh] flex flex-col"
//       >
//         {/* Header */}
//         <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-purple-50 to-white">
//           <div className="flex items-center gap-3">
//             <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center text-white">
//               <Layers size={18} />
//             </div>
//             <div>
//               <h2 className="font-semibold text-slate-800 text-[15px]">
//                 {feature.feature_name}
//               </h2>
//               <p className="text-xs text-slate-400">
//                 {feature.plans.length} plan{feature.plans.length > 1 ? "s" : ""} · Feature ID #{feature.id}
//               </p>
//             </div>
//           </div>
//           <button
//             onClick={onClose}
//             className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400
//                        hover:bg-slate-100 hover:text-slate-700 transition-colors"
//           >
//             <X size={18} />
//           </button>
//         </div>

//         {/* Table */}
//         <div className="overflow-auto flex-1">
//           <table className="w-full text-sm">
//             <thead className="sticky top-0 bg-slate-50 text-slate-500 text-xs uppercase tracking-wide">
//               <tr>
//                 <th className="text-left font-medium px-6 py-3">Plan</th>
//                 <th className="text-left font-medium px-4 py-3">Type</th>
//                 <th className="text-left font-medium px-4 py-3">Status</th>
//                 <th className="text-right font-medium px-4 py-3">Allocated</th>
//                 <th className="text-right font-medium px-4 py-3">Used</th>
//                 <th className="text-right font-medium px-4 py-3">Remaining</th>
//                 <th className="text-left font-medium px-6 py-3">Last Used</th>
//               </tr>
//             </thead>
//             <tbody>
//               {feature.plans.map((plan, i) => (
//                 <tr
//                   key={`${plan.company_subscription_id}-${i}`}
//                   className="border-t border-slate-100 hover:bg-purple-50/40 transition-colors"
//                   style={{ animationDelay: `${i * 40}ms` }}
//                 >
//                   <td className="px-6 py-3.5 font-medium text-slate-700">
//                     {plan.plan_name}
//                   </td>
//                   <td className="px-4 py-3.5 text-slate-500">{plan.subscription_type}</td>
//                   <td className="px-4 py-3.5">
//                     <StatusBadge status={plan.subscription_status} />
//                   </td>
//                   <td className="px-4 py-3.5 text-right text-slate-600">
//                     {plan.allocated_value}
//                   </td>
//                   <td className="px-4 py-3.5 text-right text-slate-600">{plan.used_value}</td>
//                   <td className="px-4 py-3.5 text-right font-semibold text-purple-600">
//                     {plan.remaining_value}
//                   </td>
//                   <td className="px-6 py-3.5 text-slate-400 text-xs">
//                     {plan.last_used_at
//                       ? new Date(plan.last_used_at).toLocaleString()
//                       : "—"}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// // ---- Main Component ----
// const SubscriptionUsage = () => {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedFeature, setSelectedFeature] = useState(null);

//   const companyId = useMemo(() => getCompanyId(), []);

//   useEffect(() => {
//     const fetchUsage = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         const res = await fetch(API_URL);
//         if (!res.ok) throw new Error(`Request failed (${res.status})`);
//         const json = await res.json();

//         const rawFeatures = json.data || [];

//         // Loose match on company_id (handles "5" vs 5 mismatch).
//         // If filtering ends up removing everything, fall back to raw data
//         // instead of showing an empty/wrong screen.
//         let features = rawFeatures;
//         if (companyId != null) {
//           const filtered = rawFeatures
//             .map((f) => ({
//               ...f,
//               plans: f.plans.filter(
//                 (p) => Number(p.company_id) === Number(companyId)
//               ),
//             }))
//             .filter((f) => f.plans.length > 0);

//           if (filtered.length > 0) {
//             features = filtered;
//           } else {
//             console.warn(
//               "[SubscriptionUsage] No plans matched company_id:",
//               companyId,
//               "— showing unfiltered data instead."
//             );
//           }
//         }

//         setData(features);
//       } catch (err) {
//         setError(err.message || "Something went wrong");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUsage();
//   }, [companyId]);

//   return (
//     <div className="min-h-screen bg-slate-50 p-6 md:p-8">
//       <style>{`
//         @keyframes fadeSlideUp {
//           from { opacity: 0; transform: translateY(14px); }
//           to { opacity: 1; transform: translateY(0); }
//         }
//         @keyframes fadeIn {
//           from { opacity: 0; }
//           to { opacity: 1; }
//         }
//         @keyframes scaleIn {
//           from { opacity: 0; transform: scale(0.94) translateY(8px); }
//           to { opacity: 1; transform: scale(1) translateY(0); }
//         }
//       `}</style>

//       <div className="max-w-6xl mx-auto">
//         <div className="mb-6">
//           <h1 className="text-xl md:text-2xl font-bold text-slate-800">
//             Subscription Usage
//           </h1>
//           <p className="text-sm text-slate-400 mt-1">
//             Track feature-wise plan allocation and usage
//           </p>
//         </div>

//         {loading && (
//           <div className="flex flex-col items-center justify-center py-24 text-slate-400">
//             <Loader2 className="animate-spin mb-3" size={28} />
//             <p className="text-sm">Loading subscription data...</p>
//           </div>
//         )}

//         {!loading && error && (
//           <div className="flex flex-col items-center justify-center py-24 text-rose-500">
//             <AlertCircle size={28} className="mb-3" />
//             <p className="text-sm font-medium">{error}</p>
//           </div>
//         )}

//         {!loading && !error && data.length === 0 && (
//           <div className="flex flex-col items-center justify-center py-24 text-slate-400">
//             <Layers size={28} className="mb-3" />
//             <p className="text-sm">No subscription usage data found</p>
//           </div>
//         )}

//         {!loading && !error && data.length > 0 && (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
//             {data.map((feature, index) => (
//               <FeatureCard
//                 key={feature.id}
//                 feature={feature}
//                 index={index}
//                 onClick={setSelectedFeature}
//               />
//             ))}
//           </div>
//         )}
//       </div>

//       <PlansModal feature={selectedFeature} onClose={() => setSelectedFeature(null)} />
//     </div>
//   );
// };

// export default SubscriptionUsage;

import React, { useEffect, useState, useMemo } from "react";
import {
  Briefcase,
  Loader2,
  AlertCircle,
  Layers,
  Calendar,
} from "lucide-react";

const API_URL = "https://hire-me-jobs.onrender.com/subscription-usage/";

// ---- Get logged-in company_id from localStorage ----
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

// ---- Status badge (for subscription status) ----
const StatusBadge = ({ status }) => {
  const configs = {
    active: "bg-emerald-50 text-emerald-700 border-emerald-200",
    pending: "bg-amber-50 text-amber-700 border-amber-200",
    expired: "bg-rose-50 text-rose-700 border-rose-200",
  };
  const cls = configs[status] || "bg-slate-100 text-slate-500 border-slate-200";
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${cls}`}>
      {status ? status.charAt(0).toUpperCase() + status.slice(1) : "Unknown"}
    </span>
  );
};

// ---- Plan Card (one per plan, with all features in a table) ----
const PlanCard = ({ plan, index }) => {
  const features = plan.features || [];

  // Calculate totals for the progress bar
  const totalAllocated = features.reduce((sum, f) => sum + (Number(f.allocated_value) || 0), 0);
  const totalUsed = features.reduce((sum, f) => sum + (Number(f.used_value) || 0), 0);
  const totalRemaining = features.reduce((sum, f) => sum + (Number(f.remaining_value) || 0), 0);
  const total = totalAllocated + totalUsed;
  const progress = total > 0 ? (totalRemaining / total) * 100 : 0;

  return (
    <div
      style={{ animationDelay: `${index * 60}ms` }}
      className="group w-full bg-white rounded-2xl border border-slate-200
                 shadow-sm hover:shadow-lg hover:border-purple-300
                 transition-all duration-300 hover:-translate-y-1
                 animate-[fadeSlideUp_0.5s_ease-out_both] overflow-hidden"
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-5 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-700
                       flex items-center justify-center text-white shadow-md shadow-purple-200
                       group-hover:scale-110 transition-transform duration-300 shrink-0"
          >
            <Briefcase size={18} />
          </div>
          <div className="min-w-0">
            <h3 className="text-slate-800 font-semibold text-[15px] line-clamp-1">
              {plan.plan_name}
            </h3>
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
              <span>{plan.company_name}</span>
              <span>·</span>
              <span>{plan.subscription_type}</span>
              <span>·</span>
              <StatusBadge status={plan.subscription_status} />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400 shrink-0">
          <Calendar size={14} />
          <span>{new Date(plan.start_date).toLocaleDateString()}</span>
          <span>→</span>
          <span>{new Date(plan.expiry_date).toLocaleDateString()}</span>
        </div>
      </div>

      {/* Summary stats */}
      <div className="flex flex-wrap items-center gap-4 px-5 py-2.5 bg-slate-50/50 border-b border-slate-100 text-xs">
        <span className="text-slate-500">
          Total Used: <span className="font-medium text-slate-700">{totalUsed}</span>
        </span>
        <span className="text-slate-500">
          Total Remaining: <span className="font-medium text-purple-600">{totalRemaining}</span>
        </span>
        <div className="flex-1 min-w-[80px]">
          <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-400 to-purple-600 rounded-full transition-all duration-700"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Features Table */}
      <div className="overflow-x-auto px-5 py-3">
        <table className="w-full text-sm">
          <thead className="bg-slate-50/80 text-slate-500 text-xs uppercase tracking-wide">
            <tr>
              <th className="text-left font-medium px-3 py-2.5 rounded-tl-lg">Feature</th>
              <th className="text-right font-medium px-3 py-2.5">Allocated</th>
              <th className="text-right font-medium px-3 py-2.5">Used</th>
              <th className="text-right font-medium px-3 py-2.5">Remaining</th>
              <th className="text-left font-medium px-3 py-2.5 rounded-tr-lg">Last Used</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {features.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-3 py-4 text-center text-slate-400 text-sm">
                  No features available for this plan
                </td>
              </tr>
            ) : (
              features.map((feature, i) => {
                const allocated = Number(feature.allocated_value) || 0;
                const used = Number(feature.used_value) || 0;
                const remaining = Number(feature.remaining_value) || 0;
                return (
                  <tr
                    key={feature.subscription_feature_id || i}
                    className="hover:bg-purple-50/30 transition-colors"
                  >
                    <td className="px-3 py-2.5 font-medium text-slate-700">
                      {feature.feature_name}
                    </td>
                    <td className="px-3 py-2.5 text-right text-slate-600">{allocated}</td>
                    <td className="px-3 py-2.5 text-right text-slate-600">{used}</td>
                    <td className="px-3 py-2.5 text-right font-semibold text-purple-600">
                      {remaining}
                    </td>
                    <td className="px-3 py-2.5 text-slate-400 text-xs">
                      {feature.last_used_at
                        ? new Date(feature.last_used_at).toLocaleString()
                        : "—"}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ---- Main Component ----
const SubscriptionUsage = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const companyId = useMemo(() => getCompanyId(), []);

  useEffect(() => {
    const fetchUsage = async () => {
      setLoading(true);
      setError(null);
      try {
        const url = companyId ? `${API_URL}?company_id=${companyId}` : API_URL;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Request failed (${res.status})`);
        const json = await res.json();

        let allPlans = json.data || [];

        // Client-side filter as fallback
        if (companyId) {
          allPlans = allPlans.filter(
            (plan) => Number(plan.company_id) === Number(companyId)
          );
        }

        setPlans(allPlans);
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
      `}</style>

      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 className="text-xl md:text-2xl font-bold text-slate-800">
            Subscription Usage
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Track feature allocation and usage for your company
          </p>
          {companyId && (
            <p className="text-xs text-slate-400 mt-0.5">
              Company ID: {companyId} · {plans.length} plan(s)
            </p>
          )}
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

        {!loading && !error && plans.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-slate-400">
            <Layers size={28} className="mb-3" />
            <p className="text-sm">No subscription plans found for your company</p>
          </div>
        )}

        {!loading && !error && plans.length > 0 && (
          <div className="grid grid-cols-1 gap-6">
            {plans.map((plan, index) => (
              <PlanCard key={plan.id} plan={plan} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscriptionUsage;