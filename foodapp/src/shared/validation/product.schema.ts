import z from "zod";

export const imageUploadSchema = z.object({
  image: z
    .instanceof(File)
    .refine((file) => file.size > 0, "Image is required"),
});



export const productCreateSchema = z.object({
  title: z
    .string()
    .min(3, "Title is required")
    .max(16, "Title must be less than 16 characters"),

  description: z
    .string()
    .min(3, "Description is required")
    .max(200, "Description must be less than 200 characters"),

  image: z.string().min(1, "Image is required"), // URL

  slug: z.string().min(1, "Slug is required"),

  price: z.string({
    message: "Price must be required",
  }),

  size: z.string().min(1, "At least one size is required"),

  isFeatured: z.boolean({
    message: "isFeatured is required",
  }),
});

export type imageUploadSchemaProps = z.infer<typeof imageUploadSchema>;
export type productCreateSchemaProps = z.infer<typeof productCreateSchema>;
