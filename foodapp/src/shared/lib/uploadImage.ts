import { cloudinary } from "../config/cloudinary.config";

export const UploadImageToCloudinary = async (file: File) => {
  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "foodapp", // 🔥 organize uploads
            resource_type: "image",
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        )
        .end(buffer);
    });
  } catch (error) {
    console.log("Error in imageuploader function",error)
    throw new Error("Image upload failed");
  }
};