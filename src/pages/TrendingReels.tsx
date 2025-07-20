/* eslint-disable @typescript-eslint/no-explicit-any */
// components/TrendingReels.tsx
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { BounceLoader } from "react-spinners";
import { usePaginatedContent } from "@/hooks/useHome";
import ReelCard from "@/components/reels/ReelCard";
// import { YourReelType } from "@/types/api";

export default function TrendingReels({
  category,
  initialLimit = 12,
}: {
  category: string;
  initialLimit?: number;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [page, setPage] = useState(1);

  const {
    items: reels,
    skip,
    limit,
    hasMore,
    totalPages,
    totalResults,
    currentPage,
    isLoading,
    isError,
  } = usePaginatedContent<any>({
    page,
    limit: initialLimit,
    type: "reels",
    category,
  });

  if (isLoading) {
    return (
      <div className="py-12 flex justify-center">
        <BounceLoader size={50} color="#ec4899" />
      </div>
    );
  }
  if (isError) {
    return (
      <p className="py-12 text-center text-red-500">
        Failed to load trending reels.
      </p>
    );
  }

  const scroll = (dir: "left" | "right") =>
    scrollRef.current?.scrollBy({
      left: dir === "left" ? -window.innerWidth : window.innerWidth,
      behavior: "smooth",
    });

  return (
    <section className="trending_reels mt-12">
      <div className="container">
        {/* Header with pagination info */}
        <div className="mx-auto flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Trending Reels</h2>
          <div className="flex items-center space-x-2 text-sm">
            {/* <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-2 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Prev
            </button>
            <span>
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => hasMore && setPage((p) => p + 1)}
              disabled={!hasMore}
              className="px-2 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Next
            </button>
            <span className="ml-4 text-gray-600">
              Showing {skip + 1}–{Math.min(skip + limit, totalResults)} of{" "}
              {totalResults}
            </span> */}
            <button
              onClick={() => navigate("/reels")}
              className="ml-6 text-pink-500 hover:underline"
            >
              View All
            </button>
          </div>
        </div>

        {/* Scrollable carousel */}
        <div className="relative">
          <button
            onClick={() => scroll("left")}
            className="absolute -left-2 top-1/2 z-10 bg-pink-600 text-white p-2 rounded-full"
          >
            <ChevronLeft />
          </button>

          <div
            ref={scrollRef}
            className="flex overflow-x-auto scroll-pl-4 snap-x snap-mandatory gap-4 hide-scrollbar pb-2"
          >
            {reels.map((r) => (
              <div
                key={r.mediaId}
                className="flex-shrink-0 snap-start w-full sm:w-[260px] lg:w-[350px]"
              >
                <ReelCard reel={r} />
              </div>
            ))}
          </div>

          <button
            onClick={() => scroll("right")}
            className="absolute -right-2 top-1/2 z-10 bg-pink-600 text-white p-2 rounded-full"
          >
            <ChevronRight />
          </button>
        </div>
      </div>
    </section>
  );
}
