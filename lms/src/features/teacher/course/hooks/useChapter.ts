/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CreateChapter,
  DeleteChapter,
  DeleteChapterVideo,
  GetSingleChapter,
  PublishChapter,
  SaveChapterVideo,
  UnPublishChapter,
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
        if (!old?.data) return old;
        const safeChapters = Array.isArray(old.data.chapters)
          ? old.data.chapters
          : [];
        return {
          ...old,
          data: old.data.map((course: CourseWithAllObjects) =>
            course.id === variables.courseId
              ? {
                  ...course,
                  chapters: [...safeChapters, data.data],
                }
              : course,
          ),
        };
      });

      queryClient.setQueryData(["course", variables.courseId], (old: any) => {
        if (!old.data) return old;
        const safeChapters = Array.isArray(old.data.chapters)
          ? old.data.chapters
          : [];

        return {
          ...old,
          data: {
            ...old.data,
            chapters: [...safeChapters, data.data],
          },
        };
      });

      queryClient.setQueryData(["chapter", data.data.id], (old: any) => {
        if (!old?.data) return old;

        return {
          ...old.data,
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
    refetchInterval:5000
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

    onSuccess: (res, variables) => {
      const updatedChapter = res?.data;

      // ✅ update courses list
      queryClient.setQueryData(["courses"], (old: any) => {
        if (!old?.data) return old;

        return {
          ...old.data,
          data: old.data.map((course: CourseWithAllObjects) => {
            if (course.id !== variables.courseId) return course;

            const safeChapters = Array.isArray(course.chapters)
              ? course.chapters
              : [];

            return {
              ...course,
              chapters: safeChapters.map((chapter) =>
                chapter.id === variables.chapterId
                  ? { ...chapter, ...updatedChapter }
                  : chapter,
              ),
            };
          }),
        };
      });

      // ✅ update single course
      queryClient.setQueryData(["course", variables.courseId], (old: any) => {
        if (!old?.data) return old;

        const safeChapters = Array.isArray(old.data.chapters)
          ? old.data.chapters
          : [];

        return {
          ...old,
          data: {
            ...old.data,
            chapters: safeChapters.map((chapter: Chapter) =>
              chapter.id === variables.chapterId
                ? { ...chapter, ...updatedChapter }
                : chapter,
            ),
          },
        };
      });

      // ✅ update single chapter
      queryClient.setQueryData(["chapter", variables.chapterId], (old: any) => {
        if (!old?.data) return old;

        return {
          ...old,
          data: {
            ...old.data,
            ...updatedChapter,
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
        if (!old?.data) return old;
        const safeChapters = Array.isArray(old.data.chapters)
          ? old.data.chapters
          : [];
        return {
          ...old,
          data: {
            ...old.data,
            chapters: safeChapters.map(
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
      courseId,
    }: {
      courseId: string;
      chapterId: string;
    }) => DeleteChapterVideo(chapterId),

    onSuccess: (_, variables) => {
      // update chapter
      queryClient.setQueryData(["chapter", variables.chapterId], (old: any) => {
        if (!old?.data) return old;

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
        if (!old?.data) return old;

        const safeChapters = Array.isArray(old.data.chapters)
          ? old.data.chapters
          : [];

        return {
          ...old,
          data: {
            ...old.data,
            chapters: safeChapters.map((c: any) =>
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

export const useDeleteChapter = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      courseId,
      chapterId,
    }: {
      courseId: string;
      chapterId: string;
    }) => DeleteChapter(courseId, chapterId),

    onSuccess: (data, variables) => {
      queryClient.setQueryData(["course", variables.courseId], (old: any) => {
        if (!old?.data) return old;

        const safeChapters = Array.isArray(old.data.chapters)
          ? old.data.chapters
          : [];

        return {
          ...old,
          data: {
            ...old.data,
            chapters: safeChapters.filter(
              (chapter: Chapter) => chapter.id !== variables.chapterId,
            ),
          },
        };
      });

      queryClient.setQueryData(["chapter", variables.chapterId], () => null);

      toast.success(GetApiResponseMessage(data));
    },

    onError: (error) => {
      console.error("Error deleting chapter:", error);
      toast.error(GetApiErrorMessage(error));
    },
  });
};

export const usePublishChapter = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      courseId,
      chapterId,
    }: {
      courseId: string;
      chapterId: string;
    }) => PublishChapter(courseId, chapterId),

    onSuccess: (data, variables) => {
      const updatedChapter = data?.data;

      // 🔥 Update single chapter cache
      queryClient.setQueryData(["chapter", variables.chapterId], (old: any) => {
        if (!old?.data) return old;

        return {
          ...old,
          data: {
            ...old.data,
            isPublished: updatedChapter?.isPublished,
          },
        };
      });

      // 🔥 Update course chapters list
      queryClient.setQueryData(["course", variables.courseId], (old: any) => {
        if (!old?.data) return old;

        const safeChapters = Array.isArray(old.data.chapters)
          ? old.data.chapters
          : [];

        return {
          ...old,
          data: {
            ...old.data,
            chapters: safeChapters.map((chapter: any) =>
              chapter.id === variables.chapterId
                ? {
                    ...chapter,
                    isPublished: updatedChapter?.isPublished,
                  }
                : chapter,
            ),
          },
        };
      });

      toast.success(GetApiResponseMessage(data));
    },

    onError: (error) => {
      console.error("Error publishing chapter:", error);
      toast.error(GetApiErrorMessage(error));
    },
  });
};

export const useUnPublishChapter = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      courseId,
      chapterId,
    }: {
      courseId: string;
      chapterId: string;
    }) => UnPublishChapter(courseId, chapterId),

    onSuccess: (data, variables) => {
      const updatedChapter = data?.data;

      // ✅ update single chapter
      queryClient.setQueryData(["chapter", variables.chapterId], (old: any) => {
        if (!old?.data) return old;

        return {
          ...old,
          data: {
            ...old.data,
            isPublished: updatedChapter?.isPublished,
          },
        };
      });

      // ✅ update course list
      queryClient.setQueryData(["course", variables.courseId], (old: any) => {
        if (!old?.data) return old;

        const safeChapters = Array.isArray(old.data.chapters)
          ? old.data.chapters
          : [];

        return {
          ...old,
          data: {
            ...old.data,
            chapters: safeChapters.map((ch: any) =>
              ch.id === variables.chapterId
                ? { ...ch, isPublished: updatedChapter?.isPublished }
                : ch,
            ),
          },
        };
      });

      toast.success(GetApiResponseMessage(data));
    },

    onError: (error) => {
      console.error("Error unpublishing chapter:", error);
      toast.error(GetApiErrorMessage(error));
    },
  });
};
