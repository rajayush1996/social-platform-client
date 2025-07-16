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

  // Compute actual duration once metadata is loaded
  const trueDuration = useVideoDuration(previewUrl);

  // We'll store the start/end times for our 5s clip
  const [clipStart, setClipStart] = useState(0);
  const [clipEnd, setClipEnd] = useState(0);

  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    const handleLoaded = () => {
      const mid = vid.duration / 2;
      // Center a 5s window around the midpoint:
      const halfWindow = 2.5;
      const start = Math.max(mid - halfWindow, 0);
      const end = Math.min(mid + halfWindow, vid.duration);
      setClipStart(start);
      setClipEnd(end);
      vid.removeEventListener('loadedmetadata', handleLoaded);
    };

    vid.addEventListener('loadedmetadata', handleLoaded);
    return () => vid.removeEventListener('loadedmetadata', handleLoaded);
  }, [previewUrl]);

  // Stop playback once we hit clipEnd
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    const handleTimeUpdate = () => {
      if (vid.currentTime >= clipEnd) {
        vid.pause();
      }
    };

    vid.addEventListener('timeupdate', handleTimeUpdate);
    return () => vid.removeEventListener('timeupdate', handleTimeUpdate);
  }, [clipEnd]);

  const handleMouseEnter = () => {
    const vid = videoRef.current;
    if (!vid) return;
    vid.muted = true;
    vid.currentTime = clipStart;
    vid.play().catch(() => {});
  };

  const handleMouseLeave = () => {
    const vid = videoRef.current;
    if (!vid) return;
    vid.pause();
    // rewind to start of clip so future hovers restart cleanly
    vid.currentTime = clipStart;
  };

  return (
    <Link to={`/videos/${id}`}>
      <Card className="overflow-hidden group hover:ring-2 hover:ring-pink-500 transition-all duration-300">
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
              preload="auto"
            />
          )}

          {/* Duration Badge */}
          <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
            {trueDuration || duration}
          </div>
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
