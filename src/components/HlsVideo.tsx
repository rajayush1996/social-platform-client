// components/HoverPreviewVideo.tsx

import React, {
  useRef,
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
  HTMLAttributes,
} from 'react';
import Hls from 'hls.js';

type HoverPreviewVideoProps = {
  /** URL to a .m3u8 or .mp4 */
  src: string;
  /** CSS classes to apply to the <video> */
  className?: string;
} & HTMLAttributes<HTMLDivElement>;

const HoverPreviewVideo = forwardRef<HTMLVideoElement, HoverPreviewVideoProps>(
  ({ src, className = '' }, ref) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [clipStart, setClipStart] = useState(0);
    const [clipEnd, setClipEnd] = useState(0);

    // Expose the video DOM node if parent wants it
    useImperativeHandle(ref, () => videoRef.current!);

    // Attach HLS or native src once
    useEffect(() => {
      const video = videoRef.current!;
      let hls: Hls | null = null;

      // iOS inline attributes
      video.setAttribute('playsinline', '');
      video.setAttribute('webkit-playsinline', 'true');

      if (src.endsWith('.m3u8') && Hls.isSupported()) {
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

    // Once metadata arrives, compute 5s snippet window, preload initial second, then pause
    useEffect(() => {
      const v = videoRef.current!;
      const onMeta = () => {
        const mid = v.duration / 2;
        setClipStart(Math.max(mid - 2.5, 0));
        setClipEnd(Math.min(mid + 2.5, v.duration));

        // Play first second to buffer initial segment
        v.muted = true;
        v.currentTime = Math.max(mid - 2.5, 0);
        v.play().catch(() => {});
        // After 1s, pause and rewind to start
        setTimeout(() => {
          v.pause();
          // v.currentTime = 0;
        }, 0);

        v.removeEventListener('loadedmetadata', onMeta);
      };

      v.addEventListener('loadedmetadata', onMeta);
      return () => v.removeEventListener('loadedmetadata', onMeta);
    }, [src]);

    // Pause when we reach the end of our snippet
    useEffect(() => {
      const v = videoRef.current!;
      const onTime = () => {
        if (v.currentTime >= clipEnd) {
          v.pause();
        }
      };
      v.addEventListener('timeupdate', onTime);
      return () => v.removeEventListener('timeupdate', onTime);
    }, [clipEnd]);

    const handleMouseEnter = () => {
      const v = videoRef.current!;
      v.currentTime = clipStart;
      v.muted = true;
      v.play().catch(() => {});
    };

    const handleMouseLeave = () => {
      const v = videoRef.current!;
      v.pause();
      v.currentTime = clipStart;
    };

    return (
      <div
        className="relative overflow-hidden"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <video
          ref={videoRef}
          className={className}
          preload="metadata"
          muted
          loop={false}
          controls={false}
        />
      </div>
    );
  }
);

HoverPreviewVideo.displayName = 'HoverPreviewVideo';
export default HoverPreviewVideo;
