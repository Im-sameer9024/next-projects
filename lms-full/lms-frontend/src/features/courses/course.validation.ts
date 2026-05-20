import { z } from "zod";

export const CreateCourseSchema = z.object({
  title: z
    .string()
    .min(8, {
      message: "title should be at least 8 char",
    })
    .max(80, {
      message: "title should be at most 80 char",
    }),
});

export const CourseDescriptionSchema = z.object({
  description: z
    .string()
    .min(10, {
      message: "description should be at least 10 char",
    })
    .max(500, {
      message: "description should be at most 500 char",
    }),
});

export const CourseImageSchema = z.object({
  image: z
    .instanceof(File, {
      message: "A valid file must be provided",
    })
    .refine((image) => image.size <= 5 * 1024 * 1024, {
      message: "File size must be less than 5 MB",
    }),
});

export const CoursePriceSchema = z.object({
  price: z
    .string()
    .min(1, "Price is required")
    .refine((val) => !isNaN(Number(val)), {
      message: "Price must be a number",
    }),
});

export const CreateAttachmentSchema = z.object({
  name: z
    .string()
    .min(3, {
      message: "Name should be at least 3 characters long",
    })
    .max(20, {
      message: "Name should be at most 20 characters long",
    }),
});

export const DeleteAttachmentSchema = z.object({
  attachmentId: z.string(),
  courseId: z.string(),
});

export type CreateCourseSchemaType = z.infer<typeof CreateCourseSchema>;
export type CourseDescriptionSchemaType = z.infer<
  typeof CourseDescriptionSchema
>;
export type CourseImageSchemaType = z.infer<typeof CourseImageSchema>;
export type CoursePriceSchemaType = z.infer<typeof CoursePriceSchema>;

export type CreateAttachmentSchemaType = z.infer<typeof CreateAttachmentSchema>;
export type DeleteAttachmentSchemaType = z.infer<typeof DeleteAttachmentSchema>;