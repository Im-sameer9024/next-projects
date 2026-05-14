"use client";

import { Chapter, Course, Purchase, UserProgress } from "@/generated/prisma/client";

import { BookOpen, Lock, Trophy } from "lucide-react";

import React from "react";

import CourseSidebarItem from "./CourseSidebarItem";

import { CustomProgress } from "@/shared/components/custom/CustomProgress";

interface CourseSidebarProps {
  course: Course & {
    chapters: (Chapter & {
      userProgresses: UserProgress[];
    })[];
  };

  progressCount: number;

  purchase?: Purchase;
}

const CourseSidebar = ({ course, progressCount, purchase }: CourseSidebarProps) => {
  const isPurchased = !!purchase;

  return (
    <aside className="flex h-full flex-col overflow-y-auto border-r border-slate-200 bg-white/95 backdrop-blur-xl">
      {/* ---------------- HEADER ---------------- */}
      <div className="space-y-5 border-b border-slate-100 p-6">
        {/* course title */}
        <div className="space-y-2">
          <h2 className="line-clamp-2 text-2xl leading-tight font-bold text-slate-800">
            {course.title}
          </h2>

          <p className="text-sm text-slate-500">Master your skills step by step</p>
        </div>

        {/* meta */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <BookOpen className="h-4 w-4 text-blue-500" />

            <span>{course.chapters.length} Chapters</span>
          </div>

          {isPurchased && (
            <div className="flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
              <Trophy className="h-3 w-3" />
              Purchased
            </div>
          )}
        </div>

        {/* progress */}
        {isPurchased ? (
          <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-600">Course Progress</span>

              <span className="text-sm font-bold text-blue-600">{Math.round(progressCount)}%</span>
            </div>

            <CustomProgress value={progressCount} />
          </div>
        ) : (
          <div className="space-y-2 rounded-2xl border border-amber-200 bg-amber-50 p-4">
            <div className="flex items-center gap-2 text-amber-700">
              <Lock className="h-4 w-4" />

              <span className="text-sm font-medium">Preview Mode</span>
            </div>

            <p className="text-xs leading-relaxed text-amber-600">
              Purchase the course to unlock all chapters and resources.
            </p>
          </div>
        )}
      </div>

      {/* ---------------- CHAPTERS ---------------- */}
      <div className="flex-1 py-6">
        <div className="mb-4 px-6">
          <p className="text-xs font-semibold tracking-[0.2em] text-slate-400 uppercase">
            Course Content
          </p>
        </div>

        <div className="space-y-1 px-2">
          {course.chapters.map((chapter, index) => (
            <CourseSidebarItem
              key={chapter.id}
              id={chapter.id}
              label={chapter.title}
              isCompleted={chapter?.userProgresses?.[0]?.isCompleted || false}
              courseId={course.id}
              isLocked={!chapter.isFree && !isPurchased}
              index={index + 1}
            />
          ))}
        </div>
      </div>

      {/* ---------------- FOOTER ---------------- */}
      <div className="border-t border-slate-100 p-5">
        <div className="text-center text-xs text-slate-400">Learn consistently every day 🚀</div>
      </div>
    </aside>
  );
};

export default CourseSidebar;
