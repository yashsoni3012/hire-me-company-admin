// import { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import {
//   TbMail,
//   TbLock,
//   TbEye,
//   TbEyeOff,
//   TbBriefcase,
//   TbPhone,
//   TbUser,
// } from "react-icons/tb";
// import { useAuth } from "../context/AuthContext";

// export default function Login() {
//   const navigate = useNavigate();
//   const { login, register } = useAuth();
//   const [showPassword, setShowPassword] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isSignUp, setIsSignUp] = useState(false); // toggle between login & signup

//   // Form state for both modes
//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//     mobile: "", // only for signup
//     confirmPassword: "", // only for signup
//   });
//   const [errors, setErrors] = useState({});

//   // Validation for both forms
//   const validateForm = () => {
//     const newErrors = {};
//     if (!formData.email) {
//       newErrors.email = "Email is required";
//     } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
//       newErrors.email = "Email is invalid";
//     }

//     if (!formData.password) {
//       newErrors.password = "Password is required";
//     } else if (formData.password.length < 6) {
//       newErrors.password = "Password must be at least 6 characters";
//     }

//     if (isSignUp) {
//       if (!formData.mobile) {
//         newErrors.mobile = "Mobile number is required";
//       } else if (!/^\d{10}$/.test(formData.mobile)) {
//         newErrors.mobile = "Enter a valid 10-digit mobile number";
//       }
//       if (formData.password !== formData.confirmPassword) {
//         newErrors.confirmPassword = "Passwords do not match";
//       }
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validateForm()) return;

//     setIsLoading(true);

//     if (isSignUp) {
//       // Sign Up
//       const result = await register(
//         formData.email,
//         formData.password,
//         formData.mobile
//       );
//       setIsLoading(false);
//       if (result.success) {
//         // Optionally auto-login after signup? We'll redirect to login tab
//         setIsSignUp(false); // switch to login tab
//         setFormData({ email: "", password: "", mobile: "", confirmPassword: "" });
//         // Optionally pre-fill email
//         setFormData((prev) => ({ ...prev, email: result.user?.email || "" }));
//       }
//     } else {
//       // Login
//       const result = await login(formData.email, formData.password);
//       setIsLoading(false);
//       if (result.success) {
//         navigate("/");
//       }
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//     if (errors[name]) {
//       setErrors((prev) => ({ ...prev, [name]: "" }));
//     }
//   };

//   const toggleMode = () => {
//     setIsSignUp(!isSignUp);
//     setErrors({});
//     // Optionally clear fields or keep them
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-brand-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
//       <div className="w-full max-w-md">
//         {/* Logo */}
//         <div className="text-center mb-8">
//           <div className="inline-flex items-center gap-2.5 bg-white dark:bg-gray-800 px-6 py-3 rounded-2xl shadow-lg">
//             <div className="w-10 h-10 rounded-xl bg-brand-500 flex items-center justify-center text-white">
//               <TbBriefcase size={22} />
//             </div>
//             <span className="text-xl font-bold text-gray-800 dark:text-white">
//               JOB<span className="text-brand-500">PORTAL</span>
//             </span>
//           </div>
//         </div>

//         {/* Card */}
//         <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-8 border border-gray-100 dark:border-gray-800">
//           {/* Toggle */}
//           <div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1 mb-6">
//             <button
//               onClick={() => setIsSignUp(false)}
//               className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
//                 !isSignUp
//                   ? "bg-white dark:bg-gray-700 text-gray-800 dark:text-white shadow-sm"
//                   : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
//               }`}
//             >
//               Sign In
//             </button>
//             <button
//               onClick={() => setIsSignUp(true)}
//               className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
//                 isSignUp
//                   ? "bg-white dark:bg-gray-700 text-gray-800 dark:text-white shadow-sm"
//                   : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
//               }`}
//             >
//               Sign Up
//             </button>
//           </div>

//           <form onSubmit={handleSubmit} className="space-y-5">
//             {/* Email */}
//             <div>
//               <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
//                 Email Address
//               </label>
//               <div className="relative">
//                 <TbMail
//                   size={18}
//                   className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
//                 />
//                 <input
//                   type="email"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   placeholder="you@example.com"
//                   className={`w-full pl-10 pr-4 py-3 text-sm rounded-xl border-2 transition-all duration-200 bg-white dark:bg-gray-800 text-gray-800 dark:text-white outline-none ${
//                     errors.email
//                       ? "border-danger-500 focus:ring-danger-500/20"
//                       : "border-gray-200 dark:border-gray-700 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
//                   }`}
//                 />
//               </div>
//               {errors.email && (
//                 <p className="mt-1.5 text-xs text-danger-500">{errors.email}</p>
//               )}
//             </div>

