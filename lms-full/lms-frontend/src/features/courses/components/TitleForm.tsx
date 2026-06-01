"use client";

import CustomButton from "@/shared/components/custom/CustomButton";
import CustomInput from "@/shared/components/custom/CustomInput";

import { zodResolver } from "@hookform/resolvers/zod";
import { Edit } from "lucide-react";
import React, { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { CreateCourseSchema, CreateCourseSchemaType } from "../course.validation";
import { useUpdateCourseByTeacher } from "../hooks/useCourse";

import { toast } from "sonner";

const TitleForm = ({ title, courseId }: { title: string; courseId: string }) => {
  const [isEdit, setIsEdit] = useState(false);

  //  --------------------- api hook ---------------

  const { mutateAsync: UpdateCourse, isPending: isUpdatingCourse } = useUpdateCourseByTeacher();

  const { handleSubmit, control, reset } = useForm<CreateCourseSchemaType>({
    resolver: zodResolver(CreateCourseSchema),
    defaultValues: { title: title },
  });

  const watchedTitle = useWatch({
    control,
    name: "title",
  });

  const onSubmit = async (data: CreateCourseSchemaType) => {
    try {
      await UpdateCourse({
        courseId,
        data,
      });

      setIsEdit(false);
      toast.success("Course Title Updated Successfully");
    } catch (error) {
      console.error("Update failed:", error);
      toast.error("Error occur in title update");
    }
  };

  const toggleEdit = () => {
    if (isEdit) reset({ title });
    setIsEdit((prev) => !prev);
  };

  return (
    <section className="rounded border border-slate-200 bg-white p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-700">Course Title</h3>

        <CustomButton
          leftIcon={!isEdit && <Edit size={16} />}
          size="sm"
          variant={isEdit ? "outline" : "default"}
          className={`${
            isEdit ? "bg-transparent text-slate-500" : "bg-blue-500 hover:bg-blue-600"
          } transition-all duration-200`}
          onClick={toggleEdit}
        >
          {isEdit ? "Cancel" : "Edit"}
        </CustomButton>
      </div>

      {/* 🔥 Smooth Height Animation */}
      <div
        className={`duration-00 overflow-hidden transition-all ease-in-out ${
          isEdit ? "mt-3 max-h-40 opacity-100" : "mt-2 max-h-fit opacity-100"
        }`}
      >
        {isEdit ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-2 p-1">
            <CustomInput
              type="text"
              control={control}
              name="title"
              loading={isUpdatingCourse}
              disabled={isUpdatingCourse}
            />

            <CustomButton
              loading={isUpdatingCourse}
              disabled={isUpdatingCourse || watchedTitle === title}
              loadingText="Saving..."
              className="bg-blue-500 hover:bg-blue-600"
              type="submit"
            >
              Save
            </CustomButton>
          </form>
        ) : (
          <p className="text-sm text-slate-600">{title}</p>
        )}
      </div>
    </section>
  );
};

export default TitleForm;
