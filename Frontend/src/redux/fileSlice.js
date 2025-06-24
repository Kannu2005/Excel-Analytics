import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Helper to get token and create headers with Authorization
const getAuthHeaders = (isFormData = false) => {
  const token = localStorage.getItem("token"); // adjust if you store token elsewhere
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
      // console.log("Sending token:", token); // ✅ Debug log

      const response = await fetch("http://localhost:5000/api/files/upload", {
        method: "POST",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: formData,
      });

      if (!response.ok) {
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
      const response = await fetch("http://localhost:5000/api/files", {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
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
        `http://localhost:5000/api/files/${fileId}`,
        {
          headers: getAuthHeaders(),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(
          errorData.message || "Failed to fetch file data"
        );
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
      .addCase(getUserFiles.fulfilled, (state, action) => {
        state.files = action.payload;
      })
      // Get file data
      .addCase(getFileData.fulfilled, (state, action) => {
        state.currentFile = action.payload;
      });
  },
});

export const { clearError, clearUploadSuccess } = fileSlice.actions;
export default fileSlice.reducer;
