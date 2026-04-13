import {
  MdOutlineDashboard,
  MdOutlineInventory2,
  MdOutlineCategory,
  MdOutlineShoppingCart,
} from "react-icons/md";
import { IconType } from "react-icons";
import {
  Package,
  ShoppingCart,
  DollarSign,
  LayoutGrid,
} from "lucide-react";


type NavbarLinksProps = {
  id: number;
  name: string;
  link: string;
};

type AdminSidebarLinksProps = {
  id: number;
  name: string;
  link: string;
  icon: IconType;
};

export type DashboardDataProps = {
  id: number;
  title: string;
  value: string | number;
  icon: IconType;
  color: string;
}

export const NavbarLinks: NavbarLinksProps[] = [
  {
    id: 1,
    name: "Home",
    link: "/user",
  },
  {
    id: 2,
    name: "Menu",
    link: "/user/menu",
  },
  {
    id: 3,
    name: "Orders",
    link: "/user/orders",
  },
  {
    id: 4,
    name: "Contact",
    link: "/user/contact",
  },
];

export const AdminSidebarLinks: AdminSidebarLinksProps[] = [
  {
    id: 1,
    name: "Dashboard",
    link: "/admin",
    icon: MdOutlineDashboard,
  },
  {
    id: 2,
    name: "Products",
    link: "/admin/products",
    icon: MdOutlineInventory2, // 📦 products
  },
  {
    id: 3,
    name: "Categories",
    link: "/admin/categories",
    icon: MdOutlineCategory, // 🏷 categories
  },
  {
    id: 4,
    name: "Orders",
    link: "/admin/orders",
    icon: MdOutlineShoppingCart, // 🛒 orders
  },
];


export const DashboardData:DashboardDataProps[] = [
  {
    id: 1,
    title: "Total Products",
    value: 128,
    icon: Package,
    color: "bg-blue-100 text-blue-600",
  },
  {
    id: 2,
    title: "Total Orders",
    value: 542,
    icon: ShoppingCart,
    color: "bg-green-100 text-green-600",
  },
  {
    id: 3,
    title: "Total Revenue",
    value: "₹45,200",
    icon: DollarSign,
    color: "bg-yellow-100 text-yellow-600",
  },
  {
    id: 4,
    title: "Categories",
    value: 12,
    icon: LayoutGrid,
    color: "bg-purple-100 text-purple-600",
  },
];
