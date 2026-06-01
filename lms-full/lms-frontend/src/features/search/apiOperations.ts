import { apiConnector } from "@/services/apiConnector";
import { chapterApiEndpoints, courseApiEndpoints } from "@/services/apiEndPoints";
import { filtersProps } from "./search";

export const GetAllCoursesForUser = async (searchParams: filtersProps) => {
  const response = await apiConnector({
    method: "GET",
    url: courseApiEndpoints.GET_ALL_COURSES_OF_USER,
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

      ...(searchParams.categoryId && {
        categoryId: searchParams.categoryId,
      }),
    },
  });
  return response.data;
};

export const GetCourseProgress = async (courseId: string) => {
  const response = await apiConnector({
    method: "POST",
    url: courseApiEndpoints.GET_PROGRESS_OF_COURSE,
    bodyData: { courseId },
  });
  return response.data;
};

export const GetSingleCourseForUser = async (courseId: string) => {
  const response = await apiConnector({
    method: "GET",
    url: courseApiEndpoints.GET_SINGLE_COURSE_OF_USER(courseId),
  });
  return response.data;
};

export const GetSingleChapterForUser = async (chapterId: string) => {
  const response = await apiConnector({
    method: "GET",
    url: chapterApiEndpoints.GET_SINGLE_CHAPTER_OF_USER(chapterId),
  });
  return response.data;
};

export const CompleteChapterByUser = async (chapterId: string) => {
  const response = await apiConnector({
    method: "POST",
    url: chapterApiEndpoints.COMPLETE_CHAPTER_BY_USER,
    bodyData: { chapterId },
  });
  return response.data;
};

export const BuyCourse = async (courseId: string) => {
  const response = await apiConnector({
    method: "POST",
    url: courseApiEndpoints.BUY_COURSE(courseId),
  });
  return response.data;
};


export const DashboardData = async() =>{
  const response = await apiConnector({
    method: "GET",
    url: courseApiEndpoints.DASHBOARD_DATA,
  })
  return response.data
}