import CourseDetail from "@/features/search/components/CourseDetail";
import React from "react";

const CourseIdPage = async ({
  params,
}: {
  params: Promise<{
    courseId: string;
  }>;
}) => {
  const { courseId } = await params;

  return (
    <div>
      <CourseDetail courseId={courseId} />
    </div>
  );
};

export default CourseIdPage;
