import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CreateCourse, GetSingleCourse, UpdateCourse, UploadCourseImage } from "../apiOperations";
import { toast } from "sonner";
import {
  GetApiErrorMessage,
  GetApiResponseMessage,
} from "@/shared/lib/apiMessages";

export const useCreateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: CreateCourse,

    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["course", data.data?.id],
      });

      queryClient.invalidateQueries({
        queryKey: ["courses"],
      });

      toast.success(GetApiResponseMessage(data));
    },

    onError: (error) => {
      toast.error(GetApiErrorMessage(error));
    },
  });
};

export const useGetCourse = (courseId: string) => {
  return useQuery({
    queryKey: ["course", courseId],
    queryFn: () => GetSingleCourse(courseId),
    enabled: !!courseId,
  });
};

export const useUpdateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: UpdateCourse,

    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["course", data.data?.id],
      });

      queryClient.invalidateQueries({
        queryKey: ["courses"],
      });

      toast.success(GetApiResponseMessage(data));
    },

    onError: (error) => {
      toast.error(GetApiErrorMessage(error));
    },
  });
};


export const useUploadCourseImage = () =>{

 const queryClient = useQueryClient();

  return useMutation({
    mutationFn: UploadCourseImage,

    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["course", data.data?.id],
      });

      queryClient.invalidateQueries({
        queryKey: ["courses"],
      });

      toast.success(GetApiResponseMessage(data));
    },

    onError: (error) => {
      toast.error(GetApiErrorMessage(error));
    },
  });
}