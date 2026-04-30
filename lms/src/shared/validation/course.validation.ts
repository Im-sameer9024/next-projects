import z from "zod";

export const CreateCourseTitleSchema = z.object({
  title: z
    .string()
    .min(8, {
      message: "title should be at least 8 char",
    })
    .max(80, {
      message: "title should be at most 80 char",
    }),
});

export const CreateCourseDescriptionSchema = z.object({
  description: z
    .string()
    .min(10, {
      message: "description should be at least 10 char",
    })
    .max(500, {
      message: "description should be at most 500 char",
    }),
});

export const CreateCourseImageSchema = z.object({
  image: z
    .instanceof(File, {
      message: "A valid file must be provided",
    })
    .refine((image) => image.size <= 5 * 1024 * 1024, {
      message: "File size must be less than 5 MB",
    }),
});

export const CreateCoursePriceSchema = z.object({
  price: z
    .string()
    .min(1, "Price is required")
    .refine((val) => !isNaN(Number(val)), {
      message: "Price must be a number",
    }),
});

export type CreateCoursePriceSchemaType = z.infer<
  typeof CreateCoursePriceSchema
>;

export type CreateCourseTitleSchemaType = z.infer<
  typeof CreateCourseTitleSchema
>;

export type CreateCourseDescriptionSchemaType = z.infer<
  typeof CreateCourseDescriptionSchema
>;

export type CreateCourseImageSchemaType = z.infer<
  typeof CreateCourseImageSchema
>;
