import { Course } from "@/generated/prisma/client";
import { apiConnector } from "@/services/apiConnector";
import { courseApiEndpoints } from "@/services/apiEndpoints";
import { ApiResponse } from "@/shared/types/apiResponse";
import { CreateCourseTitleSchemaType } from "@/shared/validation/course.validation";

export const CreateCourse = async (
  data: CreateCourseTitleSchemaType,
): Promise<ApiResponse<Course>> => {
  const response = await apiConnector({
    method: "POST",
    url: courseApiEndpoints.CREATE_COURSE,
    bodyData: data,
  });

  return response.data;
};

export const GetCourses = async (): Promise<ApiResponse<Course[]>> => {
  const response = await apiConnector({
    method: "GET",
    url: courseApiEndpoints.GET_COURSES,
  });
  return response.data;
};

export const GetSingleCourse = async (
  courseId: string,
): Promise<ApiResponse<Course>> => {
  const response = await apiConnector({
    method: "GET",
    url: courseApiEndpoints.GET_SINGLE_COURSE(courseId),
  });
  return response.data;
};

export const UpdateCourse = async (
  courseId: string,
  data: Partial<Course>,
): Promise<ApiResponse<Course>> => {
  const response = await apiConnector({
    method: "PATCH",
    url: courseApiEndpoints.UPDATE_SINGLE_VALUE_COURSE(courseId),
    bodyData: data,
  });

  return response.data;
};
