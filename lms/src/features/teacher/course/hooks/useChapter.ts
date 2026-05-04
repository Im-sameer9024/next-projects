/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CreateChapter,
  DeleteChapterVideo,
  GetSingleChapter,
  SaveChapterVideo,
  UpdateChapter,
} from "../apiOperations";
import {
  GetApiErrorMessage,
  GetApiResponseMessage,
} from "@/shared/lib/apiMessages";
import { toast } from "sonner";
import { CourseWithAllObjects } from "@/shared/types/course";
import { Chapter, MuxData } from "@/generated/prisma/client";

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
                  chapters: [...(course.chapters || []), data.data],
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

      queryClient.setQueryData(["chapter", data.data.id], (old: any) => {
        if (!old) return old;

        return {
          ...old,
          data: data.data,
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
          data: {
            ...old.data,
            ...data.data,
          },
        };
      });
    },
    onError: (error) => {
      console.error("Error updating Chapter:", error);
      toast.error(GetApiErrorMessage(error));
    },
  });
};

export const useSaveChapterVideo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      courseId,
      chapterId,
      uploadId,
    }: {
      courseId: string;
      chapterId: string;
      uploadId: string;
    }) => SaveChapterVideo(courseId, chapterId, uploadId),

    onSuccess: (data, variables) => {
      console.log("data is to save in chapter", data);

      queryClient.setQueryData(["chapter", variables.chapterId], (old: any) => {
        if (!old) return old;

        return {
          ...old,
          data: {
            ...old.data,
            muxData: data.data,
            videoUrl: data.data.playbackId ?? old.data.videoUrl,
          },
        };
      });

      queryClient.setQueryData(["course", variables.courseId], (old: any) => {
        if (!old) return old;

        return {
          ...old,
          data: {
            ...old.data,
            chapters: old.data.chapters.map(
              (chapter: Chapter & { muxData?: MuxData }) =>
                chapter.id === variables.chapterId
                  ? {
                      ...chapter,
                      muxData: data.data,
                      videoUrl: data.data.playbackId ?? chapter.videoUrl,
                    }
                  : chapter,
            ),
          },
        };
      });
    },

    onError: (error) => {
      console.error("Error saving chapter video:", error);
      toast.error(GetApiErrorMessage(error));
    },
  });
};

export const useDeleteChapterVideo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      chapterId,
    }: {
      courseId: string;
      chapterId: string;
    }) => DeleteChapterVideo(chapterId),

    onSuccess: (_, variables) => {
      // update chapter
      queryClient.setQueryData(["chapter", variables.chapterId], (old: any) => {
        if (!old) return old;

        return {
          ...old,
          data: {
            ...old.data,
            videoUrl: null,
            muxData: null,
          },
        };
      });

      // update course
      queryClient.setQueryData(["course", variables.courseId], (old: any) => {
        if (!old) return old;

        return {
          ...old,
          data: {
            ...old.data,
            chapters: old.data.chapters.map((c: any) =>
              c.id === variables.chapterId
                ? { ...c, videoUrl: null, muxData: null }
                : c,
            ),
          },
        };
      });

      toast.success("Video deleted");
    },
  });
};
