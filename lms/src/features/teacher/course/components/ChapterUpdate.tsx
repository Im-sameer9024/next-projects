import { Chapter, MuxData } from "@/generated/prisma/client";
import React from "react";
import { MdOutlineDashboard } from "react-icons/md";
import ChapterTitleForm from "./ChapterTitleForm";
import ChapterDescriptionForm from "./ChapterDescriptionForm";


const ChapterUpdate = ({
  chapter,
  courseId
}: {
  chapter: Chapter & { muxData: MuxData };
  courseId:string
}) => {
  return (
    <section className="mt-10 w-full">
      {/* Header */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <MdOutlineDashboard className="text-4xl text-blue-500 bg-blue-100 rounded-full p-2 w-10 h-10" />

          <p className="font-heading font-semibold text-md text-slate-700">
            Customize your chapter
          </p>
        </div>

        {/* Forms */}
        <section className="space-y-4">
          <ChapterTitleForm
            title={chapter.title}
            chapterId={chapter.id}
            courseId={courseId}
          />
          <ChapterDescriptionForm
          description={chapter.description}
          chapterId={chapter.id}
          courseId={courseId}
          />
        </section>
      </section>
    </section>
  );
};

export default ChapterUpdate;