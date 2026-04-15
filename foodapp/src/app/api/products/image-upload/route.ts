import { ConnectCloudinary } from "@/shared/config/cloudinary.config";
import { UploadImageToCloudinary } from "@/shared/lib/uploadImage";
import { validate } from "@/shared/lib/validator";
import { CloudinaryImageUploadResponseProps } from "@/shared/types/cloudinary";
import { imageUploadSchema } from "@/shared/validation/product.schema";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const connectCloudinary = await ConnectCloudinary();

    if (!connectCloudinary.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Error connecting to cloudinary",
        },
        {
          status: 500,
        },
      );
    }

    const formData = await req.formData();

    const image = formData.get("image");

    const parsedData = {
      image: image as File,
    };

    const result = await validate(imageUploadSchema, parsedData);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors: result.errors,
        },
        {
          status: 400,
        },
      );
    }

    const imageFile = (await UploadImageToCloudinary(
      result.data?.image as File,
    )) as CloudinaryImageUploadResponseProps;

    return NextResponse.json(
      {
        success: true,
        message: "Image uploaded successfully",
        data: imageFile,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Error creating category",
        error: error,
      },
      {
        status: 500,
      },
    );
  }
};
