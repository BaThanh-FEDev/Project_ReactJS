import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import menuService from "../services/menuService";

const initialState = {
  menuItem: [],
  nickName: "Tài khoản",
};

const name = "menu";

function mappingMenus(item) {
  let childItems = item?.child_items || [];
  childItems = childItems.map(mappingMenus);
  const newItem = {
    id: item.ID,
    title: item.title,
    childItems: childItems,
  };
  return newItem;
}

export const fetchMenu = createAsyncThunk(
  `${name}/fethMenu`, 
  async (lang) => {
    try {
      const response = await menuService.getMenu(lang);
      const menuItems = response.data.items;

      const newMenuItems = menuItems.map(mappingMenus);
      return newMenuItems;
    } catch (err) {
      console.log("err", err);
    }
  }
);

const slice = createSlice({
  name,
  initialState,
  reducer: {},
  extraReducers: (builder) => {
    builder.addCase(fetchMenu.fulfilled, (state, action) => {
      state.menuItem = action.payload;
    });
  },
});

const { reducer, actions } = slice;

export default reducer;
