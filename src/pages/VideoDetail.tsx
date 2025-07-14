import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useVideo } from "@/hooks/useVideo";
import Layout from "@/components/Layout";
import { useRef, useState, useEffect } from "react";

interface VideoPlayerState {
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  currentTime: number;
  buffered: number;
}

const VideoDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: video, isLoading, isError } = useVideo(id!);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const [playerState, setPlayerState] = useState<VideoPlayerState>({
    isPlaying: false,
    isMuted: false,
    volume: 1,
    currentTime: 0,
    buffered: 0,
  });

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const updateTime = () => {
      setPlayerState(prev => ({
        ...prev,
        currentTime: videoElement.currentTime,
        buffered: videoElement.buffered.length ? videoElement.buffered.end(0) : 0
      }));
    };

    videoElement.addEventListener('timeupdate', updateTime);
    return () => videoElement.removeEventListener('timeupdate', updateTime);
  }, []);

  const handleLoadedMetadata = () => {
    const video = videoRef.current;
    if (video) {
      setDuration(video.duration);
      setPlayerState(prev => ({ ...prev, duration: video.duration }));
    }
  };

  const handleError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    console.error('Video loading error:', e);
    const videoElement = e.currentTarget;
    console.error('Error code:', videoElement.error?.code);
    console.error('Error message:', videoElement.error?.message);
  };

  const handlePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play().catch(err => console.error('Error playing video:', err));
      setPlayerState(prev => ({ ...prev, isPlaying: true }));
    } else {
      video.pause();
      setPlayerState(prev => ({ ...prev, isPlaying: false }));
    }
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <span className="text-lg text-muted-foreground">
            Loading video...
          </span>
        </div>
      </Layout>
    );
  }

  if (isError || !video) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
          <h2 className="text-2xl font-bold mb-4 text-foreground">
            Video not found
          </h2>
          <Button onClick={() => navigate(-1)} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
          </Button>
        </div>
      </Layout>
    );
  }

  const formattedViews =
    video.views >= 1000000
      ? `${(video.views / 1000000).toFixed(1)}M`
      : video.views >= 1000
      ? `${(video.views / 1000).toFixed(1)}K`
      : video.views;

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center px-4 py-6">
        <div className="w-full max-w-4xl bg-background/80 rounded-2xl shadow-xl p-4 md:p-6">
          <Button onClick={() => navigate(-1)} variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Videos
          </Button>
          
          <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden mb-6">
            <video
              ref={videoRef}
              className="w-full h-full object-contain"
              poster={video.thumbnail?.url}
              onLoadedMetadata={handleLoadedMetadata}
              onError={handleError}
              onClick={handlePlayPause}
              playsInline
              preload="metadata"
              controlsList="nodownload"
            >
              <source src={video.mediaFile.url} type="video/mp4" />
              <source src={video.mediaFile.url.replace('.mp4', '.webm')} type="video/webm" />
              Your browser does not support the video tag.
            </video>

            {/* Custom Video Controls */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center gap-4">
                  <button
                    onClick={handlePlayPause}
                    className="hover:text-primary-foreground"
                  >
                    {playerState.isPlaying ? '⏸️' : '▶️'}
                  </button>
                  <span className="text-sm">
                    {formatTime(playerState.currentTime)} / {formatTime(duration || 0)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="text-2xl font-bold text-foreground">
              {video.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span>By {video?.user?.username || "Unknown Author"}</span>
              <span>• {formattedViews} views</span>
              <span>• {formatTime(duration || 0)}</span>
            </div>
            {video.description && (
              <p className="text-foreground/80 mt-4">{video.description}</p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default VideoDetail;
