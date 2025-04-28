
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BlogCard from "@/components/blog/BlogCard";
import { blogData } from "@/data/mockData";

const BlogDetail = () => {
  const { id } = useParams<{ id: string }>();
  
  // Find the current blog post
  const blog = blogData.find(blog => blog.id === id);
  
  // Get recommended blog posts (exclude current)
  const recommendedBlogs = blogData
    .filter(item => item.id !== id)
    .slice(0, 3);

  if (!blog) {
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
                  {blog.author.charAt(0)}
                </div>
                <span className="ml-2">{blog.author}</span>
                <span className="mx-2">•</span>
                <span>{blog.date}</span>
                <span className="mx-2">•</span>
                <span>{blog.readTime} read</span>
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
                
                <p>The rise of short-form video content has transformed the way we consume media. From TikTok to Instagram Reels, these bite-sized videos have captivated audiences worldwide, changing not just entertainment but also how brands market themselves and how information is shared.</p>
                
                <h2>The Power of Short-Form Content</h2>
                
                <p>With decreasing attention spans and increasing competition for eyeballs, short-form videos offer the perfect solution: quick, engaging content that delivers maximum impact in minimum time. Their inherent brevity forces creators to distill their message to its essence, resulting in content that's often more focused and impactful than longer formats.</p>
                
                <p>This format has democratized content creation, allowing anyone with a smartphone to potentially reach millions of viewers without expensive equipment or formal training. The low barrier to entry has unleashed a wave of creativity, with new formats and trends emerging almost daily.</p>
                
                <h2>Beyond Entertainment: Educational and Informative Reels</h2>
                
                <p>While entertainment remains a primary driver of short-form video consumption, we're seeing increasing use of the format for educational content. From quick tutorials to condensed explanations of complex topics, creators are finding innovative ways to make learning more accessible and engaging through short videos.</p>
                
                <p>This evolution represents a fascinating convergence of entertainment and education—"edutainment" at its finest—where the engaging qualities of short-form video are harnessed to impart knowledge and skills.</p>
                
                <h2>The Future of Video Content</h2>
                
                <p>As technology continues to evolve, so too will video content. Augmented reality filters, AI-generated elements, and increasingly sophisticated mobile editing tools are already enhancing the creative possibilities for short-form creators.</p>
                
                <p>Moreover, the line between short-form and long-form content is blurring, with many creators using short videos to drive traffic to longer, more in-depth content—exactly what we're doing with this blog and our associated video reels.</p>
                
                <h2>Conclusion</h2>
                
                <p>The explosion of short-form video content represents not just a trend but a fundamental shift in media consumption. Its influence extends beyond entertainment into education, marketing, and information sharing—a true digital revolution in how we create and consume content.</p>
                
                <p>As we continue to explore this evolving landscape, we'll bring you insights, analysis, and practical guidance for navigating the world of video content, whether as a creator, marketer, or simply an engaged viewer.</p>
              </div>
            </div>
            
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <h2 className="text-xl font-bold mb-4">Recommended Articles</h2>
                <div className="space-y-6">
                  {recommendedBlogs.map(rec => (
                    <BlogCard 
                      key={rec.id}
                      id={rec.id}
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
