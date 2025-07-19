// components/VideoCard.tsx

import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { useVideoDuration } from '@/hooks/useVideoDuration';
import HoverPreviewVideo from '../HlsVideo';

export interface VideoCardProps {
  id: string;
  thumbnail?: string;
  title: string;
  author: string;
  views: number;
  duration: string;
  previewUrl: string;  // .m3u8 or .mp4
}

const DEFAULT_THUMB =
  'https://via.placeholder.com/480x270?text=No+Preview+Available';


const VideoCard: React.FC<VideoCardProps> = ({
  id,
  thumbnail,
  title,
  author,
  views,
  duration,
  previewUrl,
}) => {
  const formattedViews =
    views >= 1e6
      ? `${(views / 1e6).toFixed(1)}M`
      : views >= 1e3
        ? `${(views / 1e3).toFixed(1)}K`
        : views.toString();

  const trueDuration = useVideoDuration(previewUrl);

  const [hovered, setHovered] = useState(false);
  const [muted, setMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleMouseEnter = () => {
    setHovered(true);
    // once mounted, HlsVideo will auto-play
  };

  const handleMouseLeave = () => {
    setHovered(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setMuted((m) => {
      const next = !m;
      if (videoRef.current) videoRef.current.muted = next;
      return next;
    });
  };

  return (
    <Link to={`/videos/${id}`}>
      <Card
        className="overflow-hidden group hover:ring-2 hover:ring-pink-500 transition-all duration-300"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="aspect-video relative overflow-hidden bg-black cursor-pointer">
          {/* 1. If there's a thumbnail and NOT hovered, show it */}
          {thumbnail && !hovered && (
            <img
              src={thumbnail}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              crossOrigin="anonymous"
            />
          )}

          {/* 2. If no thumbnail and NOT hovered, show blank bg */}
          {!thumbnail && !hovered && <div className="w-full h-full bg-black" />}

          {!thumbnail && !hovered && (
            <img
              src={DEFAULT_THUMB}
              alt="Preview unavailable"
              className="w-full h-full object-cover"
            />
          )}

          {/* 3. Only when hovered do we mount & load the video */}
          {hovered && (
            <HoverPreviewVideo
              ref={videoRef}
              src={previewUrl}
              muted={muted}
              loop={false}
              preload="none"                       // don't preload until mount
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          )}

          {/* Duration badge */}
          <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
            {trueDuration || duration}
          </div>

          {/* Mute toggle */}
          <button
            onClick={toggleMute}
            className="absolute top-2 right-2 bg-black/60 rounded-full p-1 z-10"
            title={muted ? 'Unmute' : 'Mute'}
          >
            {muted ? '🔇' : '🔊'}
          </button>
        </div>

        <div className="p-4">
          <h3 className="font-medium text-white line-clamp-2 mb-2">{title}</h3>
          <div className="flex justify-between items-center text-sm text-white/70">
            <p>{author}</p>
            <p>{formattedViews} views</p>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default VideoCard;
