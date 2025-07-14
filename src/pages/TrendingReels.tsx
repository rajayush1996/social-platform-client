import { ChevronLeft, ChevronRight, VolumeX, Volume2 } from "lucide-react";
import { useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import ReelCard from "@/components/reels/ReelCard";

export function TrendingReels({ reels }: { reels: any[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [muteStates, setMuteStates] = useState(reels.map(() => true));
  // Keep refs to each video element:
  const videoRefs = useRef<Array<HTMLVideoElement | null>>([]);

  const scroll = (dir: "left" | "right") => {
    const offset = 300;
    scrollRef.current?.scrollBy({
      left: dir === "left" ? -offset : offset,
      behavior: "smooth",
    });
  };

  const toggleMute = (idx: number) => {
    setMuteStates((prev) => {
      const next = [...prev];
      next[idx] = !next[idx];
      const vid = videoRefs.current[idx];
      if (vid) vid.muted = next[idx];
      return next;
    });
  };

  const handleMouseEnter = (idx: number) => {
    const vid = videoRefs.current[idx];
    if (!vid) return;
    vid.muted = muteStates[idx];
    vid.currentTime = 0;
    vid.play().catch(() => {});
    // stop at 10s
    const onTimeUpdate = () => {
      if (vid.currentTime >= 10) {
        vid.pause();
        vid.removeEventListener("timeupdate", onTimeUpdate);
      }
    };
    vid.addEventListener("timeupdate", onTimeUpdate);
  };

  const handleMouseLeave = (idx: number) => {
    const vid = videoRefs.current[idx];
    if (!vid) return;
    vid.pause();
    vid.currentTime = 0;
    // clean up any lingering listener
    vid.removeEventListener("timeupdate", () => {});
  };

  const navigate = useNavigate();

  return (
    <section className="py-12 mx-4 text-white relative">
      <div className="mx-auto max-w-screen-xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-5 px-2">
          <h2 className="text-2xl font-bold">Trending Reels</h2>
          <a href="/reels" className="text-pink-400 text-sm hover:underline">
            View All Reels
          </a>
        </div>

        <div className="relative">
          {/* Left arrow */}
          <button
            onClick={() => scroll("left")}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-pink-600 hover:bg-pink-500 text-white p-2 rounded-full shadow-lg"
          >
            <ChevronLeft size={20} />
          </button>

          {/* Scrollable list */}
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto scroll-smooth px-4 hide-scrollbar"
          >
            {reels.map(r => <ReelCard key={r.id} reel={r} />)}
          </div>

          {/* Right arrow */}
          <button
            onClick={() => scroll("right")}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-pink-600 hover:bg-pink-500 text-white p-2 rounded-full shadow-lg"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </section>
  );
}
