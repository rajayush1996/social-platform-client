import { useState } from "react";
import VideoCard from "@/components/videos/VideoCard";
import { useVideos } from "@/hooks/useVideo";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { BounceLoader } from "react-spinners";
import { useSearchParams } from "react-router-dom";
import CategoryNav from "@/components/CategoryNav";

const VideosPage = () => {
  const [page, setPage] = useState(1);
  const limit = 16;
  const [searchParams] = useSearchParams();
  const catId = searchParams.get("category") || "all";
  const searchByName = searchParams.get("q") || '';
  const [category, setCategory] = useState(catId);

  // const { categoryId: rawCategoryId } = router.query

  // Pass page and limit to fetch paginated videos
  const { data, isLoading, isError } = useVideos({
    page,
    limit,
    categoryId: category,
    search: searchByName,
  });

  if (isLoading) {
    return (
      <Layout>
        {/* full‐screen backdrop */}
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <BounceLoader
            color="#ec4899"
            loading={true}
            size={250}
            aria-label="Loading content"
            data-testid="bounce-loader"
          />
        </div>
      </Layout>
    );
  }

  if (isError) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <span className="text-lg text-red-500">
            Failed to load videos. Please try again later.
          </span>
        </div>
      </Layout>
    );
  }

  const videos = data?.results || [];
  const pagination = data?.pagination;

  if (videos.length === 0) {
    return (
      <Layout>
      <CategoryNav activeCategory={category} onCategoryChange={setCategory} />

        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <span className="text-lg text-muted-foreground">
            No videos available.
          </span>
        </div>
      </Layout>
    );
  }

  const handlePrev = () => setPage((p) => Math.max(1, p - 1));
  const handleNext = () =>
    setPage((p) => Math.min(pagination.totalPages, p + 1));

  return (
    <Layout>
      <CategoryNav activeCategory={category} onCategoryChange={setCategory} />
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
              <VideoCard key={video._id} v={video} />
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center mt-10 space-x-2">
            <Button
              onClick={handlePrev}
              disabled={page === 1}
              variant="outline"
            >
              Previous
            </Button>
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
              (num) => (
                <button
                  key={num}
                  onClick={() => setPage(num)}
                  className={`px-3 py-1 rounded ${
                    page === num
                      ? "bg-pink-500 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {num}
                </button>
              )
            )}
            <Button
              onClick={handleNext}
              disabled={page === pagination.totalPages}
              variant="outline"
            >
              Next
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default VideosPage;
