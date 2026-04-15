/* eslint-disable react-hooks/incompatible-library */
"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import ErrorMessage from "@/shared/components/common/ErrorMessage";
import CustomButton from "@/shared/components/custom/CustomButton";
import { AspectRatio } from "@/shared/components/ui/aspect-ratio";
import { Input } from "@/shared/components/ui/input";
import { SingleCategoryProps } from "@/shared/types/category";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useUploadImage } from "../../products/hooks/useProduct";
import InputField from "@/shared/components/custom/InputField";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CategoryUpdateData,
  categoryUpdateSchema,
} from "@/shared/validation/category.schema";
import { useUpdateCategory, useUpdateCategoryImage } from "../hooks/useCategory";
import { UpdateCategoryImage } from "../apiOperations";

interface Props {
  SingleCategoryData: SingleCategoryProps;
  isPendingSingleCategory: boolean;
  errorSingleCategory: any;
  isErrorSingleCategory: boolean;
  closeModal: () => void;
}

const EditCategoryForm = ({
  SingleCategoryData,
  isPendingSingleCategory,
  errorSingleCategory,
  isErrorSingleCategory,
  closeModal,
}: Props) => {
  // 🔥 IMAGE STATES
  const [img, setImg] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const { mutateAsync: UploadImage, isPending: isUploading } = useUpdateCategoryImage();

  // 🔥 FORM
  const {
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CategoryUpdateData>({
    resolver: zodResolver(categoryUpdateSchema),
    defaultValues: {
      title: "",
      description: "",
      slug: "",
      color: "#000000",
    },
  });

  const { mutate: updateCategory, isPending: isUpdating } = useUpdateCategory();

  // 🔥 SET DEFAULT DATA
  useEffect(() => {
    if (SingleCategoryData) {
      reset({
        title: SingleCategoryData.title,
        description: SingleCategoryData.description,
        slug: SingleCategoryData.slug,
        color: SingleCategoryData.color,
      });

      setPreview(SingleCategoryData.image);
    }
  }, [SingleCategoryData, reset]);

  // 🔥 HANDLE IMAGE CHANGE
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      setImg(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // 🔥 HANDLE UPLOAD
  const handleUpload = async () => {
    if (!img) return;

    const formData = new FormData();
    formData.append("image", img);
    formData.append("categoryId", String(SingleCategoryData.id));

    const res = await UploadImage(formData as any);

    console.log(res)

    if (res?.data?.secure_url) {
      const uploadedUrl = res.data.secure_url;

      

      // 🔥 IMPORTANT: update preview also
      setPreview(uploadedUrl);

      // optional: clear file
      setImg(null);
    }
  };

  // 🔥 SUBMIT
  const onSubmit = (data: CategoryUpdateData) => {
    const formData = new FormData();

    formData.append("categoryId", String(SingleCategoryData.id));
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("slug", data.slug);
    formData.append("color", data.color);

    updateCategory(formData as any, {
      onSuccess: () => {
        closeModal();
      },
    });
  };

  return (
    <section>
      <div className="border-b-2 border-textLight my-4">
        <h3 className="text-textLight font-semibold text-xl">Edit Category</h3>
      </div>

      {/* ERROR */}
      {isErrorSingleCategory && <ErrorMessage ApiError={errorSingleCategory} />}

      {/* LOADING */}
      {isPendingSingleCategory && <p className="text-center">Loading...</p>}

      {/* FORM */}
      {!isPendingSingleCategory &&
        !isErrorSingleCategory &&
        SingleCategoryData && (
          <>
            {/* IMAGE SECTION */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Category Image</label>

              <div className="flex gap-3 items-center">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />

                <CustomButton
                  onClick={handleUpload}
                  loading={isUploading}
                  disabled={!img || isUploading}
                >
                  Upload
                </CustomButton>
              </div>

              {/* PREVIEW */}
              <div className="max-w-md">
                <AspectRatio ratio={16 / 9}>
                  {preview ? (
                    <Image
                      src={preview}
                      alt="Preview"
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover rounded-lg"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-sm text-gray-400 border rounded-lg">
                      No Image
                    </div>
                  )}
                </AspectRatio>
              </div>
            </div>

            {/* FORM */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 mt-4">
              <InputField
                name="title"
                control={control}
                error={errors.title}
                label="Title"
                placeholder="Enter title"
              />

              <InputField
                name="description"
                control={control}
                error={errors.description}
                label="Description"
                placeholder="Enter description"
              />

              <InputField
                name="slug"
                control={control}
                error={errors.slug}
                label="Slug"
                placeholder="Enter slug"
              />

              {/* COLOR */}
              <div className="space-y-1">
                <label>Color</label>

                <div className="flex gap-3 items-center">
                  <input type="color" {...control.register("color")} />

                  <div
                    className="w-10 h-10 rounded border"
                    style={{
                      backgroundColor: watch("color"),
                    }}
                  />
                </div>
              </div>

              <CustomButton type="submit" loading={isUpdating} fullWidth active>
                {isSubmitting ? "Updating..." : "Update Category"}
              </CustomButton>
            </form>
          </>
        )}
    </section>
  );
};

export default EditCategoryForm;
