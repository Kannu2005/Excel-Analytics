// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import userSlice from './userSlice';
import fileSlice from './fileSlice';
import chartSlice from './chartSlice';

const store = configureStore({
  reducer: {
    user: userSlice,
    files: fileSlice,
    charts: chartSlice,
  },
});

export default store;
