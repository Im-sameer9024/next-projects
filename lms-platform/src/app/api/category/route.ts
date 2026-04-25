import { prisma } from "@/shared/lib/prisma";
import {  NextResponse } from "next/server";

export async function GET() {
  try {
    const categories = await prisma.category.findMany();

    if (categories.length === 0 || !categories || categories === null) {
      return NextResponse.json(
        {
          success: true,
          data: [],
          message: "No categories found",
        },
        {
          status: 200,
        },
      );
    }

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
}
