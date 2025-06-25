import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Helper to get token and create headers with Authorization
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    Authorization: token ? `Bearer ${token}` : "",
    "Content-Type": "application/json",
  };
};

// Create chart
export const createChart = createAsyncThunk(
  "charts/create",
  async (chartData, { rejectWithValue }) => {
    try {
      const response = await fetch("https://excel-analytics-1-sjro.onrender.com/charts", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(chartData),
      });

      const contentType = response.headers.get("content-type");

      if (!response.ok) {
        if (!contentType || !contentType.includes("application/json")) {
          const errorText = await response.text();
          return rejectWithValue(`Unexpected error: ${errorText}`);
        }

        const errorData = await response.json();
        return rejectWithValue(errorData.message || "Chart creation failed");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Chart creation failed");
    }
  }
);

// Get user charts
export const getUserCharts = createAsyncThunk(
  "charts/getUserCharts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("https://excel-analytics-1-sjro.onrender.com/charts", {
        headers: getAuthHeaders(),
      });

      const contentType = response.headers.get("content-type");

      if (!response.ok) {
        if (!contentType || !contentType.includes("application/json")) {
          const text = await response.text();
          return rejectWithValue(`Unexpected error: ${text}`);
        }

        const errorData = await response.json();
        return rejectWithValue(errorData.message || "Failed to fetch charts");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch charts");
    }
  }
);

// Get specific chart
export const getChart = createAsyncThunk(
  "charts/getChart",
  async (chartId, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `https://excel-analytics-1-sjro.onrender.com/${chartId}`,
        {
          headers: getAuthHeaders(),
        }
      );

      const contentType = response.headers.get("content-type");

      if (!response.ok) {
        if (!contentType || !contentType.includes("application/json")) {
          const text = await response.text();
          return rejectWithValue(`Unexpected error: ${text}`);
        }

        const errorData = await response.json();
        return rejectWithValue(errorData.message || "Failed to fetch chart");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch chart");
    }
  }
);

const chartSlice = createSlice({
  name: "charts",
  initialState: {
    charts: [],
    currentChart: null,
    loading: false,
    error: null,
    createSuccess: false,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCreateSuccess: (state) => {
      state.createSuccess = false;
    },
    setCurrentChart: (state, action) => {
      state.currentChart = action.payload;
    },
    clearCurrentChart: (state) => {
      state.currentChart = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create chart
      .addCase(createChart.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.createSuccess = false;
      })
      .addCase(createChart.fulfilled, (state, action) => {
        state.loading = false;
        state.createSuccess = true;
        state.currentChart = action.payload.chart;
        state.charts.unshift(action.payload.chart);
      })
      .addCase(createChart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.createSuccess = false;
      })

      // Get user charts
      .addCase(getUserCharts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserCharts.fulfilled, (state, action) => {
        state.loading = false;
        state.charts = action.payload;
      })
      .addCase(getUserCharts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get specific chart
      .addCase(getChart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getChart.fulfilled, (state, action) => {
        state.loading = false;
        state.currentChart = action.payload;
      })
      .addCase(getChart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearError,
  clearCreateSuccess,
  setCurrentChart,
  clearCurrentChart,
} = chartSlice.actions;
export default chartSlice.reducer;
