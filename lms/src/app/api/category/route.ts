import { prisma } from "@/shared/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      where: {
        name: {
          not: "",
        },
      },
    });

    if (!categories || categories.length === 0) {
      return NextResponse.json(
        {
          success: false,
          data: [],
          message: "No categories found",
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: categories,
        message: "categories fetched successfully",
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      {
        status: 500,
      },
    );
  }
}
