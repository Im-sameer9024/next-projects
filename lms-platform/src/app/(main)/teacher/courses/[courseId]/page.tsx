"use client";

import CustomizeCourse from "@/features/teacher/course/components/CustomizeCourse";
import { useGetCourse } from "@/features/teacher/course/hooks/useCourse";
import { useParams } from "next/navigation";

const SingleCourse = () => {
  const { courseId } = useParams();

  const {
    data: course,
    isPending: isCoursePending,
    isError: isCourseError,
    error: courseError,
  } = useGetCourse(courseId as string);

  const courseData = course?.data;

  const requiredFields = [
    courseData?.title,
    courseData?.description,
    courseData?.price,
    courseData?.imageUrl,
    courseData?.categoryId,
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `(${completedFields} / ${totalFields})`;

  if (isCoursePending) {
    return <div>Loading...</div>;
  }

  if (isCourseError) {
    return <div>Error: {courseError?.message}</div>;
  }

  return (
    <div>
      <div className=" ">
        <div>
          <h2 className=" text-2xl text-darkText font-heading font-semibold">
            Course Setup
          </h2>
          <p className=" text-xs font-light">
            Complete all fields {completionText}
          </p>
        </div>
        <div>
          <CustomizeCourse course={courseData} />
        </div>
      </div>
    </div>
  );
};

export default SingleCourse;
