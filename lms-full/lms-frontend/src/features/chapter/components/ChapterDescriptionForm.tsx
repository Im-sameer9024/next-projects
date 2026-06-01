"use client";

import React, { useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit, Sparkles } from "lucide-react";
import { toast } from "sonner";
import CustomButton from "@/shared/components/custom/CustomButton";
import SlateEditor from "@/features/editor/SlateEditor";
import { ChapterDescriptionSchema, ChapterDescriptionSchemaTypes } from "../chapter.validation";

import { useUpdateChapter } from "../hooks/useChapter";
import { useGetCourseForTeacher } from "@/features/courses/hooks/useCourse";
import { useAiChapterDescription } from "../hooks/useAiChapterDescription";

interface ChapterDescriptionFormProps {
  description: string | null | undefined;
  title: string;
  chapterId: string;
  courseId: string;
  isPublished: boolean;
}

const isHtmlEmpty = (html: string | null | undefined): boolean => {
  if (!html) return true;

  return html.replace(/<[^>]*>/g, "").trim() === "";
};

const ChapterDescriptionForm = ({
  description,
  title,
  chapterId,
  courseId,
  isPublished,
}: ChapterDescriptionFormProps) => {
  const [isEdit, setIsEdit] = useState(false);

  const {
    mutateAsync: updateChapter,

    isPending: isUpdatingChapter,
  } = useUpdateChapter();

  //------------- AI GENERATION HOOK ----------
  const {
    mutateAsync: generateDescription,

    isPending: isGeneratingAI,
  } = useAiChapterDescription();

  const { data: courseData } = useGetCourseForTeacher(courseId);

  const courseTitle = courseData?.data?.title || "";

  const savedDescription = description ?? "";

  const { control, handleSubmit, reset, setValue } = useForm<ChapterDescriptionSchemaTypes>({
    resolver: zodResolver(ChapterDescriptionSchema),

    defaultValues: {
      description: savedDescription,
    },
  });

  const watchedDescription = useWatch({
    control,
    name: "description",
  });

  const hasChanged = watchedDescription !== savedDescription && !isHtmlEmpty(watchedDescription);

  const onSubmit = async (data: ChapterDescriptionSchemaTypes) => {
    try {
      if (data.description === savedDescription) {
        setIsEdit(false);

        return;
      }

      await updateChapter({
        courseId,
        chapterId,

        description: data.description,
      });

      toast.success("Chapter description updated successfully");

      setIsEdit(false);
    } catch (error) {
      console.error("Description update failed:", error);

      toast.error("Failed to update description");
    }
  };

  //---------- AI GENERATION ------------

  const handleGenerateAI = async () => {
    if (!courseTitle) {
      toast.error("Course title is required");

      return;
    }

    if (!title) {
      toast.error("Chapter title is required");

      return;
    }

    try {
      const generated = await generateDescription({
        courseTitle,
        chapterTitle: title,
      });

      if (!generated) {
        toast.error("No description generated");

        return;
      }

      //  Convert plain text to proper HTML for Slate Editor
      const formattedDescription = `<p>${generated.replace(/\n/g, "</p><p>")}</p>`;

      // ✅ Update React Hook Form state properly
      setValue("description", formattedDescription, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });

      toast.success("AI description generated");
    } catch (error) {
      console.error(error);

      toast.error("Failed to generate description");
    }
  };

  const toggleEdit = () => {
    if (isEdit) {
      reset({
        description: savedDescription,
      });
    }

    setIsEdit((prev) => !prev);
  };

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4">
      {/* HEADER */}

      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-700">Chapter Description</h3>

        <CustomButton
          disabled={isPublished}
          leftIcon={!isEdit ? <Edit size={16} /> : undefined}
          size="sm"
          variant={isEdit ? "outline" : "default"}
          className={
            isEdit
              ? "border-slate-300 bg-transparent text-slate-500"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }
          onClick={toggleEdit}
        >
          {isEdit ? "Cancel" : "Edit"}
        </CustomButton>
      </div>

      {/* BODY */}

      <div className="mt-3">
        {isEdit ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            {/* EDITOR */}

            <Controller
              name="description"
              control={control}
              render={({ field, fieldState }) => (
                <div className="space-y-1">
                  <SlateEditor
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Write chapter description..."
                    minHeight="140px"
                    maxHeight="340px"
                  />

                  {fieldState.error && (
                    <p className="text-xs text-red-500">{fieldState.error.message}</p>
                  )}
                </div>
              )}
            />

            {/* ACTIONS */}

            <div className="flex items-center gap-3">
              {/* SAVE */}

              <CustomButton
                type="submit"
                loading={isUpdatingChapter}
                disabled={isUpdatingChapter || !hasChanged}
                loadingText="Saving..."
                className="bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50"
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
          <div className="text-sm text-slate-600">
            {isHtmlEmpty(description) ? (
              <p className="text-slate-400 italic">No description provided</p>
            ) : (
              <div
                className="text-sm leading-relaxed text-slate-600 [&_a]:text-blue-500 [&_a]:underline [&_blockquote]:my-1 [&_blockquote]:border-l-4 [&_blockquote]:border-slate-300 [&_blockquote]:pl-3 [&_blockquote]:text-slate-500 [&_blockquote]:italic [&_em]:italic [&_h1]:my-2 [&_h1]:text-xl [&_h1]:font-bold [&_h2]:my-2 [&_h2]:text-lg [&_h2]:font-semibold [&_h3]:my-1 [&_h3]:text-base [&_h3]:font-semibold [&_li]:my-0.5 [&_ol]:my-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:my-0.5 [&_s]:line-through [&_strong]:font-semibold [&_sub]:align-sub [&_sub]:text-xs [&_sup]:align-super [&_sup]:text-xs [&_u]:underline [&_ul]:my-1 [&_ul]:list-disc [&_ul]:pl-5"
                dangerouslySetInnerHTML={{
                  __html: description!,
                }}
              />
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default ChapterDescriptionForm;
