import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
  
    isLoggedIn: false,
  user: null,
  },
  reducers: {
    loginn: (state, action) => {
      state.isLoggedIn = true;
      state.user = action.payload;
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.user = null;
    },
  },
});

export const { loginn, logout } = authSlice.actions;
export default authSlice.reducer;
