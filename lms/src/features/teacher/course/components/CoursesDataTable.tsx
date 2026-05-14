"use client";

import React, { useState } from "react";
import { columns, CourseColumn } from "./tables/columns";
import { DataTable } from "./tables/data-table";
import {  useGetCoursesByTeacher } from "../hooks/useCourse";
import ErrorPage from "@/shared/components/common/ErrorPage";
import DataTableSkeleton from "../skeleton/DataTableSkeleton";

const DEFAULT_PAGINATION = {
  totalCourses: 0,
  totalPages: 1,
  currentPage: 1,
  limit: 10,
  hasNextPage: false,
  hasPrevPage: false,
};

const CoursesDataTable = () => {
  const [page, setPage] = useState(1);

  const { data: response, isPending, isError, error } = useGetCoursesByTeacher(page);

  if (isPending) {
    return (
      <div className="p-6">
        <DataTableSkeleton rows={8} columns={4} />
      </div>
    );
  }

  if (isError) {
    return <ErrorPage message={error?.message || "Failed to fetch courses"} />;
  }

  const courseData = (response?.data ?? []) as CourseColumn[];
  const pagination = response?.pagination ?? DEFAULT_PAGINATION;

  return (
    <div className="p-6">
      <DataTable
        columns={columns}
        data={courseData}
        pagination={pagination}
        onPageChange={setPage}
      />
    </div>
  );
};

export default CoursesDataTable;