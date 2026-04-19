"use client";

import CustomButton from "@/shared/components/custom/CustomButton";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

const CoursesPage = () => {
  const router = useRouter();

  return (
    <div>
      <div>
        <CustomButton
          active={true}
          onClick={() => router.push("/teacher/courses/create")}
          leftIcon={<Plus />}
        >
          New Course
        </CustomButton>
      </div>
    </div>
  );
};

export default CoursesPage;
