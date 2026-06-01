/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import dynamic from "next/dynamic";
import { useRef, useState } from "react";

const MuxPlayer = dynamic(() => import("@mux/mux-player-react"), {
  ssr: false,
});

interface MuxVideoPlayerProps {
  playbackId: string;
  onCompleteThreshold?: () => void;
}

const MuxVideoPlayer = ({ playbackId, onCompleteThreshold }: MuxVideoPlayerProps) => {
  const [isReady, setIsReady] = useState(false);

  const hasTriggeredRef = useRef(false);

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black">
      {!isReady && <div className="absolute inset-0 animate-pulse bg-slate-200" />}

      <MuxPlayer
        playbackId={playbackId}
        streamType="on-demand"
        className="h-full w-full"
        onLoadedMetadata={() => setIsReady(true)}
        onTimeUpdate={(e: any) => {
          const player = e.currentTarget;

          if (!player?.duration) return;

          const percentage = (player.currentTime / player.duration) * 100;

          if (percentage >= 95 && !hasTriggeredRef.current) {
            hasTriggeredRef.current = true;

            onCompleteThreshold?.();
          }
        }}
      />
    </div>
  );
};

export default MuxVideoPlayer;
