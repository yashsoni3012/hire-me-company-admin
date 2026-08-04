// import WelcomeCard from '../components/dashboard/WelcomeCard'
// import StatisticsCard from '../components/dashboard/StatisticsCard'
// import WeeklyOverview from '../components/dashboard/WeeklyOverview'
// import TotalHires from '../components/dashboard/TotalHires'
// import MiniStatGrid from '../components/dashboard/MiniStatGrid'
// import LocationsCard from '../components/dashboard/LocationsCard'
// import ListCard from '../components/dashboard/ListCard'
// import JobsTable from '../components/dashboard/JobsTable'
// import { NEW_APPLICATIONS, CLOSED_JOBS } from '../data/staticData'

// export default function Dashboard() {
//   return (
//     <div className="py-2 flex flex-col gap-5">
//       {/* Row 1 — Welcome + Statistics */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
//         <WelcomeCard />
//         <StatisticsCard />
//       </div>

//       {/* Row 2 — Weekly Overview / Total Hires / Mini stats */}
//       <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_280px] gap-5">
//         <WeeklyOverview />
//         <TotalHires />
//         <MiniStatGrid />
//       </div>

//       {/* Row 3 — Locations / New Applications / Closed Jobs */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
//         <LocationsCard />
//         <ListCard title="New Applications" items={NEW_APPLICATIONS} positive />
//         <ListCard title="Closed Jobs" items={CLOSED_JOBS} positive={false} />
//       </div>

//       {/* Row 4 — Job listings table */}
//       <JobsTable />
//     </div>
//   )
// }


import React, { useEffect } from 'react';
import WelcomeCard from '../components/dashboard/WelcomeCard'
import StatisticsCard from '../components/dashboard/StatisticsCard'
import WeeklyOverview from '../components/dashboard/WeeklyOverview'
import TotalHires from '../components/dashboard/TotalHires'
import MiniStatGrid from '../components/dashboard/MiniStatGrid'
import LocationsCard from '../components/dashboard/LocationsCard'
import ListCard from '../components/dashboard/ListCard'
import JobsTable from '../components/dashboard/JobsTable'
import { NEW_APPLICATIONS, CLOSED_JOBS } from '../data/staticData'
export default function Dashboard() {
 
  // --- TOKEN CATCHER INJECTION START ---
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Look at the URL query string
      const params = new URLSearchParams(window.location.search);
      const token = params.get('accessToken');
      if (token) {
        // Securely store the token exactly as your app does 
        localStorage.setItem('authToken', token);
        // Wipe the token from the browser URL history natively so the user can't manually copy-paste it
        window.history.replaceState({}, document.title, window.location.pathname);
        // (Optional) If you have a Redux useDispatch, you can trigger a reload here 
        window.location.reload(); // Hard reload strictly forces auth state to catch up locally just in case
      }
    }
  }, []);
  // --- TOKEN CATCHER INJECTION END ---
 
  return (
<div className="py-2 flex flex-col gap-5">
      {/* Row 1 — Welcome + Statistics */}
<div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
<WelcomeCard />
<StatisticsCard />
</div>
      {/* Row 2 — Weekly Overview / Total Hires / Mini stats */}
<div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_280px] gap-5">
<WeeklyOverview />
<TotalHires />
<MiniStatGrid />
</div>
      {/* Row 3 — Locations / New Applications / Closed Jobs */}
<div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
<LocationsCard />
<ListCard title="New Applications" items={NEW_APPLICATIONS} positive />
<ListCard title="Closed Jobs" items={CLOSED_JOBS} positive={false} />
</div>
      {/* Row 4 — Job listings table */}
<JobsTable />
</div>
  )
}