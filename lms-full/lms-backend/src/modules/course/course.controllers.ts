import { prisma } from "../../config/prisma.js";
import { asyncHandler } from "../../shared/utils/async-handler.js";
import type { Request, Response } from "express";
import type { PayloadProps } from "../auth/auth.js";
import { SendResponse } from "../../shared/utils/response.js";
import {
  DeleteUniqueCourseById,
  FindUniqueCourseById,
} from "./course.services.js";
import { UploadFileToCloudinary } from "../../shared/utils/upload.js";
import mux from "@/config/mux.config.js";
import { logger } from "@/middlewares/logger.middleware.js";

//------------------------------- TEACHER ROLE CONTROLLERS -------------------------------------------------

const CreateCourse = asyncHandler(async (req: Request, res: Response) => {
  const { title } = req.body;

  const { id } = req.user as PayloadProps;

  const course = await prisma.course.create({
    data: {
      title: title as string,
      teacher: {
        connect: {
          id: id as string,
        },
      },
    },
  });

  return SendResponse(res, {
    statusCode: 201,
    success: true,
    data: course,
    message: "Course created successfully",
  });
});

const UpdateSingleCourse = asyncHandler(async (req: Request, res: Response) => {
  const { courseId } = req.params;
  const values = req.body;
  const { id } = req.user as PayloadProps;

  const updateCourse = await prisma.course.update({
    where: {
      id: courseId as string,
      teacherId: id as string,
    },
    data: {
      ...values,
    },
  });

  return SendResponse(res, {
    statusCode: 200,
    success: true,
    data: updateCourse,
    message: "Course updated successfully",
  });
});

const GetCourseByTeacherId = asyncHandler(
  async (req: Request, res: Response) => {
    const { courseId } = req.params;
    const { id } = req.user as PayloadProps;

    if (!courseId) {
      return SendResponse(res, {
        statusCode: 400,
        success: false,
        message: "Course id is required",
      });
    }

    const course = await FindUniqueCourseById(courseId as string, id as string);

    return SendResponse(res, {
      statusCode: 200,
      success: true,
      data: course,
      message: "Course fetched successfully",
    });
  },
);

const DeleteCourseById = asyncHandler(async (req: Request, res: Response) => {
  const { courseId } = req.params;
  const { id } = req.user as PayloadProps;

  const course = await prisma.course.findUnique({
    where: {
      id: courseId as string,
      teacherId: id as string,
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
    return SendResponse(res, {
      statusCode: 404,
      success: false,
      message: "Course not found",
    });
  }

  for (const chapter of course.chapters) {
    const assetId = chapter.muxData?.assetId;

    if (!assetId) {
      continue;
    }
    try {
      await mux.video.assets.delete(assetId);
    } catch (error: any) {
      if (error?.status !== 404) {
        throw error;
      }
      logger.warn(`Mux asset not found: ${assetId}`);
    }
  }

  const deleteCourse = await prisma.course.delete({
    where: {
      id: courseId as string,
    },
  });

  if (!deleteCourse) {
    return SendResponse(res, {
      statusCode: 404,
      success: false,
      message: "Course not found",
    });
  }

  return SendResponse(res, {
    statusCode: 200,
    success: true,
    data: deleteCourse,
    message: "Course deleted successfully",
  });
});

const GetAllCourses = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.user as PayloadProps;

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const search = (req.query.search as string) || "";

  const skip = (page - 1) * limit;

  const whereCondition = {
    teacherId: id,

    ...(search && {
      title: {
        contains: search,
        mode: "insensitive" as const,
      },
    }),
  };

  //---------- total count-----------
  const totalCourses = await prisma.course.count({
    where: whereCondition,
  });

  //--------- fetch courses ---------

  const courses = await prisma.course.findMany({
    where: whereCondition,
    skip,
    take: limit,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      chapters: true,
      attachments: true,
    },
  });

  return SendResponse(res, {
    statusCode: 200,
    success: true,
    data: courses,
    pagination: {
      page,
      limit,
      total: totalCourses,
      totalPages: Math.ceil(totalCourses / limit),
    },
    message: "Courses fetched successfully",
  });
});

