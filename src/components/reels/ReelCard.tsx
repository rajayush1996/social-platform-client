import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Volume2, VolumeX } from 'lucide-react';
import { useVideoDuration } from '@/hooks/useVideoDuration';

/**
 * Renders a single reel card with thumbnail or hover-video preview,
 * duration badge (calculated via useVideoDuration), and mute toggle.
 * The Card retains its large aspect ratio (big size).
 */
export default function ReelCard({ reel }) {
  const { id, title, user, stats, thumbnailDetails, mediaDetails } = reel;

  // Calculate duration via hook if not explicitly provided
  const duration = useVideoDuration(mediaDetails.url || '');

  const formattedViews = stats?.views >= 1e6
    ? `${(stats.views / 1e6).toFixed(1)}M`
    : stats?.views >= 1e3
      ? `${(stats.views / 1e3).toFixed(1)}K`
      : stats?.views?.toString() || '0';

  const [hovered, setHovered] = useState(false);
  const [muted, setMuted] = useState(true);
  const videoRef = useRef(null);

  const handleMouseEnter = () => {
    setHovered(true);
    const vid = videoRef.current;
    if (!thumbnailDetails?.url && vid) {
      vid.muted = muted;
      vid.currentTime = 0;
      vid.play().catch(() => {});

      // stop at 5s for a quick hover preview
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
    const vid = videoRef.current;
    if (!thumbnailDetails?.url && vid) {
      vid.pause();
      vid.currentTime = 0;
      // remove any leftover listener
      vid.removeEventListener('timeupdate', () => {});
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
    <Link to="/reels" state={{ reelId: id }}>
      <Card
        className="overflow-hidden relative h-[500px]  lg:h-[500px] lg:w-[350px]"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="aspect-video w-full h-full relative bg-black">
          {!thumbnailDetails?.url ? (
            <video
              ref={(el) => (videoRef.current = el)}
              src={mediaDetails.url}
              muted={muted}
              loop
              playsInline
              preload="auto"
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              src={thumbnailDetails.url}
              alt={title}
              className="w-full h-full object-cover"
              crossOrigin="anonymous"
            />
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
