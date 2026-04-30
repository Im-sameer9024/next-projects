import { ConnectCloudinary } from "@/shared/config/cloudinary.config";
import { UploadFileToCloudinary } from "@/shared/lib/uploadImage";
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
    const file = formData.get("image");

    if (!file) {
      return NextResponse.json(
        {
          success: false,
          message: "No file provided",
        },
        {
          status: 400,
        },
      );
    }

    const result = await UploadFileToCloudinary(file as File);

    return NextResponse.json(
      {
        success: true,
        data: result,
        message: "Image Upload successfully",
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Error updating category",
        error: error,
      },
      {
        status: 500,
      },
    );
  }
};
