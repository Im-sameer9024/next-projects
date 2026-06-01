/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { CheckCircle2, CirclePlay, Lock } from "lucide-react";

import ErrorPage from "@/shared/components/common/ErrorPage";
import { Progress } from "@/shared/components/ui/progress";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useGetCourseProgress, useGetSingleCourse } from "../hooks/useCourse";

import { cn } from "@/shared/lib/utils";
import { Separator } from "@/shared/components/ui/separator";
import { useAuthStore } from "@/shared/store/auth.store";
import { Chapter } from "@/features/chapter/chapter";
import CustomButton from "@/shared/components/custom/CustomButton";

const CourseSidebar = ({ courseId }: { courseId: string }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuthStore();

  const {
    data: courseData,
    isPending: coursePending,
    isError: courseError,
    error: courseErrorMessage,
  } = useGetSingleCourse(courseId);

  const {
    data: courseProgress,
    isPending: progressPending,
    isError: progressError,
    error: progressErrorMessage,
  } = useGetCourseProgress(courseId);

  const BackToHome = () => {
    router.push("/user/search");
  };

  // Loading Skeleton
  if (coursePending || progressPending) {
    return (
      <aside className="flex h-full w-full flex-col border-r border-slate-200 bg-white">
        <div className="px-5 py-6">
          <div className="h-8 w-48 animate-pulse rounded bg-slate-200" />

          <div className="mt-6 h-2 w-full animate-pulse rounded bg-slate-200" />
        </div>

        <Separator />

        <div className="space-y-3 p-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="flex items-center gap-3 rounded-xl p-3">
              <div className="h-8 w-8 animate-pulse rounded-full bg-slate-200" />

              <div className="flex-1">
                <div className="h-4 w-32 animate-pulse rounded bg-slate-200" />

                <div className="mt-2 h-3 w-16 animate-pulse rounded bg-slate-100" />
              </div>
            </div>
          ))}
        </div>
      </aside>
    );
  }

  // Error
  if (courseError || progressError) {
    return (
      <ErrorPage
        message={
          courseErrorMessage?.message || progressErrorMessage?.message || "Failed to load course"
        }
      />
    );
  }

  const course = courseData?.data;
  const progress = courseProgress?.data ?? 0;

  const chapters = course?.chapters ?? [];

  const isPurchased =
    course?.purchases?.some((purchase: any) => purchase.userId === user?.id) ?? false;

  console.log("purchases", isPurchased);

  return (
    <aside className="flex h-full flex-col border-r border-slate-200 bg-white">
      {/* Header */}
      <div className="sticky top-0 z-20 border-b border-slate-200 bg-white px-5 py-6">
        <h2 className="line-clamp-2 text-xl leading-snug font-semibold text-slate-800">
          {course?.title}
        </h2>

        <div className="mt-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500">Progress</span>

            <span className="text-sm font-medium text-slate-700">{progress}%</span>
          </div>

          <Progress
            value={progress}
            className="h-2"
            indicatorClassName={progress === 100 ? "bg-emerald-500" : "bg-blue-500"}
          />
          <CustomButton onClick={BackToHome} leftIcon={<FaArrowLeftLong />}>
            Back
          </CustomButton>
        </div>
      </div>

      {/* Chapters */}
      <div className="flex-1 overflow-y-auto py-3">
        {chapters.map((chapter: Chapter, index: number) => {
          const href = `/courses/${courseId}/${chapter.id}`;

          const isActive = pathname === href;

          const isLocked = !isPurchased && !chapter.isFree;

          const isCompleted =
            chapter.userProgresses?.some(
              (progress) =>
                progress.userId === user?.id &&
                progress.chapterId === chapter.id &&
                progress.isCompleted,
            ) ?? false;
          const content = (
            <>
              {/* Icon */}
              <div className="mt-0.5">
                {isCompleted ? (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  </div>
                ) : (
                  <div
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full",
                      isActive ? "bg-blue-100" : "bg-slate-100",
                    )}
                  >
                    {isLocked ? (
                      <Lock className="h-4 w-4 text-slate-400" />
                    ) : (
                      <CirclePlay
                        className={cn("h-4 w-4", isActive ? "text-blue-600" : "text-slate-500")}
                      />
                    )}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col">
                <span
                  className={cn(
                    "line-clamp-2 text-sm font-medium",
                    isCompleted
                      ? "text-emerald-700"
                      : isLocked
                        ? "text-slate-400"
                        : isActive
                          ? "text-blue-700"
                          : "text-slate-700",
                  )}
                >
                  {index + 1}. {chapter.title}
                </span>

                <div className="mt-1 flex items-center gap-2">
                  {isCompleted ? (
                    <span className="text-xs font-medium text-emerald-600">Completed</span>
                  ) : isLocked ? (
                    <span className="text-xs font-medium text-amber-600">Locked</span>
                  ) : (
                    <span className="text-xs text-slate-400">Incomplete</span>
                  )}

                  {chapter.isFree && (
                    <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-600">
                      FREE
                    </span>
                  )}
                </div>
              </div>

              {isLocked && <Lock className="mt-1 h-4 w-4 text-slate-300" />}
            </>
          );

          if (isLocked) {
            return (
              <div
                key={chapter.id}
                className="mx-3 mb-2 flex cursor-not-allowed items-start gap-3 rounded-xl border border-transparent bg-slate-50 px-4 py-1 opacity-80"
              >
                {content}
              </div>
            );
          }

          return (
            <Link
              key={chapter.id}
              href={href}
              className={cn(
                "group mx-3 mb-2 flex items-start gap-3 rounded-xl border px-4 py-1 transition-all duration-200",
                isActive
                  ? "border-blue-200 bg-blue-50 shadow-sm"
                  : "border-transparent hover:border-slate-200 hover:bg-slate-50",
              )}
            >
              {content}
            </Link>
          );
        })}
      </div>
    </aside>
  );
};

export default CourseSidebar;
