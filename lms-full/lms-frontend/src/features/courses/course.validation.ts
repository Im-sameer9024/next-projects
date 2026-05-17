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

export type CreateCourseSchemaType = z.infer<typeof CreateCourseSchema>;
export type CourseDescriptionSchemaType = z.infer<
  typeof CourseDescriptionSchema
>;
export type CourseImageSchemaType = z.infer<typeof CourseImageSchema>;
