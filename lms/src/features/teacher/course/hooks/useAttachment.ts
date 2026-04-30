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


      queryClient.invalidateQueries({ queryKey: ["courses"] });
      queryClient.invalidateQueries({
        queryKey: ["course", data.data?.courseId],
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
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      queryClient.invalidateQueries({
        queryKey: ["course", variables.courseId],
      });
       toast.success(GetApiResponseMessage(data));
    },
     onError(error) {
      console.log("Error in delete attachment  hook", error);
      toast.error(GetApiErrorMessage(error));
    },
  });
};
