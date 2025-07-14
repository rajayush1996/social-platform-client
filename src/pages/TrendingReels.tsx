import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import ReelCard from "@/components/reels/ReelCard";

export function TrendingReels({ reels }: { reels: any[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    const offset = window.innerWidth; // scroll by full viewport
    scrollRef.current?.scrollBy({
      left: dir === "left" ? -offset : offset,
      behavior: "smooth",
    });
  };

  return (
    <section className="py-12">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        {/* ...header... */}

        <div className="relative">
          <button
            onClick={() => scroll("left")}
            className="absolute -left-2 top-1/2 -translate-y-1/2 z-10 bg-pink-600 text-white p-2 rounded-full"
          >
            <ChevronLeft />
          </button>

          <div
             ref={scrollRef}
            className="flex overflow-x-auto scroll-pl-4 snap-x snap-mandatory gap-4 hide-scrollbar pb-2"
          >
            {reels.map(r => (
              <div
                key={r.id}
                className="
                  flex-shrink-0 
                  snap-start 
                  w-full           /* full width on mobile */
                  sm:w-[260px]     /* your old width on sm+ */
                  lg:w-[350px]     /* old width on lg+ */
                "
              >
                <ReelCard reel={r} />
              </div>
            ))}
          </div>

          <button
            onClick={() => scroll("right")}
            className="absolute -right-2 top-1/2 -translate-y-1/2 z-10 bg-pink-600 text-white p-2 rounded-full"
          >
            <ChevronRight />
          </button>
        </div>
      </div>
    </section>
  );
}
