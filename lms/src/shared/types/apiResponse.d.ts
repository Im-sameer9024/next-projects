export type ApiResponse<T> = {
  courseId: any;
  success: boolean;
  message: string;
  data: T;
};
