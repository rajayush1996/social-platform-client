/* eslint-disable @typescript-eslint/no-explicit-any */
import FeaturedBlog from "@/components/blog/FeaturedBlog";
import { useNavigate } from "react-router-dom";

export function FeaturedBlogs({ blogs }: { blogs: any[] }) {
  const navigate = useNavigate();
  if (!blogs?.length) return null;

  return (
    <section className="mt-12 bg-background/50 mx-4">
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Latest Blogs</h2>
          <button
            onClick={() => navigate("/blogs")}
            className="text-pink-500 hover:underline text-sm"
          >
            View All
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {blogs.map((blog) => (
            <FeaturedBlog
              key={blog._id || blog.id}
              id={blog._id || blog.id}
              thumbnail={blog.blogSpecific?.thumbnailMetadata?.url || ""}
              title={blog.title}
              excerpt={blog.description}
              author={blog.categoryId?.name || "Unknown"}
              date={new Date(blog.createdAt).toLocaleDateString()}
              readTime={blog.blogSpecific?.readTime || "5 min"}
              category={blog.categoryId?.name || "Uncategorized"}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
