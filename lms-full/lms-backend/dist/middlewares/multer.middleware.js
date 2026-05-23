import multer, {} from "multer";
const storage = multer.memoryStorage();
const allowedMimeTypes = [
    // Images
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/webp",
    // documents
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
const fileFilter = (req, file, cb) => {
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new Error("File type not supported"));
    }
};
export const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
    },
});
//# sourceMappingURL=multer.middleware.js.map