//             {/* Password */}
//             <div>
//               <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
//                 Password
//               </label>
//               <div className="relative">
//                 <TbLock
//                   size={18}
//                   className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
//                 />
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   name="password"
//                   value={formData.password}
//                   onChange={handleChange}
//                   placeholder="••••••••"
//                   className={`w-full pl-10 pr-12 py-3 text-sm rounded-xl border-2 transition-all duration-200 bg-white dark:bg-gray-800 text-gray-800 dark:text-white outline-none ${
//                     errors.password
//                       ? "border-danger-500 focus:ring-danger-500/20"
//                       : "border-gray-200 dark:border-gray-700 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
//                   }`}
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
//                 >
//                   {showPassword ? <TbEyeOff size={18} /> : <TbEye size={18} />}
//                 </button>
//               </div>
//               {errors.password && (
//                 <p className="mt-1.5 text-xs text-danger-500">
//                   {errors.password}
//                 </p>
//               )}
//             </div>

//             {/* Mobile (only for signup) */}
//             {isSignUp && (
//               <>
//                 <div>
//                   <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
//                     Mobile Number
//                   </label>
//                   <div className="relative">
//                     <TbPhone
//                       size={18}
//                       className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
//                     />
//                     <input
//                       type="tel"
//                       name="mobile"
//                       value={formData.mobile}
//                       onChange={handleChange}
//                       placeholder="9876543210"
//                       className={`w-full pl-10 pr-4 py-3 text-sm rounded-xl border-2 transition-all duration-200 bg-white dark:bg-gray-800 text-gray-800 dark:text-white outline-none ${
//                         errors.mobile
//                           ? "border-danger-500 focus:ring-danger-500/20"
//                           : "border-gray-200 dark:border-gray-700 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
//                       }`}
//                     />
//                   </div>
//                   {errors.mobile && (
//                     <p className="mt-1.5 text-xs text-danger-500">
//                       {errors.mobile}
//                     </p>
//                   )}
//                 </div>

//                 <div>
//                   <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
//                     Confirm Password
//                   </label>
//                   <div className="relative">
//                     <TbLock
//                       size={18}
//                       className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
//                     />
//                     <input
//                       type={showPassword ? "text" : "password"}
//                       name="confirmPassword"
//                       value={formData.confirmPassword}
//                       onChange={handleChange}
//                       placeholder="••••••••"
//                       className={`w-full pl-10 pr-4 py-3 text-sm rounded-xl border-2 transition-all duration-200 bg-white dark:bg-gray-800 text-gray-800 dark:text-white outline-none ${
//                         errors.confirmPassword
//                           ? "border-danger-500 focus:ring-danger-500/20"
//                           : "border-gray-200 dark:border-gray-700 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
//                       }`}
//                     />
//                   </div>
//                   {errors.confirmPassword && (
//                     <p className="mt-1.5 text-xs text-danger-500">
//                       {errors.confirmPassword}
//                     </p>
//                   )}
//                 </div>
//               </>
//             )}

//             {/* Forgot Password (only for login) */}
//             {!isSignUp && (
//               <div className="flex items-center justify-end">
//                 <Link
//                   to="/forgot-password"
//                   className="text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-brand-400 dark:hover:text-brand-300 transition-colors"
//                 >
//                   Forgot Password?
//                 </Link>
//               </div>
//             )}

//             {/* Submit Button */}
//             <button
//               type="submit"
//               disabled={isLoading}
//               className="w-full py-3 px-4 bg-gradient-to-r from-brand-500 to-brand-600 text-white font-semibold rounded-xl hover:from-brand-600 hover:to-brand-700 transition-all duration-200 shadow-lg shadow-brand-500/30 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
//             >
//               {isLoading ? (
//                 <>
//                   <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
//                   {isSignUp ? "Creating account..." : "Signing in..."}
//                 </>
//               ) : (
//                 <>{isSignUp ? "Create Account" : "Sign In"}</>
//               )}
//             </button>

//             {/* Toggle link at bottom */}
//             <div className="text-center mt-4">
//               <button
//                 type="button"
//                 onClick={toggleMode}
//                 className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400 dark:hover:text-brand-300 transition-colors"
//               >
//                 {isSignUp
//                   ? "Already have an account? Sign In"
//                   : "Don't have an account? Sign Up"}
//               </button>
//             </div>
//           </form>
//         </div>

