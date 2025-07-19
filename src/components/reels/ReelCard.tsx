import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Volume2, VolumeX } from 'lucide-react';
import { useVideoDuration } from '@/hooks/useVideoDuration';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';


import Hls from 'hls.js';

/**
 * A reusable video component that supports HLS (.m3u8) streams via Hls.js
 * and falls back to native playback for MP4 (or other) sources.
 * Accepts all standard <video> props and forwards ref to the underlying element.
 */
type HlsVideoProps = React.VideoHTMLAttributes<HTMLVideoElement> & {
  src: string;
};

const HlsVideo = forwardRef<HTMLVideoElement, HlsVideoProps>(({
  src,
  ...videoProps
}, ref) => {
  const internalRef = useRef<HTMLVideoElement>(null);

  // Expose internal video element APIs to parent via forwarded ref
  useImperativeHandle(ref, () => internalRef.current as HTMLVideoElement);

  useEffect(() => {
    const video = internalRef.current;
    if (!video) return;

    let hls: Hls | null = null;
    const isHls = src.endsWith('.m3u8');

    if (isHls && Hls.isSupported()) {
      hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(video);
    } else {
      // Native playback for non-HLS sources
      video.src = src;
    }

    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, [src]);

  return (
    <video
      ref={internalRef}
      {...videoProps}
      playsInline
    />
  );
});

interface Reel {
  id: string;
  title: string;
  user?: { displayName?: string };
  stats?: { views?: number };
  thumbnailDetails?: { url?: string };
  mediaDetails: { url: string };
}

interface ReelCardProps {
  reel: Reel;
}

export default function ReelCard({ reel }: ReelCardProps) {
  const { title, user, stats, thumbnailDetails, mediaDetails } = reel;
  const duration = useVideoDuration(mediaDetails.url);
  // const duration = 0;

  const formattedViews =
    stats?.views! >= 1e6
      ? `${(stats!.views! / 1e6).toFixed(1)}M`
      : stats?.views! >= 1e3
      ? `${(stats!.views! / 1e3).toFixed(1)}K`
      : stats?.views?.toString() || '0';

  const [hovered, setHovered] = useState(false);
  const [muted, setMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleMouseEnter = () => {
    setHovered(true);
    // auto‑play first 5s if no thumbnail
    if (!thumbnailDetails?.url && videoRef.current) {
      const vid = videoRef.current;
      vid.muted = muted;
      vid.currentTime = 0;
      vid.play().catch(() => {});

      const onTimeUpdate = () => {
        if (vid.currentTime >= 5) {
          vid.pause();
          vid.removeEventListener('timeupdate', onTimeUpdate);
        }
      };
      vid.addEventListener('timeupdate', onTimeUpdate);
    }
  };

  const handleMouseLeave = () => {
    setHovered(false);
    if (!thumbnailDetails?.url && videoRef.current) {
      const vid = videoRef.current;
      vid.pause();
      vid.currentTime = 0;
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setMuted((prev) => {
      const next = !prev;
      if (videoRef.current) videoRef.current.muted = next;
      return next;
    });
  };

  return (
    <Link to={`/reels/${reel.id}`}>
      <Card
        className="overflow-hidden relative h-[500px] lg:h-[500px] lg:w-[350px]"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="aspect-video w-full h-full relative bg-black">
          {thumbnailDetails?.url ? (
            <img
              src={thumbnailDetails.url}
              alt={title}
              className="w-full h-full object-cover"
              crossOrigin="anonymous"
            />
          ) : hovered ? (
            <HlsVideo
              ref={videoRef}
              src={mediaDetails.url}
              muted={muted}
              loop={false}
              preload="none"                 // don’t preload until mount
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-black" />
          )}

          {/* Mute toggle */}
          <button
            onClick={toggleMute}
            className="absolute top-2 right-2 bg-black/60 rounded-full p-1 z-10"
            title={muted ? 'Unmute' : 'Mute'}
          >
            {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>

          {/* Duration badge */}
          <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded z-10">
            {duration}
          </div>
        </div>

        <div className="p-3">
          <h3 className="font-medium text-foreground line-clamp-2 mb-1">
            {title}
          </h3>
          <div className="flex justify-between text-sm text-foreground/70">
            <span>{user?.displayName || 'Unknown'}</span>
            <span>{formattedViews} views</span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
