import { getProgress } from "@/actions/getProgress";
import { auth } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/prisma";
import Mux from "@mux/mux-node";
import { NextRequest, NextResponse } from "next/server";

const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID!,
  tokenSecret: process.env.MUX_TOKEN_SECRET!,
});

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string }> },
) {
  try {
    const session = await auth();
    const { courseId } = await params;

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const userId = session.user?.id;

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const course = await prisma.course.findUnique({
      where: {
        id: courseId,
        userId: userId,
      },
      include: {
        chapters: {
          include: {
            muxData: true,
          },
        },
      },
    });

    if (!course) {
      return NextResponse.json(
        { success: false, message: "Course not found" },
        { status: 404 },
      );
    }

    for (const chapter of course.chapters) {
      if (chapter.muxData?.assetId) {
        await mux.video.assets.delete(chapter.muxData.assetId);
      }
    }

    const deleteCourse = await prisma.course.delete({
      where: {
        id: courseId,
      },
    });

    if (!deleteCourse) {
      return NextResponse.json(
        { success: false, message: "Course not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: deleteCourse,
        message: "Course deleted successfully",
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error("Error occurred while delete course:", error);
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

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string }> },
) {
  try {
    const { courseId } = await params;
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const course = await prisma.course.findUnique({
      where: {
        id: courseId,
        userId: session?.user?.id,
      },
      include: {
        attachments: {
          orderBy: {
            createdAt: "desc",
          },
        },
        chapters:{
          orderBy:{
            createdAt:"asc"
          }
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

    const progressPercentage = await getProgress(
      session?.user?.id as string,
      course.id,
    );

    return NextResponse.json(
      {
        success: true,
        data: course,
        progressPercentage: progressPercentage,
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
