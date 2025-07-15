/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Share2, Play, Pause, Loader2, Maximize } from 'lucide-react';
import ReelsNavigation from '@/components/ReelsNavigation';
import { useReels } from '@/hooks/useReel';
import Layout from '@/components/Layout';
import { Reel } from '@/types/api.types';
import { Link } from 'react-router-dom';

// Use an online placeholder avatar
const avatar = "https://ui-avatars.com/api/?name=User&background=6c47ff&color=fff";
const fallbackImage = "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80";

const ReelCard = ({ reel }: { reel: Reel }) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(reel.stats?.likes || 0);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState('');
  const [playing, setPlaying] = useState(true);
  const [videoError, setVideoError] = useState(false);
  const [videoLoading, setVideoLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);

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
      videoRef.current.play();
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
        user: 'You',
        avatar,
        text: commentInput,
        time: 'now',
      },
    ]);
    setCommentInput('');
  };

  return (
    <Card
      className="rounded-[2rem] shadow-xl p-0 overflow-hidden border border-border bg-gradient-to-br from-[#1c1c2c]/80 to-[#28243D]/80 backdrop-blur-xl group relative"
      style={{ perspective: '1200px' }}
    >
      {/* Glass overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-t from-black/80 via-reel-purple-900/30 to-transparent" />

      {/* Content wrapper */}
      <div className="relative z-20">
        {/* Larger Video area */}
        <div className="relative w-full h-[36rem] bg-black flex items-center justify-center">
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
            <div className="flex flex-col items-center justify-center w-full h-full">
              <img src={fallbackImage} alt="Video unavailable" className="w-full h-full object-cover rounded-t-[2rem]" />
              <div className="absolute inset-0 flex items-center justify-center bg-black/70">
                <span className="text-white text-lg font-semibold">Video unavailable</span>
              </div>
            </div>
          ) : (
            <>
              {videoLoading && (
                <div className="absolute inset-0 flex items-center justify-center z-20 bg-black/40">
                  <Loader2 className="h-10 w-10 text-reel-purple-500 animate-spin" />
                </div>
              )}
              <video
                ref={videoRef}
                src={reel.mediaFileUrl || ''}
                className="w-full h-full object-cover rounded-t-[2rem]"
                autoPlay
                loop
                muted
                playsInline
                controls={false}
                onClick={togglePlay}
                onError={() => setVideoError(true)}
                onLoadedData={() => setVideoLoading(false)}
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
              <span className="font-semibold text-white/90 text-sm">{reel?.categoryId?.name}</span>
              <span className="text-xs text-gray-400">• {new Date(reel?.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="text-sm text-gray-300 mt-0.5">{reel?.title}</div>
            <div className="text-sm text-gray-400 mt-0.5">{reel?.description}</div>
          </div>
          {/* Right action buttons */}
          <div className="flex flex-col items-center gap-4">
            <button
              onClick={handleLike}
              className="flex flex-col items-center gap-1"
            >
              <Heart
                className={`h-7 w-7 transition-all duration-200 ${liked ? 'fill-red-500 text-red-500 scale-110' : 'text-white'
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
                      <span className="text-xs text-gray-400">{comment?.time}</span>
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


function ReelsPage() {
  const loaderRef = useRef<HTMLDivElement>(null);
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useReels();

  const reels = data?.pages.flatMap(p => p.results) ?? [];

  // Set up observer *once* on mount
  useEffect(() => {
    const node = loaderRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      {
        // start loading when loader is within 200px of viewport
        rootMargin: '200px',
        threshold: 0, 
      }
    );

    observer.observe(node);
    return () => {
      observer.unobserve(node);
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          Loading reels…
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

          {/* This is the “sentinel” our observer watches */}
          <div
            ref={loaderRef}
            className="flex justify-center py-8 border-dashed border-2 border-reel-purple-500"
          >
            {isFetchingNextPage
              ? <span>Loading more…</span>
              : !hasNextPage
                ? <span>You’re all caught up!</span>
                : null}
          </div>
        </div>
      </div>
    </Layout>
  );
}


export default ReelsPage;
