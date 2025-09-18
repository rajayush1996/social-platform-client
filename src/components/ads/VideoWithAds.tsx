import { useEffect, useRef } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import "videojs-contrib-ads";
import "videojs-ima";

declare global {
  interface Window {
    google?: any;
  }
}

type Props = {
  videoUrl: string;
  poster?: string;
  vastTagUrl: string;
};

const VideoWithAds = ({ videoUrl, poster, vastTagUrl }: Props) => {
  console.log("🚀 ~ :20 ~ VideoWithAds ~ vastTagUrl:", vastTagUrl)
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<any>(null);

  // Load Google IMA SDK before initializing Video.js
  const loadImaSdk = () => {
    return new Promise<void>((resolve, reject) => {
      if (window.google && window.google.ima) {
        resolve();
        return;
      }
      const script = document.createElement("script");
      script.src = "https://imasdk.googleapis.com/js/sdkloader/ima3.js";
      script.async = true;
      script.onload = () => resolve();
      script.onerror = reject;
      document.body.appendChild(script);
    });
  };

  useEffect(() => {
    let disposed = false;

    loadImaSdk()
      .then(() => {
        if (!videoRef.current || disposed) return;

        // Initialize Video.js player
        playerRef.current = videojs(videoRef.current, {
          controls: true,
          autoplay: false,
          preload: "auto",
          fluid: true,
          poster,
          sources: [{ src: videoUrl, type: "application/x-mpegURL" }],
        });

        // Attach IMA plugin with ExoClick VAST tag
        playerRef.current.ima({
          id: videoRef.current.id,
          adTagUrl: vastTagUrl,
        });
      })
      .catch((err) => {
        console.error("Failed to load IMA SDK:", err);
      });

    return () => {
      disposed = true;
      if (playerRef.current) {
        playerRef.current.dispose();
      }
    };
  }, [videoUrl, vastTagUrl, poster]);

  useEffect(() => {
  if (!playerRef.current) return;

  playerRef.current.on("adserror", (err: any) => {
    console.error("IMA Ads Error:", err);
  });

  playerRef.current.on("ads-ad-started", () => {
    console.log("Ad started");
  });

  playerRef.current.on("ads-ad-ended", () => {
    console.log("Ad ended");
  });
}, []);

  return (
    <video
      ref={videoRef}
      id="react-video-player"
      className="video-js vjs-big-play-centered rounded-lg shadow-lg"
    />
  );
};

export default VideoWithAds;
