import mongoose from "mongoose";

const hotelSchema = new mongoose.Schema({
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
        state: { type: String, required: true },
        city: { type: String, required: true },
        address1: { type: String },
        address2: { type: String },
        address3: { type: String },
        pincode: { type: String },
        latitude: { type: Number },
        longitude: { type: Number },
    },

    socialMedia: {
        website: { type: String },
        facebook: { type: String },
        twitter: { type: String },
        instagram: { type: String },
        tripAdvisor: { type: String },
        youtube: { type: String },
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

export default mongoose.model("Hotel", hotelSchema);
