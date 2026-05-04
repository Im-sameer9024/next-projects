import { auth } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  {
    params,
  }: {
    params: Promise<{ courseId: string; chapterId: string }>;
  },
) {
  try {
    const session = await auth();

    if (!session) {
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

    const { courseId, chapterId } = await params;

    if (!courseId || !chapterId) {
      return NextResponse.json(
        {
          success: false,
          message: "courseId and chapterId are required",
        },
        {
          status: 400,
        },
      );
    }

    const chapter = await prisma.chapter.findUnique({
      where: {
        id: chapterId,
        courseId: courseId,
      },

      include: {
        muxData: true,
      },
    });

    if (!chapter) {
      return NextResponse.json(
        {
          success: false,
          message: "chapter not found",
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: chapter,
        message: "chapter fetched successfully",
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "something went wrong",
        error: error,
      },
      {
        status: 500,
      },
    );
  }
}

export async function PATCH(
  req: NextRequest,
  {
    params,
  }: {
    params: Promise<{ courseId: string; chapterId: string }>;
  },
) {
  try {
    const session = await auth();
    const { isPublished, ...values } = await req.json();


    if (!session) {
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

    const { courseId, chapterId } = await params;

    const ownCourse = await prisma.course.findUnique({
      where: {
        id: courseId,
        userId: session.user?.id,
      },
    });

    if (!ownCourse) {
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

    const chapter = await prisma.chapter.update({
      where: {
        id: chapterId,
        courseId: courseId,
      },
      data: {
        ...values,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: chapter,
        message: "chapter updated successfully",
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "something went wrong",
        error: error,
      },
      {
        status: 500,
      },
    );
  }
}