const UploadThumbnail = asyncHandler(async (req: Request, res: Response) => {
  const file = req.file;

  if (!file) {
    return SendResponse(res, {
      statusCode: 400,
      success: false,
      message: "Thumbnail image is required",
    });
  }

  const uploadedImage = await UploadFileToCloudinary(file);

  return SendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Thumbnail uploaded successfully",
    data: {
      url: uploadedImage.secure_url,
      public_id: uploadedImage.public_id,
    },
  });
});

const PublishedCourse = asyncHandler(async (req: Request, res: Response) => {
  const { courseId } = req.params;
  const { id } = req.user as PayloadProps;

  const course = await prisma.course.findUnique({
    where: {
      id: courseId as string,
      teacherId: id as string,
    },
    include: {
      chapters: {
        include: {
          muxData: {
            select: {
              assetId: true,
              playbackId: true,
              chapterId: true,
            },
          },
        },
      },
    },
  });

  if (!course) {
    return SendResponse(res, {
      statusCode: 404,
      success: false,
      message: "Course not found",
    });
  }

  const hasPublishedChapter = course.chapters.some(
    (chapter) => chapter.isPublished,
  );

  if (
    !course.title ||
    !course.description ||
    !course.image ||
    !course.categoryId ||
    !course.price ||
    !hasPublishedChapter
  ) {
    return SendResponse(res, {
      statusCode: 400,
      success: false,
      message:
        "Please fill all the required fields and publish at least one chapter",
    });
  }

  const publishedCourse = await prisma.course.update({
    where: {
      id: courseId as string,
      teacherId: id as string,
    },
    data: {
      isPublished: true,
    },
  });

  return SendResponse(res, {
    statusCode: 200,
    success: true,
    data: publishedCourse,
    message: "Course published successfully",
  });
});

const UnpublishedCourse = asyncHandler(async (req: Request, res: Response) => {
  const { courseId } = req.params;
  const { id } = req.user as PayloadProps;

  const course = await prisma.course.findUnique({
    where: {
      id: courseId as string,
      teacherId: id as string,
    },
  });

  if (!course) {
    return SendResponse(res, {
      statusCode: 404,
      success: false,
      message: "Course not found",
    });
  }

  const unpublishedCourse = await prisma.course.update({
    where: {
      id: courseId as string,
      teacherId: id as string,
    },
    data: {
      isPublished: false,
    },
  });

  return SendResponse(res, {
    statusCode: 200,
    success: true,
    data: unpublishedCourse,
    message: "Course unpublished successfully",
  });
});

//------------------------------- USER ROLE CONTROLLERS -------------------------------------------------

const GetAllCoursesForUser = asyncHandler(
  async (req: Request, res: Response) => {
    const page = Number(req.query.page) || 1;

    const limit = Number(req.query.limit) || 10;

    const search = (req.query.search as string) || "";

    const categoryId = (req.query.categoryId as string) || "";

    const skip = (page - 1) * limit;

    // filters
    const whereCondition = {
      isPublished: true,

      ...(search && {
        title: {
          contains: search,
          mode: "insensitive" as const,
        },
      }),

      ...(categoryId && {
        categoryId,
      }),
    };

    // transaction
    const [totalCourses, courses] = await Promise.all([
      prisma.course.count({
        where: whereCondition,
      }),

      prisma.course.findMany({
        where: whereCondition,

        skip,

        take: limit,

        orderBy: {
          createdAt: "desc",
        },

        include: {
          category: true,
          chapters: {
            where: {
              isPublished: true,
            },
          },

          attachments: true,

          purchases: true,
        },
      }),
    ]);

    return SendResponse(res, {
      statusCode: 200,

      success: true,

      data: courses ?? [],

      pagination: {
        page,
        limit,
        total: totalCourses,
        totalPages: Math.ceil(totalCourses / limit),
      },

      message: "Courses fetched successfully",
    });
  },
);

const GetProgressOfCourse = asyncHandler(
  async (req: Request, res: Response) => {
    const { courseId } = req.body;
    const { id } = req.user as PayloadProps;

    const publishedChapter = await prisma.chapter.findMany({
      where: {
        courseId: courseId,
        isPublished: true,
      },
      select: {
        id: true,
      },
    });

    const publishedChapterIds = publishedChapter.map((chapter) => chapter.id);

    const completedChapters = await prisma.userProgress.count({
      where: {
        userId: id,
        chapterId: {
          in: publishedChapterIds,
        },
        isCompleted: true,
      },
    });

    const progressPercentage = Math.round(
      (completedChapters / (publishedChapterIds.length || 1)) * 100,
    );
    return SendResponse(res, {
      statusCode: 200,
      success: true,
      data: progressPercentage,
      message: "Progress fetched successfully",
    });
  },
);

