/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CreateChapter,
  GetSingleChapter,
  UpdateChapter,
} from "../apiOperations";
import {
  GetApiErrorMessage,
  GetApiResponseMessage,
} from "@/shared/lib/apiMessages";
import { toast } from "sonner";
import { CourseWithAllObjects } from "@/shared/types/course";
import { Chapter } from "@/generated/prisma/client";

export const useCreateChapter = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      courseId,
      data,
    }: {
      courseId: string;
      data: Partial<any>;
    }) => CreateChapter(courseId, data),

    onSuccess: (data, variables) => {
      queryClient.setQueryData(["courses"], (old: any) => {
        if (!old) return old;

        return {
          ...old,
          data: old.data.map((course: CourseWithAllObjects) =>
            course.id === variables.courseId
              ? {
                  ...course,
                  chapters: [...course.chapters, data.data],
                }
              : course,
          ),
        };
      });

      queryClient.setQueryData(["course", variables.courseId], (old: any) => {
        if (!old) return old;

        return {
          ...old,
          data: {
            ...old.data,
            chapters: [...old.data.chapters, data.data],
          },
        };
      });

      toast.success(GetApiResponseMessage(data));
    },
    onError: (error) => {
      console.error("Error creating chapter:", error);
      toast.error(GetApiErrorMessage(error));
    },
  });
};

export const useGetSingleChapter = ({
  courseId,
  chapterId,
}: {
  courseId: string;
  chapterId: string;
}) => {
  return useQuery({
    queryKey: ["chapter", chapterId],
    queryFn: () => GetSingleChapter(courseId, chapterId),
  });
};

export const useUpdateChapter = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      courseId,
      chapterId,
      data,
    }: {
      courseId: string;
      chapterId: string;
      data: any;
    }) => UpdateChapter(courseId, chapterId, data),

    onSuccess: (data, variables) => {
      queryClient.setQueryData(["courses"], (old: any) => {
        if (!old?.data) return old;

        return {
          ...old,
          data: old.data.map((course: CourseWithAllObjects) =>
            course.id === variables.courseId
              ? {
                  ...course,
                  chapters: course.chapters.map((chapter) =>
                    chapter.id === variables.chapterId ? data.data : chapter,
                  ),
                }
              : course,
          ),
        };
      });

      queryClient.setQueryData(["course", variables.courseId], (old: any) => {
        if (!old) return old;

        return {
          ...old,
          data: {
            ...old.data,
            chapters: old.data.chapters.map((chapter: Chapter) =>
              chapter.id === variables.chapterId ? data.data : chapter,
            ),
          },
        };
      });

      queryClient.setQueryData(["chapter", variables.chapterId], (old: any) => {
        if (!old) return old;

        return {
          ...old,
          data: data.data,
        };
      });

    },
    onError: (error) => {
      console.error("Error updating Chapter:", error);
      toast.error(GetApiErrorMessage(error));
    },
  });
};
