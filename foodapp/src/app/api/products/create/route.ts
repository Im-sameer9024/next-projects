import { ConnectCloudinary } from "@/shared/config/cloudinary.config";
import { prisma } from "@/shared/lib/prisma";
import { validate } from "@/shared/lib/validator";
import { productCreateSchema } from "@/shared/validation/product.schema";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    await ConnectCloudinary();

    const formData = await req.formData();

    const title = formData.get("title");
    const description = formData.get("description");
    const price = formData.get("price");
    const size = formData.get("size");
    const slug = formData.get("slug");
    const isFeatured = formData.get("isFeatured");
    const image = formData.get("image");
    const image_public_id = formData.get("image_public_id");

    const parsedData = {
      title: title?.toString(),
      description: description?.toString(),
      slug: slug?.toString(),
      image: image?.toString(),
      image_public_id: image_public_id?.toString(),
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
        price: result.data?.price,
        size: result.data?.size.split(","),
        isFeatured: result.data?.isFeatured,
        image: result.data?.image,
        image_public_id: result.data?.image_public_id,
        category: {
          connect: {
            slug: result.data?.slug,
          },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: newProduct,
        message: "Product created successfully",
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
