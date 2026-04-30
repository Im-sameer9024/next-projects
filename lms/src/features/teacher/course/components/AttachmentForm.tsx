/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import { Attachment } from "@/generated/prisma/client";
import React, { useState } from "react";
import CustomButton from "@/shared/components/custom/CustomButton";
import CustomInput from "@/shared/components/custom/CustomInput";
import { AspectRatio } from "@/shared/components/ui/aspect-ratio";
import { Edit, Upload, Trash, Eye, Delete } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateCourseAttachmentSchema,
  CreateCourseAttachmentSchemaType,
} from "@/shared/validation/course.validation";
import {
  useCreateAttachment,
  useDeleteAttachment,
} from "../hooks/useAttachment";
import { GetApiErrorMessage } from "@/shared/lib/apiMessages";
import { Spinner } from "@/shared/components/ui/spinner";
import { UploadAttachment } from "../apiOperations";
import Link from "next/link";

const MAX_SIZE = 5 * 1024 * 1024;

type UploadedData = {
  secure_url: string;
  public_id: string;
};

const AttachmentForm = ({
  attachments,
  courseId,
}: {
  attachments: Attachment[];
  courseId: string;
}) => {
  const [isEdit, setIsEdit] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploadedData, setUploadedData] = useState<UploadedData | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const {
    mutateAsync: CreateAttachmentMutation,
    isPending: isCreateAttachmentPending,
  } = useCreateAttachment();
  const {
    mutateAsync: DeleteAttachmentMutation,
    isPending: isDeleteAttachmentPending,
  } = useDeleteAttachment();

  const {
    control,
    handleSubmit,
    formState: { isValid },
    reset,
  } = useForm<CreateCourseAttachmentSchemaType>({
    resolver: zodResolver(CreateCourseAttachmentSchema),
    mode: "onChange",
    defaultValues: { name: "", url: "", public_id: "" },
  });

  const toggleEdit = () => {
    setIsEdit((prev) => !prev);
    setFile(null);
    setUploadedData(null);
    setFilePreviewUrl(null);
    reset();
  };

  // 📌 File validation
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (selected.size > MAX_SIZE) {
      toast.error("File must be less than 5MB");
      return;
    }

    if (
      !selected.type.startsWith("image/") &&
      selected.type !== "application/pdf"
    ) {
      toast.error("Only image or PDF allowed");
      return;
    }

    setFile(selected);
    if (selected.type.startsWith("image/")) {
      setFilePreviewUrl(URL.createObjectURL(selected));
    } else {
      setFilePreviewUrl(null);
    }
  };

  // 📌 Upload
  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await UploadAttachment(formData);

      console.log("res is here", res);

      if (res?.success) {
        setUploadedData(res.data);
        toast.success("File uploaded successfully");
      }
    } catch (error) {
      toast.error(GetApiErrorMessage(error));
    } finally {
      setIsUploading(false);
    }
  };

  // 📌 Save
  const onSubmit = async (data: CreateCourseAttachmentSchemaType) => {
    if (!uploadedData) {
      toast.error("Upload file first");
      return;
    }

    const formData = new FormData();
    formData.append("url", uploadedData.secure_url);
    formData.append("public_id", uploadedData.public_id);
    formData.append("name", data.name);
    formData.append("course_id", courseId);

    await CreateAttachmentMutation(formData as any);

    toggleEdit();
  };

  // 📌 Delete
  const handleDelete = async (attachmentId: string) => {
    setDeletingId(attachmentId);
    try {
      await DeleteAttachmentMutation({
        attachmentId: attachmentId,
        courseId: courseId,
      });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section className="bg-white border p-4 border-slate-200 rounded">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-sm text-slate-700">
          Course Attachments
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
          {isEdit ? "Cancel" : "Edit"}
        </CustomButton>
      </div>

      <div className="mt-3">
        {isEdit ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <CustomInput
              name="name"
              control={control}
              label="Attachment Name"
              placeholder="Enter attachment name"
            />

            {/* FILE INPUT */}
            <AspectRatio ratio={16 / 9}>
              <div className="relative w-full h-full group rounded-md overflow-hidden border border-dashed">
                {filePreviewUrl ? (
                  <Image
                    src={filePreviewUrl}
                    alt="file preview"
                    fill
                    sizes="(max-width: 768px) 100vw, 800px"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full bg-gray-100">
                    <Upload className="w-6 h-6 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">
                      {file ? file.name : "Choose PDF/Image (<5MB)"}
                    </p>
                  </div>
                )}

                <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center cursor-pointer">
                  <Upload className="w-6 h-6 text-white mb-1" />
                  <p className="text-sm text-white font-medium">
                    Change File
                  </p>
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
            </AspectRatio>

            {/* BUTTONS */}
            <div className="flex gap-4">
              <CustomButton
                type="button"
                onClick={handleUpload}
                disabled={!file}
                loadingText="Uploading..."
                loading={isUploading}
              >
                Upload
              </CustomButton>

              <CustomButton
                type="submit"
                loading={isCreateAttachmentPending}
                loadingText="Saving..."
                disabled={
                  !uploadedData || !isValid || isCreateAttachmentPending
                }
                className="bg-blue-500 hover:bg-blue-600"
              >
                Save
              </CustomButton>
            </div>
          </form>
        ) : (
          <div className="space-y-2">
            {attachments.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 bg-gray-100 border border-dashed rounded-md">
                <Upload className="w-6 h-6 text-gray-400 mb-1" />
                <p className="text-sm text-gray-500">No attachments uploaded</p>
              </div>
            ) : (
              attachments.map((att) => (
                <div
                  key={att.id}
                  className="flex justify-between items-center border border-slate-200 rounded-md px-3 py-2 "
                >
                  <Link
                    href={att?.url}
                    target="_blank"
                    className="text-sm text-blue-600"
                  >
                    {att.name}
                  </Link>

                  <div className="flex items-center gap-3">
                    {/* 👁 Preview */}
                    <CustomButton
                      size={"icon"}
                      variant={"ghost"}
                      onClick={() => setPreviewUrl(att.url)}
                    >
                      <Eye className="w-4 h-4 cursor-pointer text-gray-600 hover:text-black" />
                    </CustomButton>

                    {/* 🗑 Delete */}
                    <CustomButton
                      size={"icon"}
                      variant={"ghost"}
                      onClick={() => handleDelete(att.id)}
                    >
                      {deletingId === att.id ? (
                        <Spinner />
                      ) : (
                        <Trash className="w-4 h-4 text-red-500 cursor-pointer hover:text-red-700" />
                      )}
                    </CustomButton>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* 🔥 PREVIEW MODAL */}
      {previewUrl && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
          <div className="bg-white p-4 rounded-lg w-full max-w-4xl relative">
            {/* Close */}
            <button
              onClick={() => setPreviewUrl(null)}
              className="absolute top-2 right-2"
            >
              {isDeleteAttachmentPending ? <Spinner /> : <Delete />}
            </button>

            <div className="mt-6">
              {previewUrl.match(/\.(jpg|jpeg|png|webp|gif)$/i) ? (
                <Image
                  src={previewUrl}
                  alt="Attachment preview"
                  width={800}
                  height={600}
                  className="w-full max-h-[75vh] object-contain"
                />
              ) : (
                <iframe
                  src={`https://docs.google.com/gview?url=${encodeURIComponent(
                    previewUrl,
                  )}&embedded=true`}
                  className="w-full h-[75vh]"
                  title="Attachment preview"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default AttachmentForm;
