import { getProgress } from "@/actions/getProgress";
import { auth } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // query params
    const searchParams = req.nextUrl.searchParams;
    const page = Number(searchParams.get("page")) || 1;
    const session = await auth();

    const limit = Number(searchParams.get("limit")) || 10;

    // pagination calculations
    const skip = (page - 1) * limit;

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

    // total courses count
    const totalCourses = await prisma.course.count({
      where: {
        userId: session.user?.id,
        title: {
          not: "",
        },
      },
    });

    // fetch paginated data
    const courses = await prisma.course.findMany({
      where: {
        userId: session.user?.id,
        title: {
          not: "",
        },
      },

      include: {
        attachments: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },

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
    const progressData = (await Promise.all(publishedCoursesProgress)).filter(
      (p) => p !== null,
    );

    return NextResponse.json(
      {
        success: true,

        data: courses,
        progress: progressData,
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
