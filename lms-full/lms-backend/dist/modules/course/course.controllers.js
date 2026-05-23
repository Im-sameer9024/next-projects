import { prisma } from "../../config/prisma.js";
import { asyncHandler } from "../../shared/utils/async-handler.js";
import { SendResponse } from "../../shared/utils/response.js";
import { DeleteUniqueCourseById, FindUniqueCourseById, } from "./course.services.js";
import { UploadFileToCloudinary } from "../../shared/utils/upload.js";
//------------------------------- TEACHER ROLE CONTROLLERS -------------------------------------------------
const CreateCourse = asyncHandler(async (req, res) => {
    const { title } = req.body;
    const { id } = req.user;
    const course = await prisma.course.create({
        data: {
            title: title,
            teacher: {
                connect: {
                    id: id,
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
const UpdateSingleCourse = asyncHandler(async (req, res) => {
    const { courseId } = req.params;
    const values = req.body;
    const { id } = req.user;
    const updateCourse = await prisma.course.update({
        where: {
            id: courseId,
            teacherId: id,
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
const GetCourseByTeacherId = asyncHandler(async (req, res) => {
    const { courseId } = req.params;
    const { id } = req.user;
    if (!courseId) {
        return SendResponse(res, {
            statusCode: 400,
            success: false,
            message: "Course id is required",
        });
    }
    const course = await FindUniqueCourseById(courseId, id);
    return SendResponse(res, {
        statusCode: 200,
        success: true,
        data: course,
        message: "Course fetched successfully",
    });
});
const DeleteCourseById = asyncHandler(async (req, res) => {
    const { courseId } = req.params;
    const { id } = req.user;
    const course = await DeleteUniqueCourseById(courseId, id);
    return SendResponse(res, {
        statusCode: 200,
        success: true,
        data: course,
        message: "Course deleted successfully",
    });
});
const GetAllCourses = asyncHandler(async (req, res) => {
    const { id } = req.user;
    const courses = await prisma.course.findMany({
        where: {
            teacherId: id
        }
    });
    return SendResponse(res, {
        statusCode: 200,
        success: true,
        data: courses,
        message: "Courses fetched successfully",
    });
});
const UploadThumbnail = asyncHandler(async (req, res) => {
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
export { CreateCourse, UpdateSingleCourse, GetCourseByTeacherId, DeleteCourseById, GetAllCourses, UploadThumbnail };
//# sourceMappingURL=course.controllers.js.map