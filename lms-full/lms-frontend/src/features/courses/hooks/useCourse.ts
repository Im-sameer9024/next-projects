"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CreateCourse,
  GetSingleCourseForTeacher,
  UpdateCourseByTeacher,
  UploadThumbnail,
} from "../apiOperations";
import { Course } from "../course";
import { toast } from "sonner";
import { GetApiResponseMessage } from "@/shared/utils/apiMessages";

export const useCreateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: CreateCourse,
    onSuccess: (data) => {
      const CourseData = data.data as Course;

      queryClient.invalidateQueries({
        queryKey: ["courses", CourseData.teacherId],
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
    queryKey: ["course", courseId],
    queryFn: () => GetSingleCourseForTeacher(courseId),
    enabled: !!courseId,
  });
};

export const useUpdateCourseByTeacher = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ courseId, data }: { courseId: string; data: any }) =>
      UpdateCourseByTeacher(courseId, data),

    onSuccess: (data) => {
      const CourseData = data.data as Course;

      queryClient.setQueryData(["course", CourseData.id], (old: any) => {
        if (!old) return old;

        return {
          ...old,
          data: {
            ...old.data,
            ...CourseData,
          },
        };
      });

      queryClient.invalidateQueries({
        queryKey: ["courses", CourseData.teacherId],
      });
    },

    onError: (error) => {
      console.log("Error occur in update course", error);
    },
  });
};

export const useUploadThumbnail = () => {
  return useMutation({
    mutationFn: async (formData: FormData) => {
      return UploadThumbnail(formData);
    },

    onSuccess: () => {
      toast.success("Thumbnail uploaded successfully");
    },

    onError: (error) => {
      console.log(error);

      toast.error("Upload failed");
    },
  });
};
