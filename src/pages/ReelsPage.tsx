
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ReelCard from "@/components/reels/ReelCard";
import FeaturedReel from "@/components/reels/FeaturedReel";
import { reelsData } from "@/data/mockData";

const ReelsPage = () => {
  // Get featured reel
  const featuredReel = reelsData.find(reel => reel.featured);
  
  // Get non-featured reels
  const normalReels = reelsData.filter(reel => !reel.featured);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-grow pt-16">
        {/* Header */}
        <section className="hero-gradient py-12 md:py-16">
          <div className="container px-4 mx-auto">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">Explore Reels</h1>
              <p className="text-lg text-foreground/90">
                Discover a collection of engaging short-form videos on various topics
              </p>
            </div>
          </div>
        </section>

        {/* Featured Reel */}
        <section className="py-12">
          <div className="container px-4 mx-auto">
            <h2 className="text-2xl font-bold mb-6">Featured Reel</h2>
            
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
          </div>
        </section>

        {/* All Reels Grid */}
        <section className="py-12">
          <div className="container px-4 mx-auto">
            <h2 className="text-2xl font-bold mb-6">All Reels</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
      </main>

      <Footer />
    </div>
  );
};

export default ReelsPage;
