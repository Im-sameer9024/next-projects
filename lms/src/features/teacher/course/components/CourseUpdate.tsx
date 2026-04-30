import { Course } from "@/generated/prisma/client";
import { MdOutlineDashboard } from "react-icons/md";
import TitleForm from "./TitleForm";
import DescriptionForm from "./DescriptionForm";
import ThumbnailForm from "./ThumbnailForm";
import CategoryForm from "./CategoryForm";
import { VscChecklist } from "react-icons/vsc";
import PriceForm from "./PriceForm";
import { FaIndianRupeeSign } from "react-icons/fa6";
import { IoDocumentOutline } from "react-icons/io5";

const CourseUpdate = ({ course }: { course: Course }) => {


  console.log(course);


  return (
    <section className=" mt-10 w-full grid grid-cols-2 gap-14 ">
      {/*------------------------------------------------ Left side ---------------------------------------- */}
      <section className=" space-y-4 ">
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
        <section className=" space-y-4">
          <TitleForm title={course.title as string} courseId={course.id} />
          <DescriptionForm
            description={course.description as string}
            courseId={course.id}
          />
          <ThumbnailForm image={course.image} courseId={course.id} />
          <CategoryForm categoryId={course.categoryId} courseId={course.id} />
        </section>
      </section>

      {/*------------------------------------- right side--------------------------------  */}
      <section className=" space-y-4 ">
        {/* heading  */}
        <div className=" flex  items-center gap-2">
          <div>
            <VscChecklist className=" text-4xl text-blue-500 bg-blue-100 rounded-full p-2 w-10 h-10" />
          </div>
          <p className=" font-heading font-semibold text-md text-slate-700">
            Course chapter
          </p>
        </div>

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
          <PriceForm price={course.price as string} courseId={course.id} />
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
          <PriceForm price={course.price as string} courseId={course.id} />
        </section>

      </section>
    </section>
  );
};

export default CourseUpdate;
