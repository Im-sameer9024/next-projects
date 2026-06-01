"use client";

import ErrorPage from "@/shared/components/common/ErrorPage";
import Banner from "../components/Banner";
import { Course } from "../course";
import { useGetCourseForTeacher } from "../hooks/useCourse";
import CourseUpdateSkeleton from "../skeletons/CourseUpdaePageSkeleton";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { MdOutlineDashboard } from "react-icons/md";
import TitleForm from "../components/TitleForm";
import DescriptionForm from "../components/DescriptionForm";
import ThumbnailForm from "../components/ThumbnailForm";
import CategoryForm from "@/features/category/components/CategoryForm";
import { VscChecklist } from "react-icons/vsc";
import ChapterForm from "@/features/chapter/components/ChapterForm";
import { FaIndianRupeeSign } from "react-icons/fa6";
import PriceForm from "../components/PriceForm";
import { IoDocumentOutline } from "react-icons/io5";
import AttachmentForm from "../components/AttachmentForm";
import CourseActions from "../components/CourseActions";

const CourseUpdatePage = ({ courseId }: { courseId: string }) => {
  const {
    data: SingleCourse,
    isPending: isSingleCoursePending,
    error: SingleCourseError,
    isError: isSingleCourseError,
  } = useGetCourseForTeacher(courseId);

  const courseData = SingleCourse?.data as Course;

  const requiredFields = [
    courseData?.title,
    courseData?.description,
    courseData?.price,
    courseData?.categoryId,
    courseData?.image,
    (courseData?.chapters ?? []).some((chapter) => chapter?.isPublished),
  ];

  const totalFields = requiredFields.length;

  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `(${completedFields} of ${totalFields})`;
  const isComplete = requiredFields.every(Boolean);

  // Loading state — show full-page skeleton
  if (isSingleCoursePending) {
    return <CourseUpdateSkeleton />;
  }

  // Error state
  if (isSingleCourseError) {
    return <ErrorPage message={SingleCourseError.message} />;
  }

  const safeChapters = Array.isArray(courseData?.chapters) ? courseData.chapters : [];
  const safeAttachments = Array.isArray(courseData?.attachments) ? courseData.attachments : [];

  return (
    <>
      {!courseData?.isPublished && (
        <Banner label="This course is unpublished. It will not be visible to the students." />
      )}

      <section aria-label="course-update-page">
        {/*-------------- heading --------- */}
        <section className="mt-4 flex justify-between">
          <div>
            <h2 className="font-heading text-xl font-semibold text-slate-700">Course Setup</h2>
            <p className="flex items-center gap-1 text-xs font-light text-slate-500">
              Complete All Fields {completionText}
              {isComplete && (
                <span className="text-green-400">
                  <IoMdCheckmarkCircleOutline size={18} />
                </span>
              )}
            </p>
          </div>
          {courseData && (
            <CourseActions
              disabled={!isComplete}
              courseId={courseId}
              isPublished={courseData.isPublished}
            />
          )}
        </section>
        <section className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2">
          {/*--------------------- Left side  ---------------*/}
          <div className="space-y-4">
            {/*------------- heading -------- */}
            <div className="flex items-center gap-2">
              <div>
                <MdOutlineDashboard className="h-10 w-10 rounded-full bg-blue-100 p-2 text-4xl text-blue-500" />
              </div>
              <p className="font-heading text-md font-semibold text-slate-700">
                Customize your course
              </p>
            </div>

            {/*------------- forms -------- */}
            <section className="space-y-4">
              <TitleForm courseId={courseData?.id || ""} title={courseData?.title || ""} />
              <DescriptionForm
                courseId={courseData?.id || ""}
                description={courseData?.description || ""}
                title={courseData?.title || ""}
              />

              <ThumbnailForm courseId={courseData?.id || ""} image={courseData?.image || ""} />

              <CategoryForm
                courseId={courseData?.id || ""}
                categoryId={courseData?.categoryId || ""}
              />
            </section>
          </div>
          {/* Right side  */}

          <div className="space-y-4">
            {/*---------------- chapter section ---------------- */}
            <section className="space-y-4">
              {/* heading  */}
              <div className="flex items-center gap-2">
                <div>
                  <VscChecklist className="h-10 w-10 rounded-full bg-blue-100 p-2 text-4xl text-blue-500" />
                </div>
                <p className="font-heading text-md font-semibold text-slate-700">Course chapter</p>
              </div>

              <ChapterForm chapters={safeChapters} courseId={(courseData?.id as string) || ""} />
            </section>

            {/*---------------------- price section -------------- */}
            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <div>
                  <FaIndianRupeeSign className="h-10 w-10 rounded-full bg-blue-100 p-2 text-4xl text-blue-500" />
                </div>
                <p className="font-heading text-md font-semibold text-slate-700">
                  Sell your course
                </p>
              </div>
              <PriceForm
                price={(courseData.price as string) || ""}
                courseId={courseData?.id || ""}
              />
            </section>

            {/*-------------------- Attachment section -------------  */}
            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <div>
                  <IoDocumentOutline className="h-10 w-10 rounded-full bg-blue-100 p-2 text-4xl text-blue-500" />
                </div>
                <p className="font-heading text-md font-semibold text-slate-700">
                  Resources and Attachments
                </p>
              </div>
              <AttachmentForm attachments={safeAttachments} courseId={courseData?.id || ""} />
            </section>
          </div>
        </section>
      </section>
    </>
  );
};

export default CourseUpdatePage;
