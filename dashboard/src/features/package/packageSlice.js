import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../utils/axios";

// Create package
export const createPackage = createAsyncThunk(
    "packages/createPackage",
    async (data, { rejectWithValue }) => {
        try {
            const res = await axios.post("/packages", data);
            return res.data.package;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

// Fetch all packages
export const fetchPackages = createAsyncThunk(
    "packages/fetchPackages",
    async (params = {}, { rejectWithValue }) => {
        try {
            const res = await axios.get("/packages", { params });
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

// Fetch package by ID
export const fetchPackageById = createAsyncThunk(
    "packages/fetchPackageById",
    async (id, { rejectWithValue }) => {
        try {
            const res = await axios.get(`/packages/${id}`);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

// Update Step 1 (Package Info)
export const updatePackageStep1 = createAsyncThunk(
    "packages/updateStep1",
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const res = await axios.put(`/packages/${id}/step1`, data);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

// Update Step 2 (Tour Details)
export const updatePackageTourDetails = createAsyncThunk(
    "packages/updateTourDetails",
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const res = await axios.put(`/packages/${id}/tour-details`, data, {
                headers: { "Content-Type": "application/json" },
            });
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

// Delete package
export const deletePackage = createAsyncThunk(
    "packages/deletePackage",
    async (id, { rejectWithValue }) => {
        try {
            await axios.delete(`/packages/${id}`);
            return id;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

// Upload banner
export const uploadPackageBanner = createAsyncThunk(
    "packages/uploadBanner",
    async ({ id, file }, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            formData.append("banner", file); // 👈 backend me field name 'banner'

            const res = await axios.post(`/packages/${id}/banner`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            return res.data; // updated package return karega
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

// Upload day image
export const uploadPackageDayImage = createAsyncThunk(
    "packages/uploadDayImage",
    async ({ id, dayIndex, file }, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            formData.append("dayImage", file); // 👈 backend me field name 'dayImage'

            const res = await axios.post(`/packages/${id}/days/${dayIndex}/image`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            return res.data; // updated package return karega
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);


// Slice
const packageSlice = createSlice({
    name: "packages",
    initialState: {
        items: [],
        total: 0,
        current: null,
        loading: false,
        error: null,
    },
    reducers: {
        clearCurrent: (state) => {
            state.current = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Create
            .addCase(createPackage.pending, (state) => { state.loading = true; })
            .addCase(createPackage.fulfilled, (state, action) => {
                state.loading = false;
                const pkg = action.payload.package || action.payload;
                state.items.unshift(pkg);
                state.current = pkg;
            })
            .addCase(createPackage.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

            // Fetch all
            .addCase(fetchPackages.pending, (state) => { state.loading = true; })
            .addCase(fetchPackages.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload.items;
                state.total = action.payload.total;
            })
            .addCase(fetchPackages.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

            // Fetch by ID
            .addCase(fetchPackageById.pending, (state) => { state.loading = true; })
            .addCase(fetchPackageById.fulfilled, (state, action) => {
                state.loading = false;
                state.current = action.payload;
            })
            .addCase(fetchPackageById.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

            .addCase(updatePackageStep1.fulfilled, (state, action) => {
                const pkg = action.payload.package || action.payload;
                state.current = pkg;
                state.items = state.items.map(p => p._id === pkg._id ? pkg : p);
            })

            .addCase(updatePackageTourDetails.fulfilled, (state, action) => {
                const pkg = action.payload.package || action.payload;
                state.current = pkg;
                state.items = state.items.map(p => p._id === pkg._id ? pkg : p);
            })


            // Delete
            .addCase(deletePackage.fulfilled, (state, action) => {
                state.items = state.items.filter(p => p._id !== action.payload);
                if (state.current?._id === action.payload) state.current = null;
            })
            .addCase(uploadPackageBanner.fulfilled, (state, action) => {
                const pkg = action.payload.package || action.payload;
                state.current = pkg;
                state.items = state.items.map(p => p._id === pkg._id ? pkg : p);
            })
            .addCase(uploadPackageDayImage.fulfilled, (state, action) => {
                const pkg = action.payload.package || action.payload;
                state.current = pkg;
                state.items = state.items.map(p => p._id === pkg._id ? pkg : p);
            });

    }
});

export const { clearCurrent } = packageSlice.actions;
export default packageSlice.reducer;
