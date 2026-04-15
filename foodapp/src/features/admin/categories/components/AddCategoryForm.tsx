/* eslint-disable react-hooks/incompatible-library */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import InputField from "@/shared/components/custom/InputField";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  categoryCreateSchema,
  CategoryFormData,
} from "@/shared/validation/category.schema";
import Image from "next/image";
import CustomButton from "@/shared/components/custom/CustomButton";
import { useCreateCategory } from "../hooks/useCategory";
import { Input } from "@/shared/components/ui/input";
import { useUploadImage } from "../../products/hooks/useProduct";
import { AspectRatio } from "@/shared/components/ui/aspect-ratio";

const AddCategoryForm = ({
  closeAddCategoryModal,
}: {
  closeAddCategoryModal: () => void;
}) => {
  //--------------- image uploading related -------------------

  const [img, setImg] = useState<File | null>(null);
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const { mutateAsync: UploadImage, isPending: isUploading } = useUploadImage();

  const handleUpload = async () => {
    if (!img) return;

    try {
      const formData = new FormData();
      formData.append("image", img);

      const res = await UploadImage(formData as any);
      console.log(res)

      if (res?.data?.secure_url) {
        setImgUrl(res.data.secure_url);

        // 🔥 sync with form
        setValue("image", res.data?.secure_url);
        setValue("image_public_id", res.data?.public_id);
      }
    } catch (error) {
      console.error(error);
      alert("Upload failed");
    }
  };

  const {
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categoryCreateSchema),
    defaultValues: {
      title: "",
      description: "",
      slug: "",
      color: "#000000",
      image: "",
      image_public_id: "",
    },
  });

  const { mutate: createCategory, isPending: isCreatingCategory } =
    useCreateCategory();

  const onSubmit = async (data: CategoryFormData) => {
    // console.log("FORM DATA:", data); // 🔥 debug

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("slug", data.slug);
    formData.append("color", data.color);
    formData.append("image", data.image); // ✅ use from form
    formData.append("image_public_id", data.image_public_id); // ✅ use from form

    createCategory(formData as any, {
      onSuccess: () => {
        reset({
          title: "",
          description: "",
          slug: "",
          color: "#000000",
          image: "",
          image_public_id:"",
        });

        setImg(null);
        setImgUrl(null);
        setPreview(null);

        closeAddCategoryModal();
      },
    });
  };
  // ✅ Handle image properly (File, not FileList)
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      setImg(file);
      setPreview(URL.createObjectURL(file)); // ✅ simple + fast
      setImgUrl(null); // reset uploaded state
    }
  };

  // 🔥 Cleanup memory
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  return (
    <section>
      <div className="border-b-2 border-textLight my-4">
        <h3 className="text-textLight font-semibold text-xl">
          Create Category
        </h3>
      </div>

      {/*---------------------- Image Upload ------------------------- */}
      <div className="space-y-3">
        <label className="text-sm font-medium">Category Image</label>

        <div className="flex gap-3 items-center">
          <Input type="file" accept="image/*" onChange={handleImageChange} />

          <CustomButton
            onClick={handleUpload}
            loading={isUploading}
            disabled={!img || isUploading}
          >
            Upload
          </CustomButton>
        </div>

        {/* Preview */}
        <div className="max-w-md">
          <AspectRatio ratio={16 / 9} className="rounded-lg bg-muted">
            {preview ? (
              <Image
                src={preview}
                alt="Preview"
                loading="eager"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover rounded-lg"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-sm text-gray-400 border border-dashed border-gray-500 rounded-lg">
                No Image Selected
              </div>
            )}
          </AspectRatio>
        </div>

        {/* Upload Status */}
        {imgUrl && (
          <p className="text-green-500 text-sm">
            ✅ Image uploaded successfully
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        {/* Title */}
        <InputField
          name="title"
          control={control}
          error={errors.title}
          loading={isCreatingCategory}
          label="Title"
          placeholder="Enter Category Title"
          type="text"
        />

        {/* Description */}
        <InputField
          name="description"
          control={control}
          error={errors.description}
          loading={isCreatingCategory}
          label="Description"
          placeholder="Write Description"
          type="text"
        />

        {/* Slug */}
        <InputField
          name="slug"
          control={control}
          error={errors.slug}
          loading={isCreatingCategory}
          label="Slug"
          placeholder="If title is 'Pizzas', slug will be 'pizza'"
          type="text"
        />

        {/* Color (Improved UI) */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-textLight">
            Background Color
          </label>

          <div className="flex items-center gap-3">
            <input
              type="color"
              disabled={isCreatingCategory}
              {...control.register("color")}
              className="h-10 w-16 cursor-pointer border rounded"
            />

            {/* Live color preview box */}
            <div
              className="h-10 w-10 rounded border"
              style={{ backgroundColor: watch("color") }}
            />
          </div>

          {errors.color && (
            <p className="text-red-500 text-sm">{errors.color.message}</p>
          )}
        </div>

        {/* Submit */}
        <CustomButton
          active
          fullWidth
          type="submit"
          loading={isCreatingCategory}
        >
          {isSubmitting ? "Creating..." : "Create Category"}
        </CustomButton>
      </form>
    </section>
  );
};

export default AddCategoryForm;
