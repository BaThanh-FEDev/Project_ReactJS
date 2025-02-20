import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  lang: localStorage.getItem("LANG") || "vi",
};

const name = "config";

const slice = createSlice({
  name,
  initialState,
  reducers: {
    changeLanguage(state, action) {
      state.lang = action.payload;
      localStorage.setItem("LANG", action.payload);
    },
  },
  extraReducers: (builder) => {
    
  },
});

const { reducer, actions } = slice;
export const { changeLanguage } = actions;
export default reducer;
