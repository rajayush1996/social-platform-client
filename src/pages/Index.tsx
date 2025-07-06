// import { Link } from 'react-router-dom';
// import { Button } from "@/components/ui/button";
// import { Film, BookOpen } from "lucide-react";
// import ReelCard from "@/components/reels/ReelCard";
// import FeaturedReel from "@/components/reels/FeaturedReel";
// import BlogCard from "@/components/blog/BlogCard";
// import FeaturedBlog from "@/components/blog/FeaturedBlog";
// import VideoCard from "@/components/videos/VideoCard";
// import { useHomeContent } from "@/hooks/useHome";
// import Layout from "@/components/Layout";

// const Index = () => {
//   const { data, isLoading, isError } = useHomeContent();

//   if (isLoading) {
//     return (
//       <Layout>
//         <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
//           <span className="text-lg text-muted-foreground">Loading content...</span>
//         </div>
//       </Layout>
//     );
//   }

//   if (isError || !data) {
//     return (
//       <Layout>
//         <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
//           <span className="text-lg text-muted-foreground">Failed to load content. Please try again later.</span>
//         </div>
//       </Layout>
//     );
//   }

//   const featuredBlogs = data.featured.blogs || [];
//   const latestBlogs = data.latest.blogs || [];
//   const featuredVideos = data.featured.videos || [];

//   return (
//     <Layout>
//       {/* Hero Section */}
//       <section className="hero-gradient py-12 md:py-16">
//         <div className="container px-4 mx-auto">
//           <div className="max-w-3xl mx-auto text-center">
//             <h1 className="text-3xl md:text-4xl font-bold mb-4">Welcome to Reel Blog Vibes</h1>
//             <p className="text-lg text-foreground/90">
//               Discover amazing videos, reels, and blog posts from creators around the world
//             </p>
//           </div>
//         </div>
//       </section>

//       {/* Featured Videos */}
//       {featuredVideos.length > 0 && (
//         <section className="py-12">
//           <div className="container px-4 mx-auto">
//             <h2 className="text-2xl font-bold mb-6">Featured Videos</h2>
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//               {featuredVideos.map(video => (
//                 <VideoCard
//                   key={video._id || video.id}
//                   id={video._id || video.id}
//                   thumbnail={video.thumbnailDetails?.url || ''}
//                   title={video.title}
//                   author={video.categoryId?.name || 'Unknown'}
//                   views={video.stats?.views || 0}
//                   duration={video.videoSpecific?.duration || '0:00'}
//                 />
//               ))}
//             </div>
//           </div>
//         </section>
//       )}

//       {/* Featured Blogs */}
//       {featuredBlogs.length > 0 && (
//         <section className="py-12 bg-background/50">
//           <div className="container px-4 mx-auto">
//             <h2 className="text-2xl font-bold mb-6">Featured Blogs</h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               {featuredBlogs.map(blog => (
//                 <FeaturedBlog
//                   key={blog._id || blog.id}
//                   id={blog._id || blog.id}
//                   thumbnail={blog.blogSpecific?.thumbnailMetadata?.url || ''}
//                   title={blog.title}
//                   excerpt={blog.description}
//                   author={blog.categoryId?.name || 'Unknown'}
//                   date={new Date(blog.createdAt).toLocaleDateString()}
//                   readTime={blog.blogSpecific?.readTime || '5 min'}
//                   category={blog.categoryId?.name || 'Uncategorized'}
//                 />
//               ))}
//             </div>
//           </div>
//         </section>
//       )}

//       {/* Latest Blogs */}
//       {latestBlogs.length > 0 && (
//         <section className="py-12">
//           <div className="container px-4 mx-auto">
//             <h2 className="text-2xl font-bold mb-6">Latest Blogs</h2>
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//               {latestBlogs.map(blog => (
//                 <BlogCard
//                   key={blog._id || blog.id}
//                   id={blog._id || blog.id}
//                   thumbnail={blog.blogSpecific?.thumbnailMetadata?.url || ''}
//                   title={blog.title}
//                   excerpt={blog.description}
//                   author={blog.categoryId?.name || 'Unknown'}
//                   date={new Date(blog.createdAt).toLocaleDateString()}
//                   readTime={blog.blogSpecific?.readTime || '5 min'}
//                   category={blog.categoryId?.name || 'Uncategorized'}
//                 />
//               ))}
//             </div>
//           </div>
//         </section>
//       )}

//       {/* No Content Message */}
//       {!featuredVideos.length && !featuredBlogs.length && !latestBlogs.length && (
//         <section className="py-12">
//           <div className="container px-4 mx-auto">
//             <div className="text-center text-muted-foreground">
//               <p className="text-lg">No content available at the moment.</p>
//               <p className="text-sm mt-2">Check back later for new videos and blogs!</p>
//             </div>
//           </div>
//         </section>
//       )}
//     </Layout>
//   );
// };

// export default Index;


import Layout from "@/components/Layout";
// import { Navbar, HeroBanner, TrendingReels } from "@/components/custom/Navbar";
// import HeroSlider from "@/components/custom/HeroSlider";


import { useHomeContent } from "@/hooks/useHome";
import { TrendingReels } from "./TrendingReels";
import { FeaturedVideos } from "./FeaturedVideos";
import { FeaturedBlogs } from "./FeaturedBlogs";
import { LatestBlogs } from "./LatestBlogs";
import { NoContentFallback } from "./NoContentFallback";
import HeroSlider from "./HeroSlider";
import MonetizeBanner from "@/components/MonetizeBanner";

export default function Index() {
  const { data, isLoading, isError } = useHomeContent();

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <span className="text-lg text-muted-foreground">Loading content...</span>
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

  return (
    <Layout>
      <section className="md:mx-12">
        <MonetizeBanner />
        <HeroSlider videos={data.featured.videos} />
        <TrendingReels reels={data.featured.reels} />
        {/* <HeroBanner /> */}
        <FeaturedVideos videos={data.featured.videos} />
        <FeaturedBlogs blogs={data.featured.blogs} />
        <LatestBlogs blogs={data.latest.blogs} />
        {!data.featured.videos.length &&
        !data.featured.blogs.length &&
        !data.latest.blogs.length && <NoContentFallback />}
      </section>
      {/* <Navbar /> */}


      
    </Layout>
  );
}

