import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../Features/authSlice";
import inquiryReducer from "../Features/inquirySlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        inquiry: inquiryReducer,
    }
});
