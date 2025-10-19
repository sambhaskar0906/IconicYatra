import Package from "../models/package.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const BASE_URL = process.env.BASE_URL || "http://localhost:5000";

// ----------------------
// Improved Helpers
// ----------------------
function calculateStatus(validFrom, validTill) {
    const now = new Date();

    // If both dates are provided
    if (validFrom && validTill) {
        return now >= validFrom && now <= validTill ? "active" : "deactive";
    }

    // If only validFrom is provided
    if (validFrom && now >= validFrom) return "active";

    // If only validTill is provided
    if (validTill && now <= validTill) return "active";

    return "deactive";
}

// ----------------------
// Enhanced Normalize helpers
// ----------------------
function normalizeDays(days) {
    if (!Array.isArray(days) || days.length === 0) {
        return [{
            title: "",
            notes: "",
            aboutCity: "",
            dayImage: "",
            sightseeing: [],
            selectedSightseeing: []
        }];
    }

    return days.map(day => ({
        title: day.title?.trim() || "",
        notes: day.notes?.trim() || "",
        aboutCity: day.aboutCity?.trim() || "",
        dayImage: day.dayImage || "",
        sightseeing: Array.isArray(day.sightseeing) ? day.sightseeing : [],
        selectedSightseeing: Array.isArray(day.selectedSightseeing) ? day.selectedSightseeing : []
    }));
}

function normalizeMealPlan(mealPlan) {
    if (!mealPlan || typeof mealPlan !== 'object') {
        return {
            planType: "CP",
            description: "",
        };
    }

    return {
        planType: ["AP", "CP", "EP", "MAP"].includes(mealPlan.planType) ? mealPlan.planType : "CP",
        description: mealPlan.description?.trim() || "",
    };
}

function normalizeDestinationNights(destNights) {
    if (!Array.isArray(destNights)) return [];

    return destNights.map(d => ({
        destination: d.destination?.trim() || "",
        nights: Math.max(1, Number(d.nights) || 1),
        hotels: Array.isArray(d.hotels) ? d.hotels.map(h => ({
            category: ["standard", "deluxe", "superior"].includes(h.category) ? h.category : "standard",
            hotelName: h.hotelName?.trim() || "TBD",
            pricePerPerson: Math.max(0, Number(h.pricePerPerson) || 0),
        })) : []
    }));
}

// ✅ IMPROVED: Policy Normalization with validation
function normalizePolicy(policy) {
    if (!policy || typeof policy !== 'object') {
        return {
            inclusionPolicy: [],
            exclusionPolicy: [],
            paymentPolicy: [],
            cancellationPolicy: [],
            termsAndConditions: []
        };
    }

    // Helper function to normalize policy arrays
    const normalizePolicyArray = (arr) => {
        if (!Array.isArray(arr)) return [];
        return arr
            .filter(item => typeof item === 'string' && item.trim().length > 0)
            .map(item => item.trim());
    };

    return {
        inclusionPolicy: normalizePolicyArray(policy.inclusionPolicy),
        exclusionPolicy: normalizePolicyArray(policy.exclusionPolicy),
        paymentPolicy: normalizePolicyArray(policy.paymentPolicy),
        cancellationPolicy: normalizePolicyArray(policy.cancellationPolicy),
        termsAndConditions: normalizePolicyArray(policy.termsAndConditions),
    };
}

// ✅ NEW: Date normalization helper
function normalizeDates(data) {
    if (data.validFrom) {
        data.validFrom = new Date(data.validFrom);
        // Prevent dates in the past for validFrom
        if (data.validFrom < new Date().setHours(0, 0, 0, 0)) {
            data.validFrom = new Date(); // Set to current date
        }
    }

    if (data.validTill) {
        data.validTill = new Date(data.validTill);
        // Ensure validTill is after validFrom
        if (data.validFrom && data.validTill <= data.validFrom) {
            data.validTill = new Date(data.validFrom.getTime() + 24 * 60 * 60 * 1000); // Add 1 day
        }
    }

    return data;
}

// ✅ NEW: URL normalization helper
function normalizePackageUrls(packageData) {
    const result = { ...packageData };

    // Fix banner image URL
    result.bannerImage = result.bannerImage
        ? result.bannerImage.startsWith("http")
            ? result.bannerImage
            : `${BASE_URL}/upload/${result.bannerImage}`
        : `${BASE_URL}/upload/default.jpg`;

    // Fix day image URLs
    result.days = normalizeDays(result.days).map(day => ({
        ...day,
        dayImage: day.dayImage
            ? day.dayImage.startsWith("http")
                ? day.dayImage
                : `${BASE_URL}/upload/${day.dayImage}`
            : `${BASE_URL}/upload/default.jpg`
    }));

    return result;
}

// ----------------------
// CREATE PACKAGE (IMPROVED)
// ----------------------
export const createPackage = asyncHandler(async (req, res) => {
    const data = { ...req.body };

    // Normalize all data
    data.days = normalizeDays(data.days);
    data.mealPlan = normalizeMealPlan(data.mealPlan);
    data.destinationNights = normalizeDestinationNights(data.destinationNights);
    data.policy = normalizePolicy(data.policy);

    // Normalize dates and calculate status
    normalizeDates(data);
    data.status = calculateStatus(data.validFrom, data.validTill);

    // Validation for International packages
    if (data.tourType === "International" && !data.destinationCountry?.trim()) {
        return res.status(400).json({
            message: "destinationCountry is required for International tours"
        });
    }

    // Auto-set India for Domestic tours
    if (data.tourType === "Domestic") {
        data.destinationCountry = "India";
    }

    const doc = await Package.create(data);
    const responseData = normalizePackageUrls(doc.toObject());

    res.status(201).json({
        message: "Package created successfully",
        package: responseData
    });
});

