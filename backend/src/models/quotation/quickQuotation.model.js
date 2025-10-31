import mongoose from "mongoose";
import Package from "../package.model.js";
import { policySchema } from "../../common/policy.js";

const quickQuotationSchema = new mongoose.Schema(
    {
        customerName: { type: String, required: true, trim: true },
        email: { type: String, required: true, trim: true },
        phone: { type: String, trim: true },
        packageId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Package",
        },
        adults: { type: Number, required: true },
        children: { type: Number, default: 0 },
        message: { type: String },
        totalCost: {
            type: Number,
            default: 0
        },
        currency: {
            type: String,
            default: "INR"
        },

        packageSnapshot: {
            type: Object,
            default: {},
        },

        policy: {
            type: policySchema,
            default: {},
        },
    },
    { timestamps: true }
);

quickQuotationSchema.pre("save", async function (next) {
    if (this.isNew && this.packageId) {
        const pkg = await Package.findById(this.packageId).lean();
        if (pkg) {
            this.packageSnapshot = pkg;
            this.policy = pkg.policy;
            if (pkg.price && !this.totalCost) {
                this.totalCost = pkg.price;
            }
        }
    }
    next();
});
quickQuotationSchema.virtual('formattedCost').get(function () {
    if (this.currency === 'INR') {
        return `₹${this.totalCost?.toLocaleString('en-IN') || '0'}`;
    }
    return `${this.currency} ${this.totalCost?.toLocaleString() || '0'}`;
});

quickQuotationSchema.methods.calculateFinalCost = function (taxPercentage = 0) {
    const taxAmount = (this.totalCost * taxPercentage) / 100;
    return this.totalCost + taxAmount;
};

const QuickQuotation = mongoose.model("QuickQuotation", quickQuotationSchema);
export default QuickQuotation;