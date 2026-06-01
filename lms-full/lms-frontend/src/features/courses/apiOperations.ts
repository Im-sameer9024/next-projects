/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiConnector } from "@/services/apiConnector";
import { attachmentApiEndpoints, courseApiEndpoints } from "@/services/apiEndPoints";
import { CreateCourseSchemaType } from "./course.validation";

export type searchParamsProps = {
  page: number;
  limit: number;
  search: string;
};

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

export const GetAllCoursesOfTeacher = async (searchParams: searchParamsProps) => {
  const response = await apiConnector({
    method: "GET",
    url: courseApiEndpoints.GET_COURSES_OF_TEACHER,
    params: {
      ...(searchParams.page && {
        page: searchParams.page,
      }),

      ...(searchParams.limit && {
        limit: searchParams.limit,
      }),

      ...(searchParams.search && {
        search: searchParams.search,
      }),
    },
  });

  return response.data;
};

export const UpdateCourseByTeacher = async (courseId: string, data: any) => {
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

export const CrateAttachment = async (data: FormData) => {
  const response = await apiConnector({
    method: "POST",
    url: attachmentApiEndpoints.CREATE_ATTACHMENT,
    bodyData: data,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const DeleteAttachment = async (data: any) => {
  const response = await apiConnector({
    method: "POST",
    url: attachmentApiEndpoints.DELETE_ATTACHMENT,
    bodyData: data,
  });
  return response.data;
};

export const PublishCourse = async (courseId: string) => {
  const response = await apiConnector({
    method: "PATCH",
    url: courseApiEndpoints.PUBLISH_COURSE(courseId),
  });

  return response.data;
};

export const UnpublishCourse = async (courseId: string) => {
  const response = await apiConnector({
    method: "PATCH",
    url: courseApiEndpoints.UNPUBLISH_COURSE(courseId),
  });

  return response.data;
};

export const DeleteCourseByTeacher = async (courseId: string) => {
  const response = await apiConnector({
    method: "DELETE",
    url: courseApiEndpoints.DELETE_COURSE_BY_TEACHER(courseId),
  });

  return response.data;
};

/* -------------------------------------------------------------------------- */
/*                      GENERATE COURSE TITLE                            */
/* -------------------------------------------------------------------------- */

export const GenerateCourseTitles = async (text: string) => {
  const response = await apiConnector({
    method: "POST",

    url: courseApiEndpoints.GENERATE_TITLES,

    bodyData: {
      text,
    },
  });

  return response.data;
};

/* -------------------------------------------------------------------------- */
/*                      GENERATE COURSE DESCRIPTION                            */
/* -------------------------------------------------------------------------- */

export const GenerateCourseDescription = async (title: string) => {
  const response = await apiConnector({
    method: "POST",

    url: courseApiEndpoints.GENERATE_DESCRIPTION,

    bodyData: {
      title,
    },
  });

  return response.data;
};
