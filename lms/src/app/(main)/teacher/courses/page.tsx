import CustomButton from "@/shared/components/custom/CustomButton";
import { Plus } from "lucide-react";
import Link from "next/link";
import React from "react";

const CoursesPage = () => {
  return (
    <div>
      <CustomButton
        leftIcon={<Plus />}
        className=" bg-blue-500 hover:bg-blue-600"
      >
        <Link href={"/teacher/courses/create"}>New Course</Link>
      </CustomButton>
    </div>
  );
};

export default CoursesPage;
