import { User } from "../auth/auth";

export enum Roles {
  USER = "USER",
  TEACHER = "TEACHER",
}

type paginationProps = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export interface Course {
  id: string;
  title: string;
  description?: string | null;
  image?: string | null;
  image_public_id?: string | null;
  price?: string | null;
  isPublished: boolean;

  teacherId: string;
  teacher: User;

  categoryId?: string | null;
  category?: Category | null;

  attachments: Attachment[];
  chapters: Chapter[];
  purchases: Purchase[];

  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  courses: Course[];
}

export interface Attachment {
  id: string;
  name: string;
  attachment_doc?: string | null;
  attachment_public_id?: string | null;

  courseId: string;
  course: Course;

  createdAt: Date;
  updatedAt: Date;
}

export interface MuxData {
  id: string;
  assetId: string;
  playbackId?: string | null;

  chapterId: string;
  chapter: Chapter;

  createdAt: Date;
  updatedAt: Date;
}

export interface Purchase {
  id: string;
  userId: string;

  courseId: string;
  course: Course;

  createdAt: Date;
  updatedAt: Date;
}

export interface StripeCustomer {
  id: string;
  userId: string;
  stripeCustomerId: string;

  createdAt: Date;
  updatedAt: Date;
}

export interface UserProgress {
  id: string;
  userId: string;
  isCompleted: boolean;

  chapterId: string;
  chapter: Chapter;

  createdAt: Date;
  updatedAt: Date;
}
