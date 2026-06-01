import ChapterVideoPlayer from "@/features/search/components/ChapterVideoPlayer";

interface Props {
  params: Promise<{
    chapterId: string;
  }>;
}

const ChapterId = async ({ params }: Props) => {
  const { chapterId } = await params;

  return <ChapterVideoPlayer chapterId={chapterId} />;
};

export default ChapterId;
