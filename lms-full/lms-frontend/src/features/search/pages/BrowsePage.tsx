"use client";

import CategoriesFilter from "@/features/category/components/CategoriesFilter";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";
import { useGetAllCoursesOfUser } from "../hooks/useCourse";
import Courses from "../components/Courses";
import ErrorPage from "@/shared/components/common/ErrorPage";

const BrowsePage = () => {
  const [filters, setFilters] = useQueryStates({
    search: parseAsString.withDefault(""),
    categoryId: parseAsString.withDefault(""),
    page: parseAsInteger.withDefault(1),
    limit: parseAsInteger.withDefault(10),
  });

  const { data, isPending, isFetching, isError, error } = useGetAllCoursesOfUser(filters);

  if (isError) {
    return <ErrorPage message={error.message} />;
  }

  return (
    <div>
      <CategoriesFilter filters={filters} setFilters={setFilters} loading={isFetching} />
      <Courses courses={data?.data || []} loading={isPending} />
    </div>
  );
};

export default BrowsePage;
