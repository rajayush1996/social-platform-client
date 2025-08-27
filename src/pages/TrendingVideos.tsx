// components/TrendingVideos.tsx
import { useState } from "react";
import Loader from "@/components/Loader";
import { usePaginatedContent } from "@/hooks/useHome";
import VideoCard from "@/components/videos/VideoCard";
import { Video } from "@/types/api.types";
import { Button } from "@/components/ui/button";

export default function TrendingVideos({
  category,
  initialLimit = 16,
}: {
  category: string;
  initialLimit?: number;
}) {
  const [page, setPage] = useState(1);

  const {
    items: videos,
    isLoading,
    isError,
    totalPages,
  } = usePaginatedContent<Video>({
    page,
    limit: initialLimit,
    type: "videos",
    filter: "trending",
    category,
  });

  if (isLoading) {
    return (
      <div className="py-12 flex justify-center">
        <Loader size={50} />
      </div>
    );
  }
  if (isError) {
    return (
      <p className="py-12 text-center text-red-500">
        Failed to load trending videos.
      </p>
    );
  }
  if (!videos.length) {
    return null;
  }

  const handlePrev = () => setPage((p) => Math.max(1, p - 1));
  const handleNext = () => setPage((p) => Math.min(totalPages, p + 1));

  const getPageNumbers = (total: number) => {
    const pages: (number | string)[] = [];
    const firstBlockEnd = Math.min(6, total);

    for (let i = 1; i <= firstBlockEnd; i++) {
      pages.push(i);
    }

    if (total > firstBlockEnd) {
      const mid = Math.ceil(total / 2);

      if (mid - firstBlockEnd > 1) {
        pages.push("...");
      }

      if (mid > firstBlockEnd && mid < total) {
        pages.push(mid);
      }

      if (total - mid > 1) {
        pages.push("...");
      }

      if (mid !== total) {
        pages.push(total);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers(totalPages);

  return (
    <section className="mt-12 mb-12">
      <div className="container mx-auto px-4">
        {/* header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Trending Videos</h2>
          <button
            onClick={() => (window.location.href = "/videos?filter=trending")}
            className="text-pink-500 hover:underline text-sm"
          >
            View All
          </button>
        </div>

        {/* grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {videos.map((video) => (
            <VideoCard key={video._id || video.id} v={video} />
          ))}
        </div>

        {totalPages > 1 && (
          <nav className="flex items-center justify-center mt-8 space-x-2">
            <Button onClick={handlePrev} disabled={page === 1} variant="outline">
              Previous
            </Button>
            {pageNumbers.map((num, idx) =>
              typeof num === "number" ? (
                <button
                  key={num}
                  onClick={() => setPage(num)}
                  className={`w-8 h-8 flex items-center justify-center rounded ${
                    page === num
                      ? "bg-white text-black"
                      : "bg-gray-800 text-gray-200"
                  }`}
                >
                  {num}
                </button>
              ) : (
                <span
                  key={`ellipsis-${idx}`}
                  className="px-2 text-gray-400"
                >
                  {num}
                </span>
              )
            )}
            <Button
              onClick={handleNext}
              disabled={page === totalPages}
              variant="outline"
            >
              Next
            </Button>
          </nav>
        )}
      </div>
    </section>
  );
}
