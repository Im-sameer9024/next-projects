import { auth } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { Role } from "../../../../generated/prisma/enums";

export async function GET() {
  try {
    const courses = await prisma.course.findMany({
      where: {
        title: {
          not: "",
        },
      },
    });
  } catch (error) {}
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const title = formData.get("title") as string;

    const session = await auth();

    if (!session?.user) {
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

    const user = session.user;

    if (user.role !== Role.TEACHER) {
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
        title: title,
        userId: user.id,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: course,
        message: "Course created successfully",
      },
      {
        status: 201,
      },
    );
  } catch (error) {}
}
