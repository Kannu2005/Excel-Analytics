// src/redux/userSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialToken = localStorage.getItem('token');

const userSlice = createSlice({
  name: 'user',
  initialState: {
    token: initialToken,
    user: null,
    isAuthenticated: !!initialToken,
    loading: false,
    error: null,
  },
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      const { token, user } = action.payload;
      state.loading = false;
      state.isAuthenticated = true;
      state.token = token;
      state.user = user;
      localStorage.setItem('token', token);
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.user = null;
      state.error = null;
      localStorage.removeItem('token');
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout, clearError } = userSlice.actions;
export default userSlice.reducer;
