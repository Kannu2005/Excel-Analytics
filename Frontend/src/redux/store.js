// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import userSlice from './userSlice';
import fileSlice from './fileSlice';     // import your fileSlice reducer
import chartSlice from './chartSlice';   // optional: if you use chartSlice too

const store = configureStore({
  reducer: {
    user: userSlice,
        files: fileSlice,      // register fileSlice here
    charts: chartSlice,    // register chartSlice if needed
  },
});

export default store;