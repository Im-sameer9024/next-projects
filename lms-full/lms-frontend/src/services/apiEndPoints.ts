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
  UPLOAD_IMAGE:"/course/upload-image",

  // ---------------  ai base api------------
  GENERATE_TITLES: "/course/ai/title",
};


export const categoryApiEndpoints = {
  GET_ALL_CATEGORIES: "/category/get-all-categories",
}
