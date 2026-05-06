"use client";

import React from "react";
import type { CourseWithAllObjects } from "@/shared/types/course.d";
import { useGetSingleCourse } from "../hooks/useCourse";
import ErrorPage from "@/shared/components/common/ErrorPage";
import { Spinner } from "@/shared/components/ui/spinner";
import CourseUpdate from "../components/CourseUpdate";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import Banner from "../components/Banner";
import CourseActions from "../components/CourseActions";

const CourseUpdatePage = ({ courseId }: { courseId: string }) => {
  const {
    data: SingleCourse,
    isPending: isSingleCoursePending,
    error: SingleCourseError,
    isError: isSingleCourseError,
  } = useGetSingleCourse(courseId);

  const courseData = SingleCourse?.data as CourseWithAllObjects;

  const requiredFields = [
    courseData?.title,
    courseData?.description,
    courseData?.price,
    courseData?.categoryId,
    courseData?.image,
    (courseData?.chapters ?? []).some((chapter) => chapter?.isPublished),
  ];

  const totalFields = requiredFields.length;

  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `(${completedFields} of ${totalFields})`;
  const isComplete = requiredFields.every(Boolean);

  return (
    <>
      {!courseData?.isPublished && (
        <Banner label="This course is unpublished. It will not be visible to the students." />
      )}

      <section aria-label="course-update-page">
        {/*-------------- heading --------- */}
        <section className=" flex justify-between mt-4">
          <div>
            <h2 className="  font-heading font-semibold text-xl text-slate-700">
              Course Setup
            </h2>
            <p className="   font-light text-xs text-slate-500 flex items-center gap-1">
              Complete All Fields{" "}
              {isSingleCoursePending ? <Spinner /> : completionText}
              {isComplete && (
                <span className=" text-green-400 ">
                  <IoMdCheckmarkCircleOutline size={18} />
                </span>
              )}
            </p>
          </div>
          {!isSingleCoursePending && courseData && (
            <CourseActions
              disabled={!isComplete}
              courseId={courseId}
              isPublished={courseData.isPublished}
            />
          )}
        </section>
        <section>
          {/*--------------- Error handleing ----------- */}
          {isSingleCourseError && (
            <ErrorPage message={SingleCourseError.message} />
          )}

          {/*---------------------------- Loading handling ------------- */}
          {!isSingleCourseError && isSingleCoursePending && (
            <div>Loading...</div>
          )}

          {!isSingleCourseError && !isSingleCoursePending && SingleCourse && (
            <CourseUpdate course={courseData as CourseWithAllObjects} />
          )}
        </section>
      </section>
    </>
  );
};

export default CourseUpdatePage;
