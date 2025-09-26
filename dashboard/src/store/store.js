import { configureStore } from '@reduxjs/toolkit';
import LeadReducer from "../features/leads/leadSlice"
import StaffReducer from "../features/staff/staffSlice"
import AssociateReducer from "../features/associate/associateSlice"
import hotelReducer from "../features/hotel/hotelSlice";
import locationReducer from "../features/location/locationSlice"
import packageReducer from "../features/package/packageSlice";
import cityReducer from "../features/allcities/citySlice";
import profileReducer from "../features/user/userSlice";
import vehicleQuotationReducer from "../features/quotation/vehicleQuotationSlice"
import flightQuotationReducer from "../features/quotation/flightQuotationSlice"

export const store = configureStore({
  reducer: {
    leads: LeadReducer,
    staffs: StaffReducer,
    associate: AssociateReducer,
    hotel: hotelReducer,
    location: locationReducer,
    packages: packageReducer,
    cities: cityReducer,
    profile: profileReducer,
    vehicleQuotation: vehicleQuotationReducer,
    flightQuotation: flightQuotationReducer,
  },
});

export default store;
