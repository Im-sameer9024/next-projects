import Mux from "@mux/mux-node";
import { prisma } from "@/shared/lib/prisma";

const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID!,
  tokenSecret: process.env.MUX_TOKEN_SECRET!,
});

export async function POST(req: Request) {
  const rawBody = await req.text();

  try {
    await mux.webhooks.verifySignature(
      rawBody,
      req.headers,
      process.env.MUX_WEBHOOK_SECRET!,
    );
  } catch {
    return new Response("Invalid signature", { status: 401 });
  }

  const event = JSON.parse(rawBody);

  if (event.type === "video.asset.ready") {
    const asset = event.data;

    const playbackId = asset.playback_ids?.[0]?.id;
    const assetId = asset.id;
    const chapterId = asset.passthrough;

    if (!playbackId) {
        return Response.json({
          success: false,
          message: "PlaybackId not found",
        });
      }

    const existingMuxData = await prisma.muxData.findFirst({
      where: { assetId },
    });

    const muxData =
      existingMuxData ??
      (chapterId
        ? await prisma.muxData.upsert({
            where: { chapterId },
            update: { assetId },
            create: { assetId, chapterId },
          })
        : null);

    if (!muxData) return Response.json({ ok: true });

    await prisma.muxData.update({
      where: { id: muxData.id },
      data: { playbackId },
    });

    await prisma.chapter.update({
      where: { id: muxData.chapterId },
      data: { videoUrl: playbackId },
    });
  }

  return Response.json({ received: true });
}
