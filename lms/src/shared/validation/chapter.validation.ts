// chapter.validation.ts
import { z } from "zod";

export const CreateChapterTitleSchema = z.object({
  title: z
    .string()
    .min(8, {
      message: "title should be at least 8 char",
    })
    .max(80, {
      message: "title should be at most 80 char",
    }),
});

export const CreateChapterDescriptionSchema = z.object({
  // Stored as HTML string in DB, e.g. "<p>Hello <strong>world</strong></p>"
  description: z
    .string()
    .min(1, "Description is required")
    .refine(
      (val) => val.replace(/<[^>]*>/g, "").trim().length > 0,
      { message: "Description cannot be empty" }
    ),
});


export const CreateChapterAccessSchema = z.object({
  isFree: z.boolean(),
});

export type CreateChapterAccessSchemaType = z.infer<
  typeof CreateChapterAccessSchema
>;
export type CreateChapterTitleSchemaType = z.infer<
  typeof CreateChapterTitleSchema
>;

export type CreateChapterDescriptionSchemaType = z.infer<
  typeof CreateChapterDescriptionSchema
>;
