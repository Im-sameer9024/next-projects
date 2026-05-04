import ChapterUpdatePage from "@/features/teacher/course/pages/ChapterUpdatePage";

const ChapterEditPage = async ({
  params,
}: {
  params: Promise<{ chapterId: string; courseId: string }>;
}) => {
  const { chapterId, courseId } = await params;

  return (
    <>
      <ChapterUpdatePage courseId={courseId} chapterId={chapterId} />
    </>
  );
};

export default ChapterEditPage;
