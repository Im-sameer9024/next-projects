import { apiConnector } from "@/services/apiConnector";
import { courseApiEndpoints } from "@/services/apiEndPoints";
import {
  CourseImageSchemaType,
  CreateCourseSchemaType,
} from "./course.validation";
import { Course } from "./course";

export const CreateCourse = async (data: CreateCourseSchemaType) => {
  const response = await apiConnector({
    method: "POST",
    url: courseApiEndpoints.CREATE_COURSE,
    bodyData: data,
  });
  return response.data;
};

export const GetSingleCourseForTeacher = async (courseId: string) => {
  const response = await apiConnector({
    method: "GET",
    url: courseApiEndpoints.GET_SINGLE_COURSE_BY_TEACHER_ID(courseId),
  });

  return response.data;
};

export const UpdateCourseByTeacher = async (courseId: string, data: Course) => {
  const response = await apiConnector({
    method: "PATCH",
    url: courseApiEndpoints.UPDATE_COURSE_BY_TEACHER(courseId),
    bodyData: data,
  });
  return response.data;
};

export const UploadThumbnail = async (data: FormData) => {
  const response = await apiConnector({
    method: "POST",
    url: courseApiEndpoints.UPLOAD_IMAGE,
    bodyData: data,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};
