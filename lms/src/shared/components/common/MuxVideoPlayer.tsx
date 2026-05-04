"use client";

import dynamic from "next/dynamic";

const MuxPlayer = dynamic(() => import("@mux/mux-player-react"), {
  ssr: false,
});

const MuxVideoPlayer = ({ playbackId }: { playbackId: string }) => {
  return (
    <MuxPlayer
      playbackId={playbackId}
      streamType="on-demand"
      className="w-full h-full rounded-md"
    />
  );
};

export default MuxVideoPlayer;