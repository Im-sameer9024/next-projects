"use client";

import CustomButton from "@/shared/components/custom/CustomButton";
import CustomInput from "@/shared/components/custom/CustomInput";
import { Notebook } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateCourseTitleSchema,
  CreateCourseTitleTypes,
} from "../validation/course.validation";

import { useCreateCourse } from "../hooks/useCourse";
import { useRouter } from "next/navigation";

const CreateCourse = () => {
  const router = useRouter();

  const { mutateAsync: CreateCourse, isPending: isCreatingCourse } =
    useCreateCourse();

  const { control, handleSubmit } = useForm<CreateCourseTitleTypes>({
    resolver: zodResolver(CreateCourseTitleSchema),
    defaultValues: {
      title: "",
    },
  });

  const onSubmit = async (data: CreateCourseTitleTypes) => {
    const res = await CreateCourse(data);
    router.push(`/teacher/courses/${res?.data?.id}`);
  };

  return (
    <div className=" space-y-4">
      {/*-------------- heading --------------- */}
      <div>
        <h2 className=" text-xl font-smallHeading text-darkText font-semibold">
          Name your Course
        </h2>
        <p className=" text-sm font-light font-content ">
          What would you like to name your course? Don&#39;t worry , you can
          change this later.
        </p>
      </div>

      {/*-------------- form ------------ */}
      <form onSubmit={handleSubmit(onSubmit)} className="font-content">
        <CustomInput
          name="title"
          control={control}
          loading={isCreatingCourse}
          type="text"
          disabled={isCreatingCourse}
          label="Course Title"
          description="What will you teach in This course"
          placeholder="e.g.'Advanced web development'"
          leftIcon={<Notebook size={16} />}
        />

        <div className=" flex  gap-4 mt-6">
          <CustomButton active={false} disabled={isCreatingCourse}>
            Cancel
          </CustomButton>
          <CustomButton
            active={true}
            loading={isCreatingCourse}
            disabled={isCreatingCourse}
            type="submit"
          >
            Continue
          </CustomButton>
        </div>
      </form>
    </div>
  );
};

export default CreateCourse;
