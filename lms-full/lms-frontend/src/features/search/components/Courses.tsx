"use client";

import React from "react";

import { Course } from "@/features/courses/course";

import CourseCard from "./CourseCard";
import CourseCardSkeleton from "../skeleton/CourseCardSkeleton";

const Courses = ({
  courses,
  loading,
}: {
  courses: Course[];

  loading: boolean;
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <CourseCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  // empty
  if (!courses?.length) {
    return (
      <div className="flex min-h-75 flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50">
        <span className="text-4xl">📚</span>

        <h3 className="mt-3 text-lg font-semibold text-slate-700">No courses found</h3>

        <p className="mt-1 text-sm text-slate-500">Try changing your filters or search</p>
      </div>
    );
  }

  return (
    <section className="grid grid-cols-1 gap-6 py-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </section>
  );
};

export default Courses;
