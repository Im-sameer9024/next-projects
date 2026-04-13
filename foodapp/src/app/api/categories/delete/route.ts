import { prisma } from "@/shared/lib/prisma";
import { NextRequest, NextResponse } from "next/server";






export const DELETE = async (req: NextRequest) => {
  try {
    const { categoryId } = await req.json();

    if (!categoryId) {
      return NextResponse.json(
        {
          success: false,
          message: "Category id is required",
        },
        {
          status: 400,
        },
      );
    }

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