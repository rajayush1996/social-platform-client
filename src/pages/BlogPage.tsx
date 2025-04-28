
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BlogCard from "@/components/blog/BlogCard";
import FeaturedBlog from "@/components/blog/FeaturedBlog";
import { blogData } from "@/data/mockData";

const BlogPage = () => {
  // Get featured blog
  const featuredBlog = blogData.find(blog => blog.featured);
  
  // Get non-featured blogs
  const normalBlogs = blogData.filter(blog => !blog.featured);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-grow pt-16">
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
            
            {featuredBlog && (
              <FeaturedBlog 
                id={featuredBlog.id}
                thumbnail={featuredBlog.thumbnail}
                title={featuredBlog.title}
                excerpt={featuredBlog.excerpt}
                author={featuredBlog.author}
                date={featuredBlog.date}
                category={featuredBlog.category}
                readTime={featuredBlog.readTime}
              />
            )}
          </div>
        </section>

        {/* All Blogs Grid */}
        <section className="py-12">
          <div className="container px-4 mx-auto">
            <h2 className="text-2xl font-bold mb-6">All Articles</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {normalBlogs.map(blog => (
                <BlogCard 
                  key={blog.id}
                  id={blog.id}
                  thumbnail={blog.thumbnail}
                  title={blog.title}
                  excerpt={blog.excerpt}
                  author={blog.author}
                  date={blog.date}
                  category={blog.category}
                  readTime={blog.readTime}
                />
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default BlogPage;
