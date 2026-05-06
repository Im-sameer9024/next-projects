/* eslint-disable @typescript-eslint/no-explicit-any */
import { Course } from "@/generated/prisma/client";
import { apiConnector } from "@/services/apiConnector";
import {
  attachmentApiEndpoints,
  categoryApiEndpoints,
  chapterApiEndpoints,
  courseApiEndpoints,
} from "@/services/apiEndpoints";
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

export const DeleteCourse = async (
  courseId: string,
): Promise<ApiResponse<null>> => {
  const response = await apiConnector({
    method: "DELETE",
    url: courseApiEndpoints.DELETE_COURSE(courseId),
  });

  return response.data;
};

export const PublishCourse = async (
  courseId: string,
): Promise<ApiResponse<Course>> => {
  const response = await apiConnector({
    method: "PATCH",
    url: courseApiEndpoints.PUBLISH_COURSE(courseId),
  });

  return response.data;
};

export const UnPublishCourse = async (
  courseId: string,
): Promise<ApiResponse<Course>> => {
  const response = await apiConnector({
    method: "PATCH",
    url: courseApiEndpoints.UNPUBLISH_COURSE(courseId),
  });

  return response.data;
};

export const UploadImage = async (
  data: Partial<any>,
): Promise<ApiResponse<any>> => {
  const response = await apiConnector({
    method: "POST",
    url: courseApiEndpoints.UPLOAD_IMAGE,
    bodyData: data,
  });
  return response.data;
};

//-------------------- category api operations----------------------------

export const GetCategories = async (): Promise<ApiResponse<any>> => {
  const response = await apiConnector({
    method: "GET",
    url: categoryApiEndpoints.GET_CATEGORIES,
  });
  return response.data;
};

//-------------------- attachment api operations----------------------------

export const UploadAttachment = async (
  data: Partial<any>,
): Promise<ApiResponse<any>> => {
  const response = await apiConnector({
    method: "POST",
    url: attachmentApiEndpoints.UPLOAD_ATTACHMENT,
    bodyData: data,
  });
  return response.data;
};

export const CreateAttachment = async (
  data: Partial<any>,
): Promise<ApiResponse<any>> => {
  const response = await apiConnector({
    method: "POST",
    url: attachmentApiEndpoints.CREATE_ATTACHMENT,
    bodyData: data,
  });
  return response.data;
};

export const DeleteAttachment = async (
  courseId: string,
  attachmentId: string,
): Promise<ApiResponse<null>> => {
  const response = await apiConnector({
    method: "DELETE",
    url: attachmentApiEndpoints.DELETE_ATTACHMENT(attachmentId),
    bodyData: { courseId },
  });
  return response.data;
};

//-------------------- chapter api operations----------------------------

export const CreateChapter = async (
  courseId: string,
  data: Partial<any>,
): Promise<ApiResponse<any>> => {
  const response = await apiConnector({
    method: "POST",
    url: chapterApiEndpoints.CREATE_CHAPTER(courseId),
    bodyData: data,
  });

  return response.data;
};

export const GetSingleChapter = async (
  courseId: string,
  chapterId: string,
): Promise<ApiResponse<any>> => {
  const response = await apiConnector({
    method: "GET",
    url: chapterApiEndpoints.GET_SINGLE_CHAPTER(courseId, chapterId),
  });
  return response.data;
};

export const UpdateChapter = async (
  courseId: string,
  chapterId: string,
  data: Partial<any>,
): Promise<ApiResponse<any>> => {
  const response = await apiConnector({
    method: "PATCH",
    url: chapterApiEndpoints.UPDATE_SINGLE_CHAPTER(courseId, chapterId),
    bodyData: data,
  });

  return response.data;
};

//------------------------- chapter video related api operations ---------------------------

export const UploadChapterVideo = async (data: any) => {
  const response = await apiConnector({
    method: "POST",
    url: chapterApiEndpoints.UPLOAD_VIDEO,
    bodyData: data,
  });
  return response.data;
};

export const SaveChapterVideo = async (
  courseId: string,
  chapterId: string,
  uploadId: string,
): Promise<ApiResponse<any>> => {
  const response = await apiConnector({
    method: "POST",
    url: chapterApiEndpoints.SAVE_VIDEO,
    bodyData: { courseId, chapterId, uploadId },
  });

  return response.data;
};

export const DeleteChapterVideo = async (
  chapterId: string,
): Promise<ApiResponse<any>> => {
  const response = await apiConnector({
    method: "DELETE",
    url: chapterApiEndpoints.DELETE_VIDEO,
    bodyData: {
      chapterId,
    },
  });

  return response.data;
};

export const DeleteChapter = async (
  courseId: string,
  chapterId: string,
): Promise<ApiResponse<any>> => {
  const response = await apiConnector({
    method: "DELETE",
    url: chapterApiEndpoints.DELETE_SINGLE_CHAPTER(courseId, chapterId),
  });

  return response.data;
};

export const PublishChapter = async (
  courseId: string,
  chapterId: string,
): Promise<ApiResponse<any>> => {
  const response = await apiConnector({
    method: "PATCH",
    url: chapterApiEndpoints.PUBLISH_CHAPTER(courseId, chapterId),
  });

  return response.data;
};

export const UnPublishChapter = async (
  courseId: string,
  chapterId: string,
): Promise<ApiResponse<any>> => {
  const response = await apiConnector({
    method: "PATCH",
    url: chapterApiEndpoints.UNPUBLISH_CHAPTER(courseId, chapterId),
  });

  return response.data;
};
