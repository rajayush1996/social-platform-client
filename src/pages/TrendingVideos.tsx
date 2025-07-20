// components/TrendingVideos.tsx
import { useState } from "react";
import { BounceLoader } from "react-spinners";
import { usePaginatedContent } from "@/hooks/useHome";
import VideoCard from "@/components/videos/VideoCard";
import { Video } from "@/types/api.types";

export default function TrendingVideos({
  category,
  initialLimit = 12,
}: {
  category: string;
  initialLimit?: number;
}) {
  const [page, setPage] = useState(1);

  const {
    items: videos,
    isLoading,
    isError,
    currentPage,
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
        <BounceLoader size={50} color="#ec4899" />
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

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

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

        {/* classic pagination below */}
        {totalPages > 1 && (
          <nav className="flex items-center justify-center mt-8 space-x-2">
            <button
              onClick={() => setPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded bg-gray-200 text-gray-700 disabled:opacity-50"
            >
              Prev
            </button>

            {pages.map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`px-3 py-1 rounded transition ${
                  p === currentPage
                    ? "bg-pink-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {p}
              </button>
            ))}

            <button
              onClick={() => setPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded bg-gray-200 text-gray-700 disabled:opacity-50"
            >
              Next
            </button>
          </nav>
        )}
      </div>
    </section>
  );
}
