import z from "zod";

export const categoryCreateSchema = z.object({
  title: z.string().min(3).max(10).trim(),
  description: z.string().min(3).max(100).trim(),
  image: z
    .instanceof(File)
    .refine((file) => file.size > 0, "Image is required"),
  color: z.string().trim(),
  slug: z.string().trim(),
});

export const categoryUpdateSchema = z.object({
  categoryId: z.string(),
  title: z.string().min(3).max(10).trim(),
  description: z.string().min(3).max(100).trim(),
  color: z.string().trim(),
  slug: z.string().trim(),
});

export const imageUpdateSchema = z.object({
  image: z
    .instanceof(File)
    .refine((file) => file.size > 0, "Image is required"),
});
