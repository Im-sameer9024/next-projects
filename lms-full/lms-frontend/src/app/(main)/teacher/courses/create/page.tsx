import CourseCreateForm from "@/features/courses/components/CourseCreateForm";

const CourseCreatePage = () => {
  return (
    <section aria-label="course-create-page">
      {/* heading */}
      <section>
        <h2 className="font-heading text-xl font-semibold text-slate-700">Name your course</h2>
        <p className="text-xs font-light text-slate-500">
          What would you like to name your course? Don&#39;t worry, you can change this later.
        </p>
      </section>

      <CourseCreateForm />
    </section>
  );
};

export default CourseCreatePage;
