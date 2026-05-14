import { Skeleton } from "@/shared/components/ui/skeleton";
import CourseCardSkeleton from "./CourseCardSkeleton";

const CourseGridSkeleton = ({ count = 6 }: { count?: number }) => {
  return (
    <section className="space-y-4 p-4">
      {/* Category row skeleton */}
      <div className="flex gap-3 overflow-x-auto py-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-36 rounded-full flex-shrink-0" />
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-3 gap-4">
        {Array.from({ length: count }).map((_, i) => (
          <CourseCardSkeleton key={i} />
        ))}
      </div>
    </section>
  );
};

export default CourseGridSkeleton;
