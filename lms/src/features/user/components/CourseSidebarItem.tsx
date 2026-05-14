"use client";

import { cn } from "@/shared/lib/utils";

import { CheckCircle2, Lock, PlayCircle } from "lucide-react";

import { usePathname, useRouter } from "next/navigation";

interface CourseSidebarItemProps {
  id: string;
  label: string;
  isCompleted: boolean;
  courseId: string;
  isLocked: boolean;
  index?: number;
}

const CourseSidebarItem = ({
  id,
  label,
  isCompleted,
  courseId,
  isLocked,
  index,
}: CourseSidebarItemProps) => {
  const pathname = usePathname();

  const router = useRouter();

  const isActive = pathname?.includes(id);

  const Icon = isLocked ? Lock : isCompleted ? CheckCircle2 : PlayCircle;

  const onClick = () => {
    if (isLocked) return;

    router.push(`/courses/${courseId}/chapters/${id}`);
  };

  return (
    <button
      onClick={onClick}
      disabled={isLocked}
      className={cn(
        `group relative flex w-full items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200`,

        !isLocked && "hover:bg-slate-100",

        isActive && `bg-blue-50 text-blue-700 shadow-sm`,

        isLocked && `cursor-not-allowed opacity-60`,
      )}
    >
      {/* active indicator */}
      {isActive && (
        <div className="absolute top-2 bottom-2 left-0 w-1 rounded-r-full bg-blue-600" />
      )}

      {/* chapter number */}
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-500">
        {index}
      </div>

      {/* icon */}
      <div
        className={cn(
          "transition-colors",

          isActive && "text-blue-600",

          isCompleted && !isActive && "text-green-500",

          !isCompleted && !isLocked && "text-slate-400",

          isLocked && "text-slate-400",
        )}
      >
        <Icon className="h-5 w-5" />
      </div>

      {/* title */}
      <div className="flex-1 text-left">
        <p
          className={cn(
            `line-clamp-1 text-sm font-medium`,

            isActive ? "text-blue-700" : "text-slate-700",
          )}
        >
          {label}
        </p>
      </div>
    </button>
  );
};

export default CourseSidebarItem;
