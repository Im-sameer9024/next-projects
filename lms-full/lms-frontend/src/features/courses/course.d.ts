import { User } from "../auth/auth";

export interface Course {
  id: string;
  title: string;
  description?: string;
  image?: string;
  image_public_id?: string;
  price?: string;
  isPublished: boolean;

  // relations
  teacherId: string;
  teacher: User; // Assuming you have a User interface
  categoryId?: string;
  category?: Category; // Assuming you have a Category interface
  attachments: Attachment[];
  chapters: Chapter[];
  purchases: Purchase[];

  createdAt: Date;
  updatedAt: Date;
}

export interface AiDateProps {
  text: string;
}
