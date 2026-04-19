import { prisma } from "@/shared/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    const { title } = await req.json();

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        {
          status: 401,
        },
      );
    }

    const course = await prisma.course.create({
      data: {
        userId: userId,
        title: title,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Course created",
        data: course,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.log("[Course Create]", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error creating course",
        error: error,
      },
      {
        status: 500,
      },
    );
  }
}


