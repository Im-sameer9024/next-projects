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
import { useInvalidateCourseCache } from "@/features/courses/hooks/useCourse";

export const useChapterCreate = () => {
  const { invalidateCourse } = useInvalidateCourseCache();

  return useMutation({
    mutationFn: CreateChapter,
    onSuccess: (data) => {
      const ChapterData = data.data as Chapter;

      invalidateCourse(ChapterData.courseId);
    },
    onError: (err) => {
      console.log("Error in chapter create", err);
    },
  });
};

export const useUpdateChapter = () => {
  const queryClient = useQueryClient();
  const { invalidateCourse } = useInvalidateCourseCache();

  return useMutation({
    mutationFn: UpdateChapter,
    onSuccess: (data) => {
      const ChapterData = data.data as Chapter;

      queryClient.invalidateQueries({
        queryKey: ["chapter", "detail", ChapterData.id],
      });

      invalidateCourse(ChapterData.courseId);
    },
  });
};

export const useGetChapter = (chapterId: string) => {
  return useQuery({
    queryKey: ["chapter", "detail", chapterId],
    queryFn: () => GetChapterById(chapterId),
    // ✅ keep checking until video ready
    refetchInterval: (query) => {
      const chapter = query.state.data?.data;

      return chapter?.isProcessingVideo ? 5000 : false;
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
  const { invalidateCourse } = useInvalidateCourseCache();

  return useMutation({
    mutationFn: SaveChapterVideo,

    onSuccess: (variables) => {
      queryClient.invalidateQueries({
        queryKey: ["chapter", "detail", variables.chapterId],
      });

      invalidateCourse(variables.courseId);
    },

    onError: (error) => {
      console.error("Failed to save chapter video:", error);
    },
  });
};

export const useDeleteChapterVideo = () => {
  const queryClient = useQueryClient();
  const { invalidateCourse } = useInvalidateCourseCache();

  return useMutation({
    mutationFn: DeleteChapterVideo,

    onSuccess: (_: unknown, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["chapter", "detail", variables.chapterId],
      });
      invalidateCourse(variables.courseId);
    },

    onError: (error) => {
      console.error("Failed to delete chapter video:", error);
    },
  });
};

export const useDeleteChapter = () => {
  const queryClient = useQueryClient();

  const { invalidateCourse } = useInvalidateCourseCache();

  return useMutation({
    mutationFn: DeleteChapter,
    onSuccess: (data) => {
      const ChapterData = data.data as Chapter;

      queryClient.removeQueries({
        queryKey: ["chapter", "detail", ChapterData.id],
      });

      invalidateCourse(ChapterData.courseId);
    },
  });
};

export const usePublishChapter = () => {
  const queryClient = useQueryClient();
  const { invalidateCourse } = useInvalidateCourseCache();

  return useMutation({
    mutationFn: PublishChapter,
    onSuccess: (data) => {
      const ChapterData = data.data as Chapter;

      queryClient.invalidateQueries({
        queryKey: ["chapter", "detail", ChapterData.id],
      });
      invalidateCourse(ChapterData.courseId);
    },
  });
};

export const useUnPublishChapter = () => {
  const queryClient = useQueryClient();
  const { invalidateCourse } = useInvalidateCourseCache();
  return useMutation({
    mutationFn: UnPublishChapter,

    onSuccess: (data) => {
      const ChapterData = data.data as Chapter;

      queryClient.invalidateQueries({
        queryKey: ["chapter", "detail", ChapterData.id],
      });
      invalidateCourse(ChapterData.courseId);
    },
  });
};
