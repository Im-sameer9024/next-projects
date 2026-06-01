import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { filtersProps } from "../search";
import {
  BuyCourse,
  DashboardData,
  GetAllCoursesForUser,
  GetCourseProgress,
  GetSingleCourseForUser,
} from "../apiOperations";
import { useInvalidateCourseCache } from "@/features/courses/hooks/useCourse";

export const useGetAllCoursesOfUser = (searchParams: filtersProps) => {
  return useQuery({
    queryKey: [
      "course",
      "list",
      searchParams.page,
      searchParams.limit,
      searchParams.search,
      searchParams.categoryId,
    ],
    queryFn: () => GetAllCoursesForUser(searchParams),
    placeholderData: (previousData) => previousData,
  });
};

export const useGetCourseProgress = (courseId: string) => {
  return useQuery({
    queryKey: ["course", "progress", courseId],
    queryFn: () => GetCourseProgress(courseId),
    enabled: !!courseId,
    placeholderData: (previousData) => previousData,
  });
};

export const useGetSingleCourse = (courseId: string) => {
  return useQuery({
    queryKey: ["course", "detail", courseId],
    queryFn: () => GetSingleCourseForUser(courseId),
    enabled: !!courseId,
    placeholderData: (previousData) => previousData,
  });
};

export const useBuyCourse = () => {
  const { invalidateCourse,invalidateCourseList } = useInvalidateCourseCache();
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (courseId: string) => BuyCourse(courseId),
    onSuccess: (data) => {
      invalidateCourse(data.courseId);
      invalidateCourseList()
      queryClient.invalidateQueries({
        queryKey: ["dashboard","user"],
      })
    },
  });
};

export const useDashboardData = () => {
  return useQuery({
    queryKey: ["dashboard","user"],
    queryFn: DashboardData,
  });
};
