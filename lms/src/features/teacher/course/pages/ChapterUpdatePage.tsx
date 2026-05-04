"use client";

import { useGetSingleChapter } from "../hooks/useChapter";
import { Chapter, MuxData } from "@/generated/prisma/client";
import { Spinner } from "@/shared/components/ui/spinner";
import ErrorPage from "@/shared/components/common/ErrorPage";
import Link from "next/link";
import { FaArrowLeftLong } from "react-icons/fa6";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import ChapterUpdate from "../components/ChapterUpdate";


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
    return <div>Loading...</div>;
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

  return (
    <section aria-label="course-update-page">
      {/* link for back to the course page */}
      <div className="  ">
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
      <section className=" mt-4">
        <h2 className=" font-heading font-semibold text-xl text-slate-700">
          Chapter Setup
        </h2>
        <p className=" font-light text-xs text-slate-500 flex items-center gap-1">
          Complete All Fields {isChapterPending ? <Spinner /> : completionText}
          {completedFields == totalFields && (
            <span className=" text-green-400 ">
              <IoMdCheckmarkCircleOutline size={18} />
            </span>
          )}
        </p>
      </section>

      <section>
        <ChapterUpdate chapter={chapter} courseId={courseId} />
      </section>
    </section>
  );
};

export default ChapterUpdatePage;
