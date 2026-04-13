import { prisma } from "@/shared/lib/prisma";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const categories = await prisma.category.findMany();

    return NextResponse.json(
      {
        success: true,
        data: categories,
        message: "Categories fetched successfully",
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Error fetching categories",
        error: error,
      },
      {
        status: 500,
      },
    );
  }
};
