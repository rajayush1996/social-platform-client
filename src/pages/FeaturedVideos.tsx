/* eslint-disable @typescript-eslint/no-explicit-any */
// components/FeaturedVideos.tsx
import { usePaginatedContent } from "@/hooks/useHome";  // adjust path if needed
import VideoCard from "@/components/videos/VideoCard";
import Loader from "@/components/Loader";
import { Video } from "@/types/api.types";

export default function FeaturedVideos({
  category,
  initialLimit = 12,
}: {
  category: string;
  initialLimit?: number;
}) {
  // 2) call hook with page & filter
  const {
    items: videos,
    isLoading,
    isError,
  } = usePaginatedContent<Video>({
    page: 1,                     // fetch only the first page
    limit: initialLimit,          // ← items per page
    type: "videos",               // same endpoint for videos & reels
    filter: "mostly-viewed",      // tell your API “mostly viewed”
    category,                     // optional category filter
  });

  // 3) loading / error
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
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {videos.map((video: any) => (
            <VideoCard
              key={video._id || video.id}
              v = {video}
            />
          ))}
        </div>

        <div className="flex justify-center mt-8">
          <button
            onClick={() => (window.location.href = "/videos")}
            className="px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition"
          >
            View All
          </button>
        </div>
      </div>
    </section>
  );
}
