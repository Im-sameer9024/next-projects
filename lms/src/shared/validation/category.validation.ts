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