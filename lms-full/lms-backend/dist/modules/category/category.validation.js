import z from "zod";
export const CreateCategorySchema = z.object({
    name: z
        .string()
        .min(3, {
        message: "name should be at least 3 char",
    })
        .max(20, {
        message: "name should be at most 20 char",
    }),
});
//# sourceMappingURL=category.validation.js.map