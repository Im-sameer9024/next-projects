"use client";

import React from "react";
import { useGetAllCategories } from "../hooks/useCategory";
import { Skeleton } from "@/shared/components/ui/skeleton";
import ErrorPage from "@/shared/components/common/ErrorPage";
import SearchInput from "./SearchInput";
import CategoryItem from "./CategoryItem";
import { DataProps } from "@/features/search/search";

const CategoriesFilter = ({ filters, setFilters, loading }: DataProps) => {
  const { data, isPending: isCategoryPending, isError, error } = useGetAllCategories();

  if (isError) {
    return <ErrorPage message={error.message} />;
  }

  const categories = data?.data || [];

  return (
    <>
      <div className="py-2">
        <SearchInput setFilters={setFilters} loading={loading} />
      </div>
      <section className="scrollbar-hide w-full overflow-x-auto px-2">
        {isCategoryPending ? (
          <div className="flex gap-3 overflow-x-auto py-2">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-10 w-36 rounded-full" />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="py-4 text-sm text-slate-500">No categories found</div>
        ) : (
          <div className="flex min-w-max items-center gap-3 py-2">
            {categories.map((category: { id: string; name: string }) => (
              <CategoryItem
                key={category.id}
                label={category.name}
                value={category.id}
                setFilters={setFilters}
                filters={filters}
              />
            ))}
          </div>
        )}
      </section>
    </>
  );
};

export default CategoriesFilter;
