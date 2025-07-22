/* eslint-disable @typescript-eslint/no-explicit-any */
/* ReelCard.tsx */
import { useEffect, useRef, useState, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Heart,
  MessageCircle,
  Share2,
  Play,
  Pause,
  Loader2,
  Maximize,
  VolumeX,
  Volume2,
  Layout,
} from "lucide-react";
import ReelVideoPlayer from "@/components/HlsReel";
import { Reel } from "@/types/api.types";
import ReelsNavigation from "@/components/ReelsNavigation"; // if you need it
import { useReelsInfinite } from "@/hooks/useReel";
import { BounceLoader } from "react-spinners";

// dummy avatar/fallback:
const avatar = "https://ui-avatars.com/api/?name=User&background=6c47ff&color=fff";
const fallbackImage =
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80";

interface Comment { id: number; user: string; avatar: string; text: string; time: string; }

export function ReelCard({ reel }: { reel: Reel }) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(reel.stats?.likes || 0);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentInput, setCommentInput] = useState("");
  const [playing, setPlaying] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [videoLoading, setVideoLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [muted, setMuted] = useState(true);
  const [isInView, setIsInView] = useState(false);

  // IntersectionObserver to toggle isInView
  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
        if (!entry.isIntersecting) {
          videoRef.current?.pause();
          setPlaying(false);
          videoRef.current!.currentTime = 0;
        }
      },
      { threshold: 0.6 }
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, []);

  // play/pause when in view
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (isInView) {
      v.play().catch(() => setPlaying(false));
      setPlaying(true);
    }
  }, [isInView]);

  const togglePlay = () => {
    const v = videoRef.current!;
    if (playing) v.pause();
    else v.play().catch(() => {});
    setPlaying(!playing);
  };

  const skip = (sec: number) => {
    const v = videoRef.current!;
    const t = Math.max(0, Math.min(v.duration, v.currentTime + sec));
    v.currentTime = t;
    setPlaying(!v.paused);
  };

  const toggleMute = () => {
    const v = videoRef.current!;
    v.muted = !v.muted;
    setMuted(v.muted);
    if (!v.muted) v.play().catch(() => {});
  };

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount((c) => c + (liked ? -1 : 1));
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    setComments((cs) => [
      ...cs,
      { id: cs.length + 1, user: "You", avatar, text: commentInput, time: "now" },
    ]);
    setCommentInput("");
  };

  return (
    <Card
      ref={containerRef}
      className="h-full rounded-[2rem] shadow-xl p-0 overflow-hidden border border-border bg-gradient-to-br from-[#1c1c2c]/80 to-[#28243D]/80 backdrop-blur-xl group relative"
      style={{ perspective: "1200px" }}
    >
      {/* Video area */}
      <div className="relative w-full h-full bg-black flex items-center justify-center">
        {/* Mute/Fullscreen buttons */}
        <button
          onClick={toggleMute}
          className="absolute top-4 left-4 z-30 bg-black/60 rounded-full p-2"
        >
          {muted ? <VolumeX className="text-white" /> : <Volume2 className="text-white" />}
        </button>
        <button
          onClick={() => {
            const v = videoRef.current!;
            if (v.requestFullscreen) v.requestFullscreen();
            else (v as any).webkitRequestFullscreen?.();
          }}
          className="absolute top-4 right-4 z-30 bg-black/60 rounded-full p-2"
        >
          <Maximize className="text-white" />
        </button>

        {/* Loader */}
        {videoLoading && isInView && (
          <div className="absolute inset-0 flex items-center justify-center z-20 bg-black/40">
            <Loader2 className="text-reel-purple-500 animate-spin" />
          </div>
        )}

        {/* Player */}
        {!videoError ? (
          <ReelVideoPlayer
            ref={videoRef}
            src={reel.videoUrl || ""}
            shouldLoad={isInView}
            className="w-full h-full object-cover"
            onLoadedData={() => setVideoLoading(false)}
            onError={() => setVideoError(true)}
            muted={muted}
            onClick={togglePlay}
          />
        ) : (
          <img src={fallbackImage} alt="fallback" className="w-full h-full object-cover" />
        )}

        {/* Play/Pause overlay */}
        <button
          onClick={togglePlay}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/50 rounded-full p-4 z-30"
        >
          {playing ? <Pause className="text-white h-8 w-8" /> : <Play className="text-white h-8 w-8" />}
        </button>
      </div>

      {/* Footer (likes, comments, share) */}
      <div className="flex items-center justify-between px-6 py-4 bg-black/20">
        <div className="flex items-center gap-4">
          <button onClick={handleLike} className="flex items-center gap-1">
            <Heart className={liked ? "fill-red-500 text-red-500" : "text-white"} />
            <span className="text-white">{likeCount}</span>
          </button>
          <button onClick={() => setShowComments(!showComments)} className="text-white">
            <MessageCircle /> {comments.length}
          </button>
          <button className="text-white">
            <Share2 />
          </button>
        </div>
      </div>

      {/* Comments panel */}
      {showComments && (
        <div className="px-6 py-4 bg-black/30">
          <form onSubmit={handleAddComment} className="flex gap-2 mb-4">
            <input
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              placeholder="Add a comment…"
              className="flex-1 rounded-full px-4 py-2 bg-black/50 text-white"
            />
            <Button type="submit" size="sm">
              Post
            </Button>
          </form>
          <div className="space-y-3">
            {comments.map((c) => (
              <div key={c.id} className="flex gap-3">
                <img src={c.avatar} className="w-8 h-8 rounded-full" />
                <div>
                  <span className="font-semibold text-white">{c.user}</span>{" "}
                  <span className="text-gray-400 text-xs">{c.time}</span>
                  <p className="text-white text-sm">{c.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}

export  function ReelsPage() {
  const loaderRef = useRef<HTMLDivElement>(null);
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useReelsInfinite(10);

  const reels = data?.pages.flatMap((p) => p.results) || [];

  // infinite scroll
  useEffect(() => {
    const sentinel = loaderRef.current;
    if (!sentinel) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: "200px" }
    );
    obs.observe(sentinel);
    return () => obs.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (isLoading)
    return (
      <Layout>
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <BounceLoader loading color="#ec4899" size={100} />
        </div>
      </Layout>
    );

  if (isError)
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          Failed to load reels.
        </div>
      </Layout>
    );

  return (
    <Layout>
      {/* Optional top nav */}
      <ReelsNavigation />

      {/* Snap‐scroll container */}
      <div className="h-screen overflow-y-scroll snap-y snap-mandatory touch-pan-y">
        {reels.map((reel: any) => (
          <div key={reel.id} className="snap-start h-screen">
            <ReelCard reel={reel} />
          </div>
        ))}

        {/* Loader sentinel */}
        <div ref={loaderRef} className="h-1"></div>
      </div>
    </Layout>
  );
}

// export default ReelsPage;
