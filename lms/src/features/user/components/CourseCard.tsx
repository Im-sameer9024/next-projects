"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import Image from "next/image";
import Link from "next/link";

import { BookOpen } from "lucide-react";

import { Progress } from "@/shared/components/ui/progress";

function CourseCard({ course, progress }: { course: any; progress: number }) {
  return (
    <Link href={`/courses/${course.id}`} className="block">
      <div
        className="
          overflow-hidden
          rounded-2xl
          border
          border-slate-200
          bg-white
          shadow-sm
          hover:shadow-lg
          hover:-translate-y-1
          transition-all
          duration-300
          cursor-pointer
        "
      >
        {/* ---------------- image ---------------- */}
        <div className="relative w-full h-52">
          <Image
            src={course.image}
            alt={course.title}
            fill
            className="object-cover"
          />
        </div>

        {/* ---------------- content ---------------- */}
        <div className="p-4 space-y-4">
          {/* title */}
          <div>
            <h2
              className="
                text-xl
                font-semibold
                text-slate-800
                line-clamp-1
              "
            >
              {course.title}
            </h2>

            <p
              className="
                text-sm
                text-slate-500
                mt-1
              "
            >
              Engineering
            </p>
          </div>

          {/* chapter */}
          <div
            className="
              flex
              items-center
              gap-2
              text-sm
              text-slate-500
            "
          >
            <BookOpen className="w-4 h-4" />

            <span>1 Chapter</span>
          </div>

          {/* progress */}
          {progress > 0 && (
            <div className="space-y-2">
              <div
                className="
                  flex
                  items-center
                  justify-between
                  text-xs
                  text-slate-500
                "
              >
                <span>Progress</span>

                <span>{progress}%</span>
              </div>

              <Progress value={progress} />
            </div>
          )}

          {/* footer */}
          <div
            className="
              flex
              items-center
              justify-between
            "
          >
            {/* price */}
            <p
              className="
                text-2xl
                font-bold
                text-slate-800
              "
            >
              ₹{course.price}
            </p>

          </div>
        </div>
      </div>
    </Link>
  );
}

export default CourseCard;
