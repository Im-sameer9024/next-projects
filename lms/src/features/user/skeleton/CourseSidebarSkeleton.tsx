import { Skeleton } from "@/shared/components/ui/skeleton";

const CourseSidebarSkeleton = () => {
  return (
    <aside className="flex h-full flex-col overflow-y-auto border-r border-slate-200 bg-white/95 backdrop-blur-xl">
      {/* Header */}
      <div className="space-y-5 border-b border-slate-100 p-6">
        <div className="space-y-2">
          <Skeleton className="h-7 w-3/4" />
          <Skeleton className="h-7 w-1/2" />
          <Skeleton className="h-4 w-48" />
        </div>

        <div className="flex items-center gap-4">
          <Skeleton className="h-4 w-24" />
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-10" />
          </div>
          <Skeleton className="h-2 w-full rounded-full" />
        </div>
      </div>

      {/* Chapters list */}
      <div className="flex-1 py-6">
        <div className="mb-4 px-6">
          <Skeleton className="h-3 w-28" />
        </div>
        <div className="space-y-1 px-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-3 rounded-lg px-4 py-3"
            >
              <Skeleton className="h-5 w-5 rounded-full flex-shrink-0" />
              <Skeleton
                className="h-4 rounded"
                style={{ width: `${60 + (i % 3) * 15}%` }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-slate-100 p-5">
        <Skeleton className="h-3 w-40 mx-auto" />
      </div>
    </aside>
  );
};

export default CourseSidebarSkeleton;
