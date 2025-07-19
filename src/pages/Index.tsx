// pages/Index.tsx
import { useState } from "react";
import Layout from "@/components/Layout";
import { useHomeContentInfinite, useTrendingVideos } from "@/hooks/useHome";
import CategoryNav from "@/components/CategoryNav";
import HeroSlider from "./HeroSlider";
import { TrendingReels } from "./TrendingReels";
import { FeaturedVideos } from "./FeaturedVideos";
import { FeaturedBlogs } from "./FeaturedBlogs";
import { NoContentFallback } from "./NoContentFallback";
import { TrendingVideos } from "./TrendingVideos";
import EarnBanner from "@/components/EarnBanner";
import { useCategories } from "@/hooks/useCategories";
import { useNavigate } from "react-router-dom";
import { BounceLoader } from "react-spinners";

export default function Index() {
  const [category, setCategory] = useState("all");
  const latestLimit = 12;
 
  // classic pagination for trendingVideos
  const [trPage, setTrPage] = useState(1);
  const [trLimit, setTrLimit] = useState(12);

  // infinite for “latestVideos”
  const {
    data: homePages,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useHomeContentInfinite(
    { categoryId: category === "all" ? undefined : category },
    latestLimit
  );
  // const isLoading = true;

  const {
    data: trData,
    isLoading: trLoading,
    isError: trError,
  } = useTrendingVideos({ page: trPage, limit: trLimit });

  
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
  if (isError || !homePages) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <span className="text-lg text-muted-foreground">
            Failed to load content.
          </span>
        </div>
      </Layout>
    );
  }

  // flatten
  const allLatest = homePages.pages.flatMap((p) => p.latestVideos.results);

  return (
    <Layout>
      <CategoryNav
        activeCategory={category}
        onCategoryChange={setCategory}
      />

      {/* <section className="container mx-auto mt-6">
        <HeroSlider videos={allLatest} />
      </section> */}

      <section className="md:mx-12">
        <TrendingReels reels={homePages.pages[0].trendingReels.results} />

        <FeaturedVideos
          videos={allLatest}
          onLoadMore={fetchNextPage}
          hasMore={Boolean(hasNextPage)}
          isLoadingMore={isFetchingNextPage}
        />

        <FeaturedBlogs blogs={homePages.pages[0].trendingBlogs.results} />

        <section className="container flex items-center gap-4 mb-4">
          <label
            htmlFor="trending-limit"
            className="text-sm font-medium text-white"
          >
            Per‑page:
          </label>

          <div className="relative inline-block">
            <select
              id="trending-limit"
              value={trLimit}
              onChange={(e) => setTrLimit(+e.target.value)}
              className="
                  block
                  w-20
                  bg-gray-800
                  text-white
                  border border-gray-700
                  rounded-md
                  px-2 py-1
                  focus:outline-none focus:ring-2 focus:ring-pink-500
                  appearance-none
                "
            >
              {[6, 12, 24, 48].map((n) => (
                <option key={n} value={n} className="bg-gray-800 text-white">
                  {n}
                </option>
              ))}
            </select>
            {/* little custom arrow so you don’t get the native one */}
            <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-gray-400">
              ▾
            </span>
          </div>
        </section>

        {trLoading ? (
          <div className="flex justify-center space-x-2 py-8">
            <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce" />
            <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce delay-150" />
            <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce delay-300" />
          </div>
        ) : trError || !trData ? (
          <p className="text-center text-red-500">
            Failed to load trending videos.
          </p>
        ) : (
          <TrendingVideos
            videos={trData.results}
            page={trData.currentPage}
            totalPages={trData.totalPages}
            onPageChange={setTrPage}
          />
        )}

        {!allLatest.length &&
          homePages.pages[0].trendingBlogs.results.length === 0 &&
          homePages.pages[0].trendingReels.results.length === 0 && (
            <NoContentFallback />
          )}
      </section>
    </Layout>
  );
}
