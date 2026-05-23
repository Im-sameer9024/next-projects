import { cloudinary } from "@/config/cloudinary";
/* -------------------------------------------------------------------------- */
/*                           UPLOAD TO CLOUDINARY                             */
/* -------------------------------------------------------------------------- */
export const UploadFileToCloudinary = async (file) => {
    try {
        if (!file) {
            throw new Error("File is required");
        }
        /* -------------------------------------------------------------------------- */
        /*                                FILE SIZE                                   */
        /* -------------------------------------------------------------------------- */
        const MAX_SIZE = 5 * 1024 * 1024;
        if (file.size > MAX_SIZE) {
            throw new Error("File size exceeds 5MB");
        }
        /* -------------------------------------------------------------------------- */
        /*                             ALLOWED TYPES                                  */
        /* -------------------------------------------------------------------------- */
        const allowedMimeTypes = [
            "image/png",
            "image/jpeg",
            "image/jpg",
            "image/webp",
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ];
        if (!allowedMimeTypes.includes(file.mimetype)) {
            throw new Error("File type not supported");
        }
        /* -------------------------------------------------------------------------- */
        /*                           RESOURCE TYPE                                    */
        /* -------------------------------------------------------------------------- */
        let resourceType = "image";
        const isDocument = file.mimetype === "application/pdf" || file.mimetype.includes("word");
        if (isDocument) {
            resourceType = "raw";
        }
        /* -------------------------------------------------------------------------- */
        /*                            UPLOAD STREAM                                   */
        /* -------------------------------------------------------------------------- */
        const uploadResult = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream({
                folder: "lms-platform",
                resource_type: resourceType,
                public_id: `${Date.now()}-${(file.originalname.split(".")[0] ?? "file").replace(/\s+/g, "-")}`,
                /* IMAGE OPTIMIZATION */
                ...(resourceType === "image" && {
                    transformation: [
                        {
                            width: 1200,
                            crop: "limit",
                        },
                        {
                            quality: "auto",
                        },
                        {
                            fetch_format: "auto",
                        },
                    ],
                }),
            }, (error, result) => {
                if (error) {
                    return reject(error);
                }
                if (!result) {
                    return reject(new Error("Upload failed"));
                }
                resolve(result);
            });
            /* SEND BUFFER */
            stream.end(file.buffer);
        });
        return uploadResult;
    }
    catch (error) {
        console.error("Cloudinary Upload Error:", error);
        throw new Error(error instanceof Error ? error.message : "File upload failed");
    }
};
//# sourceMappingURL=upload.js.map