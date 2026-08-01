
// import { Routes, Route, Navigate } from "react-router-dom";
// import {
//   TbBuilding,
//   TbFileText,
//   TbCalendarEvent,
//   TbSettings,
//   TbChartBar,
//   TbUser,
// } from "react-icons/tb";
// import DashboardLayout from "./components/layout/DashboardLayout";
// import Dashboard from "./pages/Dashboard";
// import Candidates from "./pages/Candidates";
// import Messages from "./pages/Messages";
// import Placeholder from "./pages/Placeholder";
// import Login from "./pages/Login";
// import ForgotPassword from "./pages/ForgotPassword";
// import Profile from "./pages/Profile";
// import { ThemeProvider } from "./context/ThemeContext";
// import { ToastProvider } from "./context/ToastContext";
// import { AuthProvider, ProtectedRoute, useAuth } from "./context/AuthContext";
// import MessageToggle from "./components/ui/MessageToggle";

// import JobPost from "./pages/JobPost/JobPost";
// import JobListings from "./pages/JobListing/JobListings";
// import JobApplicants from "./pages/JobListing/JobApplicants"; // Add this import
// import ApplicantDetails from "./pages/JobListing/ApplicantDetails";
// import CommentSection from "./pages/JobListing/CommentSection";
// import JobEdit from "./pages/JobListing/JobEdit";

// // Wrapper to conditionally show MessageToggle
// function MessageToggleWrapper() {
//   const { isAuthenticated } = useAuth();
//   if (!isAuthenticated) return null;
//   return <MessageToggle />;
// }

// export default function App() {
//   return (
//     <ThemeProvider>
//       <ToastProvider>
//         <AuthProvider>
//           <Routes>
//             {/* Auth Routes - No Layout */}
//             <Route path="/login" element={<Login />} />
//             <Route path="/forgot-password" element={<ForgotPassword />} />

//             {/* Protected Routes - With Layout */}
//             <Route
//               path="/"
//               element={
//                 <ProtectedRoute>
//                   <DashboardLayout />
//                 </ProtectedRoute>
//               }
//             >
//               <Route index element={<Dashboard />} />
//               <Route path="jobs" element={<JobListings />} />
//               <Route
//                 path="jobs/:id/applicants"
//                 element={<JobApplicants />}
//               />{" "}
//               {/* Add this route */}
//               <Route path="candidates" element={<Candidates />} />
//               <Route path="messages" element={<Messages />} />
//               <Route path="profile" element={<Profile />} />
//               <Route
//                 path="companies"
//                 element={<Placeholder title="Companies" icon={TbBuilding} />}
//               />
//               <Route
//                 path="applications"
//                 element={<Placeholder title="Applications" icon={TbFileText} />}
//               />
//               <Route
//                 path="interviews"
//                 element={
//                   <Placeholder title="Interviews" icon={TbCalendarEvent} />
//                 }
//               />
//               <Route
//                 path="settings"
//                 element={<Placeholder title="Settings" icon={TbSettings} />}
//               />
//               <Route
//                 path="reports"
//                 element={<Placeholder title="Reports" icon={TbChartBar} />}
//               />
//               <Route path="job-post" element={<JobPost />} />
//               <Route path="*" element={<Navigate to="/" replace />} />

//               <Route path="/jobs/:jobId/applicants/:candidateId" element={<ApplicantDetails />} />

//               <Route path="/jobs/:jobId/applicants/:candidateId/comment/:applicationId" element={<CommentSection />} />

//                <Route path="/jobs/:id/edit" element={<JobEdit />} />
//             </Route>

//           </Routes>
//           {/* Show MessageToggle only when authenticated */}
//           <MessageToggleWrapper />
//         </AuthProvider>
//       </ToastProvider>
//     </ThemeProvider>
//   );
// }


import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import {
  TbBuilding,
  TbFileText,
  TbCalendarEvent,
  TbSettings,
  TbChartBar,
  TbUser,
} from "react-icons/tb";

// ─── Providers ──────────────────────────────────────────────────────
import { QueryProvider } from "./providers/QueryProvider";
import { ThemeProvider } from "./context/ThemeContext";
import { ToastProvider } from "./context/ToastContext";
import { AuthProvider, ProtectedRoute, useAuth } from "./context/AuthContext";

// ─── Layout ─────────────────────────────────────────────────────────
import DashboardLayout from "./components/layout/DashboardLayout";
import MessageToggle from "./components/ui/MessageToggle";
import SubscriptionPackage from "./pages/Subscription/SubscriptionPackage";
import SubscriptionTransaction from "./pages/Subscription/SubscriptionTransaction";
import SubscriptionUsage from "./pages/Subscription/SubscriptionUsage";
import SubscriptionInvoice from "./pages/Subscription/SubscriptionInvoice";

