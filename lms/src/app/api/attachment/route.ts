import { Roles } from "@/shared/data/data";
import { auth } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const name = formData.get("name") as string;
    const url = formData.get("url") as string;
    const public_id = formData.get("public_id") as string;
    const course_id = formData.get("course_id") as string;

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

    if (user.role !== Roles.teacher) {
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

    // ✅ Ensure course exists
    const course = await prisma.course.findUnique({
      where: { id: course_id },
    });

    if (!course) {
      return NextResponse.json(
        { success: false, message: "Course not found" },
        { status: 404 },
      );
    }

    const attachment = await prisma.attachment.create({
      data: {
        name: name,
        url: url,
        attachment_public_id: public_id,
        courseId: course_id,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: attachment,
        message: "Attachment created successfully",
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error("Error creating course:", error);
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
