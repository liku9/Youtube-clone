import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';

/**
 * Redux Store Configuration
 * Configures the global Redux store with all reducers and middleware
 * Provides centralized state management for the entire application
 */
export const store = configureStore({
  // Combine all reducers to handle different parts of the state
  reducer: {
    auth: authReducer, // Authentication state management
    // videos: videoReducer,
    // ui: uiReducer,
  },
  
  // Middleware configuration (default middleware includes thunk, devtools, etc.)
  // Can be customized for additional middleware as needed
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // Configure serializable check for better performance
      serializableCheck: {
        // Ignore specific action types that may contain non-serializable data
        ignoredActions: ['persist/PERSIST'],
      },
    }),
  
  // Enable Redux DevTools in development
  devTools: process.env.NODE_ENV !== 'production',
});

// Export the configured store for use in the application
export default store;