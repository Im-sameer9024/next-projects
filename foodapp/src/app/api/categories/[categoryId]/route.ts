import { prisma } from "@/shared/lib/prisma";

import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ categoryId: string }> },
) => {
  const { categoryId } = await params;

  try {
    const category = await prisma.category.findUnique({
      where: {
        id: Number(categoryId),
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: category,
        message: "Category fetched successfully",
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
