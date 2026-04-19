import { prisma } from "@/shared/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string }> },
) {
  try {
    const { userId } = await auth();
    const { courseId } = await params;
    const values = await req.json();

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

    const existingCourse = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!existingCourse || existingCourse.userId !== userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const course = await prisma.course.update({
      where: {
        id: courseId,
      },
      data: {
        ...values,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: course,
        message: "Course updated",
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Error updating course",
        error: error,
      },
      {
        status: 500,
      },
    );
  }
}

export async function GET(
  req: NextRequest,
  {
    params,
  }: {
    params: Promise<{ courseId: string }>;
  },
) {
  try {
    const { userId } = await auth();
    const { courseId } = await params;

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

    const existingCourse = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!existingCourse || existingCourse.userId !== userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized with this error" },
        { status: 401 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: existingCourse,
        message: "Course updated",
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Error occur in Get single course",
        error,
      },
      {
        status: 500,
      },
    );
  }
}
