"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CreateCourse,
  DeleteCourse,
  GetCourses,
  GetSingleCourse,
  PublishCourse,
  UnPublishCourse,
  UpdateCourse,
} from "../apiOperations";
import { toast } from "sonner";
import {
  GetApiErrorMessage,
  GetApiResponseMessage,
} from "@/shared/lib/apiMessages";
import { Course } from "@/generated/prisma/client";

export const useGetCourse = () => {
  return useQuery({
    queryKey: ["courses"],
    queryFn: GetCourses,
  });
};

export const useGetSingleCourse = (courseId: string) => {
  return useQuery({
    queryKey: ["course", courseId],
    queryFn: () => GetSingleCourse(courseId),
    enabled: !!courseId,
  });
};

export const useCreateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: CreateCourse,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["courses"],
      });

      queryClient.setQueryData(["courses"], (oldData: any) => ({
        ...oldData,
        data: [...(oldData?.data || []), data.data],
      }));

      toast.success(GetApiResponseMessage(data));
    },
    onError: (error) => {
      console.log("Error occur in create course", error);
      toast.error(GetApiErrorMessage(error));
    },
  });
};

export const useUpdateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      courseId,
      data,
    }: {
      courseId: string;
      data: Partial<Course>;
    }) => UpdateCourse(courseId, data),

    onSuccess: (data, variables) => {
      const updatedCourse = data.data;

      // ✅ Update single course
      queryClient.setQueryData(["course", variables.courseId], (old: any) => {
        if (!old) return old;

        return {
          ...old,
          data: { ...old.data, ...updatedCourse },
        };
      });

      // ✅ Update course list
      queryClient.setQueryData(["courses"], (old: any) => {
        if (!old) return old;

        return {
          ...old,
          data: old.data.map((course: any) =>
            course.id === variables.courseId
              ? { ...course, ...updatedCourse }
              : course,
          ),
        };
      });
    },

    onError: (error) => {
      console.error("Error updating course:", error);
      toast.error(GetApiErrorMessage(error));
    },
  });
};

export const useDeleteCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ courseId }: { courseId: string }) => DeleteCourse(courseId),

    onSuccess: (data, variables) => {
      // ✅ Remove from courses list cache
      queryClient.setQueryData(["courses"], (old: any) => {
        if (!old?.data) return old;
        return {
          ...old,
          data: old.data.filter(
            (course: any) => course.id !== variables.courseId,
          ),
        };
      });

      // ✅ Remove single course cache entry
      queryClient.removeQueries({ queryKey: ["course", variables.courseId] });

      toast.success(GetApiResponseMessage(data));
    },

    onError: (error) => {
      console.error("Error deleting course:", error);
      toast.error(GetApiErrorMessage(error));
    },
  });
};

export const usePublishCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ courseId }: { courseId: string }) => PublishCourse(courseId),

    onSuccess: (data, variables) => {
      const updatedCourse = data?.data;

      // ✅ Update single course cache
      queryClient.setQueryData(["course", variables.courseId], (old: any) => {
        if (!old?.data) return old;
        return {
          ...old,
          data: { ...old.data, isPublished: updatedCourse?.isPublished },
        };
      });

      // ✅ Update courses list cache
      queryClient.setQueryData(["courses"], (old: any) => {
        if (!old?.data) return old;
        return {
          ...old,
          data: old.data.map((course: any) =>
            course.id === variables.courseId
              ? { ...course, isPublished: updatedCourse?.isPublished }
              : course,
          ),
        };
      });

      toast.success(GetApiResponseMessage(data));
    },

    onError: (error) => {
      console.error("Error publishing course:", error);
      toast.error(GetApiErrorMessage(error));
    },
  });
};

export const useUnPublishCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ courseId }: { courseId: string }) =>
      UnPublishCourse(courseId),

    onSuccess: (data, variables) => {
      const updatedCourse = data?.data;

      // ✅ Update single course cache
      queryClient.setQueryData(["course", variables.courseId], (old: any) => {
        if (!old?.data) return old;
        return {
          ...old,
          data: { ...old.data, isPublished: updatedCourse?.isPublished },
        };
      });

      // ✅ Update courses list cache
      queryClient.setQueryData(["courses"], (old: any) => {
        if (!old?.data) return old;
        return {
          ...old,
          data: old.data.map((course: any) =>
            course.id === variables.courseId
              ? { ...course, isPublished: updatedCourse?.isPublished }
              : course,
          ),
        };
      });

      toast.success(GetApiResponseMessage(data));
    },

    onError: (error) => {
      console.error("Error unpublishing course:", error);
      toast.error(GetApiErrorMessage(error));
    },
  });
};
