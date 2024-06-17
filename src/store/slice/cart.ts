import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { CartItemsI } from "../../types";

export interface CartState {
  order: CartItemsI[];
  orderNote: string;
}
const initialState: CartState = {
  order: [],
  orderNote: "",
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    increment: (state, action: PayloadAction<string>) => {
      const index = state.order.findIndex((item) => item.id === action.payload);
      if (index !== -1) {
        // Replace existing item
        state.order[index].quantity = state.order[index].quantity + 1;
      } else {
        // Add new item
        state.order.push({
          id: action.payload,
          price: 200,
          quantity: 1,
        });
      }
    },
    decrement: (state, action: PayloadAction<string>) => {
      const index = state.order.findIndex((item) => item.id === action.payload);
      if (index !== -1) {
        state.order[index].quantity = state.order[index].quantity - 1;
      }
    },
  },
});

export const { decrement, increment } = orderSlice.actions;
export default orderSlice.reducer;
