export const authApiEndpoints = {
  SIGNUP_USER: "/api/sign-up",
};

export const courseApiEndpoints = {
  GET_COURSES: "/api/courses",
  CREATE_COURSE: "/api/courses",
  GET_SINGLE_COURSE: (courseId: string) => `/api/courses/${courseId}`,
  UPDATE_SINGLE_VALUE_COURSE: (courseId: string) => `/api/courses/${courseId}`,
  DELETE_COURSE: (courseId: string) => `/api/courses/${courseId}`,
  PUBLISH_COURSE: (courseId: string) => `/api/courses/${courseId}/publish`,
  UNPUBLISH_COURSE: (courseId: string) => `/api/courses/${courseId}/unpublish`,
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
  DELETE_SINGLE_CHAPTER: (courseId: string, chapterId: string) =>
    `/api/courses/${courseId}/chapters/${chapterId}`,
  PUBLISH_CHAPTER: (courseId: string, chapterId: string) =>
    `/api/courses/${courseId}/chapters/${chapterId}/publish`,
  UNPUBLISH_CHAPTER: (courseId: string, chapterId: string) =>
    `/api/courses/${courseId}/chapters/${chapterId}/unpublish`,
  UPLOAD_VIDEO: "/api/mux/upload",
  SAVE_VIDEO: "/api/mux/save",
  DELETE_VIDEO: "/api/mux/delete",
};
