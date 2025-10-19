import mongoose from "mongoose";
import { DaySchema } from "./day.model.js";
import { policySchema } from "../common/policy.js";

// Stay Locations
const StayLocationSchema = new mongoose.Schema(
    {
        city: {
            type: String,
            trim: true,
            required: true, // Always required
        },
        nights: {
            type: Number,
            min: 1,
            required: true, // Always required
        },
    },
    { _id: false }
);

// Meal Plan
const MealPlanSchema = new mongoose.Schema(
    {
        planType: {
            type: String,
            enum: ["AP", "CP", "EP", "MAP"],
            required: true,
        },
        description: { type: String, default: "" },
    },
    { _id: false }
);

// Hotel Category (standard / deluxe / superior)
const HotelCategorySchema = new mongoose.Schema(
    {
        category: {
            type: String,
            enum: ["standard", "deluxe", "superior"],
            required: true,
        },
        hotelName: { type: String, trim: true, required: false, default: "TBD" },
        pricePerPerson: { type: Number, required: true, min: 0 },
    },
    { _id: false }
);

// Destination Nights Schema
const DestinationNightSchema = new mongoose.Schema(
    {
        destination: { type: String, trim: true, required: true },
        nights: { type: Number, min: 1, required: true },
        hotels: [HotelCategorySchema],
    },
    { _id: false }
);

// Package
const PackageSchema = new mongoose.Schema(
    {
        packageId: {
            type: String,
            unique: true,
        },
        tourType: {
            type: String,
            enum: ["Domestic", "International"],
            required: function () {
                return this.status !== "draft";
            },
        },
        destinationCountry: { type: String, default: "" },
        sector: {
            type: String,
            required: function () {
                return this.status !== "draft";
            },
        },
        packageSubType: {
            type: [String],
            required: function () {
                return this.status !== "draft";
            },
        },
        stayLocations: [StayLocationSchema],

        // 👇 new fields
        mealPlan: MealPlanSchema,
        destinationNights: [DestinationNightSchema],

        // ✅ Added Policy Section (Dynamic / Optional)
        policy: {
            type: policySchema,
            default: {}, // Empty by default, can include any or all policies dynamically
        },

        arrivalCity: { type: String, default: "" },
        departureCity: { type: String, default: "" },
        title: { type: String, default: "" },
        notes: { type: String, default: "" },
        bannerImage: { type: String, default: "" },
        validFrom: { type: Date },
        validTill: { type: Date },
        days: { type: [DaySchema], default: [] },
        status: {
            type: String,
            enum: ["active", "deactive"],
            default: "deactive",
        },
    },
    { timestamps: true }
);

// -----------------------
// Status Calculation
function calculateStatus(validFrom, validTill) {
    const now = new Date();
    if (validFrom && validTill) {
        return now >= validFrom && now <= validTill ? "active" : "deactive";
    }
    if (validFrom && now >= validFrom) return "active";
    if (validTill && now <= validTill) return "active";
    return "deactive";
}

// Pre-save hook
PackageSchema.pre("save", async function (next) {
    if (this.packageId) return next();

    try {
        const Package = mongoose.model("Package");
        const lastPackage = await Package.findOne({}).sort({ createdAt: -1 });

        let nextNumber = 1;
        if (lastPackage && lastPackage.packageId) {
            const lastNumber = parseInt(lastPackage.packageId.split("_").pop());
            nextNumber = lastNumber + 1;
        }

        this.packageId = `IY_PCK_${String(nextNumber).padStart(3, "0")}`;

        if (this.tourType === "Domestic") {
            this.destinationCountry = "India";
        }
        this.status = calculateStatus(this.validFrom, this.validTill);
        next();
    } catch (err) {
        next(err);
    }
});

// Pre-update hook
PackageSchema.pre("findOneAndUpdate", function (next) {
    const update = this.getUpdate();
    if (update.tourType === "Domestic") {
        update.destinationCountry = "India";
    }
    if (update.validFrom || update.validTill) {
        const validFrom = update.validFrom || this._update.validFrom;
        const validTill = update.validTill || this._update.validTill;
        update.status = calculateStatus(validFrom, validTill);
    }
    next();
});

const Package = mongoose.model("Package", PackageSchema);
export default Package;
