"use client";

import { SingleCategoryProps } from "@/shared/types/category";
import AdminCategoryCard from "./components/AdminCategoryCard";
import { useGetAllCategories } from "./hooks/useCategory";
import CardSkeleton from "@/shared/components/skeletons/CardSkeleton";

const AdminCategoryPage = () => {
  const {
    data: Categories,
    isPending: isCategoriesPending,
    error: isCategoriesError,
    isError: isCategoriesErrorFlag,
  } = useGetAllCategories();

  if (isCategoriesErrorFlag) {
    return (
      <div className="flex items-center justify-center min-h-50">
        <p className="text-sm text-red-500">
          {isCategoriesError instanceof Error
            ? isCategoriesError.message
            : "Something went wrong while fetching categories"}
        </p>
      </div>
    );
  }
  const CategoriesData = Categories?.data || [];

  return (
    <div aria-label="dashboard-page" className="  p-4 rounded-md min-h-screen">
      <div className=" grid grid-cols-4 gap-4">
        {isCategoriesPending
          ? Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)
          : CategoriesData.map((category: SingleCategoryProps) => {
              return (
                <AdminCategoryCard key={category.id} category={category} />
              );
            })}
      </div>
    </div>
  );
};

export default AdminCategoryPage;