const GetSingleCourseForUser = asyncHandler(
  async (req: Request, res: Response) => {
    const { courseId } = req.params;

    const course = await prisma.course.findUnique({
      where: {
        id: courseId as string,
        isPublished: true,
      },
      include: {
        category: true,
        chapters: {
          orderBy: {
            createdAt: "asc",
          },
          include: {
            userProgresses: true,
          },
        },
        attachments: true,
        purchases: true,
      },
    });

    if (!course) {
      return SendResponse(res, {
        statusCode: 404,
        success: false,
        message: "Course not found",
      });
    }

    return SendResponse(res, {
      statusCode: 200,
      success: true,
      data: course,
      message: "Course fetched successfully",
    });
  },
);

const DashboardDataForUser = asyncHandler(
  async (req: Request, res: Response) => {
    console.log("Dashboard route hit");
    const { id } = req.user as PayloadProps;

    console.log("id is dashboard api", id);

    const purchasedCourses = await prisma.course.findMany({
      where: {
        purchases: {
          some: {
            userId: id,
          },
        },
      },
      include: {
        category: true,
        chapters: {
          where: {
            isPublished: true,
          },
          include: {
            userProgresses: {
              where: {
                userId: id,
              },
            },
          },
        },
      },
    });

    if (!purchasedCourses) {
      return SendResponse(res, {
        statusCode: 404,
        success: false,
        message: "No courses found",
      });
    }

    const formattedCourses = purchasedCourses.map((course) => {
      const totalChapters = course.chapters.length;

      const completedChapters = course.chapters.filter((chapter) =>
        chapter.userProgresses.some((progress) => progress.isCompleted),
      ).length;

      const progress =
        totalChapters === 0
          ? 0
          : Math.round((completedChapters / totalChapters) * 100);

      return {
        ...course,
        totalChapters,
        completedChapters,
        progress,
      };
    });

    const totalPurchasedCourses = formattedCourses.length;

    const completedCourses = formattedCourses.filter(
      (course) => course.progress === 100,
    ).length;

    const inProgressCourses = formattedCourses.filter(
      (course) => course.progress > 0 && course.progress < 100,
    ).length;

    return SendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Dashboard data fetched successfully",
      data: {
        courses: formattedCourses,
        stats: {
          totalPurchasedCourses,
          completedCourses,
          inProgressCourses,
        },
      },
    });
  },
);

const GetAnalyticsForTeacher = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.user as PayloadProps;

    console.log("id",id)

    const purchases = await prisma.purchase.findMany({
      where: {
        course: {
          teacherId: id,
        },
      },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            price: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    const totalSales = purchases.length;

    const totalRevenue = purchases.reduce(
      (acc, purchase) => acc + Number(purchase.course.price || 0),
      0,
    );

    const monthlyMap = new Map<
      string,
      {
        month: string;
        revenue: number;
        sales: number;
      }
    >();

    purchases.forEach((purchase) => {
      const month = purchase.createdAt.toLocaleString("en-US", {
        month: "short",
      });

      const existing = monthlyMap.get(month);

      if (existing) {
        existing.sales += 1;
        existing.revenue += Number(purchase.course.price || 0);
      } else {
        monthlyMap.set(month, {
          month,
          sales: 1,
          revenue: Number(purchase.course.price || 0),
        });
      }
    });

    const chartData = Array.from(monthlyMap.values());

    return SendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Analytics fetched successfully",
      data: {
        totalRevenue,
        totalSales,
        chartData,
      },
    });
  },
);

export {
  CreateCourse,
  UpdateSingleCourse,
  GetCourseByTeacherId,
  DeleteCourseById,
  GetAllCourses,
  UploadThumbnail,
  PublishedCourse,
  UnpublishedCourse,
  GetAllCoursesForUser,
  GetProgressOfCourse,
  GetSingleCourseForUser,
  DashboardDataForUser,
  GetAnalyticsForTeacher
};
