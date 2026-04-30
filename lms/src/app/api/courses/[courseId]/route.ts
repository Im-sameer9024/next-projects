import { auth } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string }> },
) {
  try {
    const { courseId } = await params;

    const course = await prisma.course.findUnique({
      where: {
        id: courseId,
      },
      include: {
        attachments: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!course) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          message: "Course not found",
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: course,
        message: "Course fetched successfully",
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.log("Error occur in single course route", error);
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

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string }> },
) {
  try {
    const { courseId } = await params;
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const userId = session.user?.id;

    const values = await req.json();

    const updatedCourse = await prisma.course.update({
      where: {
        id: courseId,
        userId: userId,
      },
      data: { ...values },
    });

    return NextResponse.json(
      {
        success: true,
        data: updatedCourse,
        message: "Course updated successfully",
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error("Error occurred while updating course:", error);
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
