// utils/api.js
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = {
  // Generic fetch wrapper
  request: async (endpoint, options = {}) => {
    const token = localStorage.getItem("token");
    const url = `${API_BASE_URL}${endpoint}`;

    // Merge headers with Authorization if token exists
    const headers = {
      Authorization: token ? `Bearer ${token}` : "",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    // Add Content-Type header if body is not FormData
    if (options.body && !(options.body instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }

    const config = {
      ...options,
      headers,
    };

    // Debug logs to inspect URL and headers
    console.log("Sending request to:", url);
    console.log("Request headers:", config.headers);

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  },

  get: (endpoint, options = {}) => api.request(endpoint, options),

  post: (endpoint, data, options = {}) =>
    api.request(endpoint, {
      method: "POST",
      body: data instanceof FormData ? data : JSON.stringify(data),
      ...options,
    }),

  put: (endpoint, data, options = {}) =>
    api.request(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
      ...options,
    }),

  delete: (endpoint, options = {}) =>
    api.request(endpoint, {
      method: "DELETE",
      ...options,
    }),
};

export default api;
