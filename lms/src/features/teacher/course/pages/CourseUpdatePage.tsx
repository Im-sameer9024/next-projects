"use client";

import React from "react";
import type { CourseWithAttachments } from "@/shared/types/course.d";
import { useGetSingleCourse } from "../hooks/useCourse";
import ErrorPage from "@/shared/components/common/ErrorPage";
import { Spinner } from "@/shared/components/ui/spinner";
import CourseUpdate from "../components/CourseUpdate";

const CourseUpdatePage = ({ courseId }: { courseId: string }) => {
  const {
    data: SingleCourse,
    isPending: isSingleCoursePending,
    error: SingleCourseError,
    isError: isSingleCourseError,
  } = useGetSingleCourse(courseId);

  const courseData = SingleCourse?.data;


  const requiredFields = [
    courseData?.title,
    courseData?.description,
    courseData?.price,
    courseData?.categoryId,
    courseData?.image,
  ];

  const totalFields = requiredFields.length;

  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `(${completedFields} / ${totalFields})`;

  return (
    <section aria-label="course-update-page">
      {/*-------------- heading --------- */}
      <section>
        <h2 className=" font-heading font-semibold text-xl text-slate-700">
          Course Setup
        </h2>
        <p className=" font-light text-xs text-slate-500 flex items-center gap-1">
          Complete All Fields{" "}
          {isSingleCoursePending ? <Spinner /> : completionText}
        </p>
      </section>
      <section>
        {/*--------------- Error handleing ----------- */}
        {isSingleCourseError && (
          <ErrorPage message={SingleCourseError.message} />
        )}

        {/*---------------------------- Loading handling ------------- */}
        {!isSingleCourseError && isSingleCoursePending && <div>Loading...</div>}

        {!isSingleCourseError && !isSingleCoursePending && SingleCourse && (
          <CourseUpdate course={courseData as CourseWithAttachments} />
        )}
      </section>
    </section>
  );
};

export default CourseUpdatePage;
