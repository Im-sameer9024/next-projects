/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiConnector } from "@/services/apiConnector";
import { courseUrls } from "@/services/apiEndPoints";
import { CreateCourseTitleTypes } from "./validation/course.validation";

export const CreateCourse = async (data: CreateCourseTitleTypes) => {
  const response = await apiConnector({
    method: "POST",
    url: courseUrls.COURSE_CREATE,
    bodyData: data,
  });
  return response.data;
};

export const GetSingleCourse = async (courseId: string) => {
  const response = await apiConnector({
    method: "GET",
    url: courseUrls.GET_COURSE(courseId),
  });
  return response.data;
};

export const UploadCourseImage = async (data: any) => {
  const response = await apiConnector({
    method: "POST",
    url: courseUrls.COURSE_IMAGE_UPLOAD,
    bodyData: data,
  });
  return response?.data;
};

export const UpdateCourse = async (data: any) => {
  const { courseId, ...rest } = data;

  const response = await apiConnector({
    method: "PATCH",
    url: courseUrls.COURSE_UPDATE_SINGLE_VALUE(courseId),
    bodyData: rest,
  });
  return response.data;
};
