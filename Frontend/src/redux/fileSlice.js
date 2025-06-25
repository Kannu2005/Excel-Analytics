import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Helper to get token and create headers with Authorization
const getAuthHeaders = (isFormData = false) => {
  const token = localStorage.getItem("token");
  return {
    Authorization: token ? `Bearer ${token}` : "",
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
  };
};

// Upload file
export const uploadFile = createAsyncThunk(
  "files/upload",
  async (formData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch("https://excel-analytics-1-sjro.onrender.com/api/files/upload", {
        method: "POST",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: formData,
      });

      const contentType = response.headers.get("content-type");

      if (!response.ok) {
        if (!contentType || !contentType.includes("application/json")) {
          const errorText = await response.text();
          return rejectWithValue(`Unexpected error: ${errorText}`);
        }

        const errorData = await response.json();
        return rejectWithValue(errorData.message || "Upload failed");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Upload failed");
    }
  }
);

// Get user files
export const getUserFiles = createAsyncThunk(
  "files/getUserFiles",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("https://excel-analytics-1-sjro.onrender.com/api/files", {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          const text = await response.text();
          return rejectWithValue(`Unexpected error: ${text}`);
        }

        const errorData = await response.json();
        return rejectWithValue(errorData.message || "Failed to fetch files");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch files");
    }
  }
);

// Get file data
export const getFileData = createAsyncThunk(
  "files/getFileData",
  async (fileId, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `https://excel-analytics-1-sjro.onrender.com/api/files/${fileId}`,
        {
          headers: getAuthHeaders(),
        }
      );

      if (!response.ok) {
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          const text = await response.text();
          return rejectWithValue(`Unexpected error: ${text}`);
        }

        const errorData = await response.json();
        return rejectWithValue(errorData.message || "Failed to fetch file data");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch file data");
    }
  }
);

const fileSlice = createSlice({
  name: "files",
  initialState: {
    files: [],
    currentFile: null,
    loading: false,
    error: null,
    uploadSuccess: false,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearUploadSuccess: (state) => {
      state.uploadSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Upload file
      .addCase(uploadFile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadFile.fulfilled, (state, action) => {
        state.loading = false;
        state.uploadSuccess = true;
        state.files.unshift(action.payload.file);
      })
      .addCase(uploadFile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get user files
      .addCase(getUserFiles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserFiles.fulfilled, (state, action) => {
        state.loading = false;
        state.files = action.payload;
      })
      .addCase(getUserFiles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get file data
      .addCase(getFileData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFileData.fulfilled, (state, action) => {
        state.loading = false;
        state.currentFile = action.payload;
      })
      .addCase(getFileData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearUploadSuccess } = fileSlice.actions;
export default fileSlice.reducer;
