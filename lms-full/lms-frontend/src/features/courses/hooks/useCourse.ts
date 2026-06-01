"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CrateAttachment,
  CreateCourse,
  DeleteAttachment,
  DeleteCourseByTeacher,
  GetAllCoursesOfTeacher,
  GetSingleCourseForTeacher,
  PublishCourse,
  searchParamsProps,
  UnpublishCourse,
  UpdateCourseByTeacher,
} from "../apiOperations";
import { Attachment, Course } from "../course";
import { toast } from "sonner";
import { GetApiResponseMessage } from "@/shared/utils/apiMessages";

export const useCreateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: CreateCourse,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["course", "list"],
      });

      toast.success(GetApiResponseMessage(data));
    },

    onError: (error) => {
      console.log("Error occur in create course", error);
      toast.error(GetApiResponseMessage(error));
    },
  });
};

export const useGetCourseForTeacher = (courseId: string) => {
  return useQuery({
    queryKey: ["course", "detail", courseId],
    queryFn: () => GetSingleCourseForTeacher(courseId),
    enabled: !!courseId,
  });
};

export const useGetAllCoursesOfTeacher = (searchParams: searchParamsProps, teacherId: string) => {
  return useQuery({
    queryKey: [
      "course",
      "list",
      teacherId,
      searchParams.page,
      searchParams.limit,
      searchParams.search,
    ],
    queryFn: () => GetAllCoursesOfTeacher(searchParams),
    enabled: !!teacherId,
    placeholderData: (previousData) => previousData,
  });
};

export const useUpdateCourseByTeacher = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ courseId, data }: { courseId: string; data: any }) =>
      UpdateCourseByTeacher(courseId, data),

    onSuccess: (data) => {
      const CourseData = data.data as Course;

      queryClient.setQueryData(
        ["course", "detail", CourseData.id],
        (old: { data: Course } | undefined) => {
          if (!old) return old;

          return {
            ...old,
            data: {
              ...old.data,
              ...CourseData,
            },
          };
        },
      );
    },

    onError: (error) => {
      console.log("Error occur in update course", error);
    },
  });
};

export const useCreateAttachment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: CrateAttachment,
    onSuccess: (data) => {
      const attachmentData = data.data as Attachment;

      queryClient.setQueryData(
        ["course", "detail", attachmentData.courseId],
        (
          old:
            | {
                data: Course;
              }
            | undefined,
        ) => {
          if (!old) return old;

          const currentAttachments = Array.isArray(old.data?.attachments)
            ? old.data.attachments
            : [];

          return {
            ...old,
            data: {
              ...old.data,
              attachments: [...currentAttachments, attachmentData],
            },
          };
        },
      );
    },
  });
};

export const useDeleteAttachment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: DeleteAttachment,
    onSuccess: (data) => {
      const attachmentData = data.data as Attachment;

      queryClient.setQueryData(
        ["course", "detail", attachmentData?.courseId],
        (
          old:
            | {
                data: Course;
              }
            | undefined,
        ) => {
          if (!old) return old;

          const updatedAttachments = Array.isArray(old.data?.attachments)
            ? old.data.attachments.filter(
                (attachment: Attachment) => attachment.id !== attachmentData.id,
              )
            : [];

          return {
            ...old,
            data: {
              ...old.data,
              attachments: updatedAttachments,
            },
          };
        },
      );

      toast.success("Attachment deleted successfully");
    },
  });
};

export const useDeleteCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ courseId }: { courseId: string }) => {
      return await DeleteCourseByTeacher(courseId);
    },

    onSuccess: (data) => {
      console.log("delete course response:", data);
      queryClient.removeQueries({
        queryKey: ["course", "detail", data.data?.id],
      });

      queryClient.invalidateQueries({
        queryKey: ["course", "list"],
      });
      toast.success("Course deleted successfully");
    },

    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to delete course");
    },
  });
};

export const usePublishCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ courseId }: { courseId: string }) => {
      return await PublishCourse(courseId);
    },

    onSuccess: (data, variables) => {
      toast.success("Course published successfully");

      queryClient.invalidateQueries({
        queryKey: ["course", "detail", variables.courseId],
      });

      queryClient.invalidateQueries({
        queryKey: ["course", "list"],
      });
    },

    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to publish course");
    },
  });
};

export const useUnPublishCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ courseId }: { courseId: string }) => {
      return await UnpublishCourse(courseId);
    },

    onSuccess: (data, variables) => {
      toast.success("Course unpublished successfully");

      queryClient.invalidateQueries({
        queryKey: ["course", "detail", variables.courseId],
      });

      queryClient.invalidateQueries({
        queryKey: ["course", "list"],
      });
    },

    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to unpublish course");
    },
  });
};

export const useInvalidateCourseCache = () => {
  const queryClient = useQueryClient();

  const invalidateCourseList = () => {
    return queryClient.invalidateQueries({
      queryKey: ["course", "list"],
    });
  };

  const invalidateCourse = (courseId: string) => {
    return queryClient.invalidateQueries({
      queryKey: ["course", "detail", courseId],
    });
  };

  return {
    invalidateCourse,
    invalidateCourseList,
  };
};
