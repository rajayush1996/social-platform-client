
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Film, BookOpen } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ReelCard from "@/components/reels/ReelCard";
import FeaturedReel from "@/components/reels/FeaturedReel";
import BlogCard from "@/components/blog/BlogCard";
import FeaturedBlog from "@/components/blog/FeaturedBlog";
import { reelsData, blogData } from "@/data/mockData";

const Index = () => {
  // Get featured content
  const featuredReel = reelsData.find(reel => reel.featured);
  const featuredBlog = blogData.find(blog => blog.featured);
  
  // Get non-featured content (limited to 3 for each section)
  const normalReels = reelsData.filter(reel => !reel.featured).slice(0, 3);
  const normalBlogs = blogData.filter(blog => !blog.featured).slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-grow pt-16">
        {/* Hero Section */}
        <section className="hero-gradient py-16 md:py-24">
          <div className="container px-4 mx-auto">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Discover the Best Video <span className="text-gradient">Content</span>
              </h1>
              <p className="text-lg md:text-xl text-foreground/90 mb-8">
                Explore a curated collection of engaging reels and insightful blog articles
                about video creation, trends, and storytelling.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button 
                  className="bg-reel-purple-600 hover:bg-reel-purple-700"
                  size="lg"
                  asChild
                >
                  <Link to="/reels">
                    <Film className="mr-2 h-5 w-5" /> Explore Reels
                  </Link>
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-white/20 text-white hover:bg-white/10"
                  asChild
                >
                  <Link to="/blog">
                    <BookOpen className="mr-2 h-5 w-5" /> Read Blog
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Reel Section */}
        <section className="py-12 md:py-16">
          <div className="container px-4 mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold">Featured Reel</h2>
              <Button variant="link" className="text-reel-purple-400" asChild>
                <Link to="/reels">View All Reels</Link>
              </Button>
            </div>
            
            {featuredReel && (
              <FeaturedReel 
                id={featuredReel.id}
                thumbnail={featuredReel.thumbnail}
                title={featuredReel.title}
                description={featuredReel.description}
                author={featuredReel.author}
                views={featuredReel.views}
              />
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              {normalReels.map(reel => (
                <ReelCard 
                  key={reel.id}
                  id={reel.id}
                  thumbnail={reel.thumbnail}
                  title={reel.title}
                  author={reel.author}
                  views={reel.views}
                  duration={reel.duration}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Featured Blog Section */}
        <section className="py-12 md:py-16 bg-black/30">
          <div className="container px-4 mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold">Featured Article</h2>
              <Button variant="link" className="text-reel-purple-400" asChild>
                <Link to="/blog">View All Articles</Link>
              </Button>
            </div>
            
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
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
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

        {/* CTA Section */}
        <section className="py-16 md:py-24 glass-card">
          <div className="container px-4 mx-auto text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Create Your Own Content?</h2>
              <p className="text-lg text-foreground/80 mb-8">
                Join our community of content creators and share your unique perspective through engaging reels and insightful articles.
              </p>
              <Button 
                className="bg-reel-purple-600 hover:bg-reel-purple-700"
                size="lg"
              >
                Get Started Today
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
