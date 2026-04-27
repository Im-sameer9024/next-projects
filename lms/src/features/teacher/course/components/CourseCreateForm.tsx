"use client";

import CustomButton from "@/shared/components/custom/CustomButton";
import CustomInput from "@/shared/components/custom/CustomInput";
import {
  CreateCourseTitleSchema,
  CreateCourseTitleSchemaType,
} from "@/shared/validation/course.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const CourseCreateForm = () => {
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
    console.log("COURSE DATA:", data);

    // 👉 API call here
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
        label="Course title"
        type="text"
        placeholder="e.g 'Web Development Bootcamp'"
      />

      {/* Buttons */}
      <div className="flex  items-center  gap-4">
        {/* Cancel */}
        <CustomButton
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
          loading={isSubmitting}
          className=" bg-blue-500 hover:bg-blue-600"
        >
          Continue
        </CustomButton>
      </div>
    </form>
  );
};

export default CourseCreateForm;
