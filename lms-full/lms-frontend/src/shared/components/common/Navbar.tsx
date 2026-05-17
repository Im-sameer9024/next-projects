import { useAuthStore } from "@/shared/store/auth.store";
import { RolesObject, teacherRoutes, userRoutes } from "@/shared/utils/data";
import { redirect, usePathname } from "next/navigation";
import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { LogOut, Menu } from "lucide-react";
import SidebarLink from "./SidebarLink";
import Logo from "./Logo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Logout } from "@/features/auth/apiOperations";
import { useQueryClient } from "@tanstack/react-query";

const Navbar = () => {
  const pathname = usePathname();

  const { user, isLoading, logout } = useAuthStore();

  const role = user?.role;

  const routes = role === RolesObject.teacher ? teacherRoutes : userRoutes;
  const queryClient = useQueryClient();

  const handleLogout = async () => {
    try {
      const res = await Logout();

      if (res.success) {
        logout();
        queryClient.clear();
        redirect("/login");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className=" bg-white py-4 px-4 border border-gray-200 flex justify-between items-center">
      {/*--------------------------- Mobile menu -------------------- */}
      <Sheet>
        <SheetTrigger asChild>
          <button className="md:hidden">
            <Menu />
          </button>
        </SheetTrigger>

        <SheetContent side="left" className="w-56 p-0">
          <SheetHeader className="sr-only">
            <SheetTitle>Mobile Navigation Menu</SheetTitle>
          </SheetHeader>
          <div className="px-4 py-4 border-b border-gray-200 flex items-center gap-2">
            <Logo />
            <span className="font-semibold">LMS</span>
          </div>

          <div className="flex flex-col gap-2 p-3">
            {routes.map((link) => (
              <SidebarLink
                key={link.id}
                data={link}
                pathname={pathname}
                isCollapsed={false}
                isMobile={true}
              />
            ))}
          </div>
        </SheetContent>
      </Sheet>

      {/* ---------------- LEFT SIDE ---------------- */}
      {/* {isSearchPage && (
        <div className=" hidden md:block">
          <SearchInput />
        </div>
      )} */}

      {/* ---------------- RIGHT SIDE ---------------- */}
      <div className="flex gap-2 ml-auto ">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            {isLoading ? (
              <div className="w-9 h-9 bg-gray-200 animate-pulse rounded-full" />
            ) : user ? (
              <Avatar className="h-9 w-9 border cursor-pointer">
                <AvatarImage src={user.avatar || ""} alt="User" />
                <AvatarFallback>
                  {user?.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase() ||
                    user?.email?.charAt(0).toUpperCase() ||
                    "U"}
                </AvatarFallback>
              </Avatar>
            ) : null}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {/* Logout */}
            <DropdownMenuItem
              onClick={handleLogout}
              className="text-red-500 cursor-pointer"
            >
              <LogOut size={16} className="mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <div>
          {isLoading ? (
            <span>Loading...</span>
          ) : (
            <div className=" -space-y-2">
              <p className=" text-sm">{user?.email as string}</p>
              <span className=" text-gray-400 text-xs">{role}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
