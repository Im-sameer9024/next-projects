import {
  Course,
  Attachment,
  Chapter,
  Category,
  Purchase,
} from "@/generated/prisma/client";

export type CourseWithAllObjects = Course & {
  attachments: Attachment[];
} & {
  chapters: Chapter[];
} & {
  category: Category[];
} & {
  purchases: Purchase[];
};
