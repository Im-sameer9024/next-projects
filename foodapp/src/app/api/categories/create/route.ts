import { ConnectCloudinary } from "@/shared/config/cloudinary.config";
import { prisma } from "@/shared/lib/prisma";
import { UploadImageToCloudinary } from "@/shared/lib/uploadImage";
import { validate } from "@/shared/lib/validator";
import { CloudinaryImageUploadResponseProps } from "@/shared/types/cloudinary";
import { categoryCreateSchema } from "@/shared/validation/category.schema";
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

    const data = {
      title: formData.get("title"),
      description: formData.get("description"),
      color: formData.get("color"),
      image: formData.get("image"),
      slug: formData.get("slug"),
    };

    const parsedData = {
      title: data.title?.toString(),
      description: data.description?.toString(),
      color: data.color?.toString(),
      image: data?.image as File,
      slug: data.slug?.toString(),
    };

    //--------------- Validate ------------

    const result = validate(categoryCreateSchema, parsedData);

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

    const categoryCreated = await prisma.category.create({
      data: {
        title: result.data?.title,
        description: result.data?.description,
        color: result.data?.color,
        image: imageFile?.secure_url,
        slug: result.data?.slug,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: categoryCreated,
        message: "Category created successfully",
      },
      {
        status: 201,
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
