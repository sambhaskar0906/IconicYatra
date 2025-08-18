import Hotel from "../models/hotel.model.js";

// Create Hotel with image upload
export const createHotel = async (req, res) => {
    try {
        let bodyData = req.body;

        // agar rooms string h to parse karo, agar object h to waise hi rehne do
        if (typeof bodyData.rooms === "string") {
            bodyData.rooms = JSON.parse(bodyData.rooms);
        }

        // mainImage (single)
        if (req.files && req.files.mainImage) {
            bodyData.mainImage = req.files.mainImage[0].path;
        }

        // room images (multiple)
        if (req.files && req.files.roomImages) {
            bodyData.rooms.forEach((room, rIndex) => {
                room.roomDetails.forEach((detail, dIndex) => {
                    if (!detail.images) detail.images = [];
                    // har room ke hisaab se image attach karna
                    if (req.files.roomImages[rIndex]) {
                        detail.images.push(req.files.roomImages[rIndex].path);
                    }
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

// Update Hotel with image upload
export const updateHotel = async (req, res) => {
    try {
        const bodyData = req.body;

        if (req.files && req.files.mainImage) {
            bodyData.mainImage = req.files.mainImage[0].path;
        }

        if (req.files && req.files.roomImages) {
            bodyData.rooms = JSON.parse(bodyData.rooms || "[]");
            bodyData.rooms.forEach((room, rIndex) => {
                room.roomDetails.forEach((detail, dIndex) => {
                    if (!detail.images) detail.images = [];
                    detail.images.push(req.files.roomImages[dIndex]?.path);
                });
            });
        }

        const updatedHotel = await Hotel.findByIdAndUpdate(req.params.id, bodyData, { new: true });

        if (!updatedHotel) return res.status(404).json({ success: false, message: "Hotel not found" });

        res.status(200).json({
            success: true,
            message: "Hotel updated successfully",
            data: updatedHotel,
        });
    } catch (error) {
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
        const hotel = await Hotel.findById(req.params.id);
        if (!hotel) return res.status(404).json({ success: false, message: "Hotel not found" });
        res.status(200).json({ success: true, data: hotel });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete Hotel
export const deleteHotel = async (req, res) => {
    try {
        const deletedHotel = await Hotel.findByIdAndDelete(req.params.id);
        if (!deletedHotel) return res.status(404).json({ success: false, message: "Hotel not found" });
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

        const hotel = await Hotel.findByIdAndUpdate(req.params.id, { status }, { new: true });
        if (!hotel) return res.status(404).json({ success: false, message: "Hotel not found" });

        res.status(200).json({ success: true, message: "Status updated successfully", data: hotel });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
