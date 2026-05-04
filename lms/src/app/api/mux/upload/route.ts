import Mux from "@mux/mux-node";
import { NextRequest, NextResponse } from "next/server";

const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID!,
  tokenSecret: process.env.MUX_TOKEN_SECRET!,
});

export async function POST(req: NextRequest) {
  try {
    const { chapterId } = await req.json();

    const upload = await mux.video.uploads.create({
      new_asset_settings: {
        playback_policies: ["public"],
        passthrough: chapterId,
      },
      cors_origin: "*",
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          uploadUrl: upload.url,
          uploadId: upload.id,
        },
        message: "Upload URL and ID generated successfully",
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error,
        message: "Error generating upload URL and ID",
      },
      { status: 500 },
    );
  }
}
