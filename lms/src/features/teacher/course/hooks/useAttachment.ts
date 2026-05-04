/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateAttachment, DeleteAttachment } from "../apiOperations";
import { CreateCourseAttachmentSchemaType } from "@/shared/validation/course.validation";
import { toast } from "sonner";
import {
  GetApiErrorMessage,
  GetApiResponseMessage,
} from "@/shared/lib/apiMessages";

export const useCreateAttachment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      data: CreateCourseAttachmentSchemaType & { course_id: string },
    ) => CreateAttachment(data),
    onSuccess: (data) => {
      console.log("attachment data", data);

      queryClient.setQueryData(["courses"], (old: any) => {
        if (!old?.data) return old;

        return {
          ...old,
          data: old.data.map((course: any) =>
            course.id === data.data?.courseId
              ? {
                  ...course,
                  attachments: [data?.data, ...course.attachments],
                }
              : course,
          ),
        };
      });
      queryClient.setQueryData(["course", data.data.courseId], (old: any) => {
        if (!old?.data) return old;

        return {
          ...old,
          data: {
            ...old.data,
            attachments: [data?.data, ...old.data.attachments],
          },
        };
      });

      toast.success(GetApiResponseMessage(data));
    },
    onError(error) {
      console.log("Error in create attachment hook", error);
      toast.error(GetApiErrorMessage(error));
    },
  });
};

export const useDeleteAttachment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      courseId,
      attachmentId,
    }: {
      courseId: string;
      attachmentId: string;
    }) => DeleteAttachment(courseId, attachmentId),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(["courses"], (old: any) => {
        if (!old?.data) return old;

        return {
          ...old,
          data: old.data.map((course: any) =>
            course.id === variables.courseId
              ? {
                  ...course,
                  attachments: course.attachments.filter(
                    (attachment: any) =>
                      attachment.id !== variables.attachmentId,
                  ),
                }
              : course,
          ),
        };
      });
      queryClient.setQueryData(["course", variables.courseId], (old: any) => {
        if (!old?.data) return old;

        return {
          ...old,
          data: {
            ...old.data,
            attachments: old.data.attachments.filter(
              (attachment: any) => attachment.id !== variables.attachmentId,
            ),
          },
        };
      });
      toast.success(GetApiResponseMessage(data));
    },
    onError(error) {
      console.log("Error in delete attachment  hook", error);
      toast.error(GetApiErrorMessage(error));
    },
  });
};
