"use client";

import { Chapter } from "@/generated/prisma/client";
import CustomButton from "@/shared/components/custom/CustomButton";
import { Kbd } from "@/shared/components/ui/kbd";
import { Edit, Menu, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

const ChapterList = ({ chapters }: { chapters: Chapter[] }) => {
  const router = useRouter();

  const handleEdit = (chapterId: string, courseId: string) => {
    router.push(`/teacher/courses/${courseId}/chapters/${chapterId}`);
  };

  return (
    <div className="space-y-2">
      {chapters.map((chapter: Chapter) => {
        return (
          <div
            key={chapter.id}
            className="flex items-center justify-between p-2 border border-slate-200 rounded"
          >
            <div className="flex items-center space-x-2">
              <span className="text-gray-500">
                <Menu size={16} />
              </span>
              <span className="text-sm">{chapter.title}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Kbd className={`${chapter.isPublished && "text-blue-500"}`}>
                {chapter.isPublished ? "Published" : "Draft"}
              </Kbd>

              <CustomButton
                onClick={() => handleEdit(chapter.id, chapter.courseId)}
                size="sm"
                variant="outline"
              >
                <Edit size={16} /> Edit
              </CustomButton>

              <CustomButton
                size="sm"
                variant="outline"
                className="text-red-500 hover:text-red-600 hover:bg-red-100"
              >
                <Trash size={16} />
              </CustomButton>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ChapterList;
