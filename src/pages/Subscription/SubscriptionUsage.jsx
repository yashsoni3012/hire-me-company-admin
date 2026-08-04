// import React, { useEffect, useState, useMemo } from "react";
// import {
//   Briefcase,
//   Loader2,
//   AlertCircle,
//   Layers,
//   CheckCircle2,
//   Clock,
//   XCircle,
// } from "lucide-react";

// const API_URL = "https://hire-me-jobs.onrender.com/subscription-usage/grouped";

// // ---- Get logged‑in company_id from localStorage ----
// const getCompanyId = () => {
//   try {
//     const storedUser = localStorage.getItem("user");
//     if (!storedUser) return null;
//     const parsed = JSON.parse(storedUser);
//     if (parsed?.company_id != null) return parsed.company_id;
//     if (parsed?.Companies?.[0]?.company_id != null) return parsed.Companies[0].company_id;
//     if (parsed?.data?.user?.company_id != null) return parsed.data.user.company_id;
//     if (parsed?.data?.user?.Companies?.[0]?.company_id != null) return parsed.data.user.Companies[0].company_id;
//   } catch {}
//   // fallbacks...
//   return null;
// };

// // ---- Status badge ----
// const StatusBadge = ({ status }) => {
//   const configs = {
//     active: { icon: CheckCircle2, cls: "bg-emerald-50 text-emerald-700 border-emerald-200" },
//     pending: { icon: Clock, cls: "bg-amber-50 text-amber-700 border-amber-200" },
//     expired: { icon: XCircle, cls: "bg-rose-50 text-rose-700 border-rose-200" },
//   };
//   const config = configs[status] || {
//     icon: AlertCircle,
//     cls: "bg-slate-100 text-slate-500 border-slate-200",
//   };
//   const Icon = config.icon;
//   return (
//     <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${config.cls}`}>
//       <Icon size={12} />
//       {status ? status.charAt(0).toUpperCase() + status.slice(1) : "Unknown"}
//     </span>
//   );
// };

// // ---- Plan Card Component ----
// const PlanCard = ({ plan, index }) => {
//   const features = plan.features || [];
//   const totalAllocated = features.reduce((sum, f) => sum + (Number(f.allocated_value) || 0), 0);
//   const totalUsed = features.reduce((sum, f) => sum + (Number(f.used_value) || 0), 0);
//   const totalRemaining = features.reduce((sum, f) => sum + (Number(f.remaining_value) || 0), 0);
//   const total = totalAllocated + totalUsed;
//   const progress = total > 0 ? (totalRemaining / total) * 100 : 0;

//   return (
//     <div
//       style={{ animationDelay: `${index * 60}ms` }}
//       className="group w-full bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-purple-300 transition-all duration-300 hover:-translate-y-1 animate-[fadeSlideUp_0.5s_ease-out_both] overflow-hidden"
//     >
//       {/* Header */}
//       <div className="flex flex-wrap items-center justify-between gap-2 p-5 pb-3 border-b border-slate-100">
//         <div className="flex items-center gap-3 min-w-0">
//           <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-white shadow-md shadow-purple-200 group-hover:scale-110 transition-transform duration-300 shrink-0">
//             <Briefcase size={18} />
//           </div>
//           <div className="min-w-0">
//             <h3 className="text-slate-800 font-semibold text-[15px] line-clamp-1">
//               {plan.plan_name}
//             </h3>
//             <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
//               <span className="font-medium text-slate-600">{plan.company_name}</span>
//               <span>·</span>
//               <span>{plan.subscription_type}</span>
//               <span>·</span>
//               <StatusBadge status={plan.subscription_status} />
//             </div>
//           </div>
//         </div>
//         <div className="flex items-center gap-2 text-xs text-slate-400 shrink-0">
//           <span className="text-xs">Expires: {new Date(plan.expiry_date).toLocaleDateString()}</span>
//         </div>
//       </div>

//       {/* Summary */}
//       <div className="flex flex-wrap items-center gap-4 px-5 py-2.5 bg-slate-50/50 border-b border-slate-100 text-xs">
//         <span className="text-slate-500">
//           Used: <span className="font-medium text-slate-700">{totalUsed}</span>
//         </span>
//         <span className="text-slate-500">
//           Remaining: <span className="font-medium text-purple-600">{totalRemaining}</span>
//         </span>
//         <div className="flex-1 min-w-[80px]">
//           <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
//             <div
//               className="h-full bg-gradient-to-r from-purple-400 to-purple-600 rounded-full transition-all duration-700"
//               style={{ width: `${Math.min(progress, 100)}%` }}
//             />
//           </div>
//         </div>
//       </div>

