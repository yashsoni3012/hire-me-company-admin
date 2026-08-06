// import { createContext, useContext, useState, useEffect } from "react";
// import { useToast } from "./ToastContext";
// import { useNavigate } from "react-router-dom";
// import { buildApiUrl } from "../config/api";

// const AuthContext = createContext();

// export function AuthProvider({ children }) {
//   const [user, setUser] = useState(null);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const { showSuccess, showError } = useToast();

//   // On mount, restore user from localStorage
//   useEffect(() => {
//     const savedUser = localStorage.getItem("user");
//     if (savedUser) {
//       try {
//         const userData = JSON.parse(savedUser);
//         setUser(userData);
//         setIsAuthenticated(true);
//       } catch (error) {
//         console.error("Failed to parse user data:", error);
//         localStorage.removeItem("user");
//       }
//     }
//     setLoading(false);
//   }, []);

//   // ---------- LOGIN (token‑optional) ----------
//   const login = async (email, password) => {
//     try {
//       const response = await fetch(buildApiUrl("/company-users/login"), {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, password }),
//       });

//       const data = await response.json();
//       console.log("Login API response:", data);

//       if (!response.ok) {
//         const errorMsg = data.message || data.error || "Invalid credentials";
//         throw new Error(errorMsg);
//       }

//       // Extract user from response (try multiple locations)
//       let userData = null;
//       if (data.data && data.data.user) {
//         userData = data.data.user;
//       } else if (data.user) {
//         userData = data.user;
//       } else if (data.data) {
//         userData = data.data; // fallback: maybe the whole data is the user
//       }

//       if (!userData) {
//         throw new Error("User data missing from server response");
//       }

//       // ----- Optional: try to grab a token (if any) -----
//       let authToken = null;
//       // Check body
//       if (data.data && data.data.token) authToken = data.data.token;
//       else if (data.data && data.data.accessToken) authToken = data.data.accessToken;
//       else if (data.token) authToken = data.token;
//       else if (data.accessToken) authToken = data.accessToken;
//       // Check headers
//       if (!authToken) {
//         const headerToken = response.headers.get("Authorization");
//         if (headerToken && headerToken.startsWith("Bearer ")) {
//           authToken = headerToken.slice(7);
//         } else {
//           authToken = response.headers.get("x-access-token");
//         }
//       }

//       // If token exists, store it (optional)
//       if (authToken) {
//         localStorage.setItem("token", authToken);
//       } else {
//         console.warn("No token returned from login API – relying on session cookies.");
//         // Remove any stale token to avoid confusion
//         localStorage.removeItem("token");
//       }

//       // Save user and mark authenticated
//       setUser(userData);
//       setIsAuthenticated(true);
//       localStorage.setItem("user", JSON.stringify(userData));

//       showSuccess(data.message || "Login successful! Welcome back.");
//       return { success: true };
//     } catch (error) {
//       console.error("Login error:", error);
//       showError(error.message || "Login failed. Please try again.");
//       return { success: false, error: error.message };
//     }
//   };

//   // ---------- REGISTER (unchanged) ----------
//   const register = async (email, password, mobile) => {
//     try {
//       const payload = { email, password, mobile, login_type: "email" };
//       const response = await fetch(buildApiUrl("/company-users/"), {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       const data = await response.json();
//       console.log("Registration API response:", data);

//       if (!response.ok) {
//         const errorMsg = data.message || data.error || "Registration failed";
//         throw new Error(errorMsg);
//       }

//       showSuccess(data.message || "Account created! You can now log in.");
//       return { success: true, user: data.data?.user || data };
//     } catch (error) {
//       console.error("Registration error:", error);
//       showError(error.message || "Registration failed. Please try again.");
//       return { success: false, error: error.message };
//     }
//   };

//   // ---------- LOGOUT ----------
//   const logout = () => {
//     setUser(null);
//     setIsAuthenticated(false);
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     showSuccess("Logged out successfully");
//   };

//   // ---------- UPDATE USER ----------
//   const updateUser = (updatedData) => {
//     const newUserData = { ...user, ...updatedData };
//     setUser(newUserData);
//     localStorage.setItem("user", JSON.stringify(newUserData));
//     showSuccess("Profile updated successfully!");
//   };

//   // ---------- FORGOT PASSWORD (placeholder) ----------
//   const forgotPassword = async (email) => {
//     try {
//       if (email) {
//         showSuccess("Password reset link sent to your email!");
//         return { success: true };
//       } else {
//         showError("Please enter your email");
//         return { success: false, error: "Email required" };
//       }
//     } catch (error) {
//       showError("Failed to send reset link. Please try again.");
//       return { success: false, error: error.message };
//     }
//   };

//   const value = {
//     user,
//     isAuthenticated,
//     loading,
//     login,
//     register,
//     logout,
//     updateUser,
//     forgotPassword,
//     // If you still need the token for some reason, you can retrieve it from localStorage:
//     token: localStorage.getItem("token") || null,
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// }

// export function useAuth() {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }
//   return context;
// }

