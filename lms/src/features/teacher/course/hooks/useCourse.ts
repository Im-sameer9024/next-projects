"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CreateCourse,
  GetCourses,
  GetSingleCourse,
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
          data: updatedCourse,
        };
      });

      // ✅ Update course list
      queryClient.setQueryData(["courses"], (old: any) => {
        if (!old?.data) return old;

        return {
          ...old,
          data: old.data.map((course: any) =>
            course.id === variables.courseId
              ? updatedCourse
              : course
          ),
        };
      });

      toast.success(GetApiResponseMessage(data));
    },

    onError: (error) => {
      console.error("Error updating course:", error);
      toast.error(GetApiErrorMessage(error));
    },
  });
};