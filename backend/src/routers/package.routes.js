import { Router } from "express";
import upload from "../middleware/fileUpload.js";
import {
    createPackage,
    updateStep1,
    updateTourDetails,
    uploadBanner,
    uploadDayImage,
    getById,
    listPackages,
    remove
} from "../controllers/package.controller.js";

const router = Router();

// create (can be used by Step 1 submit)
router.post("/", createPackage);

// step-wise updates
router.put("/:id/step1", updateStep1);
router.put("/:id/tour-details", updateTourDetails);

// uploads
router.post("/:id/banner", upload.single("banner"), uploadBanner);
router.post("/:id/days/:dayIndex/image", upload.single("dayImage"), uploadDayImage);

// read
router.get("/:id", getById);
router.get("/", listPackages);

// delete
router.delete("/:id", remove);

export default router;
