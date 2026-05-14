export type ApiResponse<T> = {
  pagination: { totalCourses: number; totalPages: number; currentPage: number; limit: number; hasNextPage: boolean; hasPrevPage: boolean; };
  success: boolean;
  message: string;
  data: T;
};
