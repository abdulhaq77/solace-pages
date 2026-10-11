import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  searchQuery: "",
  sidebarOpen: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
  },
});

export const { setSearchQuery, toggleSidebar } = uiSlice.actions;
export default uiSlice.reducer;
