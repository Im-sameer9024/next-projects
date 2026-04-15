import {
  cloudinary,
  ConnectCloudinary,
} from "@/shared/config/cloudinary.config";
import { prisma } from "@/shared/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const DELETE = async (req: NextRequest) => {
  try {
    const { categoryId, image_public_id } = await req.json();

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

    if (!categoryId || !image_public_id) {
      return NextResponse.json(
        {
          success: false,
          message: "Category and Image_public id is required",
        },
        {
          status: 400,
        },
      );
    }

    const res = await cloudinary.uploader.destroy(image_public_id);

    console.log("res in delete", res);

    await prisma.category.delete({
      where: {
        id: categoryId,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Category deleted successfully",
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Error deleting category",
        error: error,
      },
      {
        status: 500,
      },
    );
  }
};
