import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { MenuItemT } from "../../types";
import getMenu, { GetMenuResponse } from "../../api/menu/getMenu";

interface MenuSlice {
  menu: MenuItemT[];
  isOpen: boolean;
}
const initialState: MenuSlice = {
  menu: [],
  isOpen: false,
};

export const getMenuAction = createAsyncThunk<GetMenuResponse["data"], string>(
  "menu/getMenuAction",
  async (vendorId: string) => {
    try {
      const response = await getMenu(vendorId);
      return response;
    } catch (error) {
      console.log(error);
      return {
        menuItems: [],
        isOpen: false,
      };
    }
  }
);

const menuSlice = createSlice({
  initialState,
  name: "menuSlice",
  reducers: {
    addMenu: (state, action: PayloadAction<MenuItemT>) => {
      state.menu.push(action.payload);
    },
    removeItem: (state, action: PayloadAction<string>) => {
      const index = state.menu.findIndex(
        (menuItem) => menuItem._id === action.payload
      );
      state.menu.splice(index, 1);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMenuAction.pending, (state) => {
        state.menu = [];
      })
      .addCase(
        getMenuAction.fulfilled,
        (state, action: PayloadAction<GetMenuResponse["data"]>) => {
          state.menu = action.payload.menuItems;
          state.isOpen = action.payload?.isOpen;
        }
      );
  },
});
export const { addMenu, removeItem } = menuSlice.actions;

export default menuSlice.reducer;
