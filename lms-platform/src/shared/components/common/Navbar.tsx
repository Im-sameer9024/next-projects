"use client";

import React from "react";
import { LogOut, Menu } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetTitle,
  SheetDescription,
} from "../ui/sheet";
import Logo from "./Logo";
import SidebarLink from "./SidebarLink";
import { usePathname } from "next/navigation";
import Link from "next/link";
import CustomButton from "../custom/CustomButton";
import { guestRoutes } from "@/shared/data/data";
import { Button } from "../ui/button";

const Navbar = () => {
  const pathname = usePathname();

  const isTeacherPage = pathname?.startsWith("/teacher");
  const isPlayerPage = pathname?.includes("/chapter");

  return (
    <div className="bg-white py-4 px-4 border-b border-gray-200 flex justify-between items-center">
      {/* ---------------- MOBILE MENU ---------------- */}
      <Sheet>
        <SheetTrigger asChild>
          <button className="md:hidden">
            <Menu className="cursor-pointer" />
          </button>
        </SheetTrigger>

        <SheetContent side="left" className="w-40 p-0 flex flex-col  ">
          <VisuallyHidden>
            <SheetTitle>Navigation Menu</SheetTitle>
            <SheetDescription>there is a description</SheetDescription>
          </VisuallyHidden>

          {/* LOGO */}
          <div className=" px-4 flex items-center gap-2 py-4 border-b border-gray-200">
            <Logo />
            <span className="font-semibold text-darkText">LMS Platform</span>
          </div>
          {/* LINKS */}
          <div className="flex flex-col gap-2 p-3">
            {guestRoutes.map((link) => (
              <SheetClose asChild key={link?.id}>
                <SidebarLink
                  data={link}
                  pathname={pathname}
                  isCollapsed={false} // always expanded in mobile
                />
              </SheetClose>
            ))}
          </div>
        </SheetContent>
      </Sheet>

      {/* ---------------- USER ---------------- */}
      <div className=" flex gap-x-2 ml-auto mr-2">
        {isTeacherPage || isPlayerPage ? (
          <Link href={"/"}>
            <Button variant="ghost" size="sm">
              <LogOut/>
              Exit
            </Button>
          </Link>
        ) : (
          <Link href={"/teacher/courses"}>
            <Button variant={"ghost"} size="sm">
              Teacher mode
            </Button>
          </Link>
        )}
      </div>
      <UserButton afterSwitchSessionUrl="/" />
    </div>
  );
};

export default Navbar;
