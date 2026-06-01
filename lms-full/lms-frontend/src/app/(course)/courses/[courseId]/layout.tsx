import CourseSidebar from "@/features/search/components/CourseSidebar";
import MobileCourseSidebar from "@/features/search/components/MobileCourseSidebar";

import React from "react";

const CourseLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;

  params: Promise<{
    courseId: string;
  }>;
}) => {
  const { courseId } = await params;

  return (
    <div className="h-screen overflow-hidden bg-white">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[320px] border-r border-slate-200 bg-white lg:flex">
        <CourseSidebar courseId={courseId} />
      </aside>

      {/* Content */}
      <main className="h-screen overflow-y-auto lg:pl-80">
        {/* Mobile Header */}
        <div className="sticky top-0 z-30 flex items-center gap-3 border-b bg-white px-4 py-3 lg:hidden">
          <MobileCourseSidebar courseId={courseId} />

          <span className="font-medium">Course Content</span>
        </div>

        <div className="min-h-full bg-slate-50">{children}</div>
      </main>
    </div>
  );
};

export default CourseLayout;
