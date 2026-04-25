import { z } from "zod";

export const CreateCourseTitleSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(60, "Title must be less than 60 characters"),
});

export const CreateCourseDescriptionSchema = z.object({
  description: z
    .string()
    .min(3, "Description is required")
    .max(300, "Description must be less than 300 characters"),
});

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const CreateCourseImageSchema = z.object({
  image: z
    .instanceof(File, { message: "Image is required" })
    .refine((file) => file.size <= MAX_FILE_SIZE, {
      message: "Max file size is 5MB",
    }),
});


export const CreateCourseCategorySchema = z.object({
  categoryId:z.string()
})

export type CreateCourseTitleTypes = z.infer<typeof CreateCourseTitleSchema>;
export type CreateCourseDescriptionTypes = z.infer<
  typeof CreateCourseDescriptionSchema
>;
export type CreateCourseImageTypes = z.infer<typeof CreateCourseImageSchema>;
export type CreateCourseCategoryTypes = z.infer<typeof CreateCourseCategorySchema>;