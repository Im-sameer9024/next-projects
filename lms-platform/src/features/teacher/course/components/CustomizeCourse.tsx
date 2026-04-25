"use client";

import { Button } from "@/shared/components/ui/button";
import { LayoutDashboard } from "lucide-react";
import type { Course } from "../../../../../generated/prisma/client";
import TitleForm from "./TitleForm";
import DescriptionForm from "./DescriptionForm";
import ImageForm from "./ImageForm";
import CategoryForm from "./CategoryForm";

const CustomizeCourse = ({ course }: { course: Course }) => {
  return (
    <div className="my-6 space-y-6 px-2 sm:px-4">
      {/* 🔹 Heading */}
      <div className="flex items-center gap-3">
        <Button
          className="rounded-full bg-lightBlue shrink-0"
          size={"icon-lg"}
          variant={"ghost"}
        >
          <LayoutDashboard className="text-btnBlue" />
        </Button>

        <span className="text-darkText font-smallHeading font-semibold text-base sm:text-lg">
          Customize Your Course
        </span>
      </div>

      {/* 🔹 Grid Layout */}
      <div className="grid grid-cols-1  gap-6 items-start max-w-xl">
        <TitleForm initialData={course} />
        <DescriptionForm initialData={course} />
        <ImageForm initialData={course} />
        <CategoryForm initialData={course}/>
      </div>
    </div>
  );
};

export default CustomizeCourse;