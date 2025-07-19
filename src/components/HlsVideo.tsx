import React, { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import Hls from 'hls.js';

/**
 * A reusable video component that supports HLS (.m3u8) streams via Hls.js
 * and falls back to native playback for MP4 (or other) sources.
 * Accepts all standard <video> props and forwards ref to the underlying <video> element.
 */
type HlsVideoProps = Omit<React.VideoHTMLAttributes<HTMLVideoElement>, 'ref'> & {
  /**
   * URL of the HLS manifest (.m3u8) or any video source (e.g. .mp4).
   */
  src: string;
};

const HlsVideo = forwardRef<HTMLVideoElement, HlsVideoProps>(({
  src,
  poster,
  ...videoProps
}, ref) => {
  const internalRef = useRef<HTMLVideoElement>(null);

  // Expose the internal <video> to parent via forwarded ref
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
      // Fallback to native playback
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
      poster={poster}
      {...videoProps}
      playsInline
      webkit-playsinline="true"
    />
  );
});

HlsVideo.displayName = 'HlsVideo';
export default HlsVideo;
