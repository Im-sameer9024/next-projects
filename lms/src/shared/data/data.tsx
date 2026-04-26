import { BarChart, Compass, LayoutDashboard, List } from "lucide-react";
import { JSX } from "react";

type roleProps = {
  user: string;
  teacher: string;
};

export const Roles: roleProps = {
  user: "USER",
  teacher: "TEACHER",
};
export const actualRoles = Object.values(Roles);



export type RoutesProps = {
  id: number;
  text: string;
  icon: JSX.Element;
  link: string;
};

export const guestRoutes: RoutesProps[] = [
  {
    id: 1,
    text: "Dashboard",
    icon: <LayoutDashboard/>,
    link: "/",
  },
  {
    id: 2,
    text: "Browse",
    icon: <Compass/>,
    link: "/search",
  },
];


export const teacherRoutes :RoutesProps[]= [
  {
    id: 1,
    text: "Courses",
    icon: <List/>,
    link: "/teacher/courses",
  },
  {
    id: 2,
    text: "Analytics",
    icon: <BarChart/>,
    link: "/teacher/analytics",
  },
]