/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CreateChapter,
  DeleteChapter,
  DeleteChapterVideo,
  GetChapterById,
  PublishChapter,
  SaveChapterVideo,
  UnPublishChapter,
  UpdateChapter,
  UploadChapterVideo,
} from "../apiOperations";
import { Chapter } from "../chapter";
import { Course } from "@/features/courses/course";

export const useChapterCreate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: CreateChapter,
    onSuccess: (data) => {
      const ChapterData = data.data as Chapter;

      queryClient.setQueryData(
        ["course", ChapterData.courseId],
        (old: { data: Course } | undefined) => {
          if (!old) return old;

          return {
            ...old,
            data: {
              ...old.data,
              chapters: [
                ...(Array.isArray(old.data?.chapters)
                  ? old.data?.chapters
                  : []),
                ChapterData,
              ],
            },
          };
        },
      );
    },
  });
};

export const useUpdateChapter = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: UpdateChapter,
    onSuccess: (data) => {
      const ChapterData = data.data as Chapter;

      queryClient.invalidateQueries({
        queryKey: ["chapter", ChapterData.id],
      });

      queryClient.setQueryData(
        ["course", ChapterData.courseId],
        (old: { data: Course } | undefined) => {
          if (!old) return old;

          return {
            ...old,
            data: {
              ...old.data,
              chapters: old.data?.chapters.map((chapter) =>
                chapter.id === ChapterData.id ? ChapterData : chapter,
              ),
            },
          };
        },
      );
    },
  });
};

export const useGetChapter = (chapterId: string) => {
  return useQuery({
    queryKey: ["chapter", chapterId],
    queryFn: () => GetChapterById(chapterId),

    // ✅ keep checking until video ready
    refetchInterval: (query) => {
      const chapter = query.state.data?.data;

      // only poll while processing
      if (chapter?.isProcessingVideo) {
        return 5000;
      }

      return false;
    },

    enabled: !!chapterId,
  });
};

export const useUploadChapterVideo = () => {
  return useMutation({
    mutationFn: UploadChapterVideo,
  });
};

export const useSaveChapterVideo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: SaveChapterVideo,

    onSuccess: (response: any, variables) => {
      const muxData = response.data;

      // ✅ update chapter cache immediately
      queryClient.setQueryData(["chapter", variables.chapterId], (old: any) => {
        if (!old) return old;

        return {
          ...old,

          data: {
            ...old.data,

            muxData: muxData,

            // processing started
            isProcessingVideo: true,
          },
        };
      });

      // ✅ refetch chapter after webhook processing
      queryClient.invalidateQueries({
        queryKey: ["chapter", variables.chapterId],
      });

      // ✅ refetch course data
      queryClient.invalidateQueries({
        queryKey: ["course", variables.courseId],
      });
    },

    onError: (error) => {
      console.error("Failed to save chapter video:", error);
    },
  });
};

export const useDeleteChapterVideo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: DeleteChapterVideo,

    onSuccess: (_: unknown, variables) => {
      // ✅ update chapter cache immediately
      queryClient.setQueryData(["chapter", variables.chapterId], (old: any) => {
        if (!old) return old;

        return {
          ...old,

          data: {
            ...old.data,

            videoUrl: null,

            muxData: null,

            isProcessingVideo: false,
          },
        };
      });

      // ✅ invalidate latest chapter
      queryClient.invalidateQueries({
        queryKey: ["chapter", variables.chapterId],
      });

      // ✅ invalidate course cache
      queryClient.invalidateQueries({
        queryKey: ["course", variables.courseId],
      });
    },

    onError: (error) => {
      console.error("Failed to delete chapter video:", error);
    },
  });
};

export const useDeleteChapter = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: DeleteChapter,
    onSuccess: (data) => {
      const ChapterData = data.data as Chapter;

      queryClient.removeQueries({
        queryKey: ["chapter", ChapterData.id],
      });

      queryClient.invalidateQueries({
        queryKey: ["course", ChapterData.courseId],
      });
    },
  });
};

export const usePublishChapter = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: PublishChapter,
    onSuccess: (data) => {
      const ChapterData = data.data as Chapter;

      queryClient.setQueryData(
        ["chapter", ChapterData.id],
        (old: { data: Chapter } | undefined) => {
          if (!old) return old;

          return {
            ...old.data,
            isPublished: ChapterData.isPublished,
          };
        },
      );

      queryClient.setQueryData(
        ["course", ChapterData.courseId],
        (old: { data: Course } | undefined) => {
          if (!old) return old;

          return {
            ...old,
            data: {
              ...old.data,
              chapters: old.data?.chapters.map((chapter) =>
                chapter.id === ChapterData.id ? ChapterData : chapter,
              ),
            },
          };
        },
      );
    },
  });
};

export const useUnPublishChapter = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: UnPublishChapter,

    onSuccess: (data) => {
      const ChapterData = data.data as Chapter;

      queryClient.setQueryData(
        ["chapter", ChapterData.id],
        (old: { data: Chapter } | undefined) => {
          if (!old) return old;

          return {
            ...old.data,
            isPublished: ChapterData.isPublished,
          };
        },
      );

      queryClient.setQueryData(
        ["course", ChapterData.courseId],
        (old: { data: Course } | undefined) => {
          if (!old) return old;

          return {
            ...old,
            data: {
              ...old.data,
              chapters: old.data?.chapters.map((chapter) =>
                chapter.id === ChapterData.id ? ChapterData : chapter,
              ),
            },
          };
        },
      );
    },
  });
};
