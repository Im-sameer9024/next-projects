/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiConnector } from "@/services/apiConnector";
import { chapterApiEndpoints } from "@/services/apiEndPoints";
import { CreateChapterSchemaTypes } from "./chapter.validation";

export const CreateChapter = async (data: CreateChapterSchemaTypes) => {
  const response = await apiConnector({
    method: "POST",
    url: chapterApiEndpoints.CREATE_CHAPTER,
    bodyData: data,
  });
  return response.data;
};

export const UpdateChapter = async (data: any) => {
  const response = await apiConnector({
    method: "POST",
    url: chapterApiEndpoints.UPDATE_CHAPTER,
    bodyData: data,
  });
  return response.data;
};

export const GetChapterById = async (chapterId: string) => {
  const response = await apiConnector({
    method: "GET",
    url: chapterApiEndpoints.GET_CHAPTER_BY_ID(chapterId),
  });
  return response.data;
};

export const DeleteChapter = async (data: any) => {
  const response = await apiConnector({
    method: "POST",
    url: chapterApiEndpoints.DELETE_CHAPTER,
    bodyData: data,
  });
  return response.data;
}

export const UploadChapterVideo = async (data: any) => {
  const response = await apiConnector({
    method: "POST",
    url: chapterApiEndpoints.UPLOAD_VIDEO,
    bodyData: data,
  });

  return response.data;
};

export const DeleteChapterVideo = async (data: any) => {
  const response = await apiConnector({
    method: "POST",
    url: chapterApiEndpoints.DELETE_VIDEO,
    bodyData: data,
  });
  return response.data;
}

export const SaveChapterVideo = async (data: any) => {
  const response = await apiConnector({
    method: "POST",
    url: chapterApiEndpoints.SAVE_VIDEO,
    bodyData: data,
  });
  return response.data;
};

export const PublishChapter = async (data: any) => {
  const response = await apiConnector({
    method: "POST",
    url: chapterApiEndpoints.PUBLISH_CHAPTER,
    bodyData: data,
  });
  return response.data;
}

export const UnPublishChapter = async (data: any) => {
  const response = await apiConnector({
    method: "POST",
    url: chapterApiEndpoints.UNPUBLISH_CHAPTER,
    bodyData: data,
  });
  return response.data;
}
