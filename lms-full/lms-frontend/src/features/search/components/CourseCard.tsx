"use client";

import Image from "next/image";

import Link from "next/link";

import React from "react";

import { BookOpen, Clock3 } from "lucide-react";

import { Course } from "@/features/courses/course";

import { useGetCourseProgress } from "../hooks/useCourse";

import { Progress } from "@/shared/components/ui/progress";

const CourseCard = ({ course }: { course: Course }) => {
  const { data, isPending } = useGetCourseProgress(course?.id);

  const progress = data?.data;

  return (
    <Link
      href={`/courses/${course.id}`}
      className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
    >
      {/* Image */}
      <div className="relative aspect-video overflow-hidden bg-slate-100">
        <Image
          src={course?.image as string}
          alt={course.title}
          fill
          sizes="(max-width: 768px) 100vw,
                 (max-width: 1200px) 50vw,
                 25vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className="space-y-3 p-4">
        {/* Title */}
        <h3 className="line-clamp-2 text-base font-semibold text-slate-800 transition-colors group-hover:text-blue-600">
          {course.title}
        </h3>

        {/* Description */}
        <p className="line-clamp-2 text-sm text-slate-500">{course?.category?.name}</p>

        {/* Meta */}
        <div className="flex items-center justify-between text-sm text-slate-500">
          <div className="flex items-center gap-1">
            <BookOpen className="h-4 w-4" />

            <span>{course.chapters?.length || 0} chapters</span>
          </div>

          <div className="flex items-center gap-1">
            <Clock3 className="h-4 w-4" />

            <span>Self-paced</span>
          </div>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500">
            <span>{progress === 100 ? "Completed" : "Progress"}</span>

            <span>{progress}%</span>
          </div>

          {isPending ? (
            <div className="h-2 w-full animate-pulse rounded-full bg-slate-200" />
          ) : (
            <Progress
            value={progress}
            className="h-2"
            indicatorClassName={progress === 100 ? "bg-emerald-500" : "bg-blue-500"}
          />
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-100 pt-3">
          <span className="text-lg font-bold text-slate-900">₹{course.price}</span>

          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
            {progress > 0 ? "Continue" : "View Course"}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