// ----------------------
// UPDATE STEP 1 (IMPROVED)
// ----------------------
export const updateStep1 = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const data = { ...req.body };

    // Validation
    if (data.tourType === "International" && !data.destinationCountry?.trim()) {
        return res.status(400).json({
            message: "destinationCountry is required for International tours"
        });
    }

    // Normalize data
    data.mealPlan = normalizeMealPlan(data.mealPlan);
    data.destinationNights = normalizeDestinationNights(data.destinationNights);
    data.policy = normalizePolicy(data.policy);

    // Normalize dates and calculate status
    normalizeDates(data);
    data.status = calculateStatus(data.validFrom, data.validTill);

    const updated = await Package.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true
    });

    if (!updated) {
        return res.status(404).json({ message: "Package not found" });
    }

    const responseData = normalizePackageUrls(updated.toObject());
    res.json(responseData);
});

// ----------------------
// UPDATE STEP 2 (IMPROVED)
// ----------------------
export const updateTourDetails = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const data = { ...req.body };

    if (!Array.isArray(data.days)) {
        return res.status(400).json({
            message: "days field is required and must be an array"
        });
    }

    data.days = normalizeDays(data.days);

    const existing = await Package.findById(id);
    if (!existing) {
        return res.status(404).json({ message: "Package not found" });
    }

    // Recalculate status based on existing dates
    data.status = calculateStatus(existing.validFrom, existing.validTill);

    const updated = await Package.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true
    });

    const responseData = normalizePackageUrls(updated.toObject());
    res.json(responseData);
});

// ----------------------
// GET BY ID (IMPROVED)
// ----------------------
export const getById = asyncHandler(async (req, res) => {
    const doc = await Package.findById(req.params.id);
    if (!doc) {
        return res.status(404).json({ message: "Package not found" });
    }

    const packageData = doc.toObject();
    packageData.status = calculateStatus(packageData.validFrom, packageData.validTill);

    const responseData = normalizePackageUrls(packageData);
    res.json(responseData);
});

// ----------------------
// LIST PACKAGES (IMPROVED)
// ----------------------
export const listPackages = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, tourType, search, status } = req.query;
    const query = {};

    // Build query
    if (tourType) query.tourType = tourType;
    if (status) query.status = status;
    if (search?.trim()) {
        const searchRegex = new RegExp(search.trim(), "i");
        query.$or = [
            { sector: searchRegex },
            { title: searchRegex },
            { "stayLocations.city": searchRegex },
            { "destinationNights.destination": searchRegex },
            { "destinationNights.hotels.hotelName": searchRegex }
        ];
    }

    const skip = (Math.max(1, Number(page)) - 1) * Math.max(1, Number(limit));
    const limitNum = Math.min(100, Math.max(1, Number(limit))); // Prevent excessive limits

    const [items, total] = await Promise.all([
        Package.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNum),
        Package.countDocuments(query)
    ]);

    const responseItems = items.map(doc => {
        const packageData = doc.toObject();
        packageData.status = calculateStatus(packageData.validFrom, packageData.validTill);
        return normalizePackageUrls(packageData);
    });

    res.json({
        items: responseItems,
        total,
        page: Number(page),
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum)
    });
});

// ----------------------
// UPLOAD BANNER
// ----------------------
export const uploadBanner = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!req.file) return res.status(400).json({ message: "No banner file uploaded" });

    const updated = await Package.findByIdAndUpdate(
        id,
        { bannerImage: req.file.filename },
        { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Package not found" });

    const BASE_URL = process.env.BASE_URL || "http://localhost:5000";
    const packageData = updated.toObject();
    packageData.bannerImage = `${BASE_URL}/upload/${packageData.bannerImage}`;

    res.json(packageData);
});

// ----------------------
// UPLOAD DAY IMAGE
// ----------------------
export const uploadDayImage = asyncHandler(async (req, res) => {
    const { id, dayIndex } = req.params;
    const BASE_URL = process.env.BASE_URL || "http://localhost:5000";

    if (!req.file) {
        return res.status(400).json({ message: "No dayImage file uploaded" });
    }

    const pkg = await Package.findById(id);
    if (!pkg) {
        return res.status(404).json({ message: "Package not found" });
    }

    const idx = Number(dayIndex);
    if (isNaN(idx) || idx < 0) {
        return res.status(400).json({ message: "Invalid dayIndex" });
    }

    // Ensure days array exists and has enough entries
    if (!Array.isArray(pkg.days)) pkg.days = [];
    while (pkg.days.length <= idx) {
        pkg.days.push({
            title: "",
            notes: "",
            aboutCity: "",
            dayImage: "",
            sightseeing: [],
            selectedSightseeing: []
        });
    }

    // ✅ Save only the filename in DB
    pkg.days[idx].dayImage = req.file.filename;
    await pkg.save();

    // ✅ Return package with absolute URL for frontend
    const packageData = pkg.toObject();
    packageData.days = packageData.days.map((day, i) => ({
        ...day,
        dayImage: day.dayImage
            ? `${BASE_URL}/upload/${day.dayImage}`
            : `${BASE_URL}/upload/default.jpg`
    }));

    res.json({
        message: "Day image uploaded successfully",
        package: packageData
    });
});


// ----------------------
// DELETE
// ----------------------
export const remove = asyncHandler(async (req, res) => {
    const doc = await Package.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ message: "Package not found" });

    res.json({ message: "Deleted", id: doc._id });
});
