import z from "zod";
export const CreateChapterSchema = z.object({
    title: z.string().min(1, "Title is required").max(20, "Title must be less than 20 characters"),
    courseId: z.string().min(1, "Course Id is required"),
});
//# sourceMappingURL=chapter.validation.js.map