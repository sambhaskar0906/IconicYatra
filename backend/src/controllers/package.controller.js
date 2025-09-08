import Package from "../models/package.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// ----------------------
// Helper
// ----------------------
function calculateStatus(validFrom, validTill) {
    const now = new Date();
    if (validFrom && validTill) {
        return now >= validFrom && now <= validTill ? "active" : "deactive";
    }
    if (validFrom && now >= validFrom) return "active";
    if (validTill && now <= validTill) return "active";
    return "deactive";
}

// ----------------------
// Normalize helpers
// ----------------------
function normalizeDays(days) {
    return Array.isArray(days) && days.length > 0
        ? days.map(day => ({
            title: day.title || "",
            notes: day.notes || "",
            aboutCity: day.aboutCity || "",
            dayImage: day.dayImage || "",
            sightseeing: Array.isArray(day.sightseeing) ? day.sightseeing : [],
            selectedSightseeing: Array.isArray(day.selectedSightseeing) ? day.selectedSightseeing : []
        }))
        : [
            {
                title: "",
                notes: "",
                aboutCity: "",
                dayImage: "",
                sightseeing: [],
                selectedSightseeing: [],
            }
        ];
}

function normalizeMealPlan(mealPlan) {
    if (!mealPlan) return null;
    return {
        planType: mealPlan.planType || "CP",
        description: mealPlan.description || "",
    };
}

function normalizeDestinationNights(destNights) {
    if (!Array.isArray(destNights)) return [];
    return destNights.map(d => ({
        destination: d.destination || "",
        nights: Number(d.nights) || 1,
        hotels: Array.isArray(d.hotels)
            ? d.hotels.map(h => ({
                category: h.category || "standard",
                hotelName: h.hotelName || "",
                pricePerPerson: Number(h.pricePerPerson) || 0,
            }))
            : []
    }));
}

// ----------------------
// CREATE PACKAGE
// ----------------------
export const createPackage = asyncHandler(async (req, res) => {
    const data = req.body || {};

    // Normalize data
    data.days = normalizeDays(data.days);
    data.mealPlan = normalizeMealPlan(data.mealPlan);
    data.destinationNights = normalizeDestinationNights(data.destinationNights);

    if (data.validFrom) data.validFrom = new Date(data.validFrom);
    if (data.validTill) data.validTill = new Date(data.validTill);

    if (data.tourType === "International" && !data.destinationCountry) {
        return res.status(400).json({ message: "destinationCountry required for International" });
    }

    data.status = calculateStatus(data.validFrom, data.validTill);

    const doc = await Package.create(data);

    res.status(201).json({
        message: "Package created successfully",
        package: doc.toObject()
    });
});

// ----------------------
// UPDATE STEP 1 (Info)
// ----------------------
export const updateStep1 = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const data = req.body || {};

    if (data.tourType === "International" && !data.destinationCountry) {
        return res.status(400).json({ message: "destinationCountry required for International" });
    }

    data.mealPlan = normalizeMealPlan(data.mealPlan);
    data.destinationNights = normalizeDestinationNights(data.destinationNights);
    data.status = calculateStatus(data.validFrom, data.validTill);

    const updated = await Package.findByIdAndUpdate(id, data, { new: true });
    if (!updated) return res.status(404).json({ message: "Package not found" });

    res.json(updated.toObject());
});

// ----------------------
// UPDATE STEP 2 (Tour Details / Days)
// ----------------------
export const updateTourDetails = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const data = req.body || {};

    if (!Array.isArray(data.days)) {
        return res.status(400).json({ message: "days field is required in step 2" });
    }

    data.days = normalizeDays(data.days);

    const existing = await Package.findById(id);
    if (!existing) return res.status(404).json({ message: "Package not found" });

    data.status = calculateStatus(existing.validFrom, existing.validTill);

    const updated = await Package.findByIdAndUpdate(id, data, { new: true });
    res.json(updated.toObject());
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

    res.json(updated.toObject());
});

// ----------------------
// UPLOAD DAY IMAGE
// ----------------------
export const uploadDayImage = asyncHandler(async (req, res) => {
    const { id, dayIndex } = req.params;
    if (!req.file) return res.status(400).json({ message: "No dayImage file uploaded" });

    const pkg = await Package.findById(id);
    if (!pkg) return res.status(404).json({ message: "Package not found" });

    const idx = Number(dayIndex);
    if (isNaN(idx) || idx < 0) return res.status(400).json({ message: "Invalid dayIndex" });

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

    pkg.days[idx].dayImage = req.file.filename;
    await pkg.save();

    res.json(pkg.toObject());
});

// ----------------------
// GET BY ID
// ----------------------
export const getById = asyncHandler(async (req, res) => {
    const doc = await Package.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: "Package not found" });

    const packageData = doc.toObject();
    packageData.status = calculateStatus(packageData.validFrom, packageData.validTill);

    packageData.bannerImage = packageData.bannerImage ? `/uploads/${packageData.bannerImage}` : "";

    packageData.days = normalizeDays(packageData.days);

    res.json(packageData);
});

// ----------------------
// LIST PACKAGES
// ----------------------
export const listPackages = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, tourType, search, status } = req.query;
    const query = {};

    if (tourType) query.tourType = tourType;
    if (status) query.status = status;
    if (search) query.$or = [
        { sector: new RegExp(search, "i") },
        { title: new RegExp(search, "i") },
        { "stayLocations.city": new RegExp(search, "i") },
        { "destinationNights.destination": new RegExp(search, "i") },
        { "destinationNights.hotels.hotelName": new RegExp(search, "i") }
    ];

    const skip = (Number(page) - 1) * Number(limit);

    const [items, total] = await Promise.all([
        Package.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
        Package.countDocuments(query)
    ]);

    res.json({
        items: items.map(doc => {
            const packageData = doc.toObject();
            packageData.days = normalizeDays(packageData.days);
            packageData.status = calculateStatus(packageData.validFrom, packageData.validTill);
            return packageData;
        }),
        total,
        page: Number(page),
        limit: Number(limit)
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
