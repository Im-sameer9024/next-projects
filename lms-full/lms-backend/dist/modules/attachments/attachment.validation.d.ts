import z from "zod";
export declare const CreateAttachmentSchema: z.ZodObject<{
    name: z.ZodString;
    courseId: z.ZodString;
}, z.core.$strip>;
export declare const DeleteAttachmentSchema: z.ZodObject<{
    attachmentId: z.ZodString;
    courseId: z.ZodString;
}, z.core.$strip>;
//# sourceMappingURL=attachment.validation.d.ts.map