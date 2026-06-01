"use client";

import React, { useState } from "react";

import { useForm, useWatch } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { Edit, Sparkles } from "lucide-react";

import { toast } from "sonner";

import CustomButton from "@/shared/components/custom/CustomButton";

import CustomTextarea from "@/shared/components/custom/CustomTextarea";

import { CourseDescriptionSchema, CourseDescriptionSchemaType } from "../course.validation";

import { useUpdateCourseByTeacher } from "../hooks/useCourse";
import { useAiCourseDescription } from "../hooks/useAiCourse";

const DescriptionForm = ({
  description,
  courseId,
  title,
}: {
  description: string;
  courseId: string;
  title: string;
}) => {
  const [isEdit, setIsEdit] = useState(false);

  const {
    mutateAsync: UpdateCourse,

    isPending: isUpdatingCourse,
  } = useUpdateCourseByTeacher();

  const { mutateAsync: GenerateDescription, isPending: isGeneratingAI } = useAiCourseDescription();

  const { handleSubmit, control, reset, setValue } = useForm<CourseDescriptionSchemaType>({
    resolver: zodResolver(CourseDescriptionSchema),
    defaultValues: {
      description: description || "",
    },
  });

  const watchedDescription = useWatch({
    control,

    name: "description",
  });

  const onSubmit = async (data: CourseDescriptionSchemaType) => {
    try {
      await UpdateCourse({
        courseId,
        data,
      });

      setIsEdit(false);

      toast.success("Course description updated successfully");
    } catch (error) {
      console.error("Update failed:", error);

      toast.error("Failed to update course description");
    }
  };

  const handleGenerateAI = async () => {
    if (!title) {
      toast.error("Course title is required");
      return;
    }

    try {
      const generated = await GenerateDescription(title);
      if (!generated) {
        toast.error("No description generated");
        return;
      }

      setValue("description", generated, {
        shouldDirty: true,
        shouldValidate: true,
      });

      toast.success("AI description generated");
    } catch (error) {
      console.log(error);
      toast.error("Failed to generate description");
    }
  };

  const toggleEdit = () => {
    if (isEdit) {
      reset({
        description: description || "",
      });
    }
    setIsEdit((prev) => !prev);
  };

  return (
    <section className="rounded border border-slate-200 bg-white p-4">
      {/* HEADER */}

      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-700">Course Description</h3>

        <CustomButton
          leftIcon={!isEdit && <Edit size={16} />}
          size="sm"
          variant={isEdit ? "outline" : "default"}
          className={`${
            isEdit ? "bg-transparent text-slate-500" : "bg-blue-500 hover:bg-blue-600"
          }`}
          onClick={toggleEdit}
        >
          {isEdit ? "Cancel" : "Edit"}
        </CustomButton>
      </div>

      {/* BODY */}

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isEdit ? "mt-3 max-h-125 opacity-100" : "mt-2 max-h-fit opacity-100"
        } `}
      >
        {isEdit ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 p-1">
            {/* TEXTAREA */}

            <CustomTextarea
              control={control}
              disabled={isUpdatingCourse || isGeneratingAI}
              loading={isGeneratingAI}
              name="description"
              placeholder="
                e.g. This course teaches...
              "
            />

            {/* ACTIONS */}

            <div className="flex items-center gap-3">
              {/* SAVE */}

              <CustomButton
                loading={isUpdatingCourse}
                disabled={isUpdatingCourse || watchedDescription === description}
                loadingText="Saving..."
                className="bg-blue-500 hover:bg-blue-600"
                type="submit"
              >
                Save
              </CustomButton>

              {/* AI BUTTON */}

              <CustomButton
                type="button"
                variant="outline"
                leftIcon={<Sparkles size={16} />}
                onClick={handleGenerateAI}
                loading={isGeneratingAI}
                disabled={isGeneratingAI}
              >
                Generate AI
              </CustomButton>
            </div>
          </form>
        ) : (
          <p className="text-sm whitespace-pre-line text-slate-600">
            {description || "No description"}
          </p>
        )}
      </div>
    </section>
  );
};

export default DescriptionForm;
