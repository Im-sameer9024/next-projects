/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import CustomButton from "@/shared/components/custom/CustomButton";
import CustomInput from "@/shared/components/custom/CustomInput";
import {
  CreateCourseTitleSchema,
  CreateCourseTitleSchemaType,
} from "@/shared/validation/course.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useCreateCourse } from "../hooks/useCourse";
import { useRouter } from "next/navigation";

const CourseCreateForm = () => {
  //----------------- api hooks --------------
  const { mutateAsync: CreateCourse, isPending: isCreatingCourse } =
    useCreateCourse();
  const router = useRouter();

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<CreateCourseTitleSchemaType>({
    resolver: zodResolver(CreateCourseTitleSchema),
    defaultValues: {
      title: "",
    },
  });

  const onSubmit = async (data: CreateCourseTitleSchemaType) => {
    const formData = new FormData();
    formData.append("title", data.title);

    const res = await CreateCourse(formData as any);

    if (res.success) {
      router.push(`/teacher/courses/${res.data?.id}`);
      reset();
    }
  };

  const handleCancel = () => {
    reset(); // 🔥 reset form
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4 max-w-lg">
      {/* Input */}
      <CustomInput
        name="title"
        control={control}
        loading={isCreatingCourse}
        disabled={isCreatingCourse}
        label="Course title"
        type="text"
        placeholder="e.g 'Web Development Bootcamp'"
      />

      {/* Buttons */}
      <div className="flex  items-center  gap-4">
        {/* Cancel */}
        <CustomButton
          disabled={isCreatingCourse}
          type="button"
          variant="ghost"
          onClick={handleCancel}
          className=" text-slate-500"
        >
          Cancel
        </CustomButton>

        {/* Submit */}
        <CustomButton
          type="submit"
          loading={isSubmitting || isCreatingCourse}
          disabled={isCreatingCourse}
          className=" bg-blue-500 hover:bg-blue-600"
        >
          Continue
        </CustomButton>
      </div>
    </form>
  );
};

export default CourseCreateForm;
