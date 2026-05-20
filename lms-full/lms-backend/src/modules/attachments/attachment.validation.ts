import z from "zod";

export const CreateAttachmentSchema = z.object({
  name: z
    .string()
    .min(3, {
      message: "Name should be at least 3 characters long",
    })
    .max(20, {
      message: "Name should be at most 20 characters long",
    }),
  courseId: z.string(),
});

export const DeleteAttachmentSchema = z.object({
  attachmentId: z.string(),
  courseId: z.string(),
});
