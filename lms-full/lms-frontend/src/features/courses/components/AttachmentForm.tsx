"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Delete, Edit, Eye, FileText, Trash, Upload } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AspectRatio } from "@/shared/components/ui/aspect-ratio";
import { Spinner } from "@/shared/components/ui/spinner";
import CustomButton from "@/shared/components/custom/CustomButton";
import CustomInput from "@/shared/components/custom/CustomInput";
import { useCreateAttachment, useDeleteAttachment } from "../hooks/useCourse";
import { Attachment } from "../course";
import {
  CreateAttachmentSchema,
  CreateAttachmentSchemaType,
} from "../course.validation";

const MAX_SIZE = 5 * 1024 * 1024;

const AttachmentForm = ({
  attachments,
  courseId,
}: {
  attachments: Attachment[];
  courseId: string;
}) => {
  const [isEdit, setIsEdit] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const {
    mutateAsync: CreateAttachmentMutation,
    isPending: isCreatingAttachment,
  } = useCreateAttachment();

  const { mutateAsync: DeleteAttachmentMutation } = useDeleteAttachment();

  const {
    control,
    handleSubmit,
    reset,

    formState: { isValid },
  } = useForm<CreateAttachmentSchemaType>({
    resolver: zodResolver(CreateAttachmentSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
    },
  });

  const toggleEdit = () => {
    setIsEdit((prev) => !prev);
    setFile(null);
    setFilePreview(null);
    reset();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];

    if (!selected) {
      return;
    }

    /* SIZE */

    if (selected.size > MAX_SIZE) {
      toast.error("File must be less than 5MB");

      return;
    }

    /* TYPE */

    const allowed =
      selected.type.startsWith("image/") || selected.type === "application/pdf";

    if (!allowed) {
      toast.error("Only image or PDF allowed");

      return;
    }

    setFile(selected);

    /* PREVIEW */

    if (selected.type.startsWith("image/")) {
      setFilePreview(URL.createObjectURL(selected));
    } else {
      setFilePreview(null);
    }
  };

  const onSubmit = async (data: CreateAttachmentSchemaType) => {
    if (!file) {
      toast.error("Please select file");

      return;
    }

    try {
      const formData = new FormData();

      formData.append("file", file);
      formData.append("name", data.name);
      formData.append("courseId", courseId);
      await CreateAttachmentMutation(formData);

      toast.success("Attachment created successfully");

      toggleEdit();
    } catch (error) {
      console.log(error);

      toast.error("Failed to create attachment");
    }
  };

  const handleDelete = async (attachmentId: string) => {
    setDeletingId(attachmentId);

    try {
      await DeleteAttachmentMutation({
        attachmentId,
        courseId,
      });

      toast.success("Attachment deleted");
    } catch (error) {
      console.log(error);
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    return () => {
      if (filePreview?.startsWith("blob:")) {
        URL.revokeObjectURL(filePreview);
      }
    };
  }, [filePreview]);

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
          }`}
          onClick={toggleEdit}
        >
          {isEdit ? "Cancel" : "Add"}
        </CustomButton>
      </div>

      {/* BODY */}

      <div className="mt-4">
        {isEdit ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* NAME */}

            <CustomInput
              name="name"
              control={control}
              label="Attachment Name"
              placeholder="e.g Course Notes"
            />

            {/* FILE AREA */}

            <AspectRatio ratio={16 / 9}>
              <div className="relative w-full h-full rounded-lg border border-dashed overflow-hidden group">
                {filePreview ? (
                  <Image
                    src={filePreview}
                    alt="preview"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full bg-slate-50">
                    <FileText className="w-8 h-8 text-slate-400 mb-2" />

                    <p className="text-sm text-slate-500">
                      {file ? file.name : "Upload PDF/Image"}
                    </p>
                  </div>
                )}

                <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center cursor-pointer">
                  <Upload className="w-6 h-6 text-white mb-2" />

                  <p className="text-sm text-white">Choose File</p>

                  <input
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
            </AspectRatio>

            {/* SAVE */}

            <CustomButton
              type="submit"
              loading={isCreatingAttachment}
              loadingText="Saving..."
              disabled={!file || !isValid}
              className="bg-blue-500 hover:bg-blue-600"
            >
              Save Attachment
            </CustomButton>
          </form>
        ) : (
          <div className="space-y-2 max-h-72 overflow-y-auto">
            {attachments?.length === 0 ? (
              <p className="text-sm text-slate-500">No attachments uploaded</p>
            ) : (
              attachments.map((att) => (
                <div
                  key={att.id}
                  className="flex items-center justify-between rounded-md border px-3 py-2"
                >
                  <p className="text-sm text-blue-600">{att.name}</p>

                  <div className="flex items-center gap-2">
                    {/* PREVIEW */}

                    <CustomButton
                      size="icon"
                      variant="ghost"
                      onClick={() => setPreviewUrl(att.attachment_doc || null)}
                    >
                      <Eye className="w-4 h-4" />
                    </CustomButton>

                    {/* DELETE */}

                    <CustomButton
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDelete(att?.id as string)}
                    >
                      {deletingId === att.id ? (
                        <Spinner />
                      ) : (
                        <Trash className="w-4 h-4 text-red-500" />
                      )}
                    </CustomButton>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* PREVIEW MODAL */}

      {previewUrl && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center">
          <div className="bg-white rounded-xl p-4 w-full max-w-5xl relative">
            <button
              onClick={() => setPreviewUrl(null)}
              className="absolute top-4 right-4"
            >
              <Delete />
            </button>

            <div className="mt-8">
              {previewUrl.match(/\.(jpg|jpeg|png|webp|gif)$/i) ? (
                <Image
                  src={previewUrl}
                  alt="preview"
                  width={1000}
                  height={800}
                  className="w-full max-h-[80vh] object-contain"
                />
              ) : (
                <iframe
                  src={`https://docs.google.com/gview?url=${encodeURIComponent(
                    previewUrl,
                  )}&embedded=true`}
                  className="w-full h-[80vh]"
                  title="preview"
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
