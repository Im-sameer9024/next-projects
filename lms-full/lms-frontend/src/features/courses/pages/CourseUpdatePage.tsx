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

  const safeChapters = Array.isArray(courseData?.chapters)
    ? courseData.chapters
    : [];
  const safeAttachments = Array.isArray(courseData?.attachments)
    ? courseData.attachments
    : [];

  return (
    <>
      {!courseData?.isPublished && (
        <Banner label="This course is unpublished. It will not be visible to the students." />
      )}

      <section aria-label="course-update-page">
        {/*-------------- heading --------- */}
        <section className=" flex justify-between mt-4">
          <div>
            <h2 className="  font-heading font-semibold text-xl text-slate-700">
              Course Setup
            </h2>
            <p className="   font-light text-xs text-slate-500 flex items-center gap-1">
              Complete All Fields {completionText}
              {isComplete && (
                <span className=" text-green-400 ">
                  <IoMdCheckmarkCircleOutline size={18} />
                </span>
              )}
            </p>
          </div>
          {/* {courseData && (
            <CourseActions
              disabled={!isComplete}
              courseId={courseId}
              isPublished={courseData.isPublished}
            />
          )} */}
        </section>
        <section className=" grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          {/*--------------------- Left side  ---------------*/}
          <div className=" space-y-4">
            {/*------------- heading -------- */}
            <div className=" flex  items-center gap-2">
              <div>
                <MdOutlineDashboard className=" text-4xl text-blue-500 bg-blue-100 rounded-full p-2 w-10 h-10" />
              </div>
              <p className=" font-heading font-semibold text-md text-slate-700">
                Customize your course
              </p>
            </div>

            {/*------------- forms -------- */}
            <section className=" space-y-4">
              <TitleForm
                courseId={courseData?.id || ""}
                title={courseData?.title || ""}
              />
              <DescriptionForm
                courseId={courseData?.id || ""}
                description={courseData?.description || ""}
                title={courseData?.title || ""}
              />

              <ThumbnailForm
                courseId={courseData?.id || ""}
                image={courseData?.image || ""}
              />

              <CategoryForm
                courseId={courseData?.id || ""}
                categoryId={courseData?.categoryId || ""}
              />
            </section>
          </div>
          {/* Right side  */}

          <div className=" space-y-4">
            {/*---------------- chapter section ---------------- */}
            <section className=" space-y-4">
              {/* heading  */}
              <div className=" flex  items-center gap-2">
                <div>
                  <VscChecklist className=" text-4xl text-blue-500 bg-blue-100 rounded-full p-2 w-10 h-10" />
                </div>
                <p className=" font-heading font-semibold text-md text-slate-700">
                  Course chapter
                </p>
              </div>

              <ChapterForm
                chapters={safeChapters}
                courseId={(courseData?.id as string) || ""}
              />
            </section>

            {/*---------------------- price section -------------- */}
            <section className=" space-y-4">
              <div className=" flex  items-center gap-2">
                <div>
                  <FaIndianRupeeSign className=" text-4xl text-blue-500 bg-blue-100 rounded-full p-2 w-10 h-10" />
                </div>
                <p className=" font-heading font-semibold text-md text-slate-700">
                  Sell your course
                </p>
              </div>
              <PriceForm
                price={(courseData.price as string) || ""}
                courseId={courseData?.id || ""}
              />
            </section>

            {/*-------------------- Attachment section -------------  */}
            <section className=" space-y-4">
              <div className=" flex  items-center gap-2">
                <div>
                  <IoDocumentOutline className=" text-4xl text-blue-500 bg-blue-100 rounded-full p-2 w-10 h-10" />
                </div>
                <p className=" font-heading font-semibold text-md text-slate-700">
                  Resources and Attachments
                </p>
              </div>
              <AttachmentForm
                attachments={safeAttachments}
                courseId={courseData?.id || ""}
              />
            </section>
          </div>
        </section>
      </section>
    </>
  );
};

export default CourseUpdatePage;
