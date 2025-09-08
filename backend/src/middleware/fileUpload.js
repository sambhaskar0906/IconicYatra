    import multer from "multer";
    import path from "path";

    // Storage config
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, "upload/");
        },
        filename: (req, file, cb) => {
            cb(
                null,
                file.fieldname + "-" + Date.now() + path.extname(file.originalname)
            );
        },
    });

    // File filter (only images allowed)
    const fileFilter = (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|webp/;
        const ext = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mime = allowedTypes.test(file.mimetype);
        if (ext && mime) {
            cb(null, true);
        } else {
            cb(new Error("Only images are allowed"), false);
        }
    };

    const upload = multer({
        storage,
        fileFilter,
        limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    });

    export default upload;
