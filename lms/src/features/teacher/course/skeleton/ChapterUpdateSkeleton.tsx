import { Skeleton } from "@/shared/components/ui/skeleton";

const ChapterUpdateSkeleton = () => {
  return (
    <>
      {/* back link */}
      <div className="w-fit mt-4">
        <Skeleton className="h-5 w-40" />
      </div>

      {/* heading row */}
      <section className="mt-4 flex justify-between">
        <div className="space-y-2">
          <Skeleton className="h-6 w-36" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="h-9 w-24 rounded-md" />
      </section>

      {/* two-column body */}
      <section className="mt-10 w-full grid grid-cols-2 gap-14">
        {/* Left column */}
        <section className="space-y-8">
          {/* Customize chapter */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-4 w-44" />
            </div>
            {Array.from({ length: 2 }).map((_, i) => (
              <div
                key={i}
                className="rounded-xl border border-slate-200 bg-white p-5 space-y-3 shadow-sm"
              >
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
            ))}
          </div>

          {/* Access settings */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-4 w-32" />
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-3 shadow-sm">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
          </div>
        </section>

        {/* Right column — video */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-4 w-28" />
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <Skeleton className="h-52 w-full rounded-md" />
          </div>
        </section>
      </section>
    </>
  );
};

export default ChapterUpdateSkeleton;
