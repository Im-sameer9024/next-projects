import { getProgress } from "@/actions/getProgress";
import { Roles } from "@/shared/data/data";
import { auth } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // query params
    const searchParams = req.nextUrl.searchParams;
    const page = Number(searchParams.get("page")) || 1;

    const limit = Number(searchParams.get("limit")) || 10;

    const title = searchParams.get("title") || "";

    const categoryId = searchParams.get("categoryId") || "";


    // pagination calculations
    const skip = (page - 1) * limit;

    // dynamic filters
    const whereClause = {
      isPublished: true,

      title: {
        contains: title,
        mode: "insensitive" as const,
      },

      ...(categoryId && {
        categoryId,
      }),
    };

    // total courses count
    const totalCourses = await prisma.course.count({
      where: whereClause,
    });

    // fetch paginated data
    const courses = await prisma.course.findMany({
      where: whereClause,

      orderBy: {
        createdAt: "desc",
      },

      skip,
      take: limit,
    });

    const publishedCoursesProgress = await courses.map(async (course) => {
      return {
        courseId: course.id,
        progress: await getProgress(course.userId, course.id),
      };
    });

    // total pages
    const totalPages = Math.ceil(totalCourses / limit);

    return NextResponse.json(
      {
        success: true,

        data: courses,
        progress: await Promise.all(publishedCoursesProgress),
        pagination: {
          totalCourses,
          totalPages,
          currentPage: page,
          limit,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },

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
