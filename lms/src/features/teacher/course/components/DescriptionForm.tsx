"use client";

import CustomButton from "@/shared/components/custom/CustomButton";
import {
  CreateCourseDescriptionSchema,
  CreateCourseDescriptionSchemaType,
} from "@/shared/validation/course.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit } from "lucide-react";
import React, { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useUpdateCourse } from "../hooks/useCourse";
import CustomTextarea from "@/shared/components/custom/CustomTextarea";

const DescriptionForm = ({
  description,
  courseId,
}: {
  description: string;
  courseId: string;
}) => {
  const [isEdit, setIsEdit] = useState(false);

  // 🔥 API hook
  const { mutateAsync: UpdateCourse, isPending: isUpdatingCourse } =
    useUpdateCourse();

  // 🔥 Form setup
  const { handleSubmit, control, reset } =
    useForm<CreateCourseDescriptionSchemaType>({
      resolver: zodResolver(CreateCourseDescriptionSchema),
      defaultValues: {
        description: description || "",
      },
    });

  const watchedDescription = useWatch({
    control,
    name: "description",
  });

  // 🔥 Submit handler
  const onSubmit = async (data: CreateCourseDescriptionSchemaType) => {
    // prevent unnecessary API call
    if (data.description === description) {
      setIsEdit(false);
      return;
    }

    try {
      await UpdateCourse({
        courseId,
        data,
      });

      setIsEdit(false);
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  // 🔥 Toggle edit
  const toggleEdit = () => {
    if (isEdit) reset({ description: description || "" });
    setIsEdit((prev) => !prev);
  };

  return (
    <section className="bg-white border p-4 border-slate-200 rounded">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-sm text-slate-700">
          Course Description
        </h3>

        <CustomButton
          leftIcon={!isEdit && <Edit size={16} />}
          size="sm"
          variant={isEdit ? "outline" : "default"}
          className={`${
            isEdit
              ? "bg-transparent text-slate-500"
              : "bg-blue-500 hover:bg-blue-600"
          } transition-all duration-200`}
          onClick={toggleEdit}
        >
          {isEdit ? "Cancel" : "Edit"}
        </CustomButton>
      </div>

      {/* 🔥 Smooth Height Animation */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isEdit ? "max-h-60 opacity-100 mt-3" : "max-h-20 opacity-100 mt-2"
        }`}
      >
        {isEdit ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-2 p-1">
            {/* 🔥 Use textarea for description */}
            <CustomTextarea
              control={control}
              disabled={isUpdatingCourse}
              loading={isUpdatingCourse}
              name="description"
              placeholder="e.g. - This course is about for...."
            />

            <CustomButton
              loading={isUpdatingCourse}
              disabled={isUpdatingCourse || watchedDescription === description}
              loadingText="Saving..."
              className="bg-blue-500 hover:bg-blue-600"
              type="submit"
            >
              Save
            </CustomButton>
          </form>
        ) : (
          <p className="text-sm text-slate-600 whitespace-pre-line">
            {description || "No description"}
          </p>
        )}
      </div>
    </section>
  );
};

export default DescriptionForm;
