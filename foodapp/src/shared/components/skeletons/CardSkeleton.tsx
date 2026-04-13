"use client";

import { Skeleton } from "@/shared/components/ui/skeleton";


const CardSkeleton = () => {
  return (
    <div className="relative h-64 rounded-xl overflow-hidden">
      {/* Background */}
      <Skeleton className="absolute inset-0 w-full h-full" />

      {/* Content */}
      <div className="absolute z-10 p-6 space-y-3 w-[60%]">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-8 w-24 rounded-md" />
      </div>

      {/* Image */}
      <div className="absolute right-4 bottom-4 w-32 h-32">
        <Skeleton className="w-full h-full rounded-full" />
      </div>
    </div>
  );
};

export default CardSkeleton;