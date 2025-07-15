import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  SkipBack,
  SkipForward,
} from "lucide-react";
import { useVideo } from "@/hooks/useVideo";
import Layout from "@/components/Layout";
import { useRef, useState, useEffect, useCallback } from "react";

const VideoDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: video, isLoading, isError } = useVideo(id!);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);


   const skip = useCallback((sec: number) => {
    const v = videoRef.current;
    if (!v) return;
    let t = v.currentTime + sec;
    if (t < 0) t = 0;
    if (t > duration) t = duration;
    v.currentTime = t;
    setCurrentTime(t);
  }, [duration]);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play().catch(console.error);
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  // video event listeners
  useEffect(() => {
    const v = videoRef.current;
    console.log("🚀 ~ :36 ~ useEffect ~ v:", v?.duration)
    if (!v) return;
    const onTime = () => setCurrentTime(v.currentTime);
    const onMeta = () => setDuration(v.duration);
    v.addEventListener("timeupdate", onTime);
    v.addEventListener("loadedmetadata", onMeta);
    return () => {
      v.removeEventListener("timeupdate", onTime);
      v.removeEventListener("loadedmetadata", onMeta);
    };
  }, [video]);

  // keyboard controls
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!containerRef.current?.contains(document.activeElement as Node))
        return;
      switch (e.code) {
        case "Space":
          e.preventDefault();
          togglePlay();
          break;
        case "ArrowRight":
          skip(10);
          break;
        case "ArrowLeft":
          skip(-10);
          break;
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [currentTime, duration, skip]);


 
  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted = val === 0;
      setMuted(val === 0);
    }
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
    if (!v.muted && volume === 0) {
      setVolume(0.5);
      v.volume = 0.5;
    }
  };

  const handleProgress = (e: React.ChangeEvent<HTMLInputElement>) => {
    const t = parseFloat(e.target.value);
    if (videoRef.current) videoRef.current.currentTime = t;
    setCurrentTime(t);
  };

  const toggleFullscreen = () => {
    const el = containerRef.current;
    if (!el) return;
    if (!fullscreen) {
      el.requestFullscreen?.();
      setFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setFullscreen(false);
    }
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60)
      .toString()
      .padStart(2, "0");
    return `${m}:${s}`;
  };

  if (isLoading) return <Layout>Loading…</Layout>;
  if (isError || !video)
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <h2 className="text-2xl font-bold">Video not found</h2>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
          </Button>
        </div>
      </Layout>
    );

  return (
    <Layout>
      <div className="px-4 py-6">
        <Button
          variant="ghost"
          className="mb-4 flex items-center gap-2"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft /> Back
        </Button>

        <div
          ref={containerRef}
          className="relative bg-black rounded-xl overflow-hidden shadow-lg max-w-4xl mx-auto focus:outline-none"
          tabIndex={0}
        >
          <video
            ref={videoRef}
            src={video.mediaFile.url}
            poster={video.thumbnail?.url}
            className="w-full h-auto bg-black cursor-pointer"
            playsInline
            onClick={togglePlay}
          />

          {/* Controls Overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 flex flex-col gap-3">
            <input
              type="range"
              min={0}
              max={duration}
              step="0.1"
              value={currentTime}
              onChange={handleProgress}
              className="w-full accent-pink-500 cursor-pointer"
            />

            <div className="flex items-center justify-between text-white">
              <div className="flex items-center gap-4">
                <button onClick={() => skip(-10)} title="Rewind 10s">
                  <SkipBack className="w-5 h-5" />
                </button>
                <button onClick={togglePlay} title="Play / Pause">
                  {playing ? (
                    <Pause className="w-6 h-6" />
                  ) : (
                    <Play className="w-6 h-6" />
                  )}
                </button>
                <button onClick={() => skip(10)} title="Forward 10s">
                  <SkipForward className="w-5 h-5" />
                </button>

                <button onClick={toggleMute} title="Mute / Unmute">
                  {muted || volume === 0 ? (
                    <VolumeX className="w-5 h-5" />
                  ) : (
                    <Volume2 className="w-5 h-5" />
                  )}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step="0.01"
                  value={muted ? 0 : volume}
                  onChange={handleVolume}
                  className="w-16 accent-pink-500"
                />

                <span className="text-sm">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>

              <button onClick={toggleFullscreen} title="Fullscreen">
                {fullscreen ? (
                  <Minimize2 className="w-6 h-6" />
                ) : (
                  <Maximize2 className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto mt-6 text-white space-y-2">
          <h1 className="text-3xl font-bold">{video.title}</h1>
          <p className="text-sm text-gray-400">
            By {video.user.username} • {video.views} views •{" "}
            {formatTime(duration)}
          </p>
          {video.description && (
            <p className="mt-4 text-gray-200">{video.description}</p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default VideoDetail;
