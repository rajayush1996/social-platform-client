import { useState } from "react";
import Layout from "@/components/Layout";
import { useHomeContentInfinite } from "@/hooks/useHome";
import CategoryNav from "@/components/CategoryNav";
import HeroSlider from "./HeroSlider";
import { TrendingReels } from "./TrendingReels";
import { FeaturedVideos } from "./FeaturedVideos";
import { FeaturedBlogs } from "./FeaturedBlogs";
import { NoContentFallback } from "./NoContentFallback";

export default function Index() {
  const [category, setCategory] = useState("all");
  const latestLimit = 12;

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useHomeContentInfinite(
    { categoryId: category === "all" ? undefined : category },
    latestLimit
  );
  console.log("🚀 ~ :23 ~ Index ~ data:", data)

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <span className="text-lg text-muted-foreground">
            Loading content...
          </span>
        </div>
      </Layout>
    );
  }

  if (isError || !data) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <span className="text-lg text-muted-foreground">
            Failed to load content. Please try again later.
          </span>
        </div>
      </Layout>
    );
  }

  // flatten all pages of latestVideos
  const allLatestVideos =
    data.pages.flatMap((page) => page.latestVideos.results) || [];

  return (
    <Layout>
      <CategoryNav
        categories={[
          { id: "all", name: "All" },
          { id: "featured", name: "Featured" },
          { id: "trending", name: "Trending" },
          { id: "bhabhi", name: "Bhabhi" },
          { id: "desi", name: "Desi" },
          { id: "punjabi", name: "Punjabi" },
        ]}
        activeCategory={category}
        onCategoryChange={setCategory}
      />

      {/* Hero Banner */}
      <section className="container mx-auto mt-6">
        <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between text-white shadow-lg">
          <div className="max-w-xl">
            <h1 className="text-4xl font-bold mb-2">Welcome to LustyHub</h1>
            <p className="mb-4 opacity-90">
              Explore the hottest collection of adult videos, reels, and blogs.
            </p>
          </div>
          <img
            src="/assets/hero.jpeg"
            alt="LustyHub"
            className="w-64 h-auto rounded-2xl"
          />
        </div>
      </section>

      <section className="md:mx-12">
        <HeroSlider videos={allLatestVideos} />

        <TrendingReels reels={data.pages[0].trendingReels.results} />

        <FeaturedVideos
          videos={allLatestVideos}
          // we’re not using page/totalPages here—just infinite load
          onLoadMore={fetchNextPage}
          hasMore={hasNextPage}
          isLoadingMore={isFetchingNextPage}
        />

        <FeaturedBlogs blogs={data.pages[0].trendingBlogs.results} />

        {!allLatestVideos.length &&
         !data.pages[0].trendingBlogs.results.length &&
         !data.pages[0].trendingReels.results.length && (
          <NoContentFallback />
        )}
      </section>
    </Layout>
  );
}
