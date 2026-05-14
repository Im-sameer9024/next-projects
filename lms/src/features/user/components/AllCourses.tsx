/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useRef } from "react";

import { useGetAllCourses } from "@/features/teacher/course/hooks/useCourse";
import CourseCard from "./CourseCard";
import CourseCardSkeleton from "../skeleton/CourseCardSkeleton";

const AllCourses = () => {
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const {
    data,

    fetchNextPage,

    hasNextPage,

    isFetchingNextPage,

    isPending,

    isError,

    error,
  } = useGetAllCourses();

  // flatten all pages
  const courses = data?.pages.flatMap((page) => page.data) || [];

  const progress = data?.pages.flatMap((page) => page.progress) || [];

  const getProgress = (courseId: string) => {
    const course = progress.find((course) => course.courseId === courseId);
    console.log(course);
    return course?.progress;
  };

  // intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      },
      {
        threshold: 1,
      },
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage]);

  // loading
  if (isPending) {
    return (
      <div className="grid grid-cols-3 gap-4 p-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <CourseCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  // error
  if (isError) {
    return <div>{(error as Error).message}</div>;
  }

  return (
    <section className="space-y-4 p-4">
      {/* courses */}
      <div className=" grid grid-cols-3 gap-4">
        {courses.map((course: any) => {
        return (
          <CourseCard
            key={course.id}
            course={course}
            progress={getProgress(course.id)}
          />
        );
      })}
      </div>

      {/* infinite scroll trigger */}
      <div ref={loadMoreRef} />

      {/* loading next page */}
      {isFetchingNextPage && (
        <div className="grid grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <CourseCardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* no more courses */}
      {!hasNextPage && (
        <div className="text-center text-sm text-gray-500 py-4">
          No more courses
        </div>
      )}
    </section>
  );
};

export default AllCourses;
