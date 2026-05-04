export const authApiEndpoints = {
  SIGNUP_USER: "/api/sign-up",
};

export const courseApiEndpoints = {
  GET_COURSES: "/api/courses",
  CREATE_COURSE: "/api/courses",
  GET_SINGLE_COURSE: (courseId: string) => `/api/courses/${courseId}`,
  UPDATE_SINGLE_VALUE_COURSE: (courseId: string) => `/api/courses/${courseId}`,
  UPLOAD_IMAGE: "/api/courses/image-upload",
};

export const categoryApiEndpoints = {
  GET_CATEGORIES: "/api/category",
};

export const attachmentApiEndpoints = {
  UPLOAD_ATTACHMENT: "/api/attachment/attachment-upload",
  CREATE_ATTACHMENT: "/api/attachment",
  DELETE_ATTACHMENT: (attachmentId: string) =>
    `/api/attachment/${attachmentId}`,
};

export const chapterApiEndpoints = {
  CREATE_CHAPTER: (courseId: string) => `/api/courses/${courseId}/chapters`,
  GET_SINGLE_CHAPTER: (courseId: string, chapterId: string) =>
    `/api/courses/${courseId}/chapters/${chapterId}`,
  UPDATE_SINGLE_CHAPTER: (courseId: string, chapterId: string) =>
    `/api/courses/${courseId}/chapters/${chapterId}`,
  UPLOAD_VIDEO: "/api/mux/upload",
  SAVE_VIDEO: "/api/mux/save",
  DELETE_VIDEO: "/api/mux/delete",
};
