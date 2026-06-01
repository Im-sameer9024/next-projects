"use client";

import Link from "next/link";
import ErrorPage from "@/shared/components/common/ErrorPage";
import { Spinner } from "@/shared/components/ui/spinner";
import { FaArrowLeftLong } from "react-icons/fa6";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { useGetChapter } from "../hooks/useChapter";
import ChapterUpdateSkeleton from "../skeletons/ChapterUpdateSkeleton";
import { Chapter } from "../chapter";
import { MuxData } from "@/features/courses/course";
import Banner from "@/features/courses/components/Banner";
import ChapterTitleForm from "./ChapterTitleForm";
import { MdOutlineDashboard } from "react-icons/md";
import ChapterDescriptionForm from "./ChapterDescriptionForm";
import ChapterAccessForm from "./ChapterAccessForm";
import { Eye, Video } from "lucide-react";
import ChapterVideoForm from "./ChapterVideoForm";
import ChapterActions from "./ChapterActions";

const ChapterUpdate = ({ courseId, chapterId }: { courseId: string; chapterId: string }) => {
  const { data, isPending, isError, error } = useGetChapter(chapterId);

  if (isPending) {
    return <ChapterUpdateSkeleton />;
  }

  if (isError) {
    return <ErrorPage message={error?.message || "Something went wrong"} />;
  }

  const chapter = data?.data as
    | (Chapter & {
        muxData?: MuxData;
      })
    | undefined;

  if (!chapter) {
    return <ErrorPage message="Chapter not found" />;
  }

  // REQUIRED FIELDS
  const requiredFields = [chapter.title, chapter.description, chapter.videoUrl];

  const totalFields = requiredFields.length;

  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `(${completedFields} of ${totalFields})`;

  const isComplete = requiredFields.every(Boolean);

  return (
    <>
      {/* BANNER */}
      {!chapter.isPublished && (
        <Banner
          variant="warning"
          label="This chapter is unpublished. It will not be visible in the course."
        />
      )}

      <section aria-label="chapter-update-page">
        {/* BACK BUTTON */}
        <div className="mt-4 w-fit">
          <Link
            href={`/teacher/courses/${courseId}`}
            className="flex items-center gap-2 text-sm transition hover:text-blue-500"
          >
            <FaArrowLeftLong />

            <span>Back to Course Page</span>
          </Link>
        </div>

        {/* HEADER */}
        <section className="mt-4 flex items-center justify-between">
          <div>
            <h2 className="font-heading text-xl font-semibold text-slate-700">Chapter Setup</h2>

            <p className="flex items-center gap-1 text-xs font-light text-slate-500">
              Complete all fields
              {isPending ? <Spinner /> : completionText}
              {isComplete && (
                <span className="text-green-500">
                  <IoMdCheckmarkCircleOutline size={18} />
                </span>
              )}
            </p>
          </div>

          {/* ACTIONS */}
          <ChapterActions
            disabled={!isComplete}
            courseId={courseId}
            chapterId={chapterId}
            isPublished={chapter.isPublished}
          />
        </section>

        {/* CONTENT */}
        <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Left side  */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <MdOutlineDashboard className="h-10 w-10 rounded-full bg-blue-100 p-2 text-4xl text-blue-500" />

              <p className="font-heading text-md font-semibold text-slate-700">
                Customize your chapter
              </p>
            </div>

            {/*-------------- forms ----------------- */}
            <section className="space-y-4">
              <ChapterTitleForm
                title={chapter?.title || ""}
                courseId={chapter?.courseId || ""}
                chapterId={chapter?.id || ""}
                isPublished={chapter?.isPublished}
              />
              <ChapterDescriptionForm
                title={chapter?.title || ""}
                description={chapter.description || ""}
                courseId={chapter?.courseId || ""}
                chapterId={chapter?.id || ""}
                isPublished={chapter?.isPublished}
              />

              {/*-------------- chapter access form ---------- */}

              <div className="flex items-center gap-2">
                <Eye className="h-10 w-10 rounded-full bg-blue-100 p-2 text-4xl text-blue-500" />

                <p className="font-heading text-md font-semibold text-slate-700">Access Setting</p>
              </div>

              {/* Forms */}

              <ChapterAccessForm
                isFree={chapter.isFree}
                chapterId={chapter.id}
                courseId={courseId}
                isPublished={chapter.isPublished}
              />
            </section>
          </section>

          {/* right side  */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <div>
                <Video className="h-10 w-10 rounded-full bg-blue-100 p-2 text-4xl text-blue-500" />
              </div>
              <p className="font-heading text-md font-semibold text-slate-700">Add a Video</p>
            </div>
            <ChapterVideoForm
              videoUrl={chapter.videoUrl || ""}
              chapterId={chapter.id || ""}
              courseId={courseId || ""}
              isPublished={chapter.isPublished}
              isProcessingVideo={chapter?.isProcessingVideo || false}
            />
          </section>
        </div>
      </section>
    </>
  );
};

export default ChapterUpdate;
