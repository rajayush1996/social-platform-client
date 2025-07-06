import BlogCard from "@/components/blog/BlogCard";
import { useState } from "react";
import { Button } from "react-day-picker";

export function LatestBlogs({ blogs }: { blogs: any[] }) {
    const [visible, setVisible] = useState(8);
  
    const handleLoadMore = () => {
      setVisible((prev) => prev + 8);
    };
  
    if (!blogs?.length) return null;
  
    return (
      <section className="py-12 mx-4">
        <div className="mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-white">Latest Blogs</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {blogs.slice(0, visible).map((blog) => (
              <BlogCard
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
          {visible < blogs.length && (
            <div className="mt-8 text-center">
              <Button onClick={handleLoadMore} className="bg-pink-500 hover:bg-pink-600">Load More</Button>
            </div>
          )}
        </div>
      </section>
    );
  }
  