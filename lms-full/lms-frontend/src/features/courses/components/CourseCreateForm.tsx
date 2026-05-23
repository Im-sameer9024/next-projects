"use client";

import React, { useEffect, useState } from "react";

import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import CustomButton from "@/shared/components/custom/CustomButton";

import CustomInput from "@/shared/components/custom/CustomInput";

import { Skeleton } from "@/shared/components/ui/skeleton";

import {
  CreateCourseSchema,
  CreateCourseSchemaType,
} from "../course.validation";

import { useCreateCourse } from "../hooks/useCourse";
import { useAiCourseTitles } from "../hooks/useAiCourse";


const CourseCreateForm = () => {
  const router = useRouter();

  const [suggestions, setSuggestions] = useState<string[]>([]);

  /* -------------------------------------------------------------------------- */
  /*                                  HOOKS                                     */
  /* -------------------------------------------------------------------------- */

  const {
    mutateAsync: CreateCourse,

    isPending: isCreatingCourse,
  } = useCreateCourse();

  const {
    mutateAsync: GenerateTitles,

    isPending: isGenerating,
  } = useAiCourseTitles();

  /* -------------------------------------------------------------------------- */
  /*                                   FORM                                     */
  /* -------------------------------------------------------------------------- */

  const {
    control,
    handleSubmit,
    reset,
    setValue,

    formState: { isSubmitting },
  } = useForm<CreateCourseSchemaType>({
    resolver: zodResolver(CreateCourseSchema),

    defaultValues: {
      title: "",
    },
  });

  /* -------------------------------------------------------------------------- */
  /*                                WATCH TITLE                                 */
  /* -------------------------------------------------------------------------- */

  const title = useWatch({
    control,

    name: "title",
  });

  /* -------------------------------------------------------------------------- */
  /*                              AI SUGGESTIONS                                */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    const generate = async () => {
      if (!title || title.length < 3) {
        setSuggestions([]);

        return;
      }

      try {
        const result = await GenerateTitles(title);

        setSuggestions(result);
      } catch (error) {
        console.error(error);
      }
    };

    const timer = setTimeout(generate, 700);

    return () => clearTimeout(timer);
  }, [title, GenerateTitles]);

  /* -------------------------------------------------------------------------- */
  /*                                   SUBMIT                                   */
  /* -------------------------------------------------------------------------- */

  const onSubmit = async (data: CreateCourseSchemaType) => {
    try {
      const res = await CreateCourse(data);

      if (res.success) {
        router.push(`/teacher/courses/${res.data?.id}`);

        reset();
      }
    } catch (error) {
      console.error(error);
    }
  };

  /* -------------------------------------------------------------------------- */
  /*                                   CANCEL                                   */
  /* -------------------------------------------------------------------------- */

  const handleCancel = () => {
    reset();

    setSuggestions([]);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="
        mt-4
        space-y-5
        max-w-2xl
      "
    >
      {/* INPUT */}

      <CustomInput
        name="title"
        control={control}
        disabled={isCreatingCourse}
        label="Course title"
        type="text"
        placeholder="
          e.g Web Development Bootcamp
        "
      />

      {/* AI Suggestions */}

      {(isGenerating || suggestions.length > 0) && (
        <div
          className="
            rounded-2xl
            border
            bg-white
            p-4
            shadow-sm
            space-y-4
          "
        >
          <div
            className="
              flex
              items-center
              justify-between
            "
          >
            <h3
              className="
                text-sm
                font-medium
                text-slate-700
              "
            >
              AI Suggestions
            </h3>

            {isGenerating && (
              <span
                className="
                  text-xs
                  text-slate-500
                  animate-pulse
                "
              >
                Generating...
              </span>
            )}
          </div>

          {isGenerating ? (
            <div
              className="
                grid
                grid-cols-2
                gap-4
              "
            >
              {Array.from({
                length: 4,
              }).map((_, index) => (
                <Skeleton
                  key={index}
                  className="
                    h-16
                    rounded-xl
                  "
                />
              ))}
            </div>
          ) : (
            <div
              className="
                grid
                grid-cols-2
                gap-4
              "
            >
              {suggestions.map((item, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() =>
                    setValue("title", item, {
                      shouldDirty: true,

                      shouldValidate: true,
                    })
                  }
                  className="
                      rounded-xl
                      border
                      p-4
                      text-left
                      text-sm
                      font-medium
                      transition-all
                      hover:border-blue-500
                      hover:bg-blue-50
                      hover:text-blue-600
                    "
                >
                  {item}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* BUTTONS */}

      <div
        className="
          flex
          items-center
          gap-4
        "
      >
        <CustomButton
          disabled={isCreatingCourse}
          type="button"
          variant="ghost"
          onClick={handleCancel}
          className="
            text-slate-500
          "
        >
          Cancel
        </CustomButton>

        <CustomButton
          type="submit"
          loading={isSubmitting || isCreatingCourse}
          disabled={isCreatingCourse}
          className="
            bg-blue-500
            hover:bg-blue-600
          "
        >
          Continue
        </CustomButton>
      </div>
    </form>
  );
};

export default CourseCreateForm;
