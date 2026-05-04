import Mux from "@mux/mux-node";
import { prisma } from "@/shared/lib/prisma";

const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID!,
  tokenSecret: process.env.MUX_TOKEN_SECRET!,
});

export async function DELETE(req: Request) {
  const { chapterId } = await req.json();

  const muxData = await prisma.muxData.findUnique({
    where: { chapterId },
  });

  if (!muxData) return Response.json({ ok: true });

  await mux.video.assets.delete(muxData.assetId);

  await prisma.muxData.delete({
    where: { chapterId },
  });

  await prisma.chapter.update({
    where: { id: chapterId },
    data: {
      videoUrl: null,
    },
  });

  return Response.json({ success: true });
}
