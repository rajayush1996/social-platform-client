import { useState } from "react";
import VideoCard from "@/components/videos/VideoCard";
import { useVideos } from "@/hooks/useVideo";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";

const VideosPage = () => {
  const [page, setPage] = useState(1);
  const limit = 8;
  // Pass page and limit to fetch paginated videos
  const { data, isLoading, isError } = useVideos({ page, limit });

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <span className="text-lg text-muted-foreground">Loading videos...</span>
        </div>
      </Layout>
    );
  }

  if (isError) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <span className="text-lg text-red-500">Failed to load videos. Please try again later.</span>
        </div>
      </Layout>
    );
  }

  const videos = data?.videos || [];
  const pagination = data?.pagination;

  if (videos.length === 0) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <span className="text-lg text-muted-foreground">No videos available.</span>
        </div>
      </Layout>
    );
  }

  const handlePrev = () => setPage((p) => Math.max(1, p - 1));
  const handleNext = () => setPage((p) => Math.min(pagination.pages, p + 1));

  return (
    <Layout>
      {/* Header */}
      <section className="hero-gradient py-12 md:py-16">
        <div className="container px-4 mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Videos</h1>
            <p className="text-lg text-foreground/90">
              Watch and enjoy our collection of long-form video content
            </p>
          </div>
        </div>
      </section>

      {/* Videos Grid */}
      <section className="py-12">
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {videos.map((video) => (
              <VideoCard
                key={video._id}
                id={video._id}
                thumbnail={video.thumbnail?.url}
                title={video.title || 'Untitled Video'}
                author={video.user?.username || 'Unknown Author'}
                views={video.views || 0}
                duration={video.videoSpecific?.duration || '0:00'}
                previewUrl={video.mediaFile.url}
              />
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center mt-10 space-x-2">
            <Button onClick={handlePrev} disabled={page === 1} variant="outline">
              Previous
            </Button>
            {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((num) => (
              <button
                key={num}
                onClick={() => setPage(num)}
                className={`px-3 py-1 rounded ${
                  page === num ? 'bg-pink-500 text-white' : 'bg-gray-200 text-gray-700'
                }`}
              >
                {num}
              </button>
            ))}
            <Button onClick={handleNext} disabled={page === pagination.pages} variant="outline">
              Next
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default VideosPage;
