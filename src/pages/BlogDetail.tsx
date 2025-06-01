import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BlogCard from "@/components/blog/BlogCard";
import { useBlog, useBlogs } from "@/hooks/useBlog";

const BlogDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: blog, isLoading, isError } = useBlog(id!);
  const { data, isLoading: isLoadingAll } = useBlogs();
  const blogs = data?.results || [];

  // Get recommended blog posts (exclude current)
  const recommendedBlogs = blogs.filter((item) => item._id !== id).slice(0, 3);

  if (isLoading || isLoadingAll) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-grow pt-16 flex items-center justify-center">
          <span className="text-lg text-muted-foreground">Loading article...</span>
        </main>
        <Footer />
      </div>
    );
  }

  if (isError || !blog) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-grow pt-16 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Article not found</h1>
            <p className="text-muted-foreground mb-6">The article you're looking for doesn't exist or has been removed.</p>
            <Button asChild>
              <a href="/blog">Back to Blog</a>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-grow pt-16">
        {/* Blog Header */}
        <div className="relative h-[400px] bg-gradient-to-b from-reel-purple-900/60 to-black/60">
          <div className="absolute inset-0 overflow-hidden">
            <img 
              src={blog.thumbnail} 
              alt={blog.title} 
              className="w-full h-full object-cover opacity-40"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
          <div className="relative h-full container px-4 mx-auto flex items-end pb-12">
            <div className="max-w-3xl">
              <Badge variant="secondary" className="bg-reel-purple-500/10 text-reel-purple-400 hover:bg-reel-purple-500/20 mb-4">
                {blog.category}
              </Badge>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">{blog.title}</h1>
              <div className="flex items-center mt-4 text-foreground/80">
                <div className="w-8 h-8 rounded-full bg-reel-purple-600 flex items-center justify-center text-white font-bold">
                  {blog.author.name.charAt(0)}
                </div>
                <span className="ml-2">{blog.author.name}</span>
                <span className="mx-2">•</span>
                <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                <span className="mx-2">•</span>
                <span>{blog.readTime} min read</span>
              </div>
            </div>
          </div>
        </div>

        <div className="container px-4 mx-auto py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="prose prose-invert lg:prose-lg max-w-none">
                <p className="text-xl text-foreground/90 mb-6">{blog.excerpt}</p>
                {/* Render blog.content if available, else fallback */}
                {blog.content ? (
                  <div dangerouslySetInnerHTML={{ __html: blog.content }} />
                ) : (
                  <p>No content available.</p>
                )}
              </div>
            </div>
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <h2 className="text-xl font-bold mb-4">Recommended Articles</h2>
                <div className="space-y-6">
                  {recommendedBlogs.map((rec) => (
                    <BlogCard 
                      key={rec._id}
                      id={rec._id}
                      thumbnail={rec.thumbnail}
                      title={rec.title}
                      excerpt={rec.excerpt}
                      author={rec.author}
                      date={rec.date}
                      category={rec.category}
                      readTime={rec.readTime}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BlogDetail;
