import { Link } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import { useEffect, useRef, useState } from 'react';
import { useVideoDuration } from '@/hooks/useVideoDuration';
// import HlsVideo from '../HlsVideo';
import HoverPreviewVideo from '../HlsVideo';

export interface VideoCardProps {
  id: string;
  thumbnail?: string;
  title: string;
  author: string;
  views: number;
  duration: string;
  previewUrl: string;        // either .m3u8 or .mp4
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

  // <-- this ref now points at the actual <video> inside HlsVideo
  const videoRef = useRef<HTMLVideoElement>(null);

  // compute duration via your custom hook
  const trueDuration = useVideoDuration(previewUrl);
  console.log("trueDuration----->", title, trueDuration);

  // these drive your 5‑second hover clip
  const [clipStart, setClipStart] = useState(0);
  const [clipEnd,   setClipEnd]   = useState(0);

  // once metadata is loaded (duration known), pick 5s around midpoint
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    const onMeta = () => {
      const mid = vid.duration / 2;
      const halfWin = 2.5;
      const start = Math.max(mid - halfWin, 0);
      const end   = Math.min(mid + halfWin, vid.duration);
      setClipStart(start);
      setClipEnd(end);
      vid.removeEventListener('loadedmetadata', onMeta);
    };

    vid.addEventListener('loadedmetadata', onMeta);
    return () => vid.removeEventListener('loadedmetadata', onMeta);
  }, [previewUrl]);

  // pause once we hit the end of the clip
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    const onTime = () => {
      if (vid.currentTime >= clipEnd) {
        vid.pause();
      }
    };

    vid.addEventListener('timeupdate', onTime);
    return () => vid.removeEventListener('timeupdate', onTime);
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
            <HoverPreviewVideo
              // ref={videoRef}                             // forwarded ref
              src={previewUrl}
              // preload="metadata"                         // ← ensure metadata loads
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              // muted={true}
              // controls={false}
              // autoPlay={false}
            />
          )}

          {/* Duration badge */}
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
