export const authApiEndpoints = {
  SIGNUP_USER: "/auth/signup",
  LOGIN_USER: "/auth/login",
  LOGOUT_USER: "/auth/logout",
};

export const courseApiEndpoints = {
  //-------------api url for teachers------------
  CREATE_COURSE: "/course/create",
  GET_COURSES_OF_TEACHER: "/course/all",
  GET_SINGLE_COURSE_BY_TEACHER_ID: (courseId: string) => `/course/${courseId}`,
  UPDATE_COURSE_BY_TEACHER: (courseId: string) => `/course/update/${courseId}`,
  UPLOAD_IMAGE: "/course/upload-image",
  DELETE_COURSE_BY_TEACHER: (courseId: string) => `/course/delete/${courseId}`,
  PUBLISH_COURSE: (courseId: string) => `/course/publish/${courseId}`,
  UNPUBLISH_COURSE: (courseId: string) => `/course/unpublish/${courseId}`,
  GET_ANALYTICS_OF_TEACHER:"/course/analytics",

  //-------------api url for user------------
  GET_ALL_COURSES_OF_USER: "/course/user/all-courses",
  GET_PROGRESS_OF_COURSE: "/course/get-progress",
  GET_SINGLE_COURSE_OF_USER: (courseId: string) => `/course/user/${courseId}`,
  BUY_COURSE: (courseId: string) => `/stripe/orders/${courseId}`,
  DASHBOARD_DATA:"/course/user/dashboard-data",

  // ---------------  ai base api------------
  GENERATE_TITLES: "/course/ai/title",
  GENERATE_DESCRIPTION: "/course/ai/description",
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

  PUBLISH_CHAPTER: "/chapter/publish",
  UNPUBLISH_CHAPTER: "/chapter/unpublish",
  GENERATE_DESCRIPTION: "/chapter/ai/description",

  COMPLETE_CHAPTER_BY_USER: "/chapter/user/complete",

  GET_SINGLE_CHAPTER_OF_USER: (chapterId: string) => `/chapter/user/${chapterId}`,

  GET_CHAPTERS_BY_COURSE_ID: (courseId: string) => `/chapter/${courseId}`,
  DELETE_CHAPTER_BY_TEACHER: (chapterId: string) => `/chapter/delete/${chapterId}`,
};
