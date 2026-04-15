import { ConnectCloudinary } from "@/shared/config/cloudinary.config";
import { prisma } from "@/shared/lib/prisma";
import { UploadImageToCloudinary } from "@/shared/lib/uploadImage";
import { validate } from "@/shared/lib/validator";
import { CloudinaryImageUploadResponseProps } from "@/shared/types/cloudinary";
import { categoryUpdateSchema } from "@/shared/validation/category.schema";
import { NextRequest, NextResponse } from "next/server";

export const PUT = async (req: NextRequest) => {
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

    const data = {
      categoryId: formData.get("categoryId"),
      title: formData.get("title"),
      description: formData.get("description"),
      color: formData.get("color"),
      slug: formData.get("slug"),
    };

    const parsedData = {
      categoryId: data.categoryId?.toString(),
      title: data.title?.toString(),
      description: data.description?.toString(),
      color: data.color?.toString(),
      slug: data.slug?.toString(),
    };

    const result = validate(categoryUpdateSchema, parsedData);

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

    const updateCategory = await prisma.category.update({
      where: {
        id: Number(result.data?.categoryId),
      },
      data: {
        title: result.data?.title,
        description: result.data?.description,
        color: result.data?.color,
        slug: result.data?.slug,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: updateCategory,
        message: "Category updated successfully",
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

    const categoryId = formData.get("categoryId");
    const image = formData.get("image");

    const imageFile = (await UploadImageToCloudinary(
      image as File,
    )) as CloudinaryImageUploadResponseProps;

    const updateCategory = await prisma.category.update({
      where: {
        id: Number(categoryId),
      },
      data: {
        image: imageFile.secure_url,
        image_public_id: imageFile.public_id,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: updateCategory,
        message: "Category updated successfully",
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
