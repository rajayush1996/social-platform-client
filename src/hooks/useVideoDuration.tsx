import { useState, useEffect } from 'react';
import Hls from 'hls.js';

export function useVideoDuration(url: string) {
  const [formatted, setFormatted] = useState('0:00');

  useEffect(() => {
    if (!url) return;
    let vid: HTMLVideoElement;
    let hls: Hls | null = null;

    // Create a detached video element
    vid = document.createElement('video');
    vid.preload = 'metadata';

    // Format seconds → H:MM:SS or MM:SS
    const onLoaded = () => {
      const totalSec = Math.floor(vid.duration);
      const hrs  = Math.floor(totalSec / 3600);
      const mins = Math.floor((totalSec % 3600) / 60);
      const secs = totalSec % 60;
      const mm = hrs ? String(mins).padStart(2, '0') : String(mins);
      const ss = String(secs).padStart(2, '0');

      setFormatted(hrs ? `${hrs}:${mm}:${ss}` : `${mm}:${ss}`);
    };

    vid.addEventListener('loadedmetadata', onLoaded);

    if (url.endsWith('.m3u8')) {
      // HLS stream
      if (Hls.isSupported()) {
        hls = new Hls();
        hls.loadSource(url);
        hls.attachMedia(vid);
        // Some browsers fire 'loadedmetadata' after MANIFEST_PARSED
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          // video.duration should now be set
          onLoaded();
        });
      } else {
        // Safari native HLS
        vid.src = url;
      }
    } else {
      // Assume MP4 or other native format
      vid.src = url;
    }

    return () => {
      vid.removeEventListener('loadedmetadata', onLoaded);
      if (hls) {
        hls.destroy();
        hls = null;
      }
    };
  }, [url]);

  return formatted;
}
