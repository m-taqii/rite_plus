import multer from "multer";
import type { Request } from "express";

// Keep files in memory as Buffers for fast streaming to ImageKit
const storage = multer.memoryStorage();

// Validate image file types
const fileFilter = (
    _req: Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
) => {
    const allowedMimeTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
        "image/svg+xml",
        "image/gif",
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Only image files (.jpeg, .jpg, .png, .webp, .svg, .gif) are allowed"));
    }
};

// Maximum file size: 5MB
const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
});

export const uploadSingleImage = upload.single("image");
export default upload;
