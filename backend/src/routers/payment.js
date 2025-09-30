// backend/src/routes/payment.js
import express from "express";
import Razorpay from "razorpay";

const router = express.Router();

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

router.post("/create-order", async (req, res) => {
    const { amount } = req.body;

    try {
        const options = {
            amount: amount * 100, // paise me
            currency: "INR",
            payment_capture: 1,
            notes: { amount }
        };

        const order = await razorpay.orders.create(options);
        res.json(order); // Order details return karo
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

export default router;
