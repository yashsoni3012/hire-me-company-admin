import { useState, useEffect, useRef } from "react";
import { styled } from "@mui/material/styles";
import { TextField, InputAdornment, IconButton } from "@mui/material";
import {
  TbUser,
  TbMail,
  TbPhone,
  TbMapPin,
  TbBriefcase,
  TbEdit,
  TbX,
  TbGlobe,
  TbInfoCircle,
  TbCheck,
  TbClock,
  TbEye,
  TbEyeOff,
  TbBuildingFactory,
  TbDeviceMobile,
  TbCircleCheck,
  TbUserCircle,
  TbLock,
  TbArrowLeft,
  TbKey,
  TbLoader2,
  TbCalendar,
  TbId,
  TbPercentage,
  TbUpload,
  TbPhoto,
} from "react-icons/tb";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { Card } from "../components/ui/Card";
import Button from "../components/ui/Button";
import { profileService } from "../services/profile.service";

// ---------- Styled MUI TextField ----------
const StyledTextField = styled(TextField)(() => ({
  "& .MuiOutlinedInput-root": {
    backgroundColor: "#f2f2f2",
    borderRadius: "12px",
    transition: "all 0.25s ease-in-out",
    "& fieldset": {
      borderColor: "transparent",
    },
    "&:hover": {
      backgroundColor: "#ececec",
    },
    "&:hover fieldset": {
      borderColor: "#c7c7f5",
    },
    "&.Mui-focused": {
      backgroundColor: "#ffffff",
      boxShadow: "0 0 0 4px rgba(99,102,241,0.12)",
      transform: "translateY(-1px)",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#6366f1",
      borderWidth: "1.5px",
    },
  },
  "& .MuiOutlinedInput-input": {
    padding: "12.5px 14px",
    fontSize: "0.875rem",
    color: "#1f2937",
  },
  "& .MuiInputLabel-root": {
    fontSize: "0.875rem",
    color: "#9ca3af",
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "#6366f1",
  },
  "& .MuiOutlinedInput-notchedOutline": {
    transition: "border-color 0.25s ease-in-out",
  },
}));

