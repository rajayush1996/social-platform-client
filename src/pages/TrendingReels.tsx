import { ChevronLeft, ChevronRight, VolumeX, Volume2, Play } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const videos = [
  {
    thumbnail: "https://randomuser.me/api/portraits/women/1.jpg",
    title: "Hot Summer Vibes",
    views: "1.2M views",
    duration: "00:30",
  },
  {
    thumbnail: "https://randomuser.me/api/portraits/women/2.jpg",
    duration: "00:15",
  },
  {
    thumbnail: "https://randomuser.me/api/portraits/men/3.jpg",
    duration: "00:40",
  },
  {
    thumbnail: "https://randomuser.me/api/portraits/women/4.jpg",
    duration: "00:25",
  },
  {
    thumbnail: "https://randomuser.me/api/portraits/men/5.jpg",
    duration: "00:20",
  },
];

export function TrendingReels({ reels }: { reels: any[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [muteStates, setMuteStates] = useState(videos.map(() => true));
  const navigate = useNavigate();

  const scroll = (dir: "left" | "right") => {
    const offset = 300;
    scrollRef.current?.scrollBy({ left: dir === "left" ? -offset : offset, behavior: "smooth" });
  };

  const toggleMute = (index: number) => {
    setMuteStates((prev) =>
      prev.map((muted, i) => (i === index ? !muted : muted))
    );
  };

  return (
    <section className="py-12 mx-4 text-white relative">
      <div className="mx-auto">
        {/* Title */}
        <div className="flex justify-between items-center mb-5 px-2">
          <h2 className="text-2xl font-bold">Trending Reels</h2>
          <a href="/reels" className="text-pink-400 text-sm hover:underline">View All Reels</a>
        </div>

        {/* Reels container with inner buttons */}
        <div className="div">
          <div
            ref={scrollRef}
            className=" flex gap-6 overflow-x-auto scroll-smooth px-4 md:px-10 hide-scrollbar"
          >

            {/* Left Button inside scroll area */}
            <button
              onClick={() => scroll("left")}
              className="absolute md:left-[-20px] top-1/2 -translate-y-1/2 z-10 bg-pink-600 hover:bg-pink-500 text-white p-2 rounded-full shadow-lg ring-2 ring-white/10"
            >
              <ChevronLeft size={20} />
            </button>

            {/* Reel Cards */}
            {reels.map((v, idx) => (
              <div
                key={idx}
                className="min-w-full sm:min-w-[260px] md:min-w-[260px] h-[400px] relative group rounded-xl overflow-hidden bg-zinc-800 shadow-lg"
              >

                {v?.thumbnailDetails?.url ? (
                  <img
                    src={v.thumbnailDetails.url}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    alt="Thumbnail"
                    crossOrigin="anonymous"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-zinc-900 text-zinc-400 text-lg font-semibold">
                    No Preview
                  </div>
                )}

                {/* Play Overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition">
                  <Button
                    size="icon"
                    className="bg-pink-500 hover:bg-pink-600 text-white rounded-full"
                    onClick={() => navigate(`/reels`)}
                  >
                    <Play size={20} />
                  </Button>
                </div>

                {/* Mute toggle */}
                <div
                  onClick={() => setMuteStates((prev) => prev.map((m, i) => (i === idx ? !m : m)))}
                  className="absolute top-2 right-2 bg-black/60 rounded-full p-1 cursor-pointer"
                  title={muteStates[idx] ? "Unmute" : "Mute"}
                >
                  {muteStates[idx] ? <VolumeX size={16} /> : <Volume2 size={16} />}
                </div>

                {/* Info */}
                {v.title && (
                  <div className="absolute bottom-2 left-2 text-sm">
                    <div className="font-semibold">{v.title}</div>
                    <div className="text-xs text-zinc-300">{v.views}</div>
                  </div>
                )}

                {/* Duration */}
                <div className="absolute bottom-2 right-2 text-xs bg-black/70 px-2 py-0.5 rounded text-white">
                  {v?.reelSpecific?.duration}
                </div>
              </div>
            ))}

            {/* Right Button inside scroll area */}
            <button
              onClick={() => scroll("right")}
              className="absolute right-1 md:right-[-20px] right-8 top-1/2 -translate-y-1/2 z-10 bg-pink-600 hover:bg-pink-500 text-white p-2 rounded-full shadow-lg ring-2 ring-white/10"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
