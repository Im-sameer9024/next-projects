"use client";

import React, { useState } from "react";
import { Edit } from "lucide-react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import CustomButton from "@/shared/components/custom/CustomButton";
import { useUpdateChapter } from "../hooks/useChapter";
import { toast } from "sonner";

import {
  CreateChapterDescriptionSchema,
  CreateChapterDescriptionSchemaType,
} from "@/shared/validation/chapter.validation";
import SlateEditor from "./editor/SlateEditor";

// ─── TYPES ───────────────────────────────────────────────────────────────────

interface ChapterDescriptionFormProps {
  description: string | null | undefined;
  chapterId: string;
  courseId: string;
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────

const isHtmlEmpty = (html: string | null | undefined): boolean => {
  if (!html) return true;
  return html.replace(/<[^>]*>/g, "").trim() === "";
};

// ─── COMPONENT ───────────────────────────────────────────────────────────────

const ChapterDescriptionForm = ({
  description,
  chapterId,
  courseId,
}: ChapterDescriptionFormProps) => {
  const [isEdit, setIsEdit] = useState(false);

  const { mutateAsync: UpdateChapter, isPending: isUpdating } = useUpdateChapter();

  const savedDescription = description ?? "";

  const { control, handleSubmit, reset } = useForm<CreateChapterDescriptionSchemaType>({
    resolver: zodResolver(CreateChapterDescriptionSchema),
    defaultValues: { description: savedDescription },
  });

  const watchedDescription = useWatch({ control, name: "description" });

  const hasChanged =
    watchedDescription !== savedDescription &&
    !isHtmlEmpty(watchedDescription as string);

  const onSubmit = async (data: CreateChapterDescriptionSchemaType) => {
    if (data.description === savedDescription) {
      setIsEdit(false);
      return;
    }
    try {
      await UpdateChapter({ courseId, chapterId, data });
      setIsEdit(false);
      toast.success("Chapter description updated successfully");
    } catch (error) {
      console.error("Update failed:", error);
      toast.error("Failed to update description. Please try again.");
    }
  };

  const toggleEdit = () => {
    if (isEdit) reset({ description: savedDescription });
    setIsEdit((prev) => !prev);
  };

  return (
    <section className="bg-white border border-slate-200 rounded-lg p-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-sm text-slate-700">Chapter Description</h3>
        <CustomButton
          leftIcon={!isEdit ? <Edit size={16} /> : undefined}
          size="sm"
          variant={isEdit ? "outline" : "default"}
          className={
            isEdit
              ? "bg-transparent text-slate-500 border-slate-300"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          }
          onClick={toggleEdit}
        >
          {isEdit ? "Cancel" : "Edit"}
        </CustomButton>
      </div>

      {/* Content */}
      <div className="mt-3">
        {isEdit ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <Controller
              name="description"
              control={control}
              render={({ field, fieldState }) => (
                <div className="space-y-1">
                  <SlateEditor
                    value={field.value as string}
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

            <CustomButton
              type="submit"
              loading={isUpdating}
              disabled={isUpdating || !hasChanged}
              loadingText="Saving..."
              className="bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-50"
            >
              Save
            </CustomButton>
          </form>
        ) : (
          <div className="text-sm text-slate-600">
            {isHtmlEmpty(description) ? (
              <p className="italic text-slate-400">No description provided</p>
            ) : (
              // FIX: explicit Tailwind classes for each HTML element the editor produces.
              // We cannot use `prose` without @tailwindcss/typography, so we target
              // each tag directly with [&_tag] selector syntax.
              <div
                className="
                  text-sm text-slate-600 leading-relaxed
                  [&_p]:my-0.5
                  [&_h2]:text-base [&_h2]:font-bold [&_h2]:my-1
                  [&_blockquote]:border-l-4 [&_blockquote]:border-slate-300 [&_blockquote]:pl-3 [&_blockquote]:italic [&_blockquote]:text-slate-500 [&_blockquote]:my-1
                  [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-1
                  [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-1
                  [&_li]:my-0.5
                  [&_strong]:font-semibold
                  [&_em]:italic
                  [&_u]:underline
                  [&_s]:line-through
                  [&_sub]:text-xs [&_sub]:align-sub
                  [&_sup]:text-xs [&_sup]:align-super
                "
                dangerouslySetInnerHTML={{ __html: description! }}
              />
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default ChapterDescriptionForm;