"use client";

import React, { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit } from "lucide-react";
import CustomButton from "@/shared/components/custom/CustomButton";
import CustomInput from "@/shared/components/custom/CustomInput";
import { cn } from "@/shared/lib/utils";
import { useUpdateChapter } from "../hooks/useChapter";
import {
  CreateChapterSchema,
  CreateChapterSchemaTypes,
} from "../chapter.validation";
import { toast } from "sonner";

const ChapterTitleForm = ({
  title,
  chapterId,
  courseId,
}: {
  title: string;
  chapterId: string;
  courseId: string;
}) => {
  const [isEdit, setIsEdit] = useState(false);

  const { mutateAsync: updateChapter, isPending: isUpdatingChapter } =
    useUpdateChapter();

  const { handleSubmit, control, reset } = useForm<CreateChapterSchemaTypes>({
    resolver: zodResolver(CreateChapterSchema),

    defaultValues: {
      title,
    },
  });

  const watchedTitle = useWatch({
    control,
    name: "title",
  });

  const onSubmit = async (data: CreateChapterSchemaTypes) => {
    try {
      await updateChapter({
        courseId,
        chapterId,
        title: data?.title,
      });

      setIsEdit(false);
      toast.success("Chapter updated successfully")
    } catch (error) {
      console.error("Chapter update failed:", error);
    }
  };

  const toggleEdit = () => {
    if (isEdit) {
      reset({
        title,
      });
    }

    setIsEdit((prev) => !prev);
  };

  return (
    <section className="bg-white border p-4 border-slate-200 rounded">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-sm text-slate-700">Chapter Title</h3>

        <CustomButton
          leftIcon={!isEdit && <Edit size={16} />}
          size="sm"
          variant={isEdit ? "outline" : "default"}
          className={cn(
            "transition-all duration-200",

            isEdit
              ? "bg-transparent text-slate-500"
              : "bg-blue-500 hover:bg-blue-600",
          )}
          onClick={toggleEdit}
        >
          {isEdit ? "Cancel" : "Edit"}
        </CustomButton>
      </div>

      {/* CONTENT */}
      <div
        className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out",

          isEdit ? "max-h-40 opacity-100 mt-3" : "max-h-10 opacity-100 mt-2",
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