//         {/* Footer */}
//         <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-6">
//           © 2026 JobPortal. All rights reserved.
//         </p>
//       </div>
//     </div>
//   );
// }

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  TbMail,
  TbLock,
  TbEye,
  TbEyeOff,
  TbBriefcase,
  TbPhone,
} from "react-icons/tb";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    mobile: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (isSignUp) {
      if (!formData.mobile) {
        newErrors.mobile = "Mobile number is required";
      } else if (!/^\d{10}$/.test(formData.mobile)) {
        newErrors.mobile = "Enter a valid 10-digit mobile number";
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);

    if (isSignUp) {
      const result = await register(
        formData.email,
        formData.password,
        formData.mobile
      );
      setIsLoading(false);
      if (result.success) {
        setIsSignUp(false);
        setFormData({ email: "", password: "", mobile: "", confirmPassword: "" });
        setFormData((prev) => ({ ...prev, email: result.user?.email || "" }));
      }
    } else {
      const result = await login(formData.email, formData.password);
      setIsLoading(false);
      if (result.success) {
        navigate("/");
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-brand-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2.5 bg-white dark:bg-gray-800 px-6 py-3 rounded-2xl shadow-lg">
            <div className="w-10 h-10 rounded-xl bg-brand-500 flex items-center justify-center text-white">
              <TbBriefcase size={22} />
            </div>
            <span className="text-xl font-bold text-gray-800 dark:text-white">
              JOB<span className="text-brand-500">PORTAL</span>
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-8 border border-gray-100 dark:border-gray-800">
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1 mb-6">
            <button
              onClick={() => setIsSignUp(false)}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                !isSignUp
                  ? "bg-white dark:bg-gray-700 text-gray-800 dark:text-white shadow-sm"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsSignUp(true)}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                isSignUp
                  ? "bg-white dark:bg-gray-700 text-gray-800 dark:text-white shadow-sm"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <TbMail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className={`w-full pl-10 pr-4 py-3 text-sm rounded-xl border-2 transition-all duration-200 bg-white dark:bg-gray-800 text-gray-800 dark:text-white outline-none ${
                    errors.email
                      ? "border-danger-500 focus:ring-danger-500/20"
                      : "border-gray-200 dark:border-gray-700 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
                  }`}
                />
              </div>
              {errors.email && <p className="mt-1.5 text-xs text-danger-500">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <TbLock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-12 py-3 text-sm rounded-xl border-2 transition-all duration-200 bg-white dark:bg-gray-800 text-gray-800 dark:text-white outline-none ${
                    errors.password
                      ? "border-danger-500 focus:ring-danger-500/20"
                      : "border-gray-200 dark:border-gray-700 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <TbEyeOff size={18} /> : <TbEye size={18} />}
                </button>
              </div>
              {errors.password && <p className="mt-1.5 text-xs text-danger-500">{errors.password}</p>}
            </div>

            {isSignUp && (
              <>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Mobile Number
                  </label>
                  <div className="relative">
                    <TbPhone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="tel"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleChange}
                      placeholder="9876543210"
                      className={`w-full pl-10 pr-4 py-3 text-sm rounded-xl border-2 transition-all duration-200 bg-white dark:bg-gray-800 text-gray-800 dark:text-white outline-none ${
                        errors.mobile
                          ? "border-danger-500 focus:ring-danger-500/20"
                          : "border-gray-200 dark:border-gray-700 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
                      }`}
                    />
                  </div>
                  {errors.mobile && <p className="mt-1.5 text-xs text-danger-500">{errors.mobile}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <TbLock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className={`w-full pl-10 pr-4 py-3 text-sm rounded-xl border-2 transition-all duration-200 bg-white dark:bg-gray-800 text-gray-800 dark:text-white outline-none ${
                        errors.confirmPassword
                          ? "border-danger-500 focus:ring-danger-500/20"
                          : "border-gray-200 dark:border-gray-700 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
                      }`}
                    />
                  </div>
                  {errors.confirmPassword && <p className="mt-1.5 text-xs text-danger-500">{errors.confirmPassword}</p>}
                </div>
              </>
            )}

            {!isSignUp && (
              <div className="flex items-center justify-end">
                <Link
                  to="/forgot-password"
                  className="text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-brand-400 dark:hover:text-brand-300 transition-colors"
                >
                  Forgot Password?
                </Link>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-gradient-to-r from-brand-500 to-brand-600 text-white font-semibold rounded-xl hover:from-brand-600 hover:to-brand-700 transition-all duration-200 shadow-lg shadow-brand-500/30 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {isSignUp ? "Creating account..." : "Signing in..."}
                </>
              ) : (
                <>{isSignUp ? "Create Account" : "Sign In"}</>
              )}
            </button>

            <div className="text-center mt-4">
              <button
                type="button"
                onClick={toggleMode}
                className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400 dark:hover:text-brand-300 transition-colors"
              >
                {isSignUp
                  ? "Already have an account? Sign In"
                  : "Don't have an account? Sign Up"}
              </button>
            </div>
          </form>
        </div>

        <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-6">
          © 2026 JobPortal. All rights reserved.
        </p>
      </div>
    </div>
  );
}