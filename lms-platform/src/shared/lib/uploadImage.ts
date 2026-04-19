
import { cloudinary } from "../config/cloudinary.config";

export const UploadImageToCloudinary = async (file: File) => {
  try {

    

    // ✅ Validation
    if (!file) throw new Error("File is required");

    const MAX_SIZE = 5 * 1024 * 1024; // 5MB
    if (file.size > MAX_SIZE) {
      throw new Error("File size exceeds 5MB");
    }

    if (!file.type.startsWith("image/")) {
      throw new Error("Only image files are allowed");
    }
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "lms-platform",
            resource_type: "image",
            transformation: [
              { width: 800, height: 800, crop: "limit" },
              { quality: "auto" },
              { fetch_format: "auto" },
            ],
            public_id: `course_${Date.now()}`,
          },
          (error, result) => {
            if (error) {
              reject(error);
            }
            resolve(result);
          },
        )
        .end(buffer);
    });
  } catch (error) {
    console.log("Error in imageuploader function", error);
    throw new Error("Image upload failed");
  }
};
