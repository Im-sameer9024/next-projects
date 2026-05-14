"use client";

import { useGetCategories } from "@/features/teacher/course/hooks/useCategory";

import ErrorPage from "@/shared/components/common/ErrorPage";
import { Skeleton } from "@/shared/components/ui/skeleton";

import CategoryItem from "./CategoryItem";
import SearchInput from "@/shared/components/common/SearchInput";
import AllCourses from "./AllCourses";

const Categories = () => {
  const { data, isPending, isError, error } = useGetCategories();

  // loading state

  if (isPending) {
    return (
      <div className="flex gap-3 overflow-x-auto py-2">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="h-10 w-36 rounded-full" />
        ))}
      </div>
    );
  }

  // error state
  if (isError) {
    return <ErrorPage message={error.message} />;
  }

  const categories = data?.data || [];

  return (
    <>
      <div className="block py-2 md:mb-0 md:hidden">
        <SearchInput />
      </div>
      <section className="scrollbar-hide w-full overflow-x-auto px-2">
        <div className="flex min-w-max items-center gap-3 py-2">
          {categories.map((category: { id: string; name: string }) => (
            <CategoryItem key={category.id} label={category.name} value={category.id} />
          ))}
        </div>
      </section>
      <AllCourses />
    </>
  );
};

export default Categories;
