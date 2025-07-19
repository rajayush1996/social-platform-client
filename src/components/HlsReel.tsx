import React, { forwardRef, useRef, useEffect, useImperativeHandle } from 'react';
import Hls from 'hls.js';

/**
 * ReelVideoPlayer automatically chooses HLS.js for .m3u8 streams
 * or native playback for other URLs (e.g. .mp4).
 */
export interface ReelVideoPlayerProps extends React.VideoHTMLAttributes<HTMLVideoElement> {
  /** URL of the video (HLS manifest or direct file) */
  src: string;
}

const ReelVideoPlayer = forwardRef<HTMLVideoElement, ReelVideoPlayerProps>(({
  src,
  onError,
  onLoadedData,
  onClick,
  className,
  autoPlay = true,
  loop = true,
  muted = true,
  ...rest
}, ref) => {
  const internalRef = useRef<HTMLVideoElement>(null);

  // expose the underlying <video> to parent components
  useImperativeHandle(ref, () => internalRef.current as HTMLVideoElement);

  useEffect(() => {
    const video = internalRef.current;
    if (!video) return;

    // ensure inline playback on mobile
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', 'true');

    let hls: Hls | null = null;
    const isHls = src.endsWith('.m3u8');

    if (isHls && Hls.isSupported()) {
      hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(video);
    } else {
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
      className={className}
      autoPlay={autoPlay}
      loop={loop}
      muted={muted}
      playsInline
      onError={onError}
      onLoadedData={onLoadedData}
      onClick={onClick}
      {...rest}
    />
  );
});

ReelVideoPlayer.displayName = 'ReelVideoPlayer';
export default ReelVideoPlayer;
