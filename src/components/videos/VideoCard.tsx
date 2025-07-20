/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import { useRef, useState } from 'react';
import { formatDuration } from '@/lib/utils';
// import { useVideoDuration } from '@/hooks/useVideoDuration';

export interface VideoCardProps {
  id: string;
  thumbnail?: string;
  title: string;
  author: string;
  views: number;
  duration: string;
  previewUrl: string; 
  category: string;       // either .m3u8 or .mp4
}

const VideoCard = ({
  v
}: any) => {
  const {
    _id: id,
  thumbnailUrl: thumbnail,
  title,
  author,
  previewUrl,
  category,
  lengthSec,
  } = v
  // const formattedViews = views >= 1e6
  //   ? `${(views / 1e6).toFixed(1)}M`
  //   : views >= 1e3
  //     ? `${(views / 1e3).toFixed(1)}K`
  //     : views;

  // <-- this ref now points at the actual <video> inside HlsVideo

  // Compute actual duration once metadata is loaded
  // const trueDuration = useVideoDuration(previewUrl);\
  const trueDuration = formatDuration(lengthSec);


  // these drive you

  // once metadata is loaded (duration known), pick 5s around midpoint

  // pause once we hit the end of the clip
  

  const videoRef = useRef<HTMLVideoElement>(null);
  // hover state
  const [hovered, setHovered] = useState(false);

  // precision: only auto‑play the preview clip
  const handleMouseEnter = () => {
    setHovered(true);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current
        .play()
        .catch(() => { /* swallow DOMException */ });
    }
  };
  const handleMouseLeave = () => {
    setHovered(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };


  return(
    <Link to={`/videos/${id}`}>
      <Card
        className="overflow-hidden group hover:ring-2 hover:ring-pink-500 transition-all duration-300"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className="aspect-video relative overflow-hidden bg-black cursor-pointer">
          <img
            src={hovered && previewUrl ? previewUrl : thumbnail}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            crossOrigin="anonymous"
          />

          {/* Duration badge */}
          <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
            {trueDuration || 0}
          </div>
        </div>

        <div className="p-4">
          <h3 className="font-medium text-white line-clamp-2 mb-2">{title}</h3>
          <div className="flex justify-between items-center text-sm text-white/70">
            <p>{author || 'UnKnown'}</p>
            <p>{0} views</p>
          </div>
        </div>
      </Card>
    </Link>
  );
}


export default VideoCard;
