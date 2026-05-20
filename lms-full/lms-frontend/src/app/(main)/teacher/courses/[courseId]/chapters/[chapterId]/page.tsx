import ChapterUpdate from "@/features/chapter/components/ChapterUpdate";
import React from "react";

const ChapterUpdatePage = async ({
  params,
}: {
  params: Promise<{
    chapterId: string;
    courseId: string;
  }>;
}) => {
  const { chapterId, courseId } = await params;

  return (
    <>
      <ChapterUpdate courseId={courseId} chapterId={chapterId} />
    </>
  );
};

export default ChapterUpdatePage;