//       {/* Features Table */}
//       <div className="overflow-x-auto px-5 py-3">
//         <table className="w-full text-sm">
//           <thead className="bg-slate-50/80 text-slate-500 text-xs uppercase tracking-wide">
//             <tr>
//               <th className="text-left font-medium px-3 py-2.5">Feature</th>
//               <th className="text-right font-medium px-3 py-2.5">Allocated</th>
//               <th className="text-right font-medium px-3 py-2.5">Used</th>
//               <th className="text-right font-medium px-3 py-2.5">Remaining</th>
//               <th className="text-left font-medium px-3 py-2.5">Last Used</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-slate-100">
//             {features.length === 0 ? (
//               <tr>
//                 <td colSpan="5" className="px-3 py-4 text-center text-slate-400 text-sm">
//                   No features available for this plan
//                 </td>
//               </tr>
//             ) : (
//               features.map((feature, idx) => (
//                 <tr key={feature.subscription_feature_id || idx} className="hover:bg-purple-50/30 transition-colors">
//                   <td className="px-3 py-2.5 font-medium text-slate-700">{feature.feature_name}</td>
//                   <td className="px-3 py-2.5 text-right text-slate-600">{feature.allocated_value}</td>
//                   <td className="px-3 py-2.5 text-right text-slate-600">{feature.used_value}</td>
//                   <td className="px-3 py-2.5 text-right font-semibold text-purple-600">{feature.remaining_value}</td>
//                   <td className="px-3 py-2.5 text-slate-400 text-xs">
//                     {feature.last_used_at ? new Date(feature.last_used_at).toLocaleString() : "—"}
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// // ---- Main Component ----
// const SubscriptionUsage = () => {
//   const [plans, setPlans] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const companyId = useMemo(() => getCompanyId(), []);

//   useEffect(() => {
//     if (companyId === null) {
//       setLoading(false);
//       setError("Could not find your company ID. Please log in again.");
//       return;
//     }

//     const fetchUsage = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         const url = `${API_URL}?company_id=${companyId}`;
//         const res = await fetch(url);
//         if (!res.ok) throw new Error(`Request failed (${res.status})`);
//         const json = await res.json();

//         let allPlans = json.data || [];
//         allPlans = allPlans.filter((plan) => Number(plan.company_id) === Number(companyId));
//         allPlans = allPlans.map((plan) => ({
//           ...plan,
//           features: plan.features || [],
//         }));

//         setPlans(allPlans);
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
//       `}</style>

//       <div className="max-w-6xl mx-auto">
//         <div className="mb-6">
//           <h1 className="text-xl md:text-2xl font-bold text-slate-800">Subscription Usage</h1>
//           <p className="text-sm text-slate-400 mt-1">Track feature allocation and usage for your company</p>
//           {companyId && (
//             <p className="text-xs text-slate-400 mt-0.5">
//               Company ID: {companyId} · {plans.length} plan{plans.length !== 1 ? "s" : ""}
//             </p>
//           )}
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

//         {!loading && !error && plans.length === 0 && (
//           <div className="flex flex-col items-center justify-center py-24 text-slate-400">
//             <Layers size={28} className="mb-3" />
//             <p className="text-sm">No subscription plans found for your company</p>
//           </div>
//         )}

//         {!loading && !error && plans.length > 0 && (
//           <div className="grid grid-cols-1 gap-6">
//             {plans.map((plan, index) => (
//               <PlanCard key={plan.id} plan={plan} index={index} />
//             ))}
//           </div>
//         )}
//       </div>
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
  CheckCircle2,
  Clock,
  XCircle,
  Calendar,
} from "lucide-react";

const API_URL = "https://hire-me-jobs.onrender.com/subscription-usage/grouped";

// ---- Get logged‑in company_id from localStorage ----
const getCompanyId = () => {
  try {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return null;
    const parsed = JSON.parse(storedUser);
    if (parsed?.company_id != null) return parsed.company_id;
    if (parsed?.Companies?.[0]?.company_id != null) return parsed.Companies[0].company_id;
    if (parsed?.data?.user?.company_id != null) return parsed.data.user.company_id;
    if (parsed?.data?.user?.Companies?.[0]?.company_id != null) return parsed.data.user.Companies[0].company_id;
  } catch {}

  const possibleKeys = ["userData", "authUser", "loginData", "company"];
  for (const key of possibleKeys) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) continue;
      const p = JSON.parse(raw);
      if (p?.company_id != null) return p.company_id;
      if (p?.Companies?.[0]?.company_id != null) return p.Companies[0].company_id;
      if (p?.data?.user?.company_id != null) return p.data.user.company_id;
    } catch {}
  }

  const direct = localStorage.getItem("company_id");
  if (direct) return Number(direct);
  return null;
};

