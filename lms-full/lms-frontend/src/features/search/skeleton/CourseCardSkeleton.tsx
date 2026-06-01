"use client";

import React from "react";

import { Skeleton } from "@/shared/components/ui/skeleton";

const CourseCardSkeleton = () => {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* image */}
      <Skeleton className="aspect-video w-full rounded-none" />

      {/* content */}
      <div className="space-y-4 p-4">
        <div className="space-y-2">
          <Skeleton className="h-5 w-full" />

          <Skeleton className="h-5 w-3/4" />
        </div>

        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />

          <Skeleton className="h-4 w-5/6" />
        </div>

        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-24" />

          <Skeleton className="h-4 w-20" />
        </div>

        <div className="flex items-center justify-between pt-2">
          <Skeleton className="h-6 w-16" />

          <Skeleton className="h-8 w-24 rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default CourseCardSkeleton;
