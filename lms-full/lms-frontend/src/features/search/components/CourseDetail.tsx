/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";

import React from "react";

import { BookOpen, Clock3, Loader2, Trophy } from "lucide-react";

import ErrorPage from "@/shared/components/common/ErrorPage";

import { useBuyCourse, useGetSingleCourse } from "../hooks/useCourse";
import CustomButton from "@/shared/components/custom/CustomButton";
import { Spinner } from "@/shared/components/ui/spinner";
import { useAuthStore } from "@/shared/store/auth.store";

const CourseDetail = ({ courseId }: { courseId: string }) => {
  const { data, isPending, isError, error } = useGetSingleCourse(courseId);

  const { mutateAsync, isPending: isBuyPending } = useBuyCourse();
  const { user } = useAuthStore();
  // loading
  if (isPending) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-slate-500" />
      </div>
    );
  }

  // error
  if (isError) {
    return <ErrorPage message={error?.message || "Failed to load course"} />;
  }

  const course = data?.data;

  const totalChapters = course?.chapters?.length || 0;
  const isPurchased =
    course?.purchases?.some((purchase: any) => purchase.userId === user?.id) ?? false;

  const handleBuyCourse = async () => {
    try {
      const response = await mutateAsync(courseId);
      console.log(response);
      window.location.href = response.data;
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-6">
      {/* Hero */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Left */}
        <div className="space-y-5">
          <div>
            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
              ONLINE COURSE
            </span>
          </div>

          <h1 className="text-3xl leading-tight font-bold text-slate-900 md:text-4xl">
            {course?.title}
          </h1>

          <p className="text-base leading-relaxed text-slate-600">{course?.description}</p>

          {/* Stats */}
          <div className="flex flex-wrap items-center gap-5 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />

              <span>{totalChapters} Chapters</span>
            </div>

            <div className="flex items-center gap-2">
              <Clock3 className="h-4 w-4" />

              <span>Self-paced</span>
            </div>

            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />

              <span>Certificate Included</span>
            </div>
          </div>
        </div>

        {/* Right Image */}
        <div className="relative aspect-video overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 shadow-lg">
          <Image
            src={course?.image}
            alt={course?.title}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      </div>

      {/* purchase button */}
      <div className="flex flex-wrap gap-4">
        {isPurchased ? (
          <CustomButton
            onClick={() =>
              (window.location.href = `/courses/${courseId}/${course.chapters?.[0]?.id}`)
            }
          >
            Continue Learning
          </CustomButton>
        ) : (
          <CustomButton onClick={handleBuyCourse} disabled={isBuyPending}>
            {isBuyPending ? (
              <Spinner />
            ) : (
              <>
                <span>Enroll Now</span>
                <span>₹{course.price}</span>
              </>
            )}
          </CustomButton>
        )}
      </div>
    </div>
  );
};

export default CourseDetail;
