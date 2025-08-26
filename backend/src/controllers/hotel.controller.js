import Hotel from "../models/hotel.model.js";
import { findHotelByIdOrHotelId } from "../utils/findHotelById.js";

// Create Hotel with image upload
export const createHotel = async (req, res) => {
    try {
        let bodyData = req.body;

        // rooms parse
        if (typeof bodyData.rooms === "string") {
            bodyData.rooms = JSON.parse(bodyData.rooms);
        }

        // ✅ Main image
        if (req.files?.mainImage) {
            bodyData.mainImage = `/upload/${req.files.mainImage[0].filename}`;
        }

        // ✅ Room images (common for all roomDetails)
        if (req.files?.roomImages) {
            bodyData.rooms?.forEach((room) => {
                room.roomDetails?.forEach((detail) => {
                    detail.images = req.files.roomImages.map(
                        (file) => `/upload/${file.filename}`
                    );
                });
            });
        }


        const hotel = new Hotel(bodyData);
        const savedHotel = await hotel.save();

        res.status(201).json({
            success: true,
            message: "Hotel created successfully",
            data: savedHotel,
        });
    } catch (error) {
        console.error("❌ Hotel create error:", error);
        res.status(400).json({ success: false, message: error.message });
    }
};

// update
export const updateHotel = async (req, res) => {
    try {
        let bodyData = req.body;

        // -----------------------------
        // Step 2a: Parse JSON strings
        // -----------------------------
        if (typeof bodyData.contactDetails === "string")
            bodyData.contactDetails = JSON.parse(bodyData.contactDetails);

        if (typeof bodyData.location === "string")
            bodyData.location = JSON.parse(bodyData.location);

        if (typeof bodyData.socialMedia === "string")
            bodyData.socialMedia = JSON.parse(bodyData.socialMedia);

        if (typeof bodyData.facilities === "string")
            bodyData.facilities = JSON.parse(bodyData.facilities);

        if (typeof bodyData.rooms === "string")
            bodyData.rooms = JSON.parse(bodyData.rooms);

        // -----------------------------
        // Step 2b: Handle images
        // -----------------------------
        if (req.files?.mainImage) {
            bodyData.mainImage = `/upload/${req.files.mainImage[0].filename}`;
        }

        if (req.files?.roomImages) {
            let roomImagesIndex = 0;
            bodyData.rooms?.forEach((room) => {
                room.roomDetails?.forEach((detail) => {
                    detail.images = req.files.roomImages
                        .slice(roomImagesIndex, roomImagesIndex + (detail.images?.length || 0))
                        .map(file => `/upload/${file.filename}`);
                    roomImagesIndex += detail.images?.length || 0;
                });
            });
        }

        // -----------------------------
        // Step 2c: Find hotel and update
        // -----------------------------
        const hotel = await findHotelByIdOrHotelId(req.params.id);
        if (!hotel) {
            return res.status(404).json({ success: false, message: "Hotel not found" });
        }

        Object.assign(hotel, bodyData);
        const updatedHotel = await hotel.save();

        res.status(200).json({
            success: true,
            message: "Hotel updated successfully",
            data: updatedHotel,
        });
    } catch (error) {
        console.error("Error updating hotel:", error);
        res.status(400).json({ success: false, message: error.message });
    }
};

// Get All Hotels
export const getHotels = async (req, res) => {
    try {
        const hotels = await Hotel.find();
        res.status(200).json({ success: true, data: hotels });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get Single Hotel
export const getHotelById = async (req, res) => {
    try {
        const hotel = await findHotelByIdOrHotelId(req.params.id);
        if (!hotel) return res.status(404).json({ success: false, message: "Hotel not found" });

        res.status(200).json({ success: true, data: hotel });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete Hotel
export const deleteHotel = async (req, res) => {
    try {
        const hotel = await findHotelByIdOrHotelId(req.params.id);
        if (!hotel) return res.status(404).json({ success: false, message: "Hotel not found" });

        await hotel.deleteOne();
        res.status(200).json({ success: true, message: "Hotel deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update Status
export const updateStatus = async (req, res) => {
    try {
        const { status } = req.body;
        if (!["Active", "Inactive"].includes(status)) {
            return res.status(400).json({ success: false, message: "Invalid status" });
        }

        const hotel = await findHotelByIdOrHotelId(req.params.id);
        if (!hotel) return res.status(404).json({ success: false, message: "Hotel not found" });

        hotel.status = status;
        await hotel.save();

        res.status(200).json({ success: true, message: "Status updated successfully", data: hotel });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
