"use client";

import { useGetSingleChapter } from "../hooks/useChapter";
import { Chapter, MuxData } from "@/generated/prisma/client";
import { Spinner } from "@/shared/components/ui/spinner";
import ErrorPage from "@/shared/components/common/ErrorPage";
import Link from "next/link";
import { FaArrowLeftLong } from "react-icons/fa6";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import ChapterUpdate from "../components/ChapterUpdate";
import Banner from "@/features/teacher/course/components/Banner";
import ChapterActions from "../components/ChapterActions";
import ChapterUpdateSkeleton from "../skeleton/ChapterUpdateSkeleton";

const ChapterUpdatePage = ({
  courseId,
  chapterId,
}: {
  courseId: string;
  chapterId: string;
}) => {
  const {
    data: ChapterData,
    isPending: isChapterPending,
    isError: isChapterError,
    error: SingleChapterError,
  } = useGetSingleChapter({
    courseId,
    chapterId,
  });

  if (isChapterPending) {
    return <ChapterUpdateSkeleton />;
  }

  if (isChapterError) {
    return <ErrorPage message={SingleChapterError.message} />;
  }

  const chapter = ChapterData?.data as
    | (Chapter & { muxData?: MuxData })
    | undefined;

  if (!chapter) {
    return <ErrorPage message="Chapter data not found" />;
  }

  const requiredFields = [chapter.title, chapter.description, chapter.videoUrl];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = ` ( ${completedFields} of ${totalFields} )  `;

  const isComplete = requiredFields.every(Boolean);

  return (
    <>
      {!chapter.isPublished && (
        <Banner
          variant={"warning"}
          label="This chapter is not unpublished. It will not be visible in the course"
        />
      )}
      <section aria-label="course-update-page">
        {/* link for back to the course page */}
        <div className="w-fit mt-4">
          <Link
            href={`/teacher/courses/${courseId}`}
            className=" flex items-center gap-2"
          >
            <span>
              <FaArrowLeftLong />
            </span>
            Back to Course Page
          </Link>
        </div>

        {/*-------------- heading --------- */}
        <section className=" mt-4 flex justify-between">
          <div>
            <h2 className=" font-heading font-semibold text-xl text-slate-700">
              Chapter Setup
            </h2>
            <p className=" font-light text-xs text-slate-500 flex items-center gap-1">
              Complete All Fields{" "}
              {isChapterPending ? <Spinner /> : completionText}
              {isComplete && (
                <span className=" text-green-400 ">
                  <IoMdCheckmarkCircleOutline size={18} />
                </span>
              )}
            </p>
          </div>
          <ChapterActions
            disabled={!isComplete}
            courseId={courseId}
            chapterId={chapterId}
            isPublished={chapter.isPublished}
          />
        </section>

        <section>
          <ChapterUpdate chapter={chapter} courseId={courseId} />
        </section>
      </section>
    </>
  );
};

export default ChapterUpdatePage;
