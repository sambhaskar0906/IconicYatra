import { configureStore } from '@reduxjs/toolkit';
import LeadReducer from "../features/leads/leadSlice"
import StaffReducer from "../features/staff/staffSlice"
import AssociateReducer from "../features/associate/associateSlice"
import hotelReducer from "../features/hotel/hotelSlice";
import locationReducer from "../features/location/locationSlice"

export const store = configureStore({
  reducer: {
    leads: LeadReducer,
    staffs: StaffReducer,
    associate: AssociateReducer,
    hotel: hotelReducer,
    location: locationReducer,
  },
});

export default store;
