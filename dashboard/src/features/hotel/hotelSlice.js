// src/redux/slices/hotelSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5000/api/v1";

// ----------- Async Thunks -----------

// ✅ Create Hotel
export const createHotel = createAsyncThunk(
    "hotel/createHotel",
    async (formData, { rejectWithValue }) => {
        try {
            const res = await axios.post(`${API_URL}/create-hotel`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

// ✅ Get All Hotels
export const fetchHotels = createAsyncThunk(
    "hotel/fetchHotels",
    async (_, { rejectWithValue }) => {
        try {
            const res = await axios.get(`${API_URL}/all-hotel`);
            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

// ✅ Get Single Hotel
export const fetchHotelById = createAsyncThunk(
    "hotel/fetchHotelById",
    async (id, { rejectWithValue }) => {
        try {
            const res = await axios.get(`${API_URL}/${id}`);
            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

// ✅ Update Hotel
export const updateHotel = createAsyncThunk(
    "hotel/updateHotel",
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            const res = await axios.put(`${API_URL}/update/${id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

// ✅ Delete Hotel
export const deleteHotel = createAsyncThunk(
    "hotel/deleteHotel",
    async (id, { rejectWithValue }) => {
        try {
            await axios.delete(`${API_URL}/delete/${id}`);
            return id;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

// ✅ Update Status
export const updateHotelStatus = createAsyncThunk(
    "hotel/updateHotelStatus",
    async ({ id, status }, { rejectWithValue }) => {
        try {
            const res = await axios.patch(`${API_URL}/${id}/status`, { status });
            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

// ----------- Slice -----------
const hotelSlice = createSlice({
    name: "hotel",
    initialState: {
        hotels: [],
        hotel: null,
        loading: false,
        error: null,
        success: null,
    },
    reducers: {
        clearMessages: (state) => {
            state.error = null;
            state.success = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // CREATE
            .addCase(createHotel.pending, (state) => {
                state.loading = true;
            })
            .addCase(createHotel.fulfilled, (state, action) => {
                state.loading = false;
                state.success = "Hotel created successfully";
                state.hotels.push(action.payload);
            })
            .addCase(createHotel.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // FETCH ALL
            .addCase(fetchHotels.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchHotels.fulfilled, (state, action) => {
                state.loading = false;
                state.hotels = action.payload;
            })
            .addCase(fetchHotels.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // FETCH BY ID
            .addCase(fetchHotelById.fulfilled, (state, action) => {
                state.hotel = action.payload;
            })

            // UPDATE
            .addCase(updateHotel.fulfilled, (state, action) => {
                state.success = "Hotel updated successfully";
                state.hotels = state.hotels.map((h) =>
                    h._id === action.payload._id ? action.payload : h
                );
            })

            // DELETE
            .addCase(deleteHotel.fulfilled, (state, action) => {
                state.success = "Hotel deleted successfully";
                state.hotels = state.hotels.filter((h) => h._id !== action.payload);
            })

            // UPDATE STATUS
            .addCase(updateHotelStatus.fulfilled, (state, action) => {
                state.success = "Status updated successfully";
                state.hotels = state.hotels.map((h) =>
                    h._id === action.payload._id ? action.payload : h
                );
            });
    },
});

export const { clearMessages } = hotelSlice.actions;
export default hotelSlice.reducer;
