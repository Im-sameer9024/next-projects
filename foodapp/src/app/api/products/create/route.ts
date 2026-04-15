import { ConnectCloudinary } from "@/shared/config/cloudinary.config";
import { prisma } from "@/shared/lib/prisma";
import { UploadImageToCloudinary } from "@/shared/lib/uploadImage";
import { validate } from "@/shared/lib/validator";
import { CloudinaryImageUploadResponseProps } from "@/shared/types/cloudinary";
import { productCreateSchema } from "@/shared/validation/product.schema";
import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "../../../../../generated/prisma/client";

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

    const title = formData.get("title");
    const description = formData.get("description");
    const image = formData.get("image");
    const price = formData.get("price");
    const size = formData.get("size");
    const slug = formData.get("slug");
    const isFeatured = formData.get("isFeatured");

    const parsedData = {
      title: title?.toString(),
      description: description?.toString(),
      image: image?.toString(), // URL
      slug: slug?.toString(),

      price: price?.toString(), // ✅ FIXED

      size: size?.toString(),

      isFeatured: isFeatured?.toString() === "true",
    };

    //--------------- Validate ------------

    const result = validate(productCreateSchema, parsedData);

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

    const newProduct = await prisma.product.create({
      data: {
        title: result.data?.title,
        description: result.data?.description,
        catSlug: result.data?.slug,
        price: result.data?.price,
        size: result.data?.size.split(","),
        isFeatured: result.data?.isFeatured,
        image: result.data?.image,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: newProduct,
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
