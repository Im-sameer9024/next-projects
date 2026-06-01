import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CompleteChapterByUser, GetSingleChapterForUser } from "../apiOperations";
import { useInvalidateCourseCache } from "@/features/courses/hooks/useCourse";
import { Chapter } from "@/features/chapter/chapter";

export const useGetChapterForUser = (chapterId: string) => {
  return useQuery({
    queryKey: ["chapter", "detail", chapterId],
    queryFn: () => GetSingleChapterForUser(chapterId),

    enabled: !!chapterId,
  });
};

export const useCompleteChapter = () => {
  const queryClient = useQueryClient();
  const { invalidateCourse } = useInvalidateCourseCache();

  return useMutation({
    mutationFn: CompleteChapterByUser,
    onSuccess: (data) => {
      const ChapterData = data.data as Chapter;
      console.log("chapterData", ChapterData);

      queryClient.invalidateQueries({
        queryKey: ["chapter", "detail", ChapterData.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["course", "progress", ChapterData.courseId],
      });

      queryClient.invalidateQueries({
        queryKey:["dashboard","user"]
      })

      invalidateCourse(ChapterData.courseId);
    },
  });
};
