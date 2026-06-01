"use client";

import Link from "next/link";
import { useState } from "react";

import { CheckCircle2, Lock } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import MuxVideoPlayer from "@/shared/components/common/MuxVideoPlayer";

import { useCompleteChapter, useGetChapterForUser } from "../hooks/useChapter";

interface Props {
  chapterId: string;
}

const ChapterVideoPlayer = ({ chapterId }: Props) => {
  const [showCompleteButton, setShowCompleteButton] = useState(false);

  const { mutateAsync, isPending: completePending } = useCompleteChapter();

  const { data, isPending, isError, error } = useGetChapterForUser(chapterId);

  const chapter = data?.data;

  const isCompleted = chapter?.userProgresses?.[0]?.isCompleted ?? false;

  const handleComplete = async () => {
    try {
      await mutateAsync(chapterId);

      setShowCompleteButton(false);
    } catch (error) {
      console.error(error);
    }
  };

  if (isPending) {
    return (
      <div className="mx-auto max-w-6xl space-y-6 p-4 md:p-6">
        <div className="h-10 w-72 animate-pulse rounded-md bg-slate-200" />

        <div className="aspect-video animate-pulse rounded-2xl bg-slate-200" />

        <div className="space-y-3">
          <div className="h-4 animate-pulse rounded bg-slate-200" />
          <div className="h-4 w-4/5 animate-pulse rounded bg-slate-200" />
          <div className="h-4 w-3/5 animate-pulse rounded bg-slate-200" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-100 items-center justify-center">
        <p className="text-red-500">{error?.message || "Failed to load chapter"}</p>
      </div>
    );
  }

  if (!chapter) {
    return <div className="flex h-100 items-center justify-center">Chapter not found</div>;
  }

  const isPurchased = chapter.course && chapter.course.purchases && chapter.course.purchases.length > 0;

  console.log(isPurchased, "isPurchased");

  const isFree = chapter.isFree ?? false;

  const canWatch = isPurchased || isFree;

  const playbackId = chapter?.muxData?.playbackId;

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-4 md:p-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">{chapter.title}</h1>
      </div>

      {/* Video */}
      {canWatch ? (
        <div className="overflow-hidden rounded-2xl border shadow-sm">
          {playbackId ? (
            <MuxVideoPlayer
              playbackId={playbackId}
              onCompleteThreshold={() => setShowCompleteButton(true)}
            />
          ) : (
            <div className="flex aspect-video items-center justify-center text-white">
              Video is processing...
            </div>
          )}
        </div>
      ) : (
        <div className="bg-muted flex aspect-video items-center justify-center rounded-2xl border">
          <div className="max-w-md text-center">
            <div className="mb-4 flex justify-center">
              <div className="rounded-full bg-slate-200 p-4">
                <Lock className="h-8 w-8" />
              </div>
            </div>

            <h3 className="text-xl font-semibold">This chapter is locked</h3>

            <p className="text-muted-foreground mt-2 text-sm">
              Purchase this course to access all premium chapters, downloadable resources and future
              updates.
            </p>

            <Button asChild className="mt-6">
              <Link href={`/courses/${chapter.course.id}`}>Purchase Course</Link>
            </Button>
          </div>
        </div>
      )}

      {/* Completion */}
      {isCompleted ? (
        <div className="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-green-700">
          <CheckCircle2 className="h-5 w-5" />
          <span className="font-medium">Chapter Completed</span>
        </div>
      ) : (
        showCompleteButton && (
          <div className="flex justify-end">
            <Button onClick={handleComplete} disabled={completePending}>
              <CheckCircle2 className="mr-2 h-4 w-4" />

              {completePending ? "Completing..." : "Mark as Complete"}
            </Button>
          </div>
        )
      )}

      {/* Purchase CTA */}
      {!isPurchased && isFree && (
        <div className="rounded-2xl border bg-linear-to-r from-blue-50 to-indigo-50 p-6">
          <h3 className="text-lg font-semibold">Enjoying this lesson?</h3>

          <p className="text-muted-foreground mt-2 text-sm">
            Unlock the complete course to access all chapters, resources, quizzes and future
            updates.
          </p>

          <Button asChild className="mt-4">
            <Link href={`/courses/${chapter.course.id}`}>Unlock Full Course</Link>
          </Button>
        </div>
      )}

      {/* Description */}
      {chapter.description && (
        <div className="bg-background rounded-2xl border p-6">
          <h2 className="mb-4 text-xl font-semibold">Chapter Overview</h2>

          <div
            className="prose prose-slate max-w-none"
            dangerouslySetInnerHTML={{
              __html: chapter.description,
            }}
          />
        </div>
      )}
    </div>
  );
};

export default ChapterVideoPlayer;
