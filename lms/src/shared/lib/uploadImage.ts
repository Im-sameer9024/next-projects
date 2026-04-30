/* eslint-disable @typescript-eslint/no-explicit-any */
import { cloudinary } from "../config/cloudinary.config";

export const UploadFileToCloudinary = async (file: File) => {
  try {
    if (!file) throw new Error("File is required");

    const MAX_SIZE = 5 * 1024 * 1024; // 5MB
    if (file.size > MAX_SIZE) {
      throw new Error("File size exceeds 5MB");
    }

    // ✅ Allowed types
    const allowedTypes = [
      "image/",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    const isAllowed = allowedTypes.some((type) =>
      file.type.startsWith(type)
    );

    if (!isAllowed) {
      throw new Error("File type not supported");
    }

    // ✅ Decide resource type
    let resourceType: "image" | "raw" = "image";

    if (file.type === "application/pdf" || file.type.includes("word")) {
      resourceType = "raw"; // ✅ required for pdf/docs
    }

    // ✅ Convert to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadResult = await new Promise<any>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "lms-platform",
          resource_type: resourceType,
          public_id: `file_${Date.now()}`,

          // ✅ Apply transformations ONLY for images
          ...(resourceType === "image" && {
            transformation: [
              { width: 800, height: 800, crop: "limit" },
              { quality: "auto" },
              { fetch_format: "auto" },
            ],
          }),
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );

      stream.end(buffer);
    });

    return uploadResult;
  } catch (error) {
    console.error("Error in uploader:", error);
    throw new Error("File upload failed");
  }
};