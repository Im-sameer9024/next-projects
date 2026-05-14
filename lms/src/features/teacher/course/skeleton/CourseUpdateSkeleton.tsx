import { Skeleton } from "@/shared/components/ui/skeleton";

const CourseUpdateSkeleton = () => {
  return (
    <>
      {/* ---- heading row ---- */}
      <section className="flex justify-between mt-4">
        <div className="space-y-2">
          <Skeleton className="h-6 w-36" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="h-9 w-24 rounded-md" />
      </section>

      {/* ---- two-column body ---- */}
      <section className="mt-10 w-full grid grid-cols-2 gap-14">
        {/* Left column */}
        <section className="space-y-4">
          {/* section header */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-4 w-40" />
          </div>

          {/* form cards */}
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl border border-slate-200 bg-white p-5 space-y-3 shadow-sm"
            >
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
          ))}
        </section>

        {/* Right column */}
        <section className="space-y-8">
          {/* Chapter section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-4 w-32" />
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-3 shadow-sm">
              <Skeleton className="h-4 w-28" />
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full rounded-md" />
              ))}
            </div>
          </div>

          {/* Price section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-4 w-32" />
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-3 shadow-sm">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
          </div>

          {/* Attachment section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-4 w-44" />
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-3 shadow-sm">
              <Skeleton className="h-24 w-full rounded-md" />
            </div>
          </div>
        </section>
      </section>
    </>
  );
};

export default CourseUpdateSkeleton;
