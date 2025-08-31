 
import { useEffect, useRef, useState, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Heart,
  MessageCircle,
  Share2,
  Play,
  Loader2,
  VolumeX,
  Volume2,
  RotateCcw,
} from "lucide-react";
import ReelVideoPlayer from "@/components/HlsReel";
import { Reel } from "@/types/api.types";
import { useIncrementReelView } from "@/hooks/useReel";

const avatar =
  "https://ui-avatars.com/api/?name=User&background=6c47ff&color=fff";
const fallbackImage =
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80";

interface Comment {
  id: number;
  user: string;
  avatar: string;
  text: string;
  time: string;
}

export function ReelCard({ reel }: { reel: Reel }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hasIncremented = useRef(false);
  const { mutate: incrementView } = useIncrementReelView();

  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [inView, setInView] = useState(false);
  const [showReplay, setShowReplay] = useState(false);

  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(reel.stats?.likes || 0);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [input, setInput] = useState("");

  // OBSERVE VISIBILITY
  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        setInView(e.isIntersecting);
        const v = videoRef.current;
        if (!e.isIntersecting && v) {
          // stop playback and unload the video when it leaves the viewport
          v.pause();
          v.removeAttribute("src");
          v.load();
          v.currentTime = 0;
          setPlaying(false);
          setLoading(true);
          setShowReplay(false);
        } else if (e.isIntersecting) {
          setLoading(true);
        }
      },
      { threshold: 0.6 }
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, []);

  // AUTO‑PLAY / PAUSE
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (inView) {
      v.play().catch(() => setPlaying(false));
      setPlaying(true);
    }
  }, [inView]);

  const handleLoadedData = useCallback(() => {
    setLoading(false);
  }, []);
  const handleError = useCallback(() => {
    setError(true);
    setLoading(false);
  }, []);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (showReplay) {
      v.currentTime = 0;
      v.play().catch(() => {});
      setPlaying(true);
      setShowReplay(false);
      return;
    }
    if (playing) v.pause(); else v.play().catch(() => {});
    setPlaying(!playing);
  };
  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
    if (!v.muted) v.play().catch(() => {});
  };
  const doLike = () => {
    setLiked(!liked);
    setLikes((l) => l + (liked ? -1 : 1));
  };
  const addComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setComments((cs) => [...cs, { id: cs.length+1, user: "You", avatar, text: input, time: "now" }]);
    setInput("");
  };

  const VIEW_INCREMENT_THRESHOLD = Math.min(20, reel.lengthSec || 20);

  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    if (
      !hasIncremented.current &&
      reel._id &&
      e.currentTarget.currentTime >= VIEW_INCREMENT_THRESHOLD
    ) {
      incrementView(reel._id);
      hasIncremented.current = true;
    }
  };

  return (
    <Card
      ref={containerRef}
      className="relative w-full h-full overflow-hidden bg-black flex flex-col justify-end p-0 m-0"
    >
      {/* Video layer */}
      <div className="absolute inset-0 w-full h-full">
        {loading && inView && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
            <Loader2 className="animate-spin text-white" size={40} />
          </div>
        )}

        {!error ? (
          <ReelVideoPlayer
            ref={videoRef}
            src={reel.videoUrl || ""}
            shouldLoad={inView}
            muted={muted}
            onLoadedData={handleLoadedData}
            onError={handleError}
            className="w-full h-full object-cover"
            onClick={togglePlay}
            onEnded={() => {
              setPlaying(false);
              setShowReplay(true);
            }}
            onTimeUpdate={handleTimeUpdate}
          />
        ) : (
          <img
            src={fallbackImage}
            alt="Unavailable"
            className="w-full h-full object-cover"
          />
        )}

        {/* Mute button only */}
        <button
          onClick={toggleMute}
          className="absolute top-2 right-2 z-20 p-2 bg-black/60 rounded-full hover:bg-black/80 transition pointer-events-auto"
          aria-label={muted ? "Unmute" : "Mute"}
        >
          {muted ? <VolumeX className="text-white" /> : <Volume2 className="text-white" />}
        </button>

        {/* Play/Pause center or replay */}
        {!playing && (
          showReplay ? (
            <button
              onClick={togglePlay}
              className="absolute inset-0 m-auto w-16 h-16 flex items-center justify-center text-white z-20 pointer-events-auto"
            >
              <RotateCcw size={40} />
            </button>
          ) : (
            <button
              onClick={togglePlay}
              className="absolute inset-0 m-auto w-16 h-16 flex items-center justify-center text-white z-20 pointer-events-auto"
            >
              <Play size={40} className="animate-pulse" />
            </button>
          )
        )}

        {/* Bottom overlay: user info + actions */}
        <div className="absolute bottom-0 left-0 w-full p-4 flex justify-between items-end pointer-events-auto z-20 bg-gradient-to-t from-black via-transparent to-transparent">
          {/* User info */}
          <div className="flex flex-col gap-1 text-white">
            <div className="flex items-center gap-2">
              <img src={avatar} className="w-8 h-8 rounded-full border-2 border-white/50" />
              <span className="font-semibold text-base">@{reel.categoryId?.name}</span>
            </div>
            <p className="text-sm line-clamp-2">{reel.title}</p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col items-center gap-4 text-white">
            <button onClick={doLike} className="flex flex-col items-center gap-1">
              <Heart className={`${liked ? 'fill-red-500 text-red-500' : 'text-white'} h-7 w-7`} />
              <span className="text-xs">{likes}</span>
            </button>
            <button onClick={() => setShowComments(!showComments)} className="flex flex-col items-center gap-1">
              <MessageCircle className="h-7 w-7 text-white" />
              <span className="text-xs">{comments.length}</span>
            </button>
            <button className="flex flex-col items-center gap-1">
              <Share2 className="h-7 w-7 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Comments overlay */}
      {showComments && (
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-black/90 backdrop-blur-lg p-4 text-white z-30 flex flex-col rounded-t-lg">
          <h3 className="text-lg font-semibold mb-3">Comments</h3>
          <div className="flex-1 overflow-y-auto space-y-3 mb-4">
            {comments.length === 0 ? (
              <p className="text-gray-400 text-center">No comments yet</p>
            ) : (
              comments.map((c) => (
                <div key={c.id} className="flex items-start gap-2">
                  <img src={c.avatar} className="w-7 h-7 rounded-full" />
                  <div>
                    <p className="text-sm"><strong>{c.user}</strong> {c.text}</p>
                    <p className="text-xs text-gray-400">{c.time}</p>
                  </div>
                </div>
              ))
            )}
          </div>
          <form onSubmit={addComment} className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Add a comment…"
              className="flex-1 bg-white/10 text-white placeholder-gray-400 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-reel-purple-500"
            />
            <Button type="submit" size="sm" className="rounded-full bg-reel-purple-600 hover:bg-reel-purple-700">
              Post
            </Button>
          </form>
          <Button
            variant="ghost"
            className="absolute top-2 right-2 text-white"
            onClick={() => setShowComments(false)}
          >
            X
          </Button>
        </div>
      )}
    </Card>
  );
}