// // ---------- PROTECTED ROUTE ----------
// export function ProtectedRoute({ children }) {
//   const { isAuthenticated, loading } = useAuth();
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (!loading && !isAuthenticated) {
//       navigate("/login");
//     }
//   }, [isAuthenticated, loading, navigate]);

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="flex flex-col items-center gap-3">
//           <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
//           <p className="text-sm text-gray-400">Loading...</p>
//         </div>
//       </div>
//     );
//   }

//   return isAuthenticated ? children : null;
// }

// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "./ToastContext";
import { useNavigate } from "react-router-dom";
import { buildApiUrl } from "../config/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const { showSuccess, showError } = useToast();

  // ---------- On mount, restore user from localStorage ----------
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setIsAuthenticated(true);
        setLoading(false);
        return;
      } catch (error) {
        console.error("Failed to parse user data:", error);
        localStorage.removeItem("user");
      }
    }

    // If token exists but user not, try to fetch user using token
    if (token) {
      const fetchUserByToken = async () => {
        try {
          const response = await fetch(buildApiUrl("/company-users/me"), {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });

          if (response.ok) {
            const data = await response.json();
            const userData = data.data?.user || data.user || data.data || data;
            if (userData && typeof userData === "object") {
              setUser(userData);
              setIsAuthenticated(true);
              localStorage.setItem("user", JSON.stringify(userData));
            } else {
              throw new Error("Invalid user data");
            }
          } else {
            // Token invalid/expired, remove it
            localStorage.removeItem("token");
          }
        } catch (error) {
          console.error("Failed to fetch user with token:", error);
          localStorage.removeItem("token");
        } finally {
          setLoading(false);
        }
      };

      fetchUserByToken();
    } else {
      setLoading(false);
    }
  }, []);

  // ---------- LOGIN (email & password) ----------
  const login = async (email, password) => {
    try {
      const response = await fetch(buildApiUrl("/company-users/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log("Login API response:", data);

      if (!response.ok) {
        const errorMsg = data.message || data.error || "Invalid credentials";
        throw new Error(errorMsg);
      }

      // Extract user from response
      let userData = null;
      if (data.data && data.data.user) {
        userData = data.data.user;
      } else if (data.user) {
        userData = data.user;
      } else if (data.data) {
        userData = data.data;
      }

      if (!userData) {
        throw new Error("User data missing from server response");
      }

      // Try to grab token
      let authToken = null;
      if (data.data && data.data.token) authToken = data.data.token;
      else if (data.data && data.data.accessToken) authToken = data.data.accessToken;
      else if (data.token) authToken = data.token;
      else if (data.accessToken) authToken = data.accessToken;

      if (!authToken) {
        const headerToken = response.headers.get("Authorization");
        if (headerToken && headerToken.startsWith("Bearer ")) {
          authToken = headerToken.slice(7);
        } else {
          authToken = response.headers.get("x-access-token");
        }
      }

      if (authToken) {
        localStorage.setItem("token", authToken);
      } else {
        console.warn("No token returned – relying on cookies.");
        localStorage.removeItem("token");
      }

      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem("user", JSON.stringify(userData));

      showSuccess(data.message || "Login successful! Welcome back.");
      return { success: true };
    } catch (error) {
      console.error("Login error:", error);
      showError(error.message || "Login failed. Please try again.");
      return { success: false, error: error.message };
    }
  };

  // ---------- TOKEN-BASED LOGIN (new) ----------
  const loginWithToken = async (token) => {
    try {
      // Save token immediately
      localStorage.setItem("token", token);

      // Option 1: Fetch user from API
      const response = await fetch(buildApiUrl("/company-users/me"), {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        const userData = data.data?.user || data.user || data.data || data;
        if (!userData || typeof userData !== "object") {
          throw new Error("Invalid user data from API");
        }
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem("user", JSON.stringify(userData));
        showSuccess("Logged in successfully via token.");
        return { success: true };
      } else {
        // If API fails, fallback to decoding JWT (if it's a JWT)
        try {
          // You can install jwt-decode: npm install jwt-decode
          const jwt_decode = require("jwt-decode");
          const decoded = jwt_decode(token);
          // Map the decoded fields to your user object
          const userData = {
            id: decoded.id,
            email: decoded.email,
            company_id: decoded.company_id,
            type: decoded.type,
            provider: decoded.provider,
            // add any other fields you need
          };
          setUser(userData);
          setIsAuthenticated(true);
          localStorage.setItem("user", JSON.stringify(userData));
          showSuccess("Logged in via token (decoded).");
          return { success: true };
        } catch (decodeError) {
          console.error("Token decode failed:", decodeError);
          throw new Error("Invalid token or API unavailable");
        }
      }
    } catch (error) {
      console.error("Token login error:", error);
      showError(error.message || "Token authentication failed");
      localStorage.removeItem("token");
      return { success: false, error: error.message };
    }
  };

  // ---------- REGISTER ----------
  const register = async (email, password, mobile) => {
    try {
      const payload = { email, password, mobile, login_type: "email" };
      const response = await fetch(buildApiUrl("/company-users/"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log("Registration API response:", data);

      if (!response.ok) {
        const errorMsg = data.message || data.error || "Registration failed";
        throw new Error(errorMsg);
      }

      showSuccess(data.message || "Account created! You can now log in.");
      return { success: true, user: data.data?.user || data };
    } catch (error) {
      console.error("Registration error:", error);
      showError(error.message || "Registration failed. Please try again.");
      return { success: false, error: error.message };
    }
  };

  // ---------- LOGOUT ----------
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    showSuccess("Logged out successfully");
  };

  // ---------- UPDATE USER ----------
  const updateUser = (updatedData) => {
    const newUserData = { ...user, ...updatedData };
    setUser(newUserData);
    localStorage.setItem("user", JSON.stringify(newUserData));
    showSuccess("Profile updated successfully!");
  };

  // ---------- FORGOT PASSWORD ----------
  const forgotPassword = async (email) => {
    try {
      if (email) {
        showSuccess("Password reset link sent to your email!");
        return { success: true };
      } else {
        showError("Please enter your email");
        return { success: false, error: "Email required" };
      }
    } catch (error) {
      showError("Failed to send reset link. Please try again.");
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    loginWithToken,   // <--- new
    register,
    logout,
    updateUser,
    forgotPassword,
    token: localStorage.getItem("token") || null,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// ---------- PROTECTED ROUTE ----------
export function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? children : null;
}