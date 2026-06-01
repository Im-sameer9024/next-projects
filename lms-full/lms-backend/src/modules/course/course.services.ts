import { prisma } from "../../config/prisma.js";

export const FindUniqueCourseById = async (
  courseId: string,
  teacherId: string,
) => {
  return await prisma.course.findUnique({
    where: {
      id: courseId as string,
      teacherId: teacherId as string,
    },

    include: {
      attachments: true,
      chapters: {
        orderBy: {
          createdAt: "asc",
        },
      },
      purchases: true,
    },
  });
};

export const DeleteUniqueCourseById = async (
  courseId: string,
  teacherId: string,
) => {
  return await prisma.course.delete({
    where: {
      id: courseId as string,
      teacherId: teacherId as string,
    },
  });
};

export const FindAllCoursesByTeacherId = async (teacherId: string) => {
  return await prisma.course.findMany({
    where: {
      teacherId: teacherId as string,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};
