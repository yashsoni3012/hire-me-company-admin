import axios from "axios";

// ---------------------------------------------------------------------------
// Base axios instance
// If your project already has a shared axios instance (e.g. src/api/axios.js
// or src/services/axiosInstance.js), delete this block and import that
// instance instead — don't create a second one.
// ---------------------------------------------------------------------------
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ---------------------------------------------------------------------------
// Subscription Plans service
// ---------------------------------------------------------------------------
const subscriptionPlansService = {
  /**
   * Fetch all subscription plans
   * GET /subscription-plans
   */
  getAll: async () => {
    const response = await axiosInstance.get("/subscription-plans");
    return response.data; // { success, count, message, data: [...] }
  },
};

export default subscriptionPlansService;