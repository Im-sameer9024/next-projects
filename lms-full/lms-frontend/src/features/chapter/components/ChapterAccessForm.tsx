"use client";

import React, { useEffect, useState } from "react";
import { useForm, useWatch, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit } from "lucide-react";

import CustomButton from "@/shared/components/custom/CustomButton";
import { cn } from "@/shared/lib/utils";

import { useUpdateChapter } from "../hooks/useChapter";

import { Checkbox } from "@/shared/components/ui/checkbox";
import {
  ChapterAccessSchema,
  ChapterAccessSchemaTypes,
} from "../chapter.validation";

const ChapterAccessForm = ({
  isFree,
  chapterId,
  courseId,
  isPublished,
}: {
  isFree: boolean;
  chapterId: string;
  courseId: string;
  isPublished: boolean;
}) => {
  const [isEdit, setIsEdit] = useState(false);

  const { mutateAsync: updateChapter, isPending } = useUpdateChapter();

  const { handleSubmit, control, reset } = useForm<ChapterAccessSchemaTypes>({
    resolver: zodResolver(ChapterAccessSchema),
    defaultValues: {
      isFree,
    },
  });

  // ✅ Sync latest prop value into form
  useEffect(() => {
    reset({ isFree });
  }, [isFree, reset]);

  const watchedIsFree = useWatch({
    control,
    name: "isFree",
  });

  const onSubmit = async (values: ChapterAccessSchemaTypes) => {
    try {
      if (values.isFree === isFree) {
        setIsEdit(false);
        return;
      }

      await updateChapter({
        courseId,
        chapterId,
        isFree: values.isFree,
      });

      // ✅ update form state
      reset(values);

      setIsEdit(false);
    } catch (error) {
      console.error(error);
    }
  };

  const toggleEdit = () => {
    if (isEdit) {
      reset({ isFree });
    }

    setIsEdit((prev) => !prev);
  };

  return (
    <section className="bg-white border border-slate-200 rounded p-4 ">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-700">Chapter Access</h3>

        <CustomButton
          disabled={isPublished}
          leftIcon={!isEdit && <Edit size={16} />}
          size="sm"
          variant={isEdit ? "outline" : "default"}
          onClick={toggleEdit}
          className={cn(
            "transition-all duration-200",
            isEdit
              ? "bg-transparent text-slate-500"
              : "bg-blue-500 hover:bg-blue-600",
          )}
        >
          {isEdit ? "Cancel" : "Edit"}
        </CustomButton>
      </div>

      {/* Body */}
      <div
        className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out",

          isEdit ? "max-h-40 opacity-100 mt-3" : "max-h-10 opacity-100 mt-2",
        )}
      >
        {isEdit ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <Controller
              name="isFree"
              control={control}
              render={({ field }) => (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(checked) =>
                      field.onChange(checked === true)
                    }
                    disabled={isPending}
                  />

                  <label className="text-sm text-slate-600">
                    Make this chapter free
                  </label>
                </div>
              )}
            />

            <CustomButton
              type="submit"
              loading={isPending}
              loadingText="Saving..."
              disabled={isPending || watchedIsFree === isFree}
              className="bg-blue-500 hover:bg-blue-600"
            >
              Save
            </CustomButton>
          </form>
        ) : (
          <p className="text-sm text-slate-600">
            {watchedIsFree
              ? "🟢 This chapter is free"
              : "🔒 This chapter is paid"}
          </p>
        )}
      </div>
    </section>
  );
};

export default ChapterAccessForm;
