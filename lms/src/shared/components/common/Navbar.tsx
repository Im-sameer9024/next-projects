"use client";

import { LogOut, Menu } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "../ui/sheet";
import Logo from "./Logo";
import SidebarLink from "./SidebarLink";
import { usePathname } from "next/navigation";
import { guestRoutes, teacherRoutes, Roles } from "@/shared/data/data";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const Navbar = () => {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const role = session?.user?.role;


  const routes = role === Roles.teacher ? teacherRoutes : guestRoutes;

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/sign-in" });
  };

  return (
    <div className="bg-white py-4 px-4 border border-gray-200 flex justify-between items-center">
      {/* ---------------- MOBILE MENU ---------------- */}
      <Sheet>
        <SheetTrigger asChild>
          <button className="md:hidden">
            <Menu />
          </button>
        </SheetTrigger>

        <SheetContent side="left" className="w-56 p-0">
          <div className="px-4 py-4 border-b border-gray-200 flex items-center gap-2">
            <Logo />
            <span className="font-semibold">LMS</span>
          </div>

          <div className="flex flex-col gap-2 p-3">
            {routes.map((link) => (
              <SheetClose asChild key={link.id}>
                <SidebarLink
                  data={link}
                  pathname={pathname}
                  isCollapsed={false}
                />
              </SheetClose>
            ))}
          </div>
        </SheetContent>
      </Sheet>

      {/* ---------------- RIGHT SIDE ---------------- */}
      <div className="flex gap-2 ml-auto ">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            {status === "loading" ? (
              <div className="w-9 h-9 bg-gray-200 animate-pulse rounded-full" />
            ) : (
              <Avatar className="h-9 w-9 border cursor-pointer">
                <AvatarImage src={session?.user?.image || ""} alt="User" />
                <AvatarFallback>
                  {session?.user?.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase() ||
                    session?.user?.email?.charAt(0).toUpperCase() ||
                    "U"}
                </AvatarFallback>
              </Avatar>
            )}
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
          {status === "loading" ? (
            <span>Loading...</span>
          ) : (
            <div className=" -space-y-2">
              <p className=" text-sm">{session?.user.email as string}</p>
              <span className=" text-gray-400 text-xs">{role}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
