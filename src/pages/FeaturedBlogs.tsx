import FeaturedBlog from "@/components/blog/FeaturedBlog";

export function FeaturedBlogs({ blogs }: { blogs: any[] }) {
    if (!blogs?.length) return null;
  
    return (
      <section className="py-12 bg-background/50 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-white">Featured Blogs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {blogs.map((blog) => (
              <FeaturedBlog
                key={blog._id || blog.id}
                id={blog._id || blog.id}
                thumbnail={blog.blogSpecific?.thumbnailMetadata?.url || ''}
                title={blog.title}
                excerpt={blog.description}
                author={blog.categoryId?.name || 'Unknown'}
                date={new Date(blog.createdAt).toLocaleDateString()}
                readTime={blog.blogSpecific?.readTime || '5 min'}
                category={blog.categoryId?.name || 'Uncategorized'}
              />
            ))}
          </div>
        </div>
      </section>
    );
  }