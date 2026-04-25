export const courseUrls = {
  COURSE_CREATE: "/api/courses",
  GET_COURSE: (courseId: string) => `/api/courses/${courseId}`,
  COURSE_UPDATE_SINGLE_VALUE: (courseId: string) => `/api/courses/${courseId}`,
  COURSE_IMAGE_UPLOAD:"/api/courses/image-upload"
};



export const categoryUrls =  {
  GET_ALL_CATEGORIES: "/api/category",
}