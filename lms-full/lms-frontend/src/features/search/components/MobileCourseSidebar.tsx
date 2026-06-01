"use client";

import { Menu } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
  SheetHeader,
} from "@/shared/components/ui/sheet";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import CourseSidebar from "./CourseSidebar";

const MobileCourseSidebar = ({ courseId }: { courseId: string }) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="rounded-md border p-2">
          <Menu className="h-5 w-5" />
        </button>
      </SheetTrigger>

      <SheetContent side="left" className="w-[320px] p-0">
        <SheetHeader>
          <VisuallyHidden>
            <SheetTitle>Course Content</SheetTitle>
          </VisuallyHidden>
        </SheetHeader>
        <CourseSidebar courseId={courseId} />
      </SheetContent>
    </Sheet>
  );
};

export default MobileCourseSidebar;
