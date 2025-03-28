import authReducer from "@/store/slices/authSlice";
import transactionsReducer from "@/store/slices/transactionSlice";
import { combineReducers } from "@reduxjs/toolkit";

export const RootReducer = combineReducers({
  auth: authReducer,
  transactions: transactionsReducer,
});

export type RootState = ReturnType<typeof RootReducer>;
