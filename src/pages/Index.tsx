// pages/Index.tsx
import { useState } from "react";
import Layout from "@/components/Layout";
// import { useHomeContentInfinite, useVideos } from "@/hooks/useHome";
import CategoryNav from "@/components/CategoryNav";
import TrendingReels from "./TrendingReels";
import FeaturedVideos from "./FeaturedVideos";
import TrendingVideos from "./TrendingVideos";


// infinite for “latestVideos”
  // const {
  //   data: homePages,
  //   isLoading,
  //   isError,
  //   fetchNextPage,
  //   hasNextPage,
  //   isFetchingNextPage,
  // } = useHomeContentInfinite(
  //   { categoryId: category === "all" ? undefined : category },
  //   latestLimit
  // );
  // const isLoading = true;

  // const {
  //   data: trData,
  //   isLoading: trLoading,
  //   isError: trError,
  // } = useVideos({ page: trPage, limit: trLimit });

  
  // if (trLoading) {
  //   return (
  //     <Layout>
  //       {/* full‐screen backdrop */}
  //       <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
  //         <BounceLoader
  //           color="#ec4899"
  //           loading={true}
  //           size={250}
  //           aria-label="Loading content"
  //           data-testid="bounce-loader"
  //         />
  //       </div>
  //     </Layout>
  //   );
  // }
  // if (trError || !trData) {
  //   return (
  //     <Layout>
  //       <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
  //         <span className="text-lg text-muted-foreground">
  //           Failed to load content.
  //         </span>
  //       </div>
  //     </Layout>
  //   );
  // }

  // // flatten


export default function Index() {
  const [category, setCategory] = useState("all");

  
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
        <TrendingReels category={category}/>

        <FeaturedVideos
          category={category}
        />

        {/* <FeaturedBlogs blogs={homePages.pages[0].trendingBlogs.results} /> */}

        <TrendingVideos category={category} />
{/* 
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
          )} */}
      </section>
    </Layout>
  );
}
