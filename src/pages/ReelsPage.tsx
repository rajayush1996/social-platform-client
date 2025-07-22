/* eslint-disable @typescript-eslint/no-explicit-any */
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
} from "lucide-react";
import ReelsNavigation from "@/components/ReelsNavigation";
import { useReelsInfinite } from "@/hooks/useReel";
import Layout from "@/components/Layout";
import { Reel } from "@/types/api.types";
import { Link } from "react-router-dom";
import { BounceLoader } from "react-spinners";
import ReelVideoPlayer from "@/components/HlsReel";

// Use an online placeholder avatar
const avatar =
  "https://ui-avatars.com/api/?name=User&background=6c47ff&color=fff";
const fallbackImage =
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80";

const ReelCard = ({ reel }: { reel: Reel }) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(reel.stats?.likes || 0);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState("");
  const [playing, setPlaying] = useState(false); // Default to false, controlled by IntersectionObserver
  const [videoError, setVideoError] = useState(false);
  const [videoLoading, setVideoLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null); // This is the Card's root div
  const [muted, setMuted] = useState(true); // Start muted as per Instagram behavior

  // NEW STATE: To track if the reel card is currently in view
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting); // Update isInView state
        if (entry.isIntersecting) {
          // When entering view
          // We don't call play() here directly anymore.
          // The HlsVideo component will handle loading based on isInView.
          // We'll let `playing` state be set by the video's actual `onPlay` event if it autoplays.
          setVideoLoading(true); // Reset loading state when it comes into view
        } else {
          // When leaving view
          setPlaying(false); // Explicitly set playing to false
          setVideoLoading(true); // Reset loading state when it goes out of view
        }
      },
      { threshold: 0.6 } // when 60% of card is visible
    );

    obs.observe(node);
    return () => {
      obs.disconnect();
    };
  }, []); // Empty dependency array: runs once per ReelCard instance

  // Effect to manage video playback based on isInView
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    if (isInView) {
      vid.play().catch((e) => {
        // Handle autoplay policy issues
        console.warn("Autoplay prevented:", e);
        setPlaying(false); // Ensure playing state is false if autoplay fails
      });
      setPlaying(true);
    } else {
      vid.pause();
      setPlaying(false);
      vid.currentTime = 0; // Reset video to start when out of view
    }
  }, [isInView]); // Re-run when isInView changes

  // Like animation
  const handleLike = () => {
    setLiked((prev) => !prev);
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
  };

  // Play/pause video
  const togglePlay = () => {
    if (!videoRef.current) return;
    if (playing) {
      videoRef.current.pause();
    } else {
      videoRef.current.play().catch(() => {}); // Catch play errors
    }
    setPlaying((p) => !p);
  };

  // Add comment
  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    setComments([
      ...comments,
      {
        id: comments.length + 1,
        user: "You",
        avatar,
        text: commentInput,
        time: "now",
      },
    ]);
    setCommentInput("");
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;

    v.muted = !v.muted;
    setMuted(v.muted);

    // if we’re unmuting, make sure it’s playing (and at full volume)
    if (!v.muted) {
      v.volume = 1;
      v.play().catch(() => { }); // Catch play errors
    }
  };

  return (
    <Card
      ref={containerRef} // Assign containerRef to the Card's root div
      className="rounded-[2rem] shadow-xl p-0 overflow-hidden border border-border bg-gradient-to-br from-[#1c1c2c]/80 to-[#28243D]/80 backdrop-blur-xl group relative"
      style={{ perspective: "1200px" }}
    >
      {/* Glass overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-t from-black/80 via-reel-purple-900/30 to-transparent" />

      {/* Content wrapper */}
      <div className="relative z-20">
        {/* Larger Video area */}
        <div className="relative w-full h-[36rem] bg-black flex items-center justify-center">
          <button
            onClick={toggleMute}
            className="absolute top-4 left-4 z-30 bg-black/60 hover:bg-black/80 rounded-full p-2 transition"
            title={muted ? "Unmute" : "Mute"}
            type="button"
          >
            {muted ? (
              <VolumeX className="h-5 w-5 text-white" />
            ) : (
              <Volume2 className="h-5 w-5 text-white" />
            )}
          </button>
          <button
            className="absolute top-4 right-4 z-30 bg-black/60 hover:bg-black/80 rounded-full p-2 transition"
            title="Fullscreen"
            type="button"
            onClick={() => {
              if (videoRef.current) {
                if (videoRef.current.requestFullscreen) {
                  videoRef.current.requestFullscreen();
                } else if ((videoRef.current as any).webkitRequestFullscreen) {
                  (videoRef.current as any).webkitRequestFullscreen();
                } else if ((videoRef.current as any).msRequestFullscreen) {
                  (videoRef.current as any).msRequestFullscreen();
                }
              }
            }}
          >
            <Maximize className="h-5 w-5 text-white" />
          </button>
          {videoError ? (
            <div
              // ref={containerRef} // This ref should stay on the Card component
              className="flex flex-col items-center justify-center w-full h-full"
            >
              <img
                src={fallbackImage}
                alt="Video unavailable"
                className="w-full h-full object-cover rounded-t-[2rem]"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/70">
                <span className="text-white text-lg font-semibold">
                  Video unavailable
                </span>
              </div>
            </div>
          ) : (
            <>
              {videoLoading && isInView && ( // Only show loader if in view and loading
                <div className="absolute inset-0 flex items-center justify-center z-20 bg-black/40">
                  <Loader2 className="h-10 w-10 text-reel-purple-500 animate-spin" />
                </div>
              )}
              <ReelVideoPlayer
                ref={videoRef}
                src={reel.videoUrl || ''}
                shouldLoad={isInView} // Pass the new prop here
                className="w-full h-full object-cover rounded-t-[2rem]"
                onError={() => {
                  setVideoError(true);
                  setVideoLoading(false); // Stop loading if error
                }}
                onLoadedData={() => setVideoLoading(false)}
                onClick={togglePlay}
                muted={muted} // Pass muted state to the player
              />
              {/* Play/Pause overlay */}
              <button
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/50 backdrop-blur-sm border border-white/20 shadow-xl rounded-full p-4 transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-110 z-30"
                onClick={togglePlay}
                type="button"
              >
                {playing ? (
                  <Pause className="h-8 w-8 text-white drop-shadow-xl" />
                ) : (
                  <Play className="h-8 w-8 text-white drop-shadow-xl animate-pulse" />
                )}
              </button>
            </>
          )}
        </div>

        {/* User info and Actions */}
        <div className="flex items-center gap-4 px-6 py-4 bg-black/20 backdrop-blur-lg rounded-b-[2rem]">
          <img
            src={avatar}
            alt={reel?.categoryId?.name}
            className="w-11 h-11 rounded-full border-2 border-reel-purple-500 shadow-lg"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white/90 text-sm">
                {reel?.categoryId?.name}
              </span>
              <span className="text-xs text-gray-400">
                • {new Date(reel?.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div className="text-sm text-gray-300 mt-0.5">{reel?.title}</div>
            <div className="text-sm text-gray-400 mt-0.5">
              {reel?.description}
            </div>
          </div>
          {/* Right action buttons */}
          <div className="flex flex-col items-center gap-4">
            <button
              onClick={handleLike}
              className="flex flex-col items-center gap-1"
            >
              <Heart
                className={`h-7 w-7 transition-all duration-200 ${liked ? "fill-red-500 text-red-500 scale-110" : "text-white"
                  }`}
              />
              <span className="text-xs text-white/80">{likeCount}</span>
            </button>
            <button
              onClick={() => setShowComments(!showComments)}
              className="flex flex-col items-center gap-1"
            >
              <MessageCircle className="h-7 w-7 text-white" />
              <span className="text-xs text-white/80">{comments?.length}</span>
            </button>
            <button className="flex flex-col items-center gap-1">
              <Share2 className="h-7 w-7 text-white" />
            </button>
          </div>
        </div>

        {/* Comments section */}
        {showComments && (
          <div className="px-6 py-4 bg-black/20 backdrop-blur-lg border-t border-white/10">
            <form onSubmit={handleAddComment} className="flex gap-2 mb-4">
              <input
                type="text"
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 bg-black/30 text-white placeholder-gray-400 rounded-full py-2 text-sm focus:outline-none focus:ring-2 focus:ring-reel-purple-500"
              />
              <Button type="submit" size="sm" className="rounded-full">
                Post
              </Button>
            </form>
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment?.id} className="flex gap-3">
                  <img
                    src={comment?.avatar}
                    alt={comment?.user}
                    className="w-8 h-8 rounded-full"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-white/90 text-sm">
                        {comment?.user}
                      </span>
                      <span className="text-xs text-gray-400">
                        {comment?.time}
                      </span>
                    </div>
                    <p className="text-sm text-gray-300">{comment?.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default function ReelsPage() {
  const loaderRef = useRef<HTMLDivElement>(null);

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useReelsInfinite(10); // <-- pass page size here

  // flatten all pages.results into one array
  const reels: Reel[] = data?.pages.flatMap((page) => page.results) ?? [];

  // infinite‐scroll observer
  useEffect(() => {
    const sentinel = loaderRef.current;
    if (!sentinel) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: "200px", threshold: 0 }
    );

    obs.observe(sentinel);
    return () => {
      obs.unobserve(sentinel);
      obs.disconnect();
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (isLoading) {
    return (
      <Layout>
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <BounceLoader
            loading
            color="#ec4899"
            size={150}
            aria-label="Loading reels..."
          />
        </div>
      </Layout>
    );
  }

  if (isError) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          Failed to load reels.
        </div>
      </Layout>
    );
  }

  if (reels.length === 0) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          No reels available.
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <ReelsNavigation />
      <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center pt-24 px-2">
        <div className="w-full max-w-md flex flex-col gap-10">
          {reels.map((reel) => (
            <ReelCard key={reel.id} reel={reel} />
          ))}

          {/* sentinel for IntersectionObserver */}
          <div
            ref={loaderRef}
            className="flex justify-center py-8 border-dashed border-2 border-reel-purple-500"
          >
            {isFetchingNextPage ? (
              <span>Loading more…</span>
            ) : !hasNextPage ? (
              <span>You’re all caught up!</span>
            ) : null}
          </div>
        </div>
      </div>
    </Layout>
  );
}

// export default ReelsPage;
