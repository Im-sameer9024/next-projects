import { prisma } from "@/shared/lib/prisma";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const products = await prisma.product.findMany();

    return NextResponse.json(
      {
        success: true,
        data: products,
        message: "Products fetched successfully",
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Error fetching Products",
        error: error,
      },
      {
        status: 500,
      },
    );
  }
};
