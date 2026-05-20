export const authApiEndpoints = {
  SIGNUP_USER: "/auth/signup",
  LOGIN_USER: "/auth/login",
  LOGOUT_USER: "/auth/logout",
};

export const courseApiEndpoints = {
  //-------------api url for teachers------------
  CREATE_COURSE: "/course/create",
  GET_SINGLE_COURSE_BY_TEACHER_ID: (courseId: string) => `/course/${courseId}`,
  UPDATE_COURSE_BY_TEACHER: (courseId: string) => `/course/update/${courseId}`,
  UPLOAD_IMAGE: "/course/upload-image",

  // ---------------  ai base api------------
  GENERATE_TITLES: "/course/ai/title",
};

export const categoryApiEndpoints = {
  GET_ALL_CATEGORIES: "/category/get-all-categories",
};

export const attachmentApiEndpoints = {
  CREATE_ATTACHMENT: "/attachment/create",
  DELETE_ATTACHMENT: "/attachment/delete",
};

export const chapterApiEndpoints = {
  CREATE_CHAPTER: "/chapter/create",
  UPDATE_CHAPTER: "/chapter/update",
  DELETE_CHAPTER: "/chapter/delete",
  GET_CHAPTER_BY_ID: (chapterId: string) => `/chapter/get/${chapterId}`,

  UPLOAD_VIDEO: "/chapter/mux/upload",
  SAVE_VIDEO: "/chapter/mux/save-video",
  DELETE_VIDEO: "/chapter/mux/delete-video",

  PUBLISH_CHAPTER:"/chapter/publish",
  UNPUBLISH_CHAPTER:"/chapter/unpublish",

  GET_CHAPTERS_BY_COURSE_ID: (courseId: string) => `/chapter/${courseId}`,
  DELETE_CHAPTER_BY_TEACHER: (chapterId: string) =>
    `/chapter/delete/${chapterId}`,
};
