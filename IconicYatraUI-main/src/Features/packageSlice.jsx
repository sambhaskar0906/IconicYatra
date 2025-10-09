// src/features/packageSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { packagesAxios } from "../Utils/axiosInstance";

// ✅ Fetch all packages
export const fetchPackages = createAsyncThunk(
    "packages/fetchPackages",
    async (_, { rejectWithValue }) => {
        try {
            const res = await packagesAxios.get("/");
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

// ✅ Fetch domestic packages
export const fetchDomesticPackages = createAsyncThunk(
    "packages/fetchDomesticPackages",
    async (_, { rejectWithValue }) => {
        try {
            const res = await packagesAxios.get("/", { params: { tourType: "Domestic" } });
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

// ✅ Fetch international packages
export const fetchInternationalPackages = createAsyncThunk(
    "packages/fetchInternationalPackages",
    async (_, { rejectWithValue }) => {
        try {
            const res = await packagesAxios.get("/", { params: { tourType: "International" } });
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

// ✅ Fetch single package
export const fetchPackageById = createAsyncThunk(
    "packages/fetchPackageById",
    async (id, { rejectWithValue }) => {
        try {
            const res = await packagesAxios.get(`/${id}`);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

const packageSlice = createSlice({
    name: "packages",
    initialState: {
        items: [],
        domestic: [],
        international: [],
        total: 0,
        page: 1,
        limit: 10,
        selected: null,
        loading: false,
        error: null,
    },
    reducers: {
        clearSelected: (state) => {
            state.selected = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // All packages
            .addCase(fetchPackages.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPackages.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload.items;
                state.total = action.payload.total;
                state.page = action.payload.page;
                state.limit = action.payload.limit;
            })
            .addCase(fetchPackages.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Domestic
            .addCase(fetchDomesticPackages.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDomesticPackages.fulfilled, (state, action) => {
                state.loading = false;
                state.domestic = action.payload.items;
            })
            .addCase(fetchDomesticPackages.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // International
            .addCase(fetchInternationalPackages.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchInternationalPackages.fulfilled, (state, action) => {
                state.loading = false;
                state.international = action.payload.items;
            })
            .addCase(fetchInternationalPackages.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Single package
            .addCase(fetchPackageById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPackageById.fulfilled, (state, action) => {
                state.loading = false;
                state.selected = action.payload;
            })
            .addCase(fetchPackageById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearSelected } = packageSlice.actions;
export default packageSlice.reducer;
