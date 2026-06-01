"use client";

import { Plus } from "lucide-react";

import React, { useCallback, useState } from "react";

import Link from "next/link";

import CustomButton from "@/shared/components/custom/CustomButton";

import { useGetAllCoursesOfTeacher } from "../hooks/useCourse";

import { useAuthStore } from "@/shared/store/auth.store";

import DataTableSkeleton from "../skeletons/DataTableSkeleton";

import ErrorPage from "@/shared/components/common/ErrorPage";

import { columns, CourseColumn } from "../components/table/columns";

import { paginationProps } from "../course";

import { DataTable } from "../components/table/DataTable";

const CourseDataTablePage = () => {
  const { user } = useAuthStore();

  const userId = user?.id;

  const [filterParams, setFilterParams] = useState({
    page: 1,
    limit: 10,
    search: "",
  });

  const { data, isPending, isFetching, isError, error } = useGetAllCoursesOfTeacher(
    filterParams,
    userId as string,
  );

  // pagination handler
  const handlePageChange = (page: number) => {
    setFilterParams((prev) => ({
      ...prev,
      page,
    }));
  };

  const handleSearchChange = useCallback((search: string) => {
    setFilterParams((prev) => ({
      ...prev,
      search,
      page: 1,
    }));
  }, []);

  // loading
  if (isPending) {
    return (
      <div className="p-6">
        <DataTableSkeleton rows={8} columns={4} />
      </div>
    );
  }

  if (isError) {
    return <ErrorPage message={error?.message || "Error while fetching courses"} />;
  }

  const courses = (data?.data ?? []) as CourseColumn[];
  const pagination = data?.pagination as paginationProps;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-800">My Courses</h1>

        <Link href="/teacher/courses/create">
          <CustomButton leftIcon={<Plus />} className="bg-blue-500 hover:bg-blue-600">
            New Course
          </CustomButton>
        </Link>
      </div>

      {/* Table */}
      <section>
        <DataTable
          columns={columns}
          data={courses}
          pagination={pagination}
          onPageChange={handlePageChange}
          onSearchChange={handleSearchChange}
          searchValue={filterParams?.search}
          isSearching={isFetching}
        />
      </section>
    </div>
  );
};

export default CourseDataTablePage;
