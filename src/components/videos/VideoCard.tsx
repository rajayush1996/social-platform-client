import { Link } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import { useEffect, useRef, useState } from 'react';
import { useVideoDuration } from '@/hooks/useVideoDuration';

export interface VideoCardProps {
  id: string;
  thumbnail?: string;
  title: string;
  author: string;
  views: number;
  duration: string;
  previewUrl: string;
}

const VideoCard = ({
  id,
  thumbnail,
  title,
  author,
  views,
  duration,
  previewUrl
}: VideoCardProps) => {
  const formattedViews = views >= 1e6
    ? `${(views / 1e6).toFixed(1)}M`
    : views >= 1e3
      ? `${(views / 1e3).toFixed(1)}K`
      : views;

  const videoRef = useRef<HTMLVideoElement>(null);
  const [stopTime, setStopTime] = useState<number>(0);

  const currentDuration = useVideoDuration(previewUrl);

  // Once metadata is loaded, compute mid-point preview start & stop
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    const onLoadedMeta = () => {
      const mid = vid.duration / 2;
      const end = Math.min(mid + 5, vid.duration);
      setStopTime(end);
      vid.removeEventListener('loadedmetadata', onLoadedMeta);
    };
    vid.addEventListener('loadedmetadata', onLoadedMeta);
    return () => {
      vid.removeEventListener('loadedmetadata', onLoadedMeta);
    };
  }, []);

  // Stop playback at stopTime
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    const onTimeUpdate = () => {
      if (vid.currentTime >= stopTime) {
        vid.pause();
      }
    };
    vid.addEventListener('timeupdate', onTimeUpdate);
    return () => vid.removeEventListener('timeupdate', onTimeUpdate);
  }, [stopTime]);

  // Hover handlers to play that middle-10s clip
  const handleMouseEnter = () => {
    const vid = videoRef.current;
    if (!vid) return;
    vid.muted = true;
    const start = stopTime ? stopTime - 10 : 0;  // play from (end‑10)
    vid.currentTime = start;
    vid.play().catch(() => {});
  };
  const handleMouseLeave = () => {
    const vid = videoRef.current;
    if (!vid) return;
    vid.pause();
    // reset to preview start (so mouse‑enter always works)
    const start = stopTime ? stopTime - 10 : 0;
    vid.currentTime = start;
  };

  return (
    <Link to={`/videos/${id}`}>
      <Card className="overflow-hidden group hover:ring-2 hover:ring-reel-purple-500/50 transition-all duration-300">
        <div
          className="aspect-video relative overflow-hidden bg-black cursor-pointer"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {thumbnail ? (
            <img
              src={thumbnail}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              crossOrigin="anonymous"
            />
          ) : (
            <video
              ref={videoRef}
              src={previewUrl}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              playsInline
              preload="metadata"
            />
          )}

          {/* Duration Badge */}
          <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
            {currentDuration || duration}
          </div>
        </div>

        <div className="p-4">
          <h3 className="font-medium text-foreground line-clamp-2 mb-2">{title}</h3>
          <div className="flex justify-between items-center text-sm text-foreground/70">
            <p>{author}</p>
            <p>{formattedViews} views</p>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default VideoCard;
