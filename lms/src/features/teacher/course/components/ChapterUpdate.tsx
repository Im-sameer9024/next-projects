import { Chapter, MuxData } from "@/generated/prisma/client";
import React from "react";
import { MdOutlineDashboard } from "react-icons/md";
import ChapterTitleForm from "./ChapterTitleForm";
import ChapterDescriptionForm from "./ChapterDescriptionForm";
import ChapterAccessForm from "./ChapterAccessForm";
import { Eye, Video } from "lucide-react";
import ChapterVideoForm from "./ChapterVideoForm";

const ChapterUpdate = ({
  chapter,
  courseId,
}: {
  chapter: Chapter & { muxData?: MuxData };
  courseId: string;
}) => {
  return (
    <section className="mt-10 w-full  grid grid-cols-2 gap-14">
      {/*------------- Left side ---------------  */}
      <section className=" space-y-4 ">
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

        {/*--------------- chapter access form-------------- */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Eye className="text-4xl text-blue-500 bg-blue-100 rounded-full p-2 w-10 h-10" />

            <p className="font-heading font-semibold text-md text-slate-700">
              Access Setting
            </p>
          </div>

          {/* Forms */}

          <ChapterAccessForm
            isFree={chapter.isFree}
            chapterId={chapter.id}
            courseId={courseId}
          />
        </section>
      </section>

      {/*---------------- Right side ----------------  */}
      <section className="space-y-4">
        <section className=" space-y-4">
          <div className=" flex  items-center gap-2">
            <div>
              <Video className=" text-4xl text-blue-500 bg-blue-100 rounded-full p-2 w-10 h-10" />
            </div>
            <p className=" font-heading font-semibold text-md text-slate-700">
              Add a Video
            </p>
          </div>
          <ChapterVideoForm
            videoUrl={chapter.videoUrl || ""}
            chapterId={chapter.id}
            courseId={courseId}
          />
        </section>
      </section>
    </section>
  );
};

export default ChapterUpdate;
