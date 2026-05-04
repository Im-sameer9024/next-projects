"use client";

import React, { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit } from "lucide-react";

import CustomButton from "@/shared/components/custom/CustomButton";
import CustomInput from "@/shared/components/custom/CustomInput";



// 👉 create hook similar to useUpdateCourse
import { CreateChapterTitleSchema, CreateChapterTitleSchemaType } from "@/shared/validation/chapter.validation";
import { cn } from "@/shared/lib/utils";
import { useUpdateChapter } from "../hooks/useChapter";

const ChapterTitleForm = ({
  title,
  chapterId,
  courseId
}: {
  title: string;
  chapterId: string;
  courseId:string;
}) => {
  const [isEdit, setIsEdit] = useState(false);

  const { mutateAsync: UpdateChapter, isPending:isUpdatingChapter } = useUpdateChapter();

  const { handleSubmit, control, reset } =
    useForm<CreateChapterTitleSchemaType>({
      resolver: zodResolver(CreateChapterTitleSchema),
      defaultValues: { title },
    });

  const watchedTitle = useWatch({
    control,
    name: "title",
  });

  const onSubmit = async (data: CreateChapterTitleSchemaType) => {
    try {

        console.log(data)

      await UpdateChapter({
        courseId,
        chapterId,
        data,
      });

      setIsEdit(false);
    } catch (error) {
      console.error("Chapter update failed:", error);
    }
  };

  const toggleEdit = () => {
    if (isEdit) reset({ title });
    setIsEdit((prev) => !prev);
  };

  return (
    <section className="bg-white border p-4 border-slate-200 rounded">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-sm text-slate-700">
          Chapter Title
        </h3>

        <CustomButton
          leftIcon={!isEdit && <Edit size={16} />}
          size="sm"
          variant={isEdit ? "outline" : "default"}
          className={cn(
            "transition-all duration-200",
            isEdit
              ? "bg-transparent text-slate-500"
              : "bg-blue-500 hover:bg-blue-600"
          )}
          onClick={toggleEdit}
        >
          {isEdit ? "Cancel" : "Edit"}
        </CustomButton>
      </div>

      {/* Animated Section */}
      <div
        className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out",
          isEdit ? "max-h-40 opacity-100 mt-3" : "max-h-10 opacity-100 mt-2"
        )}
      >
        {isEdit ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-2 p-1">
            <CustomInput
              type="text"
              control={control}
              name="title"
              loading={isUpdatingChapter}
              disabled={isUpdatingChapter}
            />

            <CustomButton
              loading={isUpdatingChapter}
              disabled={isUpdatingChapter || watchedTitle === title}
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

export default ChapterTitleForm;