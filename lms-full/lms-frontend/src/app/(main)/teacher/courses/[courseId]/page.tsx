import CourseUpdatePage from "@/features/courses/pages/CourseUpdatePage";
import React from "react";

const SingleCourse = async ({
  params,
}: {
  params: Promise<{
    courseId: string;
  }>;
}) => {
  const { courseId } = await params;

  return (
    <>
      <CourseUpdatePage courseId={courseId} />
    </>
  );
};

export default SingleCourse;
