import { prisma } from "../../config/prisma.js";
export const FindUniqueCourseById = async (courseId, teacherId) => {
    return await prisma.course.findUnique({
        where: {
            id: courseId,
            teacherId: teacherId,
        },
        include: {
            attachments: true,
            chapters: {
                orderBy: {
                    createdAt: "asc"
                }
            },
            purchases: true,
        },
    });
};
export const DeleteUniqueCourseById = async (courseId, teacherId) => {
    return await prisma.course.delete({
        where: {
            id: courseId,
            teacherId: teacherId,
        },
    });
};
export const FindAllCoursesByTeacherId = async (teacherId) => {
    return await prisma.course.findMany({
        where: {
            teacherId: teacherId,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
};
//# sourceMappingURL=course.services.js.map