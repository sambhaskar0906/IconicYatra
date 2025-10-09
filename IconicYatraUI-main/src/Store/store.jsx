import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../Features/authSlice";
import inquiryReducer from "../Features/inquirySlice";
import razorpayReducer from "../Features/razorpaySlice";
import packageReducer from "../Features/packageSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        inquiry: inquiryReducer,
        razorpay: razorpayReducer,
        packages: packageReducer,
    }
});
