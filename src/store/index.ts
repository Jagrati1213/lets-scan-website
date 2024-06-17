import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import menu from "./slice/menu";
import cart from "./slice/cart";

const store = configureStore({ reducer: { menu, cart } });

export type RootState = ReturnType<typeof store.getState>; //get type of state

export type AppDispatch = typeof store.dispatch; // get type of all action reducers

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

export default store;
