"use client";

import { SingleCategoryProps } from "@/shared/types/category";
import AdminCategoryCard from "./components/AdminCategoryCard";
import {
  useDeleteCategory,
  useGetAllCategories,
  useGetCategory,
} from "./hooks/useCategory";
import CardSkeleton from "@/shared/components/skeletons/CardSkeleton";
import ErrorMessage from "@/shared/components/common/ErrorMessage";
import Modal from "@/shared/components/custom/Modal";
import { useState } from "react";
import AddCategoryForm from "./components/AddCategoryForm";
import CustomButton from "@/shared/components/custom/CustomButton";
import EditCategoryForm from "./components/EditCategoryForm";

const AdminCategoryPage = () => {
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [showDeleteCategoryModal, setShowDeleteCategoryModal] = useState(false);
  const [showEditCategoryModal, setShowEditCategoryModal] = useState(false);
  const [categoryId, setCategoryId] = useState<number | null>(null);


  //------------------------- APIs ----------------
  const { data, isPending, error, isError } = useGetAllCategories();
  const {
    data: SingleCategoryData,
    isPending: isPendingSingleCategory,
    error: errorSingleCategory,
    isError: isErrorSingleCategory,
  } = useGetCategory(categoryId as number);

  const { mutate: deleteCategory, isPending: isDeleting } = useDeleteCategory();

  const categories = data?.data || [];

  //------------------------- Handlers ----------------
  const handleDeleteCategory = () => {
    if (!categoryId || !SingleCategoryData) return;


    deleteCategory(
      { categoryId, image_public_id: SingleCategoryData?.data?.image_public_id },
      {
        onSuccess: () => {
          setShowDeleteCategoryModal(false);
          setCategoryId(null);
        },
      },
    );
  };

  //------------------------- UI ----------------
  return (
    <>
      <section className="p-4 min-h-screen space-y-6">
        {/* Header */}
        <div className="flex justify-end">
          <CustomButton onClick={() => setShowAddCategoryModal(true)} active>
            Add Category
          </CustomButton>
        </div>

        {/* 🔥 ERROR */}
        {isError && <ErrorMessage ApiError={error} />}

        {/* 🔥 LOADING */}
        {isPending && (
          <div className="grid grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* 🔥 EMPTY STATE */}
        {!isPending && !isError && categories.length === 0 && (
          <div className="flex items-center justify-center h-75 ">
            <p className="text-gray-500 text-lg font-medium">
              No Categories Found
            </p>
          </div>
        )}

        {/* 🔥 DATA */}
        {!isPending && !isError && categories.length > 0 && (
          <div className="grid grid-cols-4 gap-4">
            {categories.map((category: SingleCategoryProps) => (
              <AdminCategoryCard
                key={category.id}
                category={category}
                openEditCategoryModal={(id: number) => {
                  setCategoryId(id);
                  setShowEditCategoryModal(true);
                }}
                openDeleteCategoryModal={(id: number) => {
                  setCategoryId(id);
                  setShowDeleteCategoryModal(true);
                }}
              />
            ))}
          </div>
        )}
      </section>

      {/*------------- ADD MODAL -------------------- */}
      <Modal
        isVisible={showAddCategoryModal}
        onClose={() => setShowAddCategoryModal(false)}
        width="60%"
        content={
          <AddCategoryForm
            closeAddCategoryModal={() => setShowAddCategoryModal(false)}
          />
        }
      />

      {/* ------------------- DELETE MODAL ---------------- */}
      <Modal
        isVisible={showDeleteCategoryModal}
        onClose={() => setShowDeleteCategoryModal(false)}
        content={
          <div className="space-y-4">
            <p className="text-sm">
              Are you sure you want to delete this category?
            </p>

            <div className="flex gap-3">
              <CustomButton
                onClick={handleDeleteCategory}
                loading={isDeleting}
                active
              >
                Delete
              </CustomButton>

              <CustomButton
                active={false}
                onClick={() => setShowDeleteCategoryModal(false)}
              >
                Cancel
              </CustomButton>
            </div>
          </div>
        }
      />

      {/* ------------------- EDIT MODAL ---------------- */}
      <Modal
        isVisible={showEditCategoryModal}
        onClose={() => setShowEditCategoryModal(false)}
        width="60%"
        content={
          <EditCategoryForm
            SingleCategoryData={SingleCategoryData?.data}
            isPendingSingleCategory={isPendingSingleCategory}
            errorSingleCategory={errorSingleCategory}
            isErrorSingleCategory={isErrorSingleCategory}
            closeModal={() => setShowEditCategoryModal(false)}
          />
        }
      />
    </>
  );
};

export default AdminCategoryPage;
