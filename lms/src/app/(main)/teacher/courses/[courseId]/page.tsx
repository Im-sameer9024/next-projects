import CourseUpdatePage from "@/features/teacher/course/pages/CourseUpdatePage";
import React from "react";

const SingleCoursePage = async ({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) => {
  const { courseId } = await params;

  return (
    <>
      <CourseUpdatePage courseId={courseId} />
    </>
  );
};

export default SingleCoursePage;
