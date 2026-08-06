// src/pages/Callback.jsx
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Callback() {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginWithToken } = useAuth();
  const [error, setError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("accessToken");

    if (!token) {
      setError("No access token provided");
      return;
    }

    const handleLogin = async () => {
      const result = await loginWithToken(token);
      if (result.success) {
        // Redirect to dashboard or home
        navigate("/");
      } else {
        setError(result.error || "Login failed");
      }
    };

    handleLogin();
  }, [location, loginWithToken, navigate]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600">Authentication Failed</h2>
          <p className="text-gray-600 mt-2">{error}</p>
          <button
            onClick={() => navigate("/login")}
            className="mt-4 px-4 py-2 bg-brand-500 text-white rounded"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-600">Logging you in...</p>
      </div>
    </div>
  );
}