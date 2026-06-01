import { Course, UserProgress } from "../courses/course";

export interface Chapter {
  id: string;
  title: string;
  description?: string | null;

  videoUrl?: string | null;
  isPublished: boolean;
  isFree: boolean;
  isProcessingVideo: boolean;
  courseId: string;
  course: Course;

  muxData?: MuxData | null;
  userProgresses: UserProgress[];

  createdAt: Date;
  updatedAt: Date;
}
