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

    // get upload details
    const upload = await mux.video.uploads.retrieve(uploadId);

    const assetId = upload.asset_id;

    // asset still processing
    if (!assetId) {
      return NextResponse.json(
        {
          success: false,
          message: "Video still processing",
        },
        {
          status: 400,
        },
      );
    }

    // save assetId only
    const muxData = await prisma.muxData.upsert({
      where: {
        chapterId,
      },
      update: {
        assetId,
      },
      create: {
        assetId,
        chapterId,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: muxData,
        message: "Mux asset saved successfully",
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error("SAVE VIDEO ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Error saving mux asset",
      },
      {
        status: 500,
      },
    );
  }
}