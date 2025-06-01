import BlogCard from "@/components/blog/BlogCard";
import FeaturedBlog from "@/components/blog/FeaturedBlog";
import { useBlogs } from "@/hooks/useBlog";
import Layout from "@/components/Layout";

const BlogPage = () => {
  const { data: featuredData } = useBlogs({ featured: true, limit: 1 });
  const { data: allBlogsData, isLoading, isError } = useBlogs({ featured: false });
  
  const featuredBlog = featuredData?.results[0];
  const blogs = allBlogsData?.results;

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <span className="text-lg text-muted-foreground">Loading blogs...</span>
        </div>
      </Layout>
    );
  }

  if (isError) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <span className="text-lg text-red-500">Failed to load blogs. Please try again later.</span>
        </div>
      </Layout>
    );
  }

  if (!blogs || blogs.length === 0) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <span className="text-lg text-muted-foreground">No blog articles found.</span>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Header */}
      <section className="hero-gradient py-12 md:py-16">
        <div className="container px-4 mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Blog Articles</h1>
            <p className="text-lg text-foreground/90">
              Explore insightful articles about video content, production, and trends
            </p>
          </div>
        </div>
      </section>

      {/* Featured Blog */}
      <section className="py-12">
        <div className="container px-4 mx-auto">
          <h2 className="text-2xl font-bold mb-6">Featured Article</h2>
          {featuredBlog ? (
            <FeaturedBlog
              id={featuredBlog._id}
              thumbnail={featuredBlog.blogSpecific.thumbnailMetadata.url}
              title={featuredBlog.title}
              excerpt={featuredBlog.blogSpecific.excerpt}
              author={featuredBlog.categoryId.name}
              date={featuredBlog.createdAt}
              category={featuredBlog.categoryId.name}
              readTime={featuredBlog.blogSpecific.readTime}
            />
          ) : (
            <span className="text-muted-foreground">No featured article found.</span>
          )}
        </div>
      </section>

      {/* All Blogs Grid */}
      <section className="py-12">
        <div className="container px-4 mx-auto">
          <h2 className="text-2xl font-bold mb-6">All Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog) => (
              <BlogCard
                key={blog._id}
                id={blog._id}
                thumbnail={blog.blogSpecific.thumbnailMetadata.url}
                title={blog.title}
                excerpt={blog.blogSpecific.excerpt}
                author={blog.categoryId.name}
                date={blog.createdAt}
                category={blog.categoryId.name}
                readTime={blog.blogSpecific.readTime}
              />
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default BlogPage;
