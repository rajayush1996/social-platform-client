/* eslint-disable @typescript-eslint/no-explicit-any */
// components/FeaturedVideos.tsx
import { useState } from "react";
import { usePaginatedContent } from "@/hooks/useHome";  // adjust path if needed
import VideoCard from "@/components/videos/VideoCard";
import { BounceLoader } from "react-spinners";
import { Video } from "@/types/api.types";

export default function FeaturedVideos({
  category,
  initialLimit = 12,
}: {
  category: string;
  initialLimit?: number;
}) {
  // 1) manage page internally
  const [page, setPage] = useState(1);

  // 2) call hook with page & filter
  const {
    items: videos,
    isLoading,
    isError,
    hasMore,
    currentPage,
    totalPages,
  } = usePaginatedContent<Video>({
    page,                         // ← drives which page you fetch
    limit: initialLimit,          // ← items per page
    type: "videos",               // same endpoint for videos & reels
    filter: "mostly-viewed",      // tell your API “mostly viewed”
    category,                     // optional category filter
  });

  // 3) loading / error
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
        Failed to load videos.
      </p>
    );
  }

  // 4) render
  return (
    <section className="mt-12 mb-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Mostly Viewed</h2>
          <button
            onClick={() => (window.location.href = "/videos")}
            className="text-pink-500 hover:underline text-sm"
          >
            View All
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {videos.map((video: any) => (
            <VideoCard
              key={video._id || video.id}
              v = {video}
            />
          ))}
        </div>

        {/* 5) “Load More” driven by API’s hasMore */}
        {hasMore && (
          <div className="flex justify-center mt-8">
            <button
              onClick={() => setPage(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 disabled:opacity-50 transition"
            >
              {`Load More (${currentPage + 1}/${totalPages})`}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
