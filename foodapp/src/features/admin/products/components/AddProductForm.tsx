"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { AspectRatio } from "@/shared/components/ui/aspect-ratio";
import { Input } from "@/shared/components/ui/input";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useCreateProduct, useUploadImage } from "../hooks/useProduct";
import CustomButton from "@/shared/components/custom/CustomButton";
import InputField from "@/shared/components/custom/InputField";
import { useForm, Controller } from "react-hook-form";
import { useGetAllCategories } from "../../categories/hooks/useCategory";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  productCreateSchema,
  productCreateSchemaProps,
} from "@/shared/validation/product.schema";
import { toast } from "sonner";

const AddProductForm = () => {
  // 🔥 IMAGE STATE
  const [img, setImg] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const { mutateAsync: uploadImage, isPending: isUploading } = useUploadImage();
  const { mutateAsync: createProduct, isPending: isCreating } =
    useCreateProduct();

  const { data: Categories, isPending: isFetchingCategories } =
    useGetAllCategories();

  const productSlugs =
    Categories?.data?.map((category: any) => category.slug) || [];

  // 🔥 FORM
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<productCreateSchemaProps>({
    resolver: zodResolver(productCreateSchema),
    defaultValues: {
      title: "",
      description: "",
      price: "",
      size: "",
      slug: "",
      isFeatured: false,
      image: "",
      image_public_id: "",
    },
  });

  // 🔥 IMAGE CHANGE
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      setImg(file);
      setPreview(URL.createObjectURL(file));
      setImageUrl(null);
    }
  };

  // 🔥 IMAGE UPLOAD
  const handleUpload = async () => {
    if (!img) return;

    const formData = new FormData();
    formData.append("image", img);

    const res = await uploadImage(formData as any);

    if (res?.data?.secure_url) {
      setImageUrl(res.data.secure_url);
      setValue("image", res.data?.secure_url);
      setValue("image_public_id", res.data?.public_id);
    }
  };

  // 🔥 CLEANUP
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  // 🔥 SUBMIT
  const onSubmit = async (data: any) => {
    console.log("sdferfe", data);
    if (!imageUrl) {
      toast.error("upload image ");
      return;
    }

    await createProduct(data as any);
  };

  return (
    <section className="space-y-5">
      {/* Heading */}
      <div className="border-b pb-2">
        <h3 className="text-lg font-semibold">Create Product</h3>
      </div>

      {/* IMAGE */}
      <div className="space-y-3">
        <label>Product Image</label>

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

        <div className="max-w-md">
          <AspectRatio ratio={16 / 9} className="rounded-lg bg-muted">
            {preview ? (
              <Image
                src={preview}
                alt="Preview"
                fill
                sizes="(max-width: 768px) 100vw, 25vw"
                className="object-cover rounded-lg"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-sm text-gray-400 border border-dashed border-gray-500 rounded-lg">
                No Image Selected
              </div>
            )}
          </AspectRatio>
        </div>

        {imageUrl && (
          <p className="text-green-500 text-sm">
            ✅ Image uploaded successfully
          </p>
        )}
      </div>

      {/* FORM */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <InputField
          name="title"
          control={control}
          error={errors.title}
          loading={isCreating}
          label="Title"
          placeholder="Enter Product Title"
          type="text"
        />

        <InputField
          name="description"
          control={control}
          error={errors.description}
          loading={isCreating}
          label="Description"
          placeholder="Description"
          type="text"
        />

        <InputField
          name="price"
          control={control}
          error={errors.price}
          type="number"
          loading={isCreating}
          label="Price"
          placeholder="23"
        />

        <InputField
          name="size"
          control={control}
          error={errors.size}
          placeholder="s,m,l"
          type="text"
          loading={isCreating}
          label="Size"
        />

        {/* 🔥 SLUG SELECT (FIXED WITH RHF) */}
        <div>
          <label htmlFor="slug" className="text-sm font-medium">
            Category
          </label>
          <Controller
            name="slug"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>

                <SelectContent>
                  <SelectGroup>
                    {isFetchingCategories ? (
                      <SelectItem value="loading">Loading...</SelectItem>
                    ) : (
                      productSlugs.map((slug: string, i: number) => (
                        <SelectItem key={i} value={slug}>
                          {slug}
                        </SelectItem>
                      ))
                    )}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
        </div>

        {/* 🔥 CHECKBOX (FIXED) */}
        <Controller
          name="isFeatured"
          control={control}
          render={({ field }) => (
            <div className="flex items-center gap-2">
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
              <label>Featured Product</label>
            </div>
          )}
        />

        <CustomButton type="submit" loading={isCreating} fullWidth active>
          Create Product
        </CustomButton>
      </form>
    </section>
  );
};

export default AddProductForm;
