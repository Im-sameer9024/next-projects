// app/courses/[courseId]/layout.tsx
import { getProgress } from "@/actions/getProgress";
import CourseSidebar from "@/features/user/components/CourseSidebar";
import { auth } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/prisma";
import { redirect } from "next/navigation";
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
  const session = await auth();
  const { courseId } = await params;

  if (!session?.user.id) {
    return redirect("/");
  }

  const course = await prisma.course.findUnique({
    where: {
      id: courseId,
    },
    include: {
      chapters: {
        where: {
          isPublished: true,
        },
        include: {
          userProgresses: {
            where: {
              userId: session.user.id,
            },
          },
        },
        orderBy: {
          createdAt: "asc", 
        },
      },
    },
  });

  if (!course) {
    return redirect("/");
  }

  const [progressCount, purchase] = await Promise.all([
    getProgress(session.user.id, courseId),
    prisma.purchase.findUnique({
      where: {
        userId_courseId: {
          userId: session.user.id,
          courseId: courseId,
        },
      },
    }),
  ]);

  return (
    <div className="flex h-full">
      {/* Mobile sidebar trigger - optional */}
      <div className="hidden md:flex h-full w-80 flex-col fixed inset-y-0 z-50">
        <CourseSidebar
          course={course}
          purchase={purchase || undefined}
          progressCount={progressCount}
        />
      </div>
      <main className="flex-1 md:pl-80">
        <div className="h-full">
          {children}
        </div>
      </main>
    </div>
  );
};

export default CourseLayout;