/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { AspectRatio } from "@/shared/components/ui/aspect-ratio";
import { Input } from "@/shared/components/ui/input";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useUploadImage } from "../hooks/useProduct";
import CustomButton from "@/shared/components/custom/CustomButton";

const AddProductForm = () => {
  const [img, setImg] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const { mutateAsync: uploadImage, isPending: isUploading } = useUploadImage();

  // 🔥 Handle file change
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      setImg(file);
      setPreview(URL.createObjectURL(file)); // ✅ simple + fast
      setImageUrl(null); // reset uploaded state
    }
  };

  // 🔥 Upload image
  const handleUpload = async () => {
    if (!img) return;

    try {
      const formData = new FormData();
      formData.append("image", img);

      const res = await uploadImage(formData as any);

      if (res?.data?.secure_url) {
        setImageUrl(res.data.secure_url);
      }
    } catch (error) {
      console.error(error);
      alert("Upload failed");
    }
  };

  // 🔥 Cleanup memory
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  return (
    <section className="space-y-5">
      {/* Heading */}
      <div className="border-b pb-2">
        <h3 className="text-lg font-semibold">Create Product</h3>
      </div>

      {/* Image Upload */}
      <div className="space-y-3">
        <label className="text-sm font-medium">Product Image</label>

        <div className="flex gap-3 items-center">
          <Input type="file" accept="image/*" onChange={handleImageChange} />

          <CustomButton
            onClick={handleUpload}
            loading={isUploading}
            disabled={!img || isUploading}
          >
            {isUploading ? "Uploading..." : "Upload"}
          </CustomButton>
        </div>

        {/* Preview */}
        <div className="max-w-md">
          <AspectRatio ratio={16 / 9} className="rounded-lg bg-muted">
            {preview ? (
              <Image
                src={preview}
                alt="Preview"
                fill
                sizes="(max-width: 768px) 100vw, 25vw"
                className="rounded-lg object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-sm text-gray-400 border border-dashed border-gray-500 rounded-lg">
                No Image Selected
              </div>
            )}
          </AspectRatio>
        </div>

        {/* Upload Status */}
        {imageUrl && (
          <p className="text-green-500 text-sm">
            ✅ Image uploaded successfully
          </p>
        )}
      </div>
    </section>
  );
};

export default AddProductForm;
