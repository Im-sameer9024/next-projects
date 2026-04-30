import { Course, Attachment } from "@/generated/prisma/client";

export type CourseWithAttachments = Course & {
  attachments: Attachment[];
};