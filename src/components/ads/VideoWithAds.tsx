import { useEffect, useRef } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import "@/videojs-plugin"; // contrib-ads + ima

const IMA_SDK_URL = "https://imasdk.googleapis.com/js/sdkloader/ima3.js";

let imaLoaderPromise: Promise<void> | null = null;

const loadImaSdk = () => {
  if (typeof window === "undefined") {
    return Promise.resolve();
  }

  const w = window as typeof window & { google?: any };

  if (w.google?.ima) {
    return Promise.resolve();
  }

  if (imaLoaderPromise) {
    return imaLoaderPromise;
  }

  const loader = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${IMA_SDK_URL}"]`
    );

    const script = existing ?? document.createElement("script");

    let onLoad: () => void;
    let onError: () => void;

    const cleanup = () => {
      script.removeEventListener("load", onLoad);
      script.removeEventListener("error", onError);
    };

    onLoad = () => {
      cleanup();
      script.dataset.imaReady = "true";
      if (w.google?.ima) {
        resolve();
      } else {
        reject(new Error("IMA SDK loaded but window.google.ima is unavailable."));
      }
    };

    onError = () => {
      cleanup();
      if (!existing && script.parentNode) {
        script.parentNode.removeChild(script);
      }
      reject(new Error("Failed to load Google IMA SDK."));
    };

    script.addEventListener("load", onLoad);
    script.addEventListener("error", onError);

    const scriptReadyState = (
      script as HTMLScriptElement & { readyState?: string }
    ).readyState;

    if (!existing) {
      script.src = IMA_SDK_URL;
      script.async = true;
      document.head.appendChild(script);
    } else if (
      scriptReadyState === "complete" ||
      scriptReadyState === "loaded" ||
      script.dataset.imaReady === "true"
    ) {
      onLoad();
    }

    if (w.google?.ima) {
      cleanup();
      resolve();
    }
  });

  imaLoaderPromise = loader.then(
    () => undefined,
    (error) => {
      imaLoaderPromise = null;
      throw error;
    }
  );

  return imaLoaderPromise;
};

type Props = {
  videoUrl: string;
  poster?: string;
  vastTagUrl: string;
};

const VideoWithAds = ({ videoUrl, poster, vastTagUrl }: Props) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<any>(null);

  useEffect(() => {
    if (!videoRef.current) return;

    // Dispose any old instance
    if (playerRef.current) {
      playerRef.current.dispose();
    }

    const player = videojs(videoRef.current, {
      controls: true,
      autoplay: false,
      preload: "auto",
      fluid: true,
      poster,
      sources: [{ src: videoUrl, type: "application/x-mpegURL" }],
    });

    let cancelled = false;

    loadImaSdk()
      .then(() => {
        if (cancelled || !videoRef.current) return;

        (player as any).ima({
          id: videoRef.current.id,
          adTagUrl: vastTagUrl,
        });
      })
      .catch((error) => {
        console.error("Failed to initialise IMA ads", error);
      });

    // Debug events
    player.on("adserror", (err: any) => {
      console.error("IMA Ads Error:", err);
      player.play();
    });
    player.on("ads-ad-started", () => console.log("✅ Ad started"));
    player.on("ads-ad-ended", () => console.log("✅ Ad ended"));

    playerRef.current = player;

    return () => {
      cancelled = true;
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [videoUrl, vastTagUrl, poster]);

  return (
    <video
      ref={videoRef}
      id="react-video-player"
      className="video-js vjs-big-play-centered rounded-lg shadow-lg"
    />
  );
};

export default VideoWithAds;
