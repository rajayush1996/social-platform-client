import VideoCard from "@/components/videos/VideoCard";
import { Video } from "@/types/api.types";

interface FeaturedVideosProps {
  videos: Video[];                      // all videos loaded so far
  hasMore: boolean;                     // true if there’s another page
  isLoadingMore: boolean;               // true while fetching the next page
  onLoadMore: () => void;               // callback to fetch the next page
}

export function FeaturedVideos({
  videos,
  hasMore,
  isLoadingMore,
  onLoadMore,
}: FeaturedVideosProps) {
  if (!videos?.length) return null;

  // Render X skeleton cards while loading more
  const skeletons = Array.from({ length: 4 }).map((_, i) => (
    <div
      key={i}
      className="w-full aspect-video bg-gray-700 rounded-lg animate-pulse"
    />
  ));

  return (
    <section className="mt-12 mb-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Mostly Viewed</h2>
          {/* this button could navigate to a full /videos page */}
          <button
            onClick={() => window.location.href = "/videos"}
            className="text-pink-500 hover:underline text-sm"
          >
            View All
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {videos.map(video => (
            <VideoCard
              key={video._id || video.id}
              id={video._id || video.id}
              thumbnail={video?.thumbnailDetails?.url || ""}
              title={video.title}
              author={video.categoryId?.name || "Unknown"}
              views={video.stats?.views || 0}
              duration={video.videoSpecific?.duration || "0:00"}
              previewUrl={video.mediaDetails.url || ""}
            />
          ))}

          {isLoadingMore && skeletons}
        </div>

        {hasMore && (
          <div className="flex justify-center mt-8">
            <button
              onClick={onLoadMore}
              disabled={isLoadingMore}
              className="px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 disabled:opacity-50 transition"
            >
              {isLoadingMore ? "Loading…" : "Load More"}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
