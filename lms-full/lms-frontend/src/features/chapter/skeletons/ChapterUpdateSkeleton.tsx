import { Skeleton } from "@/shared/components/ui/skeleton";

const ChapterUpdateSkeleton = () => {
  return (
    <div className="grid grid-cols-2 gap-6">
      {/* form cards */}
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="space-y-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
      ))}
    </div>
  );
};

export default ChapterUpdateSkeleton;
