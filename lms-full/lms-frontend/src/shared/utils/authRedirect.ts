export const getRoleRedirectRoute = (role: string) => {
  switch (role) {
    case "USER":
      return "/user/dashboard";

    case "TEACHER":
      return "/teacher/courses";

    default:
      return "/login";
  }
};
