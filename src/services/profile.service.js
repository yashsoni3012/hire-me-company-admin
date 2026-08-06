// import { buildApiUrl } from "../config/api";

// const authHeaders = (token) => ({
//   "Content-Type": "application/json",
//   ...(token ? { Authorization: `Bearer ${token}` } : {}),
// });

// const parseJsonSafe = async (res) => {
//   try {
//     return await res.json();
//   } catch {
//     return {};
//   }
// };

// export const profileService = {
//   /**
//    * GET /company-users/:id
//    */
//   async getCompanyUser(userId, token) {
//     const res = await fetch(buildApiUrl(`/company-users/${userId}`), {
//       headers: authHeaders(token),
//     });
//     if (!res.ok) throw new Error("Failed to fetch user details");
//     const data = await res.json();
//     return data.data || data;
//   },

//   /**
//    * GET /companies
//    */
//   async getCompanies(token) {
//     const res = await fetch(buildApiUrl("/companies"), {
//       headers: authHeaders(token),
//     });
//     if (!res.ok) throw new Error("Failed to fetch companies");
//     const data = await res.json();
//     return data.data || data;
//   },

//   /**
//    * PATCH /company-users/:id
//    * payload: { name, email, mobile, location, bio, department }
//    */
//   async updateCompanyUser(userId, payload, token) {
//     const res = await fetch(buildApiUrl(`/company-users/${userId}`), {
//       method: "PATCH",
//       headers: authHeaders(token),
//       body: JSON.stringify(payload),
//     });
//     const data = await parseJsonSafe(res);
//     if (!res.ok) {
//       throw new Error(
//         data?.message || data?.error || "Failed to update profile."
//       );
//     }
//     return data.data || data;
//   },

//   /**
//    * PATCH /company-users/change-password
//    * payload: { old_password, new_password, confirm_password }
//    */
//   async changePassword(payload, token) {
//     const res = await fetch(buildApiUrl("/company-users/change-password"), {
//       method: "PATCH",
//       headers: authHeaders(token),
//       body: JSON.stringify(payload),
//     });
//     const data = await parseJsonSafe(res);
//     if (!res.ok) {
//       throw new Error(
//         data?.message || data?.error || "Failed to change password."
//       );
//     }
//     return data;
//   },
// };

// export default profileService;

import { buildApiUrl } from "../config/api";

const authHeaders = (token) => ({
  "Content-Type": "application/json",
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
});

const parseJsonSafe = async (res) => {
  try {
    return await res.json();
  } catch {
    return {};
  }
};

export const profileService = {
  /**
   * GET /company-users/:id
   */
  async getCompanyUser(userId, token) {
    const res = await fetch(buildApiUrl(`/company-users/${userId}`), {
      headers: authHeaders(token),
    });
    if (!res.ok) throw new Error("Failed to fetch user details");
    const data = await res.json();
    return data.data || data;
  },

  /**
   * GET /companies
   */
  async getCompanies(token) {
    const res = await fetch(buildApiUrl("/companies"), {
      headers: authHeaders(token),
    });
    if (!res.ok) throw new Error("Failed to fetch companies");
    const data = await res.json();
    return data.data || data;
  },

  /**
   * PATCH /company-users/:id
   */
  async updateCompanyUser(userId, payload, token) {
    const res = await fetch(buildApiUrl(`/company-users/${userId}`), {
      method: "PATCH",
      headers: authHeaders(token),
      body: JSON.stringify(payload),
    });
    const data = await parseJsonSafe(res);
    if (!res.ok) {
      throw new Error(
        data?.message || data?.error || "Failed to update profile."
      );
    }
    return data.data || data;
  },

  /**
   * PATCH /companies/:id  <-- NEW method
   * Supports both JSON and FormData (for file upload)
   */
  async updateCompany(companyId, payload, token) {
    const isFormData = payload instanceof FormData;
    const headers = {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
    if (!isFormData) {
      headers["Content-Type"] = "application/json";
    }
    const res = await fetch(buildApiUrl(`/companies/${companyId}`), {
      method: "PATCH",
      headers,
      body: isFormData ? payload : JSON.stringify(payload),
    });
    const data = await parseJsonSafe(res);
    if (!res.ok) {
      throw new Error(
        data?.message || data?.error || "Failed to update company."
      );
    }
    return data.data || data;
  },

  /**
   * PATCH /company-users/change-password
   */
  async changePassword(payload, token) {
    const res = await fetch(buildApiUrl("/company-users/change-password"), {
      method: "PATCH",
      headers: authHeaders(token),
      body: JSON.stringify(payload),
    });
    const data = await parseJsonSafe(res);
    if (!res.ok) {
      throw new Error(
        data?.message || data?.error || "Failed to change password."
      );
    }
    return data;
  },
};

export default profileService;