"use client";

import React, { useState } from "react";
import CustomButton from "@/shared/components/custom/CustomButton";
import CustomInput from "@/shared/components/custom/CustomInput";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import ChapterList from "./ChapterList";

import { CreateChapterSchema, CreateChapterSchemaTypes } from "../chapter.validation";
import { useChapterCreate } from "../hooks/useChapter";
import { Chapter } from "../chapter";

const ChapterForm = ({ chapters, courseId }: { chapters: Chapter[]; courseId: string }) => {
  const [isEdit, setIsEdit] = useState(false);

  const { mutateAsync: createChapter, isPending: isCreatingChapter } = useChapterCreate();

  const { handleSubmit, control, reset } = useForm<CreateChapterSchemaTypes>({
    resolver: zodResolver(CreateChapterSchema),

    defaultValues: {
      title: "",
    },
  });

  const onSubmit = async (data: CreateChapterSchemaTypes) => {
    const actualData = {
      title: data.title,
      courseId: courseId as string,
    };

    try {
      await createChapter(actualData);

      reset({
        title: "",
      });

      setIsEdit(false);
      toast.success("Chapter created successfully!");
    } catch (error) {
      console.error("Error creating chapter:", error);
      toast.error("Failed to create chapter.");
    }
  };

  const toggleEdit = () => {
    if (isEdit) {
      reset({
        title: "",
      });
    }

    setIsEdit((prev) => !prev);
  };

  const safeChapters = Array.isArray(chapters) ? chapters : [];

  return (
    <section className="rounded border border-slate-200 bg-white p-4">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-700">Course Chapters</h3>

        <CustomButton
          leftIcon={!isEdit && <Edit size={16} />}
          size="sm"
          variant={isEdit ? "outline" : "default"}
          className={`${
            isEdit ? "bg-transparent text-slate-500" : "bg-blue-500 hover:bg-blue-600"
          } transition-all duration-200`}
          onClick={toggleEdit}
        >
          {isEdit ? "Cancel" : "Add"}
        </CustomButton>
      </div>

      {/* CONTENT */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isEdit ? "mt-3 max-h-40 opacity-100" : "mt-2 max-h-125 opacity-100"
        }`}
      >
        {isEdit ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-2 p-1">
            <CustomInput
              type="text"
              control={control}
              name="title"
              placeholder="e.g Chapter-1"
              loading={isCreatingChapter}
              disabled={isCreatingChapter}
            />

            <CustomButton
              loading={isCreatingChapter}
              disabled={isCreatingChapter}
              loadingText="Saving..."
              className="bg-blue-500 hover:bg-blue-600"
              type="submit"
            >
              Save
            </CustomButton>
          </form>
        ) : (
          <div>
            {safeChapters.length === 0 ? (
              <p className="text-sm text-gray-500">No Chapters created</p>
            ) : (
              <ChapterList chapters={safeChapters} />
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default ChapterForm;