// ---- Status badge ----
const StatusBadge = ({ status }) => {
  const configs = {
    active: { icon: CheckCircle2, cls: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    pending: { icon: Clock, cls: "bg-amber-50 text-amber-700 border-amber-200" },
    expired: { icon: XCircle, cls: "bg-rose-50 text-rose-700 border-rose-200" },
  };
  const config = configs[status] || {
    icon: AlertCircle,
    cls: "bg-slate-100 text-slate-500 border-slate-200",
  };
  const Icon = config.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${config.cls}`}>
      <Icon size={12} />
      {status ? status.charAt(0).toUpperCase() + status.slice(1) : "Unknown"}
    </span>
  );
};

// ---- Plan Card Component ----
const PlanCard = ({ plan, index }) => {
  const features = plan.features || [];
  const totalAllocated = features.reduce((sum, f) => sum + (Number(f.allocated_value) || 0), 0);
  const totalUsed = features.reduce((sum, f) => sum + (Number(f.used_value) || 0), 0);
  const totalRemaining = features.reduce((sum, f) => sum + (Number(f.remaining_value) || 0), 0);
  const total = totalAllocated + totalUsed;
  const progress = total > 0 ? (totalRemaining / total) * 100 : 0;

  return (
    <div
      style={{ animationDelay: `${index * 60}ms` }}
      className="group w-full bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-purple-300 transition-all duration-300 hover:-translate-y-1 animate-[fadeSlideUp_0.5s_ease-out_both] overflow-hidden"
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-5 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-white shadow-md shadow-purple-200 group-hover:scale-110 transition-transform duration-300 shrink-0">
            <Briefcase size={18} />
          </div>
          <div className="min-w-0">
            <h3 className="text-slate-800 font-semibold text-[15px] line-clamp-1">
              {plan.plan_name}
            </h3>
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
              <span className="font-medium text-slate-600">{plan.company_name}</span>
              <span>·</span>
              <span>{plan.subscription_type}</span>
              <span>·</span>
              <StatusBadge status={plan.subscription_status} />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400 shrink-0">
          <Calendar size={14} />
          <span className="text-xs">
            {new Date(plan.start_date).toLocaleDateString()} → {new Date(plan.expiry_date).toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Summary */}
      <div className="flex flex-wrap items-center gap-4 px-5 py-2.5 bg-slate-50/50 border-b border-slate-100 text-xs">
        <span className="text-slate-500">
          Used: <span className="font-medium text-slate-700">{totalUsed}</span>
        </span>
        <span className="text-slate-500">
          Remaining: <span className="font-medium text-purple-600">{totalRemaining}</span>
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
              <th className="text-left font-medium px-3 py-2.5">Feature</th>
              <th className="text-right font-medium px-3 py-2.5">Allocated</th>
              <th className="text-right font-medium px-3 py-2.5">Used</th>
              <th className="text-right font-medium px-3 py-2.5">Remaining</th>
              <th className="text-left font-medium px-3 py-2.5">Last Used</th>
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
              features.map((feature, idx) => (
                <tr key={feature.subscription_feature_id || idx} className="hover:bg-purple-50/30 transition-colors">
                  <td className="px-3 py-2.5 font-medium text-slate-700">{feature.feature_name}</td>
                  <td className="px-3 py-2.5 text-right text-slate-600">{feature.allocated_value}</td>
                  <td className="px-3 py-2.5 text-right text-slate-600">{feature.used_value}</td>
                  <td className="px-3 py-2.5 text-right font-semibold text-purple-600">{feature.remaining_value}</td>
                  <td className="px-3 py-2.5 text-slate-400 text-xs">
                    {feature.last_used_at ? new Date(feature.last_used_at).toLocaleString() : "—"}
                  </td>
                </tr>
              ))
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
    if (companyId === null) {
      setLoading(false);
      setError("Could not find your company ID. Please log in again.");
      return;
    }

    const fetchUsage = async () => {
      setLoading(true);
      setError(null);
      try {
        // Use the grouped endpoint
        const url = `${API_URL}?company_id=${companyId}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Request failed (${res.status})`);
        const json = await res.json();

        // Extract the plans array – the API returns { data: [ ... ] }
        let allPlans = json?.data || [];

        // Optional: client-side filter as a safety net
        if (companyId) {
          allPlans = allPlans.filter(
            (plan) => Number(plan.company_id) === Number(companyId)
          );
        }

        // Ensure features array exists
        allPlans = allPlans.map((plan) => ({
          ...plan,
          features: plan.features || [],
        }));

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

      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-xl md:text-2xl font-bold text-slate-800">
            Subscription Usage
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Track feature allocation and usage for your company
          </p>
          {companyId && (
            <p className="text-xs text-slate-400 mt-0.5">
              Company ID: {companyId} · {plans.length} plan{plans.length !== 1 ? "s" : ""}
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
              <PlanCard key={plan.id || index} plan={plan} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscriptionUsage;