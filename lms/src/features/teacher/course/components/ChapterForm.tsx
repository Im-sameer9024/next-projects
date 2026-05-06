import { Chapter } from "@/generated/prisma/client";
import CustomButton from "@/shared/components/custom/CustomButton";
import CustomInput from "@/shared/components/custom/CustomInput";
import {
  CreateCourseChapterSchema,
  CreateCourseChapterSchemaType,
} from "@/shared/validation/course.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import ChapterList from "./ChapterList";
import { useCreateChapter } from "../hooks/useChapter";

const ChapterForm = ({
  chapters,
  courseId,
}: {
  chapters: Chapter[];
  courseId: string;
}) => {
  const [isEdit, setIsEdit] = useState(false);

  const { mutateAsync: CreateChapter, isPending: isCreatingChapter } =
    useCreateChapter();

  const { handleSubmit, control, reset } =
    useForm<CreateCourseChapterSchemaType>({
      resolver: zodResolver(CreateCourseChapterSchema),
      defaultValues: { title: "" },
    });

  const onSubmit = async (data: CreateCourseChapterSchemaType) => {
    try {
      await CreateChapter({ courseId, data });
      reset({ title: "" });
      setIsEdit(false);
    } catch (error) {
      console.error("Error creating chapter:", error);
    }
  };

  const toggleEdit = () => {
    if (isEdit) reset({ title: "" });
    setIsEdit((prev) => !prev);
  };

  const safeChapters = Array.isArray(chapters) ? chapters : [];

  return (
    <section className="bg-white border p-4 border-slate-200 rounded">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-sm text-slate-700">
          Course Chapters
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
          {isEdit ? "Cancel" : "Add"}
        </CustomButton>
      </div>

      {/* 🔥 Smooth Height Animation */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isEdit ? "max-h-40 opacity-100 mt-3" : "max-h-100 opacity-100 mt-2"
        }`}
      >
        {isEdit ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-2 p-1">
            <CustomInput
              type="text"
              control={control}
              name="title"
              placeholder="e.g 'Chapter-1'"
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
              <>
                <p className="text-sm text-gray-500 ">No Chapters created</p>
              </>
            ) : (
              <>
                <ChapterList chapters={safeChapters} />
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default ChapterForm;
