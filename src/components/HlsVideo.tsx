import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react';
import Hls from 'hls.js';

export type HoverPreviewVideoProps = React.VideoHTMLAttributes<HTMLVideoElement> & {
  /** URL to a .m3u8 or .mp4 */
  src: string;
};

const HoverPreviewVideo = forwardRef<HTMLVideoElement, HoverPreviewVideoProps>(
  ({ src, ...videoProps }, ref) => {
    const internalRef = useRef<HTMLVideoElement>(null);

    // Expose the underlying <video> to parent refs
    useImperativeHandle(ref, () => internalRef.current!);

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
        video.src = src;
      }

      return () => {
        if (hls) hls.destroy();
      };
    }, [src]);

    return <video ref={internalRef} {...videoProps} playsInline />;
  }
);

HoverPreviewVideo.displayName = 'HoverPreviewVideo';
export default HoverPreviewVideo;
