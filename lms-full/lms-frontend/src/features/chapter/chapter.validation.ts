import z from "zod";

export const CreateChapterSchema = z.object({
  title: z.string().min(1, "Title is required").max(20, "Title must be less than 20 characters"),
});

export const ChapterDescriptionSchema = z.object({
  // Stored as HTML string in DB, e.g. "<p>Hello <strong>world</strong></p>"
  description: z
    .string()
    .min(1, "Description is required")
    .refine((val) => val.replace(/<[^>]*>/g, "").trim().length > 0, {
      message: "Description cannot be empty",
    }),
});

export const ChapterAccessSchema = z.object({
  isFree: z.boolean(),
});

export type CreateChapterSchemaTypes = z.infer<typeof CreateChapterSchema>;
export type ChapterDescriptionSchemaTypes = z.infer<typeof ChapterDescriptionSchema>;
export type ChapterAccessSchemaTypes = z.infer<typeof ChapterAccessSchema>;
