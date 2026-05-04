import Mux from "@mux/mux-node";
import { prisma } from "@/shared/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID!,
  tokenSecret: process.env.MUX_TOKEN_SECRET!,
});

export async function POST(req: NextRequest) {
  try {
    const { uploadId, chapterId } = await req.json();

    const upload = await mux.video.uploads.retrieve(uploadId);

    const assetId = upload.asset_id;

    if (!assetId) {
      return Response.json(
        { error: "Video still processing. Try again." },
        { status: 400 },
      );
    }

    const asset = await mux.video.assets.retrieve(assetId);
    const playbackId = asset.playback_ids?.[0]?.id;

    const createMuxData = await prisma.muxData.upsert({
      where: { chapterId },
      update: {
        assetId,
        ...(playbackId && { playbackId }),
      },
      create: {
        assetId,
        chapterId,
        ...(playbackId && { playbackId }),
      },
    });

    if (playbackId) {
      await prisma.chapter.update({
        where: { id: chapterId },
        data: { videoUrl: playbackId },
      });
    }

    return NextResponse.json(
      {
        success: true,
        data: createMuxData,
        message: "Video saved successfully",
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Error saving video",
        error: error,
      },
      {
        status: 500,
      },
    );
  }
}
