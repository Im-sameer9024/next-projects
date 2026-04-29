import { Course } from "@/generated/prisma/client";
import { MdOutlineDashboard } from "react-icons/md";
import TitleForm from "./TitleForm";
const CourseUpdate = ({ course }: { course: Course }) => {
  console.log(course);
  return (
    <section className=" mt-10 w-full grid grid-cols-2 gap-4 ">
      {/* Left side  */}
      <section className=" space-y-4 max-w-full">
        {/* heading  */}
        <div className=" flex  items-center gap-2">
          <div>
            <MdOutlineDashboard className=" text-4xl text-blue-500 bg-blue-100 rounded-full p-2 w-10 h-10" />
          </div>
          <p className=" font-heading font-semibold text-md text-slate-700">
            Customize your course
          </p>
        </div>

        {/* all forms to update course details will go here */}
        <section>
          {/* title form  */}
          <TitleForm title={course.title as string} courseId={course.id} />
        </section>
      </section>

      {/* right side  */}
      <section>

      </section>
    </section>
  );
};

export default CourseUpdate;
