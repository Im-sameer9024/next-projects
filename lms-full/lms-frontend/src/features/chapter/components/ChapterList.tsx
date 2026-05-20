"use client";

import CustomButton from "@/shared/components/custom/CustomButton";
import { Kbd } from "@/shared/components/ui/kbd";
import { Edit, Menu } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { Chapter } from "../chapter";

const ChapterList = ({ chapters }: { chapters?: Chapter[] }) => {
  const router = useRouter();

  // ✅ Always safe
  const safeChapters = Array.isArray(chapters) ? chapters : [];

  const handleEdit = (chapterId: string, courseId: string) => {
    if (!chapterId || !courseId) return; // extra safety
    router.push(`/teacher/courses/${courseId}/chapters/${chapterId}`);
  };

  // ✅ Empty state (important UX)
  if (safeChapters.length === 0) {
    return (
      <p className="text-sm text-gray-500">
        No chapters created yet
      </p>
    );
  }

  return (
    <div className="space-y-2 max-h-50 overflow-auto">
      {safeChapters.map((chapter) => (
        <div
          key={chapter.id}
          className="flex items-center justify-between p-2 border border-slate-200 rounded hover:bg-slate-50 transition"
        >
          {/* LEFT */}
          <div className="flex items-center space-x-2">
            <Menu size={16} className="text-gray-400" />
            <span className="text-sm font-medium">
              {chapter.title || "Untitled Chapter"}
            </span>
          </div>

          {/* RIGHT */}
          <div className="flex items-center space-x-2">
            {chapter.isFree && (
              <Kbd className="text-blue-500">Free</Kbd>
            )}

            <Kbd
              className={`${
                chapter.isPublished
                  ? "text-green-500"
                  : "text-gray-500"
              }`}
            >
              {chapter.isPublished ? "Published" : "Draft"}
            </Kbd>

            <CustomButton
              onClick={() =>
                handleEdit(chapter.id, chapter.courseId)
              }
              size="sm"
              variant="outline"
            >
              <Edit size={14} /> Edit
            </CustomButton>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChapterList;