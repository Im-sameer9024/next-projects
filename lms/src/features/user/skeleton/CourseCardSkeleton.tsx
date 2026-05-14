import { Skeleton } from "@/shared/components/ui/skeleton";

const CourseCardSkeleton = () => {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* image */}
      <Skeleton className="w-full h-52 rounded-none" />

      {/* content */}
      <div className="p-4 space-y-4">
        {/* title */}
        <div className="space-y-2">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-1/3" />
        </div>

        {/* chapter count */}
        <Skeleton className="h-4 w-24" />

        {/* price */}
        <Skeleton className="h-7 w-16" />
      </div>
    </div>
  );
};

export default CourseCardSkeleton;