// ─── Lazy load all page components ─────────────────────────────────
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Candidates = lazy(() => import("./pages/Candidates"));
const Messages = lazy(() => import("./pages/Messages"));
const Placeholder = lazy(() => import("./pages/Placeholder"));
const Login = lazy(() => import("./pages/Login"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const Profile = lazy(() => import("./pages/Profile"));
const JobPost = lazy(() => import("./pages/JobPost/JobPost"));
const JobListings = lazy(() => import("./pages/JobListing/JobListings"));
const JobApplicants = lazy(() => import("./pages/JobListing/JobApplicants"));
const ApplicantDetails = lazy(() => import("./pages/JobListing/ApplicantDetails"));
const CommentSection = lazy(() => import("./pages/JobListing/CommentSection"));
const JobEdit = lazy(() => import("./pages/JobListing/JobEdit"));

// ─── Loading fallback ──────────────────────────────────────────────
const PageLoader = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
  </div>
);

// ─── Wrapper for MessageToggle ─────────────────────────────────────
function MessageToggleWrapper() {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return null;
  return <MessageToggle />;
}

// ─── Main App ──────────────────────────────────────────────────────
export default function App() {
  return (
    <QueryProvider>
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <Routes>
              {/* ── Auth Routes (no layout) ── */}
              <Route
                path="/login"
                element={
                  <Suspense fallback={<PageLoader />}>
                    <Login />
                  </Suspense>
                }
              />
              <Route
                path="/forgot-password"
                element={
                  <Suspense fallback={<PageLoader />}>
                    <ForgotPassword />
                  </Suspense>
                }
              />

              {/* ── Protected Routes (with DashboardLayout) ── */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route
                  index
                  element={
                    <Suspense fallback={<PageLoader />}>
                      <Dashboard />
                    </Suspense>
                  }
                />
                <Route
                  path="jobs"
                  element={
                    <Suspense fallback={<PageLoader />}>
                      <JobListings />
                    </Suspense>
                  }
                />
                <Route
                  path="jobs/:id/applicants"
                  element={
                    <Suspense fallback={<PageLoader />}>
                      <JobApplicants />
                    </Suspense>
                  }
                />
                <Route
                  path="jobs/:jobId/applicants/:candidateId"
                  element={
                    <Suspense fallback={<PageLoader />}>
                      <ApplicantDetails />
                    </Suspense>
                  }
                />
                <Route
                  path="jobs/:jobId/applicants/:candidateId/comment/:applicationId"
                  element={
                    <Suspense fallback={<PageLoader />}>
                      <CommentSection />
                    </Suspense>
                  }
                />
                <Route
                  path="jobs/:id/edit"
                  element={
                    <Suspense fallback={<PageLoader />}>
                      <JobEdit />
                    </Suspense>
                  }
                />
                <Route
                  path="candidates"
                  element={
                    <Suspense fallback={<PageLoader />}>
                      <Candidates />
                    </Suspense>
                  }
                />
                <Route
                  path="messages"
                  element={
                    <Suspense fallback={<PageLoader />}>
                      <Messages />
                    </Suspense>
                  }
                />
                <Route
                  path="profile"
                  element={
                    <Suspense fallback={<PageLoader />}>
                      <Profile />
                    </Suspense>
                  }
                />
                <Route
                  path="companies"
                  element={
                    <Suspense fallback={<PageLoader />}>
                      <Placeholder title="Companies" icon={TbBuilding} />
                    </Suspense>
                  }
                />
                <Route
                  path="applications"
                  element={
                    <Suspense fallback={<PageLoader />}>
                      <Placeholder title="Applications" icon={TbFileText} />
                    </Suspense>
                  }
                />
                <Route
                  path="interviews"
                  element={
                    <Suspense fallback={<PageLoader />}>
                      <Placeholder title="Interviews" icon={TbCalendarEvent} />
                    </Suspense>
                  }
                />
                <Route
                  path="settings"
                  element={
                    <Suspense fallback={<PageLoader />}>
                      <Placeholder title="Settings" icon={TbSettings} />
                    </Suspense>
                  }
                />
                <Route
                  path="reports"
                  element={
                    <Suspense fallback={<PageLoader />}>
                      <Placeholder title="Reports" icon={TbChartBar} />
                    </Suspense>
                  }
                />
                <Route
                  path="job-post"
                  element={
                    <Suspense fallback={<PageLoader />}>
                      <JobPost />
                    </Suspense>
                  }
                />
                <Route
                  path="company-subscription"
                  element={
                    <Suspense fallback={<PageLoader />}>
                      <SubscriptionPackage />
                    </Suspense>
                  }
                />
                <Route
                  path="subscription-usage"
                  element={
                    <Suspense fallback={<PageLoader />}>
                      <SubscriptionUsage />
                    </Suspense>
                  }
                />
                <Route
                  path="subscription-invoice"
                  element={
                    <Suspense fallback={<PageLoader />}>
                      <SubscriptionInvoice />
                    </Suspense>
                  }
                />
               
                 <Route
                  path="subscription-transaction"
                  element={
                    <Suspense fallback={<PageLoader />}>
                      <SubscriptionTransaction />
                    </Suspense>
                  }
                />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
            </Routes>

            {/* ── Global floating toggle ── */}
            <MessageToggleWrapper />
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </QueryProvider>
  );
}