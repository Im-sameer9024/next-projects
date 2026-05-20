import { prisma } from "@/config/prisma";
import { asyncHandler } from "@/shared/utils/async-handler";
import type { Request, Response } from "express";
import type { PayloadProps } from "../auth/auth";
import { SendResponse } from "@/shared/utils/response";
import {
  DeleteUniqueCourseById,
  FindUniqueCourseById,
} from "./course.services";
import { UploadFileToCloudinary } from "@/shared/utils/upload";

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

  const course = await DeleteUniqueCourseById(courseId as string, id as string);

  return SendResponse(res, {
    statusCode: 200,
    success: true,
    data: course,
    message: "Course deleted successfully",
  });
});

const GetAllCourses = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.user as PayloadProps;

  const courses = await prisma.course.findMany({
    where:{
      teacherId: id as string
    }
  })

  return SendResponse(res, {
    statusCode: 200,
    success: true,
    data: courses,
    message: "Courses fetched successfully",
  })

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

export {
  CreateCourse,
  UpdateSingleCourse,
  GetCourseByTeacherId,
  DeleteCourseById,
  GetAllCourses,
  UploadThumbnail
};
