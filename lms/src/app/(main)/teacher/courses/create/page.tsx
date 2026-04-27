import CourseCreateForm from "@/features/teacher/course/components/CourseCreateForm";
import React from "react";

const CourseCreate = () => {
  return (
    <section aria-label="course-create-page">
      {/* heading */}
      <section>
        <h2 className=" font-heading font-semibold text-xl text-slate-700">
          Name your course
        </h2>
        <p className=" font-light text-xs text-slate-500">
          What would you like to name your course? Don&#39;t worry, you can
          change this later.
        </p>
      </section>

      <CourseCreateForm />
    </section>
  );
};

export default CourseCreate;
