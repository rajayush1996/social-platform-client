// src/components/HlsReel.tsx (or .jsx, renamed from HlsVideo for clarity in this context)
import { useRef, useEffect, useImperativeHandle, forwardRef } from "react";
import Hls from 'hls.js';

/**
 * A reusable video component that supports HLS (.m3u8) streams via Hls.js
 * and falls back to native playback for MP4 (or other) sources.
 * Accepts all standard <video> props and forwards ref to the underlying element.
 *
 * @param {boolean} shouldLoad - If true, the HLS stream will be loaded. If false, it will be unloaded.
 */
type HlsVideoProps = React.VideoHTMLAttributes<HTMLVideoElement> & {
  src: string;
  shouldLoad: boolean; // New prop
};

const ReelVideoPlayer = forwardRef<HTMLVideoElement, HlsVideoProps>(({
  src,
  shouldLoad, // Destructure the new prop
  ...videoProps
}, ref) => {
  const internalRef = useRef<HTMLVideoElement>(null);
  const hlsInstanceRef = useRef<Hls | null>(null); // To keep track of the Hls.js instance

  // Expose internal video element APIs to parent via forwarded ref
  useImperativeHandle(ref, () => internalRef.current as HTMLVideoElement);

  useEffect(() => {
    const video = internalRef.current;
    if (!video) return;

    const isHls = src.endsWith('.m3u8');

    if (shouldLoad && isHls && Hls.isSupported()) {
      // If we should load AND it's an HLS stream AND Hls.js is supported
      if (!hlsInstanceRef.current) { // Only create a new instance if one doesn't exist
        hlsInstanceRef.current = new Hls();
        hlsInstanceRef.current.loadSource(src);
        hlsInstanceRef.current.attachMedia(video);
      }
    } else {
      // If we should NOT load, or it's not an HLS stream, or Hls.js is not supported
      if (hlsInstanceRef.current) {
        hlsInstanceRef.current.destroy(); // Destroy the Hls.js instance
        hlsInstanceRef.current = null;
        console.log(`[HlsReel] HLS destroyed for: ${src}`);
      }
      // For native playback or when unloading HLS, clear the video source
      // This stops buffering and frees up resources.
      if (video.src) { // Only clear if a source is set
        video.removeAttribute('src'); // Clear src attribute
        video.load(); // Tell the video element to reload (which effectively unloads)
        console.log(`[HlsReel] Video source cleared for: ${src}`);
      }
      // If it's a non-HLS video and shouldLoad is true, set src directly
      if (shouldLoad && !isHls) {
         video.src = src;
         video.load(); // Load the new source
         console.log(`[HlsReel] Native video loaded for: ${src}`);
      }
    }

    // Cleanup function: This runs when the component unmounts or dependencies change
    return () => {
      if (hlsInstanceRef.current) {
        hlsInstanceRef.current.destroy();
        hlsInstanceRef.current = null;
        console.log(`[HlsReel] HLS destroyed on cleanup for: ${src}`);
      }
      // Ensure video source is cleared on unmount too
      if (video.src) {
        video.removeAttribute('src');
        video.load();
      }
    };
  }, [src, shouldLoad]); // Dependencies: src and the new shouldLoad prop

  return (
    <video
      ref={internalRef}
      {...videoProps}
      playsInline
      webkit-playsinline="true"
    />
  );
});

export default ReelVideoPlayer;