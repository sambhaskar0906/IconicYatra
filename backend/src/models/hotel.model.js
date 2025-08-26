import mongoose from "mongoose";

const hotelSchema = new mongoose.Schema({
    hotelId: { type: String, unique: true },
    hotelName: { type: String, required: true },
    hotelType: {
        type: String,
        enum: ["Resort", "Villa", "Boutique", "Business", "Budget", "Luxury"],
        required: true,
    },
    status: {
        type: String,
        enum: ["Active", "Inactive"],
        default: "Active",
    },
    contactDetails: {
        email: { type: String, required: true },
        mobile: { type: String, required: true },
        alternateContact: { type: String },
        designation: { type: String },
        contactPerson: { type: String },
    },
    description: { type: String },
    cancellationPolicy: {
        type: String,
        enum: ["Non-refundable", "24hrs Free", "48hrs Free", "Flexible"],
    },
    facilities: [
        {
            type: String,
            enum: [
                "Wifi",
                "Parking",
                "Pool",
                "Restaurant",
                "Spa",
                "Gym",
                "Airport Pickup",
            ],
        },
    ],
    mainImage: { type: String },

    location: {
        country: { type: String, required: true },
        state: { type: String, required: true },
        city: { type: String, required: true },
        address1: { type: String },
        pincode: { type: String },
    },

    socialMedia: {
        googleLink: { type: String },
    },

    rooms: [
        {
            seasonType: {
                type: String,
                enum: ["Peak", "Off-Season", "Festival", "Weekend"],
            },
            validFrom: { type: Date },
            validTill: { type: Date },

            roomDetails: [
                {
                    roomType: {
                        type: String,
                        enum: ["Standard", "Deluxe", "Suite", "Family", "Dormitory"],
                        required: true,
                    },
                    mealPlan: {
                        type: String,
                        enum: ["EP", "CP", "MAP", "AP"],
                        required: true,
                    },
                    images: [{ type: String }],

                    mattressCost: {
                        mealPlan: { type: String, enum: ["EP", "CP", "MAP", "AP"] },
                        adult: { type: Number },
                        children: { type: Number },
                        kidWithoutMattress: { type: Number },
                    },

                    peakCost: [
                        {
                            title: { type: String },
                            validFrom: { type: Date },
                            validTill: { type: Date },
                            surcharge: { type: Number },
                            note: { type: String },
                        },
                    ],
                },
            ],

        },
    ],
});

// 🔹 Auto-generate hotelId before saving
hotelSchema.pre("save", async function (next) {
    if (this.isNew) {
        const lastHotel = await mongoose.model("Hotel").findOne().sort({ hotelId: -1 });

        let nextNumber = 1;
        if (lastHotel && lastHotel.hotelId) {
            const lastNumber = parseInt(lastHotel.hotelId.replace("ICYR_HT", ""));
            nextNumber = lastNumber + 1;
        }

        this.hotelId = `ICYR_HT${String(nextNumber).padStart(3, "0")}`;
    }
    next();
});


export default mongoose.model("Hotel", hotelSchema);
