const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

// Get dashboard statistics
export const getDashboardStats = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/stats`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch dashboard stats");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    throw error;
  }
};

// Get all users
export const getAllUsers = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/users`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch users");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

// Delete user
export const deleteUser = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error("Failed to delete user");
    }

    return await response.json();
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

// Get all files
export const getAllFiles = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/files`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch files");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching files:", error);
    throw error;
  }
};

// Delete file
export const deleteFile = async (fileId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/files/${fileId}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error("Failed to delete file");
    }

    return await response.json();
  } catch (error) {
    console.error("Error deleting file:", error);
    throw error;
  }
};

// Get storage usage
export const getStorageUsage = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/storage`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch storage usage");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching storage usage:", error);
    throw error;
  }
};

// //////////////////////////////////////////////////////////////////////
// utils/adminApi.js

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      errorData?.message || `HTTP error! status: ${response.status}`
    );
  }
  return response.json();
};

// Get chart statistics
export const getChartStats = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/charts/stats`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    const data = await handleResponse(response);
    return data.data;
  } catch (error) {
    console.error("Failed to fetch chart stats:", error);
    throw error;
  }
};

// Get all charts with optional filters
export const getAllCharts = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();

    // Add parameters if they exist
    Object.keys(params).forEach((key) => {
      if (params[key] !== undefined && params[key] !== "") {
        queryParams.append(key, params[key]);
      }
    });

    const url = `${API_BASE_URL}/admin/charts${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;

    const response = await fetch(url, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    const data = await handleResponse(response);
    return data.data.charts; // Return just the charts array for compatibility
  } catch (error) {
    console.error("Failed to fetch charts:", error);
    throw error;
  }
};

// Get chart by ID
export const getChartById = async (chartId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/charts/${chartId}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    const data = await handleResponse(response);
    return data.data;
  } catch (error) {
    console.error("Failed to fetch chart:", error);
    throw error;
  }
};

// Delete chart
export const deleteChart = async (chartId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/charts/${chartId}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    const data = await handleResponse(response);
    return data;
  } catch (error) {
    console.error("Failed to delete chart:", error);
    throw error;
  }
};

// Bulk delete charts
export const bulkDeleteCharts = async (chartIds) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/charts`, {
      method: "DELETE",
      headers: getAuthHeaders(),
      body: JSON.stringify({ chartIds }),
    });

    const data = await handleResponse(response);
    return data;
  } catch (error) {
    console.error("Failed to bulk delete charts:", error);
    throw error;
  }
};

// Get dashboard overview
export const getDashboardOverview = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/dashboard`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    const data = await handleResponse(response);
    return data.data;
  } catch (error) {
    console.error("Failed to fetch dashboard overview:", error);
    throw error;
  }
};

// Get user statistics
export const getUserStats = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/users/stats`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    const data = await handleResponse(response);
    return data.data;
  } catch (error) {
    console.error("Failed to fetch user stats:", error);
    throw error;
  }
};

// Get file statistics
export const getFileStats = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/files/stats`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    const data = await handleResponse(response);
    return data.data;
  } catch (error) {
    console.error("Failed to fetch file stats:", error);
    throw error;
  }
};

// Export charts data - Fixed version
export const exportCharts = async (format = "json", chartIds = null) => {
  try {
    // Build query parameters
    const params = new URLSearchParams();
    if (format) {
      params.append("format", format);
    }
    if (chartIds && chartIds.length > 0) {
      params.append("chartIds", chartIds.join(","));
    }

    const url = `${API_BASE_URL}/admin/charts/export${
      params.toString() ? "?" + params.toString() : ""
    }`;

    const response = await fetch(url, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    // Check the content type to determine how to handle the response
    const contentType = response.headers.get("content-type");

    if (format === "csv" || contentType?.includes("text/csv")) {
      // Handle CSV download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = `charts-export-${
        new Date().toISOString().split("T")[0]
      }.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      return {
        success: true,
        message: "Charts exported as CSV successfully",
        format: "csv",
      };
    } else {
      // Handle JSON response
      const data = await response.json();

      if (data.success) {
        // Create JSON file download
        const jsonString = JSON.stringify(data.data, null, 2);
        const blob = new Blob([jsonString], { type: "application/json" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        a.download = `charts-export-${
          new Date().toISOString().split("T")[0]
        }.json`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        return {
          success: true,
          message: `${data.totalCharts} charts exported successfully`,
          format: "json",
          totalCharts: data.totalCharts,
          data: data.data,
        };
      } else {
        throw new Error(data.message || "Export failed");
      }
    }
  } catch (error) {
    console.error("Failed to export charts:", error);
    throw new Error(error.message || "Failed to export charts");
  }
};

// Alternative: Export specific charts by IDs
export const exportChartsById = async (chartIds, format = "json") => {
  return exportCharts(format, chartIds);
};

// Alternative: Export all charts as CSV
export const exportChartsAsCSV = async () => {
  return exportCharts("csv");
};

// Alternative: Get charts data without downloading (for display purposes)
export const getChartsForExport = async (chartIds = null) => {
  try {
    const params = new URLSearchParams();
    params.append("format", "json");
    if (chartIds && chartIds.length > 0) {
      params.append("chartIds", chartIds.join(","));
    }

    const url = `${API_BASE_URL}/admin/charts/export?${params.toString()}`;

    const response = await fetch(url, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    const data = await response.json();

    if (data.success) {
      return {
        success: true,
        charts: data.data,
        totalCharts: data.totalCharts,
        exportDate: data.exportDate,
      };
    } else {
      throw new Error(data.message || "Failed to get charts data");
    }
  } catch (error) {
    console.error("Failed to get charts for export:", error);
    throw new Error(error.message || "Failed to get charts data");
  }
};

// Get system health
export const getSystemHealth = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/health`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    const data = await handleResponse(response);
    return data.data;
  } catch (error) {
    console.error("Failed to fetch system health:", error);
    throw error;
  }
};

// Search charts
export const searchCharts = async (searchTerm, filters = {}) => {
  try {
    const params = {
      search: searchTerm,
      ...filters,
    };

    return await getAllCharts(params);
  } catch (error) {
    console.error("Failed to search charts:", error);
    throw error;
  }
};