export default function Profile() {
  const { user, token, updateUser } = useAuth();
  const { showError, showSuccess } = useToast();
  const [loading, setLoading] = useState(true);
  const [companyUser, setCompanyUser] = useState(null);
  const [companyData, setCompanyData] = useState(null);

  // ---------- Personal info edit state ----------
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  // ---------- Company edit state ----------
  const [isEditingCompany, setIsEditingCompany] = useState(false);
  const [companySaving, setCompanySaving] = useState(false);
  const [companyFormData, setCompanyFormData] = useState({
    company_name: "",
    website: "",
    founded_year: "",
    gst_number: "",
    about_company: "",
  });
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const fileInputRef = useRef(null);

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

  // ---------- User form data ----------
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    location: user?.location || "",
    bio: user?.bio || "",
    department: user?.department || "",
  });

  // ---------- Helper functions ----------
  const getLocalStorageUser = () => {
    try {
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
      console.error("Failed to parse user from localStorage:", error);
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

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") closeUserPanel();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    try {
      return new Date(dateStr).toLocaleString();
    } catch {
      return dateStr;
    }
  };

  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith("http")) return path;
    return `https://hire-me-jobs.onrender.com${path}`;
  };

  const formatBool = (val) => (val ? "Yes" : "No");

  // ---------- Fetch data ----------
  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);

        const userDetails = await profileService.getCompanyUser(
          user.id,
          token
        );
        setCompanyUser(userDetails);

        const companies = await profileService.getCompanies(token);
        const found = companies.find(
          (c) => c.CompanyUser?.company_user_id === user.id
        );
        setCompanyData(found || null);
        if (found) {
          setCompanyFormData({
            company_name: found.company_name || "",
            website: found.website || "",
            founded_year: found.founded_year || "",
            gst_number: found.gst_number || "",
            about_company: found.about_company || "",
          });
          setLogoPreview(getImageUrl(found.logo));
        }

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
      } catch (error) {
        console.error("Profile fetch error:", error);
        showError("Could not load profile data. Please refresh.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, token, showError]);

  // ---------- Personal info handlers ----------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetFormToSource = () => {
    setFormData({
      name: companyUser?.name || user?.name || "",
      email: companyUser?.email || user?.email || "",
      phone: companyUser?.mobile || user?.phone || "",
      location:
        companyUser?.location || companyData?.location || user?.location || "",
      bio: companyUser?.bio || companyData?.about_company || user?.bio || "",
      department:
        companyUser?.department ||
        companyData?.industry ||
        user?.department ||
        "",
    });
  };

  const handleCancelEdit = () => {
    resetFormToSource();
    setIsEditing(false);
  };

  const handleSaveProfile = async () => {
    if (!user?.id) return;

    if (!formData.name.trim()) {
      showError("Name cannot be empty.");
      return;
    }
    if (!formData.email.trim()) {
      showError("Email cannot be empty.");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        mobile: formData.phone.trim(),
        location: formData.location.trim(),
        bio: formData.bio.trim(),
        department: formData.department.trim(),
      };

      const updated = await profileService.updateCompanyUser(
        user.id,
        payload,
        token
      );

      setCompanyUser((prev) => ({ ...prev, ...updated }));

      updateUser({
        name: updated.name ?? payload.name,
        email: updated.email ?? payload.email,
        phone: updated.mobile ?? payload.mobile,
        location: updated.location ?? payload.location,
        bio: updated.bio ?? payload.bio,
        department: updated.department ?? payload.department,
      });

      showSuccess("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      console.error("Update profile error:", error);
      showError(error.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  // ---------- Company edit handlers ----------
  const handleCompanyChange = (e) => {
    const { name, value } = e.target;
    setCompanyFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onload = (ev) => setLogoPreview(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleCancelCompanyEdit = () => {
    if (companyData) {
      setCompanyFormData({
        company_name: companyData.company_name || "",
        website: companyData.website || "",
        founded_year: companyData.founded_year || "",
        gst_number: companyData.gst_number || "",
        about_company: companyData.about_company || "",
      });
      setLogoPreview(getImageUrl(companyData.logo));
      setLogoFile(null);
    }
    setIsEditingCompany(false);
  };

  const handleSaveCompany = async () => {
    if (!companyData?.id) {
      showError("Company ID not found.");
      return;
    }

    try {
      setCompanySaving(true);

      // Build payload – use FormData if a new logo is selected
      let payload;
      const isMultipart = logoFile !== null;
      if (isMultipart) {
        payload = new FormData();
        Object.keys(companyFormData).forEach((key) => {
          if (companyFormData[key]) {
            payload.append(key, companyFormData[key]);
          }
        });
        payload.append("logo", logoFile);
      } else {
        payload = { ...companyFormData };
        Object.keys(payload).forEach((key) => {
          if (payload[key] === "") delete payload[key];
        });
      }

      const updated = await profileService.updateCompany(
        companyData.id,
        payload,
        token
      );

      setCompanyData(updated);
      setCompanyFormData({
        company_name: updated.company_name || "",
        website: updated.website || "",
        founded_year: updated.founded_year || "",
        gst_number: updated.gst_number || "",
        about_company: updated.about_company || "",
      });
      setLogoPreview(getImageUrl(updated.logo));
      setLogoFile(null);
      showSuccess("Company updated successfully!");
      setIsEditingCompany(false);
    } catch (error) {
      console.error("Update company error:", error);
      showError(error.message || "Failed to update company.");
    } finally {
      setCompanySaving(false);
    }
  };

  // ---------- Password reset handlers ----------
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

    const storedToken = localStorage.getItem("token") || token;
    if (!storedToken) {
      setResetError("You are not authenticated. Please log in again.");
      return;
    }

    try {
      setResetLoading(true);

      const data = await profileService.changePassword(
        { old_password, new_password, confirm_password },
        storedToken
      );

      const successMsg = data?.message || "Password changed successfully!";
      setResetSuccess(successMsg);
      showSuccess(successMsg);
      setResetForm({
        old_password: "",
        new_password: "",
        confirm_password: "",
      });

      setTimeout(() => {
        setPanelView("details");
        setResetSuccess("");
      }, 1500);
    } catch (error) {
      console.error("Change password error:", error);
      const msg = error.message || "Something went wrong. Please try again.";
      setResetError(msg);
      showError(msg);
    } finally {
      setResetLoading(false);
    }
  };

  // ---------- Loading & auth guards ----------
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

  const fieldConfig = [
    { key: "name", label: "Full Name", icon: TbUser, type: "text" },
    { key: "email", label: "Email", icon: TbMail, type: "email" },
    { key: "phone", label: "Mobile", icon: TbPhone, type: "text" },
    { key: "location", label: "Location", icon: TbMapPin, type: "text" },
    {
      key: "department",
      label: "Department",
      icon: TbBriefcase,
      type: "text",
    },
  ];

  // ---------- Render ----------
  return (
    <div className="max-w-7xl mx-auto py-4">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-200">
            My Profile
          </h1>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
            Manage your account and view company details.
          </p>
        </div>

        <Button
          onClick={handleToggleUserPanel}
          className="flex items-center gap-2 whitespace-nowrap"
        >
          <TbUserCircle size={18} />
          Account Details
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-5">
        <div className="lg:col-span-2 space-y-5">
          {/* ---------- PERSONAL INFO CARD ---------- */}
          <Card>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-14 h-14 rounded-full bg-indigo-500 text-white flex items-center justify-center text-lg font-bold flex-shrink-0">
                  {displayName.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 truncate">
                    {displayName}
                  </h3>
                  <p className="text-sm text-gray-400 truncate">
                    {formData.email || "-"}
                  </p>
                </div>
              </div>

              {!isEditing ? (
                <Button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 whitespace-nowrap"
                >
                  <TbEdit size={16} />
                  Edit Profile
                </Button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCancelEdit}
                    disabled={saving}
                    className="p-2.5 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors disabled:opacity-60"
                    aria-label="Cancel edit"
                  >
                    <TbX size={18} />
                  </button>
                  <button
                    onClick={handleSaveProfile}
                    disabled={saving}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-sm font-medium text-white hover:opacity-90 transition-opacity disabled:opacity-60"
                  >
                    {saving ? (
                      <>
                        <TbLoader2 size={16} className="animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <TbCheck size={16} />
                        Save
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
              {fieldConfig.map(({ key, label, icon: Icon, type }) => (
                <div key={key}>
                  {isEditing ? (
                    <StyledTextField
                      fullWidth
                      size="small"
                      label={label}
                      name={key}
                      type={type}
                      value={formData[key]}
                      onChange={handleChange}
                      disabled={saving}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Icon size={17} color="#9ca3af" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  ) : (
                    <>
                      <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                        <Icon size={14} className="text-gray-400" />
                        {label}
                      </label>
                      <p className="mt-1.5 text-sm text-gray-800 dark:text-gray-200 font-medium">
                        {formData[key] || "-"}
                      </p>
                    </>
                  )}
                </div>
              ))}

              <div className="md:col-span-2">
                {isEditing ? (
                  <StyledTextField
                    fullWidth
                    multiline
                    minRows={3}
                    label="Bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    disabled={saving}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment
                          position="start"
                          sx={{ alignSelf: "flex-start", mt: "12px" }}
                        >
                          <TbInfoCircle size={17} color="#9ca3af" />
                        </InputAdornment>
                      ),
                    }}
                  />
                ) : (
                  <>
                    <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                      <TbInfoCircle size={14} className="text-gray-400" />
                      Bio
                    </label>
                    <p className="mt-1.5 text-sm text-gray-800 dark:text-gray-200 font-medium whitespace-pre-wrap">
                      {formData.bio || "-"}
                    </p>
                  </>
                )}
              </div>
            </div>
          </Card>

          {/* ---------- COMPANY CARD (with edit mode) ---------- */}
          {companyData ? (
            <Card>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">
                    {companyData.company_name || "Company"}
                  </h3>
                  <p className="text-sm text-gray-400 dark:text-gray-500">
                    {companyData.Industry?.industry_name ||
                      "Industry not set"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {!isEditingCompany ? (
                    <Button
                      onClick={() => setIsEditingCompany(true)}
                      className="flex items-center gap-2 whitespace-nowrap"
                    >
                      <TbEdit size={16} />
                      Edit Company
                    </Button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleCancelCompanyEdit}
                        disabled={companySaving}
                        className="p-2.5 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors disabled:opacity-60"
                        aria-label="Cancel edit"
                      >
                        <TbX size={18} />
                      </button>
                      <button
                        onClick={handleSaveCompany}
                        disabled={companySaving}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-sm font-medium text-white hover:opacity-90 transition-opacity disabled:opacity-60"
                      >
                        {companySaving ? (
                          <>
                            <TbLoader2 size={16} className="animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <TbCheck size={16} />
                            Save
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Logo preview / upload */}
              <div className="mt-3 flex items-center gap-4">
                <div className="w-20 h-20 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 flex-shrink-0">
                  {logoPreview ? (
                    <img
                      src={logoPreview}
                      alt="Company logo"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400">
                      <TbPhoto size={28} />
                    </div>
                  )}
                </div>
                {isEditingCompany && (
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={handleLogoChange}
                      className="hidden"
                      id="logo-upload"
                    />
                    <label
                      htmlFor="logo-upload"
                      className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <TbUpload size={16} />
                      Upload Logo
                    </label>
                    {logoFile && (
                      <span className="ml-2 text-sm text-gray-500">
                        {logoFile.name}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Company fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {isEditingCompany ? (
                  <>
                    <StyledTextField
                      fullWidth
                      size="small"
                      label="Company Name"
                      name="company_name"
                      value={companyFormData.company_name}
                      onChange={handleCompanyChange}
                      disabled={companySaving}
                    />
                    <StyledTextField
                      fullWidth
                      size="small"
                      label="Website"
                      name="website"
                      value={companyFormData.website}
                      onChange={handleCompanyChange}
                      disabled={companySaving}
                    />
                    <StyledTextField
                      fullWidth
                      size="small"
                      label="Founded Year"
                      name="founded_year"
                      type="number"
                      value={companyFormData.founded_year}
                      onChange={handleCompanyChange}
                      disabled={companySaving}
                    />
                    <StyledTextField
                      fullWidth
                      size="small"
                      label="GST Number"
                      name="gst_number"
                      value={companyFormData.gst_number}
                      onChange={handleCompanyChange}
                      disabled={companySaving}
                    />
                    <div className="md:col-span-2">
                      <StyledTextField
                        fullWidth
                        multiline
                        minRows={3}
                        label="About Company"
                        name="about_company"
                        value={companyFormData.about_company}
                        onChange={handleCompanyChange}
                        disabled={companySaving}
                      />
                    </div>
                  </>
                ) : (
                  // Read-only view
                  <>
                    <div className="flex items-center gap-2">
                      <TbGlobe className="text-gray-400" size={16} />
                      <span className="text-gray-500">Website:</span>
                      <a
                        href={companyData.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-brand-500 hover:underline truncate"
                      >
                        {companyData.website || "-"}
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <TbCalendar className="text-gray-400" size={16} />
                      <span className="text-gray-500">Founded:</span>
                      <span className="text-gray-800 dark:text-gray-200 font-medium">
                        {companyData.founded_year || "-"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TbId className="text-gray-400" size={16} />
                      <span className="text-gray-500">GST:</span>
                      <span className="text-gray-800 dark:text-gray-200 font-medium">
                        {companyData.gst_number || "-"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TbPercentage className="text-gray-400" size={16} />
                      <span className="text-gray-500">Profile Completion:</span>
                      <span className="text-gray-800 dark:text-gray-200 font-medium">
                        {companyData.profile_completion_percentage || "0"}%
                      </span>
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
                      <span className="text-gray-800 dark:text-gray-200 font-medium">
                        {formatBool(companyData.is_trending)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 col-span-1 md:col-span-2">
                      <TbClock className="text-gray-400" size={16} />
                      <span className="text-gray-500">Last updated:</span>
                      <span className="text-gray-800 dark:text-gray-200 font-medium">
                        {formatDate(companyData.updated_at)}
                      </span>
                    </div>
                    {companyData.created_at && (
                      <div className="flex items-center gap-2 col-span-1 md:col-span-2">
                        <TbCalendar className="text-gray-400" size={16} />
                        <span className="text-gray-500">Created:</span>
                        <span className="text-gray-800 dark:text-gray-200 font-medium">
                          {formatDate(companyData.created_at)}
                        </span>
                      </div>
                    )}
                    {companyData.about_company && (
                      <div className="md:col-span-2 mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                        <div className="flex items-start gap-2">
                          <TbInfoCircle
                            size={16}
                            className="text-gray-400 mt-0.5"
                          />
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {companyData.about_company}
                          </p>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Industry & Company Size (always read-only) */}
              {(companyData.Industry || companyData.CompanySize) && (
                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  {companyData.Industry && (
                    <div>
                      <span className="text-xs text-gray-400 uppercase tracking-wider">
                        Industry
                      </span>
                      <div className="text-sm text-gray-800 dark:text-gray-200 font-medium">
                        {companyData.Industry.industry_name}
                      </div>
                    </div>
                  )}
                  {companyData.CompanySize && (
                    <div>
                      <span className="text-xs text-gray-400 uppercase tracking-wider">
                        Company Size
                      </span>
                      <div className="text-sm text-gray-800 dark:text-gray-200 font-medium">
                        {companyData.CompanySize.company_size_name}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {companyData.CompanyUser && (
                <div className="mt-3 p-3 bg-brand-50 dark:bg-brand-900/10 rounded-xl">
                  <p className="text-xs font-semibold text-brand-600 dark:text-brand-400">
                    Linked Company User
                  </p>
                  <div className="flex flex-wrap gap-4 text-sm mt-1">
                    <span className="text-gray-600 dark:text-gray-300">
                      Email: {companyData.CompanyUser.company_user_email}
                    </span>
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
        </div>
      </div>

      {/* ---------- ACCOUNT DETAILS SIDE PANEL ---------- */}
      {/* (unchanged – same as previous) */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          showUserPanel
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={closeUserPanel}
      />

      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white dark:bg-gray-900 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto ${
          showUserPanel ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-5 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            {panelView === "reset" ? (
              <button
                onClick={() => {
                  setPanelView("details");
                  setResetError("");
                  setResetSuccess("");
                }}
                className="p-1.5 -ml-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors"
                aria-label="Back to account details"
              >
                <TbArrowLeft size={20} />
              </button>
            ) : (
              <TbUserCircle className="text-indigo-500" size={22} />
            )}
            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
              {panelView === "reset" ? "Reset Password" : "Account Details"}
            </h2>
          </div>
          <button
            onClick={closeUserPanel}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors"
            aria-label="Close panel"
          >
            <TbX size={20} />
          </button>
        </div>

        <div className="p-5 space-y-6 bg-white dark:bg-gray-900">
          {panelView === "details" && (
            <>
              {localUserError && (
                <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 text-sm text-red-600 dark:text-red-400 flex items-start gap-2">
                  <TbInfoCircle size={18} className="mt-0.5 flex-shrink-0" />
                  <span>
                    No logged‑in user data found in local storage. Please make
                    sure you're logged in.
                  </span>
                </div>
              )}

              {localUserData && (
                <>
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                    <div className="w-14 h-14 rounded-full bg-indigo-500 text-white flex items-center justify-center text-lg font-bold flex-shrink-0">
                      {(localUserData.email || "U").charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-800 dark:text-gray-200 truncate">
                        {localUserData.email || "-"}
                      </p>
                      <p className="text-xs text-gray-400 capitalize">
                        {localUserData.login_type || "email"} login
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                      Basic Information
                    </h3>

                    <div className="flex items-center justify-between text-sm py-2.5 border-b border-gray-100 dark:border-gray-800">
                      <span className="flex items-center gap-2 text-gray-500">
                        <TbMail size={16} className="text-gray-400" /> Email
                      </span>
                      <span className="font-medium text-gray-800 dark:text-gray-200 truncate max-w-[220px] text-right">
                        {localUserData.email || "-"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm py-2.5 border-b border-gray-100 dark:border-gray-800">
                      <span className="flex items-center gap-2 text-gray-500">
                        <TbDeviceMobile size={16} className="text-gray-400" />{" "}
                        Mobile
                      </span>
                      <span className="font-medium text-gray-800 dark:text-gray-200">
                        {localUserData.mobile || "-"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm py-2.5 border-b border-gray-100 dark:border-gray-800">
                      <span className="flex items-center gap-2 text-gray-500">
                        <TbUser size={16} className="text-gray-400" /> Name
                      </span>
                      <span className="font-medium text-gray-800 dark:text-gray-200">
                        {localUserData.name || "-"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm py-2.5 border-b border-gray-100 dark:border-gray-800">
                      <span className="flex items-center gap-2 text-gray-500">
                        <TbMapPin size={16} className="text-gray-400" /> Location
                      </span>
                      <span className="font-medium text-gray-800 dark:text-gray-200">
                        {localUserData.location || "-"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm py-2.5">
                      <span className="flex items-center gap-2 text-gray-500">
                        <TbBriefcase size={16} className="text-gray-400" /> Department
                      </span>
                      <span className="font-medium text-gray-800 dark:text-gray-200">
                        {localUserData.department || "-"}
                      </span>
                    </div>
                  </div>

                  {(localUserData.reset_otp ||
                    localUserData.reset_otp_expiry) && (
                    <div className="space-y-1">
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                        Password Reset
                      </h3>
                      <div className="flex items-center justify-between text-sm py-2.5 border-b border-gray-100 dark:border-gray-800">
                        <span className="text-gray-500">Reset OTP</span>
                        <span className="font-medium text-gray-800 dark:text-gray-200">
                          {localUserData.reset_otp || "-"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm py-2.5">
                        <span className="text-gray-500">OTP Expiry</span>
                        <span className="font-medium text-gray-800 dark:text-gray-200">
                          {formatDate(localUserData.reset_otp_expiry)}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex flex-col gap-3 pt-2">
                    <button
                      onClick={() => {
                        closeUserPanel();
                        setIsEditing(true);
                      }}
                      className="w-full flex items-center justify-between gap-2 px-4 py-3 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 border border-indigo-100 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 font-medium text-sm transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <TbEdit size={18} />
                        Edit Profile
                      </span>
                      <TbArrowLeft size={16} className="rotate-180" />
                    </button>

                    <button
                      onClick={() => {
                        setPanelView("reset");
                        setResetError("");
                        setResetSuccess("");
                      }}
                      className="w-full flex items-center justify-between gap-2 px-4 py-3 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 border border-indigo-100 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 font-medium text-sm transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <TbLock size={18} />
                        Reset Password
                      </span>
                      <TbArrowLeft size={16} className="rotate-180" />
                    </button>
                  </div>
                </>
              )}
            </>
          )}

          {panelView === "reset" && (
            <div className="space-y-5">
              <div className="flex items-center gap-2 p-3 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800">
                <TbKey className="text-indigo-500 flex-shrink-0" size={18} />
                <p className="text-xs text-indigo-600 dark:text-indigo-400">
                  Enter your current password and choose a new one below.
                </p>
              </div>

              {resetError && (
                <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 text-sm text-red-600 dark:text-red-400 flex items-start gap-2">
                  <TbInfoCircle size={16} className="mt-0.5 flex-shrink-0" />
                  <span>{resetError}</span>
                </div>
              )}

              {resetSuccess && (
                <div className="p-3 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 text-sm text-green-600 dark:text-green-400 flex items-start gap-2">
                  <TbCircleCheck size={16} className="mt-0.5 flex-shrink-0" />
                  <span>{resetSuccess}</span>
                </div>
              )}

              <StyledTextField
                fullWidth
                size="small"
                label="Current Password"
                name="old_password"
                type={showOldPass ? "text" : "password"}
                value={resetForm.old_password}
                onChange={handleResetFormChange}
                disabled={resetLoading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <TbLock size={17} color="#9ca3af" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowOldPass((p) => !p)}
                        edge="end"
                        size="small"
                        tabIndex={-1}
                      >
                        {showOldPass ? (
                          <TbEyeOff size={17} color="#9ca3af" />
                        ) : (
                          <TbEye size={17} color="#9ca3af" />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <div>
                <StyledTextField
                  fullWidth
                  size="small"
                  label="New Password"
                  name="new_password"
                  type={showNewPass ? "text" : "password"}
                  value={resetForm.new_password}
                  onChange={handleResetFormChange}
                  disabled={resetLoading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <TbLock size={17} color="#9ca3af" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowNewPass((p) => !p)}
                          edge="end"
                          size="small"
                          tabIndex={-1}
                        >
                          {showNewPass ? (
                            <TbEyeOff size={17} color="#9ca3af" />
                          ) : (
                            <TbEye size={17} color="#9ca3af" />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <p className="text-[11px] text-gray-400 mt-1.5">
                  Must be at least 6 characters, different from current
                  password.
                </p>
              </div>

              <StyledTextField
                fullWidth
                size="small"
                label="Confirm New Password"
                name="confirm_password"
                type={showConfirmPass ? "text" : "password"}
                value={resetForm.confirm_password}
                onChange={handleResetFormChange}
                disabled={resetLoading}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !resetLoading) {
                    handleResetPassword();
                  }
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <TbLock size={17} color="#9ca3af" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowConfirmPass((p) => !p)}
                        edge="end"
                        size="small"
                        tabIndex={-1}
                      >
                        {showConfirmPass ? (
                          <TbEyeOff size={17} color="#9ca3af" />
                        ) : (
                          <TbEye size={17} color="#9ca3af" />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

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
                  className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-60"
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