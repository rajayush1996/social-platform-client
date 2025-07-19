import VideoCard from "@/components/videos/VideoCard";
import { Video } from "@/types/api.types";

interface TrendingVideosProps {
  videos: Video[];                   // videos on the current page
  page: number;                      // current page index (1‑based)
  totalPages: number;                // total number of pages available
  onPageChange: (page: number) => void; // callback when user clicks a page button
}

export function TrendingVideos({
  videos,
  page,
  totalPages,
  onPageChange,
}: TrendingVideosProps) {
  if (!videos?.length) return null;

  // build an array like [1,2,3,...]
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <section className="mt-12 mb-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Trending Videos</h2>
          <button
            onClick={() => window.location.href = "/videos?filter=trending"}
            className="text-pink-500 hover:underline text-sm"
          >
            View All
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {videos.map((video) => (
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
        </div>

        {totalPages > 1 && (
          <nav className="flex items-center justify-center mt-8 space-x-2">
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page === 1}
              className="px-3 py-1 rounded bg-gray-200 text-gray-700 disabled:opacity-50"
            >
              Prev
            </button>

            {pages.map((p) => (
              <button
                key={p}
                onClick={() => onPageChange(p)}
                className={`px-3 py-1 rounded transition ${
                  p === page
                    ? "bg-pink-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {p}
              </button>
            ))}

            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page === totalPages}
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
