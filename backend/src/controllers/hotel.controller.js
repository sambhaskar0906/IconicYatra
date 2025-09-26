import Hotel from "../models/hotel.model.js";
import { findHotelByIdOrHotelId } from "../utils/findHotelById.js";

// ----------------------
// Create Hotel
// ----------------------
export const createHotel = async (req, res) => {
    try {
        let bodyData = req.body;

        // ✅ JSON.parse for nested objects/arrays
        if (typeof bodyData.contactDetails === "string")
            bodyData.contactDetails = JSON.parse(bodyData.contactDetails);

        if (typeof bodyData.location === "string")
            bodyData.location = JSON.parse(bodyData.location);

        if (typeof bodyData.socialMedia === "string")
            bodyData.socialMedia = JSON.parse(bodyData.socialMedia);

        if (typeof bodyData.facilities === "string")
            bodyData.facilities = JSON.parse(bodyData.facilities);

        if (typeof bodyData.hotelType === "string")
            bodyData.hotelType = JSON.parse(bodyData.hotelType);

        if (typeof bodyData.rooms === "string")
            bodyData.rooms = JSON.parse(bodyData.rooms);

        // ✅ Main image
        if (req.files?.mainImage) {
            bodyData.mainImage = `/upload/${req.files.mainImage[0].filename}`;
        }

        // ✅ Room images
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

// ----------------------
// Update Hotel
// ----------------------
export const updateHotel = async (req, res) => {
    try {
        let bodyData = req.body;

        // ✅ Parse JSON strings
        if (typeof bodyData.contactDetails === "string")
            bodyData.contactDetails = JSON.parse(bodyData.contactDetails);

        if (typeof bodyData.location === "string")
            bodyData.location = JSON.parse(bodyData.location);

        if (typeof bodyData.socialMedia === "string")
            bodyData.socialMedia = JSON.parse(bodyData.socialMedia);

        if (typeof bodyData.facilities === "string")
            bodyData.facilities = JSON.parse(bodyData.facilities);

        if (typeof bodyData.hotelType === "string")
            bodyData.hotelType = JSON.parse(bodyData.hotelType);

        if (typeof bodyData.rooms === "string")
            bodyData.rooms = JSON.parse(bodyData.rooms);

        // ✅ Handle Images
        if (req.files?.mainImage) {
            bodyData.mainImage = `/upload/${req.files.mainImage[0].filename}`;
        }

        if (req.files?.roomImages) {
            let roomImagesIndex = 0;
            bodyData.rooms?.forEach((room) => {
                room.roomDetails?.forEach((detail) => {
                    const count = detail.images?.length || 0;
                    detail.images = req.files.roomImages
                        .slice(roomImagesIndex, roomImagesIndex + count)
                        .map((file) => `/upload/${file.filename}`);
                    roomImagesIndex += count;
                });
            });
        }

        // ✅ Find hotel
        const hotel = await findHotelByIdOrHotelId(req.params.id);
        if (!hotel) {
            return res.status(404).json({ success: false, message: "Hotel not found" });
        }

        // ✅ Update fields
        Object.assign(hotel, bodyData);
        const updatedHotel = await hotel.save();

        res.status(200).json({
            success: true,
            message: "Hotel updated successfully",
            data: updatedHotel,
        });
    } catch (error) {
        console.error("❌ Error updating hotel:", error);
        res.status(400).json({ success: false, message: error.message });
    }
};

// ----------------------
// Get All Hotels
// ----------------------
export const getHotels = async (req, res) => {
    try {
        const hotels = await Hotel.find();
        res.status(200).json({ success: true, data: hotels });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ----------------------
// Get Single Hotel
// ----------------------
export const getHotelById = async (req, res) => {
    try {
        const hotel = await findHotelByIdOrHotelId(req.params.id);
        if (!hotel) return res.status(404).json({ success: false, message: "Hotel not found" });

        res.status(200).json({ success: true, data: hotel });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ----------------------
// Delete Hotel
// ----------------------
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

// ----------------------
// Update Status
// ----------------------
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

        res.status(200).json({
            success: true,
            message: "Status updated successfully",
            data: hotel,
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
