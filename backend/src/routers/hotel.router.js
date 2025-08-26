import express from "express";
import upload from "../middleware/fileUpload.js";
import {
    createHotel,
    getHotels,
    getHotelById,
    updateHotel,
    deleteHotel,
    updateStatus,
} from "../controllers/hotel.controller.js";

const router = express.Router();

// Upload config
router.post(
    "/create-hotel",
    upload.fields([
        { name: "mainImage", maxCount: 1 },
        { name: "roomImages", maxCount: 20 },
    ]),
    createHotel
);

router.put(
    "/update/:id",
    upload.fields([
        { name: "mainImage", maxCount: 1 },
        { name: "roomImages", maxCount: 10 },
    ]),
    updateHotel
);

router.get("/all-hotel", getHotels);
router.get("/:id", getHotelById);
router.delete("/delete/:id", deleteHotel);
router.patch("/:id/status", updateStatus);

export default router;
