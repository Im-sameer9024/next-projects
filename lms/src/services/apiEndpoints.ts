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
