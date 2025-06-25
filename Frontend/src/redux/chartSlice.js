// redux/chartSlice.js
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
      // console.log("Creating chart with data:", chartData);

      const response = await fetch("https://excel-analytics-1-sjro.onrender.com/charts", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(chartData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || "Chart creation failed");
      }

      const data = await response.json();
      // console.log("Chart created successfully:", data);
      return data;
    } catch (error) {
      console.error("Chart creation error:", error);
      return rejectWithValue(error.message || "Chart creation failed");
    }
  }
);

// Get user charts
export const getUserCharts = createAsyncThunk(
  "charts/getUserCharts",
  async (_, { rejectWithValue }) => {
    try {
      // console.log("Z test",_)
      const response = await fetch("http://localhost:5000/api/charts", {
        headers: getAuthHeaders(),
      });
// console.log("Fetch response:", response);
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || "Failed to fetch charts");
      }

      const data = await response.json();
      // console.log("Fetched chart data:", data);
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
      console.log("Fetching chart with ID:", chartId);
      const response = await fetch(
        `http://localhost:5000/api/charts/${chartId}`,
        {
          headers: getAuthHeaders(),
        }
      );
  // console.log("Fetch response:", response);
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || "Failed to fetch chart");
      }

      const data = await response.json();
    
      console.log("Fetched chart data:", data);
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
        // The response structure from your backend: { message, chart }
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
        state.charts = action.payload; // Assuming the response is an array of charts
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
