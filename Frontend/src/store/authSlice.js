import { createSlice } from '@reduxjs/toolkit';

/**
 * Authentication Slice
 * Manages user authentication state including user data, tokens, and loading states
 * Provides reducers for login, logout, user updates, and loading management
 */
const authSlice = createSlice({
  name: 'auth',
  // Initial state structure
  initialState: {
    user: null, // Current user object (null when not authenticated)
    token: localStorage.getItem('token'), // JWT token from localStorage
    loading: true, // Loading state for async operations
  },
  // Reducer functions for state updates
  reducers: {
    /**
     * Set authentication state with user data and token
     * Called after successful login or token validation
     */
    setAuth: (state, action) => {
      state.user = action.payload.user; // Set user data
      state.token = action.payload.token; // Set authentication token
      state.loading = false; // Set loading to false
      
      // Persist token to localStorage for session persistence
      if (action.payload.token) {
        localStorage.setItem('token', action.payload.token);
      }
    },
    /**
     * Clear authentication state
     * Called during logout or when token becomes invalid
     */
    clearAuth: (state) => {
      state.user = null; // Clear user data
      state.token = null; // Clear token
      state.loading = false; // Set loading to false
      localStorage.removeItem('token'); // Remove token from localStorage
    },
    /**
     * Update user data while preserving other state
     * Used for profile updates and user information changes
     */
    updateUser: (state, action) => {
      // Merge existing user data with updates
      state.user = { ...state.user, ...action.payload };
    },
    
    /**
     * Set loading state for async operations
     * Controls loading indicators during authentication processes
     */
    setLoading: (state, action) => {
      state.loading = action.payload; // Set loading state based on action payload
    }
  },
});

// Export action creators for use in components
export const { setAuth, clearAuth, updateUser, setLoading } = authSlice.actions;

// Export the reducer to be used in the store configuration
export default authSlice.reducer;