import { Roles } from "@/shared/data/data";
import { auth } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const courses = await prisma.course.findMany({
      where: {
        title: {
          not: "",
        },
      },
      include:{
        attachments:{
          orderBy:{
            createdAt:"desc"
          }
        }
      }
    });

    if (!courses || courses.length === 0) {
      return NextResponse.json(
        {
          success: false,
          data: [],
          message: "No courses found",
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: courses,
        message: "Courses fetched successfully",
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error("Error fetching courses:", error);
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
