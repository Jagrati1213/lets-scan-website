import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { CartItemsI } from "../../types";

export interface CartState {
  order: CartItemsI[];
}
const initialState: CartState = {
  order: [],
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    increment: (
      state,
      action: PayloadAction<{ menuId: string; price: number; quantity: number }>
    ) => {
      const index = state.order.findIndex(
        (item) => item.menuId === action.payload.menuId
      );
      if (index !== -1) {
        // Replace existing item
        state.order[index].quantity = state.order[index].quantity + 1;
      } else {
        // Add new item
        state.order.push({ ...action.payload, quantity: 1 });
      }
    },
    decrement: (state, action: PayloadAction<string>) => {
      const index = state.order.findIndex(
        (item) => item.menuId === action.payload
      );
      if (index !== -1 && state.order[index].quantity > 1) {
        state.order[index].quantity = state.order[index].quantity - 1;
      } else if (index !== -1) {
        // remove item
        state.order.splice(index, 1);
      }
    },
    clearCart: (state) => {
      state.order = [];
    },
  },
});

export const { decrement, increment, clearCart } = orderSlice.actions;
export default orderSlice.reducer;
