import { useState, useEffect } from "react";
import {
  TbUser,
  TbMail,
  TbPhone,
  TbMapPin,
  TbBriefcase,
  TbCalendar,
  TbEdit,
  TbX,
  TbShield,
  TbBuilding,
  TbUsers,
  TbFileText,
  TbChartBar,
  TbGlobe,
  TbInfoCircle,
  TbId,
  TbCheck,
  TbClock,
  TbEye,
  TbEyeOff,
  TbCode,
  TbHash,
  TbFlag,
  TbPercentage,
  TbBuildingFactory,
  TbDeviceMobile,
  TbCircleCheck,
  TbCircleX,
  TbLogin2,
  TbBrandGoogle,
  TbBrandLinkedin,
  TbHistory,
  TbUserCircle,
  TbLock,
  TbArrowLeft,
  TbKey,
  TbLoader2,
} from "react-icons/tb";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { Card } from "../components/ui/Card";
import Avatar from "../components/ui/Avatar";
import Button from "../components/ui/Button";
import { buildApiUrl } from "../config/api";

export default function Profile() {
  const { user, token, updateUser, logout } = useAuth();
  const { showError, showSuccess } = useToast();
  const [loading, setLoading] = useState(true);
  const [companyUser, setCompanyUser] = useState(null);
  const [companyData, setCompanyData] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // ---------- Local storage user details side panel ----------
  const [showUserPanel, setShowUserPanel] = useState(false);
  const [localUserData, setLocalUserData] = useState(null);
  const [localUserError, setLocalUserError] = useState(false);

  // ---------- Panel view: "details" | "reset" ----------
  const [panelView, setPanelView] = useState("details");

  // ---------- Reset password form state ----------
  const [resetForm, setResetForm] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState("");
  const [resetSuccess, setResetSuccess] = useState("");

  const getLocalStorageUser = () => {
    try {
      // Try common keys used to store the logged-in user object
      const raw =
        localStorage.getItem("user") ||
        localStorage.getItem("userData") ||
        localStorage.getItem("loggedInUser") ||
        localStorage.getItem("authUser");

      if (!raw) {
        setLocalUserError(true);
        setLocalUserData(null);
        return;
      }

      const parsed = JSON.parse(raw);
      setLocalUserData(parsed);
      setLocalUserError(false);
    } catch (error) {
      console.error("❌ Failed to parse user from localStorage:", error);
      setLocalUserError(true);
      setLocalUserData(null);
    }
  };

  const handleToggleUserPanel = () => {
    if (!showUserPanel) {
      getLocalStorageUser();
      setPanelView("details");
      setResetForm({
        old_password: "",
        new_password: "",
        confirm_password: "",
      });
      setResetError("");
      setResetSuccess("");
    }
    setShowUserPanel((prev) => !prev);
  };

  const closeUserPanel = () => {
    setShowUserPanel(false);
    // Reset panel back to details view after the close animation
    setTimeout(() => {
      setPanelView("details");
      setResetForm({
        old_password: "",
        new_password: "",
        confirm_password: "",
      });
      setResetError("");
      setResetSuccess("");
    }, 300);
  };

  // Prevent background scroll when panel is open
  useEffect(() => {
    if (showUserPanel) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showUserPanel]);

  // Close panel on Escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") closeUserPanel();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    try {
      return new Date(dateStr).toLocaleString();
    } catch {
      return dateStr;
    }
  };

  const StatusPill = ({ active, trueLabel = "Yes", falseLabel = "No" }) => (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
        active
          ? "bg-green-50 text-green-600 border border-green-200"
          : "bg-gray-100 text-gray-500 border border-gray-200"
      }`}
    >
      {active ? <TbCircleCheck size={14} /> : <TbCircleX size={14} />}
      {active ? trueLabel : falseLabel}
    </span>
  );

  // Form state for user editable fields
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    location: user?.location || "",
    bio: user?.bio || "",
    department: user?.department || "",
  });

  // Fetch all data on mount
  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);

        // 1. Fetch company user details (profile)
        const userRes = await fetch(buildApiUrl(`/company-users/${user.id}`), {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!userRes.ok) throw new Error("Failed to fetch user details");
        const userData = await userRes.json();
        const userDetails = userData.data || userData;
        setCompanyUser(userDetails);

        // 2. Fetch all companies and find the one linked to this user
        const companiesRes = await fetch(buildApiUrl("/companies"), {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!companiesRes.ok) throw new Error("Failed to fetch companies");
        const companiesData = await companiesRes.json();
        const companies = companiesData.data || companiesData;

        // Find company where CompanyUser.company_user_id === user.id
        const found = companies.find(
          (c) => c.CompanyUser?.company_user_id === user.id,
        );
        setCompanyData(found || null);

        // Pre‑fill form with available data
        if (userDetails) {
          setFormData({
            name: userDetails.name || user.name || "",
            email: userDetails.email || user.email || "",
            phone: userDetails.mobile || user.phone || "",
            location:
              userDetails.location || found?.location || user.location || "",
            bio: userDetails.bio || found?.about_company || user.bio || "",
            department:
              userDetails.department ||
              found?.industry ||
              user.department ||
              "",
          });
        }

        console.log("✅ Company User:", userDetails);
        console.log("✅ Company Data:", found);
      } catch (error) {
        console.error("❌ Profile fetch error:", error);
        showError("Could not load profile data. Please refresh.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, token, showError]);

  // Handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    updateUser(formData);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      location: user?.location || "",
      bio: user?.bio || "",
      department: user?.department || "",
    });
  };

  // ---------- Reset Password handlers ----------
  const handleResetFormChange = (e) => {
    const { name, value } = e.target;
    setResetForm((prev) => ({ ...prev, [name]: value }));
    if (resetError) setResetError("");
  };

  const handleResetPassword = async () => {
    setResetError("");
    setResetSuccess("");

    const { old_password, new_password, confirm_password } = resetForm;

    if (!old_password || !new_password || !confirm_password) {
      setResetError("All fields are required.");
      return;
    }

    if (new_password.length < 6) {
      setResetError("New password must be at least 6 characters long.");
      return;
    }

    if (new_password !== confirm_password) {
      setResetError("New password and confirm password do not match.");
      return;
    }

    if (old_password === new_password) {
      setResetError("New password must be different from old password.");
      return;
    }

    // Grab token from localStorage (falls back to context token if not found)
    const storedToken = localStorage.getItem("token") || token;

    if (!storedToken) {
      setResetError("You are not authenticated. Please log in again.");
      return;
    }

    try {
      setResetLoading(true);

      const res = await fetch(buildApiUrl("/company-users/change-password"), {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${storedToken}`,
        },
        body: JSON.stringify({
          old_password,
          new_password,
          confirm_password,
        }),
      });

      let data = {};
      try {
        data = await res.json();
      } catch {
        data = {};
      }

      if (!res.ok) {
        throw new Error(
          data?.message || data?.error || "Failed to change password.",
        );
      }

      const successMsg = data?.message || "Password changed successfully!";
      setResetSuccess(successMsg);
      showSuccess(successMsg);
      setResetForm({
        old_password: "",
        new_password: "",
        confirm_password: "",
      });

      // Return to details view shortly after success
      setTimeout(() => {
        setPanelView("details");
        setResetSuccess("");
      }, 1500);
    } catch (error) {
      console.error("❌ Change password error:", error);
      const msg = error.message || "Something went wrong. Please try again.";
      setResetError(msg);
      showError(msg);
    } finally {
      setResetLoading(false);
    }
  };

  // Placeholder stats & permissions (replace with real data later)
  const stats = [
    { icon: TbUsers, label: "Candidates Reviewed", value: "1,284" },
    { icon: TbFileText, label: "Jobs Posted", value: "248" },
    { icon: TbBriefcase, label: "Placements", value: "142" },
    { icon: TbChartBar, label: "Success Rate", value: "94%" },
  ];

  const permissions = [
    { icon: TbUsers, label: "Manage Users", active: true },
    { icon: TbBriefcase, label: "Manage Jobs", active: true },
    { icon: TbUsers, label: "Manage Candidates", active: true },
    { icon: TbChartBar, label: "View Reports", active: true },
    { icon: TbShield, label: "System Settings", active: false },
  ];

  if (!user) {
    return (
      <div className="py-2">
        <div className="text-center py-12">
          <p className="text-gray-400 dark:text-gray-500">
            Please login to view your profile
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  const displayName = formData.name || user?.email?.split("@")[0] || "User";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  // Helper to format image URL
  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith("http")) return path;
    return `https://hire-me-jobs.onrender.com${path}`;
  };

  // Helper to format boolean values
  const formatBool = (val) => (val ? "Yes" : "No");

  return (
    <div className="max-w-7xl mx-auto y">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:gray-500">
            My Profile
          </h1>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
            Manage your account and view company details.
          </p>
        </div>

        {/* Toggle button to open logged-in user details panel */}
        <Button
          onClick={handleToggleUserPanel}
          className="flex items-center gap-2 whitespace-nowrap"
        >
          <TbUserCircle size={18} />
          Account Details
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-5">
        {/* Right Column */}
        <div className="lg:col-span-2 space-y-5">
          <>
            {/* ---------- COMPANY CARD ---------- */}
            {companyData ? (
              <Card>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 ">
                      {companyData.company_name || "Company"}
                    </h3>
                    <p className="text-sm text-gray-400 dark:text-gray-500">
                      {companyData.Industry?.industry_name ||
                        "Industry not set"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {companyData.logo && (
                      <img
                        src={getImageUrl(companyData.logo)}
                        alt={companyData.company_name}
                        className="w-14 h-14 rounded-xl object-cover border border-gray-200 dark:border-gray-700"
                        onError={(e) => (e.target.style.display = "none")}
                      />
                    )}
                  </div>
                </div>

                {/* All Company Fields in a Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4 text-sm">
                  <div className="flex items-center gap-2">
                    <TbGlobe className="text-gray-400" size={16} />
                    <span className="text-gray-500">Website:</span>
                    <a
                      href={companyData.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-500 hover:underline truncate"
                    >
                      {companyData.website || "—"}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <TbBuildingFactory className="text-gray-400" size={16} />
                    <span className="text-gray-500">Status:</span>
                    <span
                      className={`capitalize font-medium ${
                        companyData.company_status === "active"
                          ? "text-success-600"
                          : "text-gray-500"
                      }`}
                    >
                      {companyData.company_status || "active"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TbCheck className="text-gray-400" size={16} />
                    <span className="text-gray-500">Trending:</span>
                    <span className="text-gray-800  font-medium">
                      {formatBool(companyData.is_trending)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TbClock className="text-gray-400" size={16} />
                    <span className="text-gray-500">Updated:</span>
                    <span className="text-gray-800  font-medium">
                      {new Date(companyData.updated_at).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Industry & CompanySize (if they exist) */}
                {(companyData.Industry || companyData.CompanySize) && (
                  <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    {companyData.Industry && (
                      <div>
                        <span className="text-xs text-gray-400 uppercase tracking-wider">
                          Industry
                        </span>
                        <div className="text-sm text-white font-medium">
                          {companyData.Industry.industry_name}
                        </div>
                      </div>
                    )}
                    {companyData.CompanySize && (
                      <div>
                        <span className="text-xs text-gray-400 uppercase tracking-wider">
                          Company Size
                        </span>
                        <div className="text-sm text-white font-medium">
                          {companyData.CompanySize.company_size_name}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* CompanyUser relation */}
                {companyData.CompanyUser && (
                  <div className="mt-3 p-3 bg-brand-50 dark:bg-brand-900/10 rounded-xl">
                    <p className="text-xs font-semibold text-brand-600 dark:text-brand-400">
                      Linked Company User
                    </p>
                    <div className="flex flex-wrap gap-4 text-sm mt-1">
                      <span className="text-gray-600 dark:text-gray-800">
                        Email: {companyData.CompanyUser.company_user_email}
                      </span>
                    </div>
                  </div>
                )}

                {/* About Company */}
                {companyData.about_company && (
                  <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <div className="flex items-start gap-2">
                      <TbInfoCircle
                        size={16}
                        className="text-gray-400 mt-0.5"
                      />
                      <p className="text-sm text-gray-600 dark:text-white">
                        {companyData.about_company}
                      </p>
                    </div>
                  </div>
                )}
              </Card>
            ) : (
              <Card>
                <p className="text-sm text-gray-400 dark:text-gray-500">
                  No company associated with this account.
                </p>
              </Card>
            )}
          </>
        </div>
      </div>

      {/* ---------- LOGGED-IN USER DETAILS SIDE PANEL (right side, white theme) ---------- */}
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          showUserPanel
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={closeUserPanel}
      />

      {/* Sliding panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto ${
          showUserPanel ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Panel Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-5 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            {panelView === "reset" ? (
              <button
                onClick={() => {
                  setPanelView("details");
                  setResetError("");
                  setResetSuccess("");
                }}
                className="p-1.5 -ml-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
                aria-label="Back to account details"
              >
                <TbArrowLeft size={20} />
              </button>
            ) : (
              <TbUserCircle className="text-indigo-500" size={22} />
            )}
            <h2 className="text-lg font-bold text-gray-800">
              {panelView === "reset" ? "Reset Password" : "Account Details"}
            </h2>
          </div>
          <button
            onClick={closeUserPanel}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
            aria-label="Close panel"
          >
            <TbX size={20} />
          </button>
        </div>

        {/* Panel Body */}
        <div className="p-5 space-y-6 bg-white">
          {panelView === "details" && (
            <>
              {localUserError && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600 flex items-start gap-2">
                  <TbInfoCircle size={18} className="mt-0.5 flex-shrink-0" />
                  <span>
                    No logged-in user data found in local storage. Please make
                    sure you're logged in.
                  </span>
                </div>
              )}

              {localUserData && (
                <>
                  {/* Avatar + Email Summary */}
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 border border-gray-100">
                    <div className="w-14 h-14 rounded-full bg-indigo-500 text-white flex items-center justify-center text-lg font-bold flex-shrink-0">
                      {(localUserData.email || "U").charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-800 truncate">
                        {localUserData.email || "—"}
                      </p>
                      <p className="text-xs text-gray-400 capitalize">
                        {localUserData.login_type || "email"} login
                      </p>
                    </div>
                  </div>

                  {/* Core Details */}
                  <div className="space-y-1">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                      Basic Information
                    </h3>

                    <div className="flex items-center justify-between text-sm py-2.5 border-b border-gray-100">
                      <span className="flex items-center gap-2 text-gray-500">
                        <TbMail size={16} className="text-gray-400" /> Email
                      </span>
                      <span className="font-medium text-gray-800 truncate max-w-[220px] text-right">
                        {localUserData.email || "—"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm py-2.5 border-b border-gray-100">
                      <span className="flex items-center gap-2 text-gray-500">
                        <TbDeviceMobile size={16} className="text-gray-400" />{" "}
                        Mobile
                      </span>
                      <span className="font-medium text-gray-800">
                        {localUserData.mobile || "—"}
                      </span>
                    </div>
                  </div>

                  {/* Reset OTP Info (only shown if present) */}
                  {(localUserData.reset_otp ||
                    localUserData.reset_otp_expiry) && (
                    <div className="space-y-1">
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                        Password Reset
                      </h3>
                      <div className="flex items-center justify-between text-sm py-2.5 border-b border-gray-100">
                        <span className="text-gray-500">Reset OTP</span>
                        <span className="font-medium text-gray-800">
                          {localUserData.reset_otp || "—"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm py-2.5">
                        <span className="text-gray-500">OTP Expiry</span>
                        <span className="font-medium text-gray-800">
                          {formatDate(localUserData.reset_otp_expiry)}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* ---------- Reset Password trigger button ---------- */}
                  <button
                    onClick={() => {
                      setPanelView("reset");
                      setResetError("");
                      setResetSuccess("");
                    }}
                    className="w-full flex items-center justify-between gap-2 px-4 py-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 text-indigo-600 font-medium text-sm transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <TbLock size={18} />
                      Reset Password
                    </span>
                    <TbArrowLeft size={16} className="rotate-180" />
                  </button>
                </>
              )}
            </>
          )}

          {panelView === "reset" && (
            <div className="space-y-5">
              <div className="flex items-center gap-2 p-3 rounded-xl bg-indigo-50 border border-indigo-100">
                <TbKey className="text-indigo-500 flex-shrink-0" size={18} />
                <p className="text-xs text-indigo-600">
                  Enter your current password and choose a new one below.
                </p>
              </div>

              {resetError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600 flex items-start gap-2">
                  <TbInfoCircle size={16} className="mt-0.5 flex-shrink-0" />
                  <span>{resetError}</span>
                </div>
              )}

              {resetSuccess && (
                <div className="p-3 rounded-xl bg-green-50 border border-green-100 text-sm text-green-600 flex items-start gap-2">
                  <TbCircleCheck size={16} className="mt-0.5 flex-shrink-0" />
                  <span>{resetSuccess}</span>
                </div>
              )}

              {/* Old Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Current Password
                </label>
                <div className="relative">
                  <TbLock
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type={showOldPass ? "text" : "password"}
                    name="old_password"
                    value={resetForm.old_password}
                    onChange={handleResetFormChange}
                    placeholder="Enter current password"
                    disabled={resetLoading}
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400 disabled:opacity-60"
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPass((p) => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    tabIndex={-1}
                  >
                    {showOldPass ? <TbEyeOff size={18} /> : <TbEye size={18} />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  New Password
                </label>
                <div className="relative">
                  <TbLock
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type={showNewPass ? "text" : "password"}
                    name="new_password"
                    value={resetForm.new_password}
                    onChange={handleResetFormChange}
                    placeholder="Enter new password"
                    disabled={resetLoading}
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400 disabled:opacity-60"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPass((p) => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    tabIndex={-1}
                  >
                    {showNewPass ? <TbEyeOff size={18} /> : <TbEye size={18} />}
                  </button>
                </div>
                <p className="text-[11px] text-gray-400">
                  Must be at least 6 characters, different from current
                  password.
                </p>
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Confirm New Password
                </label>
                <div className="relative">
                  <TbLock
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type={showConfirmPass ? "text" : "password"}
                    name="confirm_password"
                    value={resetForm.confirm_password}
                    onChange={handleResetFormChange}
                    placeholder="Re-enter new password"
                    disabled={resetLoading}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !resetLoading) {
                        handleResetPassword();
                      }
                    }}
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400 disabled:opacity-60"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPass((p) => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    tabIndex={-1}
                  >
                    {showConfirmPass ? (
                      <TbEyeOff size={18} />
                    ) : (
                      <TbEye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => {
                    setPanelView("details");
                    setResetError("");
                    setResetSuccess("");
                    setResetForm({
                      old_password: "",
                      new_password: "",
                      confirm_password: "",
                    });
                  }}
                  disabled={resetLoading}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-60"
                >
                  Cancel
                </button>
                <button
                  onClick={handleResetPassword}
                  disabled={resetLoading}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-sm font-medium text-white hover:opacity-90 transition-opacity disabled:opacity-60"
                >
                  {resetLoading ? (
                    <>
                      <TbLoader2 size={16} className="animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <TbCheck size={16} />
                      Update Password
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}