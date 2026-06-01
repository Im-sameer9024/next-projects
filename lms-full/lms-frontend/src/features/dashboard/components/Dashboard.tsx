/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";

import { BookOpen, CheckCircle2, Clock3 } from "lucide-react";

import ErrorPage from "@/shared/components/common/ErrorPage";
import { Progress } from "@/shared/components/ui/progress";
import { useDashboardData } from "@/features/search/hooks/useCourse";
import { Course } from "@/features/courses/course";
import CourseCard from "@/features/search/components/CourseCard";


const Dashboard = () => {
  const {
    data,
    isPending,
    isError,
    error,
  } = useDashboardData();

  console.log(data)

  if (isPending) {
    return (
      <div className="p-6">
        Loading Dashboard...
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorPage
        message={
          error?.message ||
          "Failed to load dashboard"
        }
      />
    );
  }

  const dashboard = data?.data;

  const courses =
    dashboard?.courses ?? [];

  const stats =
    dashboard?.stats;

  return (
    <div className="space-y-8 p-6">
      {/* Stats */}

      <div className="grid gap-4 md:grid-cols-2">
        <div className="flex items-center gap-4 rounded-xl border p-5">
          <div className="rounded-full bg-blue-100 p-3">
            <Clock3 className="h-6 w-6 text-blue-600" />
          </div>

          <div>
            <h3 className="font-semibold">
              In Progress
            </h3>

            <p className="text-sm text-slate-500">
              {stats?.inProgressCourses} Courses
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-xl border p-5">
          <div className="rounded-full bg-green-100 p-3">
            <CheckCircle2 className="h-6 w-6 text-green-600" />
          </div>

          <div>
            <h3 className="font-semibold">
              Completed
            </h3>

            <p className="text-sm text-slate-500">
              {stats?.completedCourses} Courses
            </p>
          </div>
        </div>
      </div>

      {/* Courses */}

      <section className="grid grid-cols-1 gap-6 py-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {courses.map((course:any) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </section>
    </div>
  );
};

export default Dashboard;