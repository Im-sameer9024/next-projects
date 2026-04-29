import z from "zod";

export const CreateCourseTitleSchema = z.object({
  title: z
    .string()
    .min(8, {
      message: "title should be at least 8 char",
    })
    .max(50, {
      message: "title should be at most 50 char",
    }),
});





export type CreateCourseTitleSchemaType = z.infer<typeof CreateCourseTitleSchema>;
