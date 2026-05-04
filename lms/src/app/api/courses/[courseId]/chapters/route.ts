import { auth } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  {
    params,
  }: {
    params: Promise<{ courseId: string }>;
  },
) {
  try {
    const session = await auth();
    const { courseId } = await params;

    const body = await req.json();
    const { title } = body;

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const course = await prisma.course.findUnique({
      where: {
        id: courseId,
        userId: session.user?.id,
      },
    });

    if (!course) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const chapter = await prisma.chapter.create({
      data: {
        title,
        course: {
          connect: {
            id: courseId,
          },
        },
      },
    });

    return NextResponse.json(
      { success: true, data: chapter, message: "Chapter created successfully" },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Internal Server Error", error: error },
      { status: 500 },
    );
  }
}
