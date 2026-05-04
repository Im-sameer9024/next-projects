/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { useForm, useWatch, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit } from "lucide-react";

import CustomButton from "@/shared/components/custom/CustomButton";
import { cn } from "@/shared/lib/utils";
import { useUpdateChapter } from "../hooks/useChapter";

import {
  CreateChapterAccessSchema,
  CreateChapterAccessSchemaType,
} from "@/shared/validation/chapter.validation";
import { Checkbox } from "@/shared/components/ui/checkbox";


const ChapterAccessForm = ({
  isFree,
  chapterId,
  courseId,
}: {
  isFree: boolean;
  chapterId: string;
  courseId: string;
}) => {
  const [isEdit, setIsEdit] = useState(false);

  const { mutateAsync: UpdateChapter, isPending: isUpdatingChapter } =
    useUpdateChapter();

  const { handleSubmit, control, reset } =
    useForm<CreateChapterAccessSchemaType>({
      resolver: zodResolver(CreateChapterAccessSchema),
      defaultValues: { isFree },
    });

  const watchedIsFree = useWatch({
    control,
    name: "isFree",
  });

  const onSubmit = async (data: CreateChapterAccessSchemaType) => {
    try {
      if (data.isFree === isFree) {
        setIsEdit(false);
        return;
      }

      await UpdateChapter({
        courseId,
        chapterId,
        data,
      });

      setIsEdit(false);
    } catch (error) {
      console.error("Chapter access update failed:", error);
    }
  };

  const toggleEdit = () => {
    if (isEdit) reset({ isFree });
    setIsEdit((prev) => !prev);
  };

  return (
    <section className="bg-white border p-4 border-slate-200 rounded">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-sm text-slate-700">
          Chapter Access
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

      {/* Content */}
      <div
        className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out",
          isEdit ? "max-h-40 opacity-100 mt-3" : "max-h-10 opacity-100 mt-2"
        )}
      >
        {isEdit ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 p-1">
            
            {/* 🔥 shadcn Checkbox */}
            <Controller
              name="isFree"
              control={control}
              render={({ field }) => (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(checked:any) =>
                      field.onChange(checked === true)
                    }
                    disabled={isUpdatingChapter}
                  />
                  <label className="text-sm text-slate-600 cursor-pointer">
                    Check this box if you want to make this chapter free
                  </label>
                </div>
              )}
            />

            <CustomButton
              loading={isUpdatingChapter}
              disabled={isUpdatingChapter || watchedIsFree === isFree}
              loadingText="Saving..."
              className="bg-blue-500 hover:bg-blue-600"
              type="submit"
            >
              Save
            </CustomButton>
          </form>
        ) : (
          <p className="text-sm text-slate-600">
            {isFree ? "🟢 This chapter is free" : "🔒 This chapter is paid"}
          </p>
        )}
      </div>
    </section>
  );
};

export default ChapterAccessForm;